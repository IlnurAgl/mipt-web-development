from pydantic import BaseModel, Field, validator
from typing import List, Dict

class OrderCreate(BaseModel):
    customer_name: str = Field(..., min_length=2, max_length=100)
    phone: str
    goods: Dict[int, int]

    @validator('phone')
    def validate_phone(cls, v):
        if not v.startswith('+'):
            raise ValueError('Phone must start with +')
        if not v[1:].isdigit():
            raise ValueError('Phone must contain only digits after +')
        return v

    @validator('goods')
    def validate_quantities(cls, item):
        for k, v in item.items():
            if v <= 0:
                raise ValueError('Quantity must be greater than 0')
        return item

class Order(OrderCreate):
    id: int

    class Config:
        from_attributes = True