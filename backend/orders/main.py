from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from models import Order as OrderModel, Base
from schemas import Order, OrderCreate
from database import get_db, engine

Base.metadata.create_all(bind=engine)

app = FastAPI()

@app.post("/orders/", response_model=Order)
def create_order(order: OrderCreate, db: Session = Depends(get_db)):
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
    product = db.query(Order).filter(Order.id == order_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    db.delete(product)
    db.commit()
    return {"message": "Product deleted successfully"}
