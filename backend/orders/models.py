from sqlalchemy import Column, Integer, String, JSON
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    customer_name = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    goods = Column(JSON, nullable=False)  # Список товаров
    address = Column(String, nullable=False)