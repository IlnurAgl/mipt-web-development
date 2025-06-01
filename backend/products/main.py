from fastapi import FastAPI, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from typing import List, Optional
import httpx
import logging

from models import Product as ProductModel, Base
from schemas import Product, ProductCreate
from database import get_db, engine
from fastapi.middleware.cors import CORSMiddleware

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

@app.post("/products/", response_model=Product)
async def create_product(
    product: ProductCreate,
    db: Session = Depends(get_db),
    _: None = Depends(verify_token)
):
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
async def update_product(
    product_id: int,
    product: ProductCreate,
    db: Session = Depends(get_db),
    _: None = Depends(verify_token)
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
async def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    _: None = Depends(verify_token)
):
    """Delete product by ID"""
    product = db.query(ProductModel).filter(ProductModel.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    db.delete(product)
    db.commit()
    return {"message": "Product deleted successfully"}

@app.delete("/products/")
async def delete_all_products(
    db: Session = Depends(get_db),
    _: None = Depends(verify_token)
):
    """Delete all products (for testing only)"""
    db.query(ProductModel).delete()
    db.commit()
    return {"message": "All products deleted"}
