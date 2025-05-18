from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from models import Product as ProductModel, Base
from schemas import Product, ProductCreate
from database import get_db, engine

Base.metadata.create_all(bind=engine)

app = FastAPI()

@app.post("/products/", response_model=Product)
def create_product(product: ProductCreate, db: Session = Depends(get_db)):
    """Create new product"""
    db_product = ProductModel(**product.model_dump())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

@app.get("/products/", response_model=List[Product])
def read_products(
    skip: int = 0, 
    limit: int = 100,
    name: str = None,
    db: Session = Depends(get_db)
):
    """Get list of products with optional filtering"""
    query = db.query(ProductModel)
    if name:
        query = query.filter(ProductModel.name.ilike(f"%{name}%"))
    return query.offset(skip).limit(limit).all()

@app.get("/products/{product_id}", response_model=Product)
def read_product(product_id: int, db: Session = Depends(get_db)):
    """Get single product by ID"""
    product = db.query(ProductModel).filter(ProductModel.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@app.put("/products/{product_id}", response_model=Product)
def update_product(
    product_id: int, 
    product: ProductCreate, 
    db: Session = Depends(get_db)
):
    """Update existing product"""
    db_product = db.query(ProductModel).filter(ProductModel.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    for field, value in product.model_dump().items():
        setattr(db_product, field, value)
    
    db.commit()
    db.refresh(db_product)
    return db_product

@app.delete("/products/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db)):
    """Delete product by ID"""
    product = db.query(ProductModel).filter(ProductModel.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    db.delete(product)
    db.commit()
    return {"message": "Product deleted successfully"}

@app.delete("/products/")
def delete_all_products(db: Session = Depends(get_db)):
    """Delete all products (for testing only)"""
    db.query(ProductModel).delete()
    db.commit()
    return {"message": "All products deleted"}