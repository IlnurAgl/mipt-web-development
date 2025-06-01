from fastapi import FastAPI, Depends, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
import httpx
import logging

from models import Order as OrderModel, Base
from schemas import Order, OrderCreate
from database import get_db, engine

Base.metadata.create_all(bind=engine)

app = FastAPI()
origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

async def verify_token(authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=403, detail="Invalid authorization header")
    
    token = authorization.split(" ")[1]
    async with httpx.AsyncClient(timeout=5.0) as client:
        try:
            response = await client.get(
                "http://auth:8000/users/me",
                headers={"Authorization": f"Bearer {token}"}
            )
            if response.status_code // 100 != 2 or "username" not in response.json():
                raise HTTPException(status_code=403, detail="Invalid token")
        except httpx.ConnectError:
            logging.error("Auth service connection failed")
            raise HTTPException(status_code=503, detail="Auth service unavailable")
        except httpx.TimeoutException:
            logging.error("Auth service timeout")
            raise HTTPException(status_code=504, detail="Auth service timeout")
        except httpx.RequestError as e:
            logging.error(f"Auth service error: {e}")
            raise HTTPException(status_code=500, detail=f"Auth service error: {str(e)}")

@app.post("/orders/", response_model=Order)
async def create_order(
    order: OrderCreate,
    db: Session = Depends(get_db),
):
    for item in order.goods:
        async with httpx.AsyncClient() as client:
            response = await client.get(f'http://products:8000/products/{item}')
            if response.status_code != 200:
                raise HTTPException(status_code=response.status_code, detail=response.text)
    db_order = OrderModel(**order.model_dump())
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    return db_order

@app.get("/orders/", response_model=List[Order])
def read_orders(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    _: None = Depends(verify_token)
):
    return db.query(OrderModel).offset(skip).limit(limit).all()

@app.get("/orders/{order_id}", response_model=Order)
def read_order(
    order_id: int,
    db: Session = Depends(get_db),
    _: None = Depends(verify_token)
):
    order = db.query(OrderModel).filter(OrderModel.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@app.delete("/orders/{order_id}")
def delete_product(
    order_id: int,
    db: Session = Depends(get_db),
    _: None = Depends(verify_token)
):
    product = db.query(OrderModel).filter(OrderModel.id == order_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Order not found")
    
    db.delete(product)
    db.commit()
    return {"message": "Order deleted successfully"}

@app.put("/orders/{order_id}", response_model=Order)
def update_order(
    order_id: int,
    order: OrderCreate,
    db: Session = Depends(get_db),
    _: None = Depends(verify_token)
):
    """Update existing order including status"""
    db_order = db.query(OrderModel).filter(OrderModel.id == order_id).first()
    if not db_order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    for field, value in order.model_dump().items():
        setattr(db_order, field, value)
    
    db.commit()
    db.refresh(db_order)
    return db_order


