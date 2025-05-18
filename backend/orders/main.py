from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import httpx

from models import Order as OrderModel, Base
from schemas import Order, OrderCreate
from database import get_db, engine

Base.metadata.create_all(bind=engine)

app = FastAPI()

@app.post("/orders/", response_model=Order)
async def create_order(order: OrderCreate, db: Session = Depends(get_db)):
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
    db: Session = Depends(get_db)
):
    return db.query(OrderModel).offset(skip).limit(limit).all()

@app.get("/orders/{order_id}", response_model=Order)
def read_order(order_id: int, db: Session = Depends(get_db)):
    order = db.query(OrderModel).filter(OrderModel.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@app.delete("/orders/{order_id}")
def delete_product(order_id: int, db: Session = Depends(get_db)):
    product = db.query(OrderModel).filter(OrderModel.id == order_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Order not found")
    
    db.delete(product)
    db.commit()
    return {"message": "Product deleted successfully"}


@app.put("/orders/{order_id}", response_model=Order)
def update_product(
    order_id: int, 
    product: OrderCreate, 
    db: Session = Depends(get_db)
):
    """Update existing product"""
    db_product = db.query(OrderModel).filter(OrderModel.id == order_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Order not found")
    
    for field, value in product.model_dump().items():
        setattr(db_product, field, value)
    
    db.commit()
    db.refresh(db_product)
    return db_product

