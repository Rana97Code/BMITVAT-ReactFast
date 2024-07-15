from pydantic import BaseModel
from datetime import date
from typing import Optional
from sqlalchemy import Column, Integer, Float, String, Date, ForeignKey
from sqlalchemy.dialects.mysql import BIGINT as MySQLBigInt
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()

# Pydantic Models
class OpeningAddModel(BaseModel):
    item_id: int
    opening_quantity: float
    opening_rate: float
    opening_value: float
    opening_date: date

class OpeningStockModel(BaseModel):
    id: int
    item_name: str
    hs_code: str
    opening_quantity: float
    opening_rate: float
    opening_value: float
    opening_date: date

    class Config:
        orm_mode = True

# SQLAlchemy Models
class OpeningStockEntity(Base):
    __tablename__ = 'opening_stocks'
    
    id = Column(Integer, primary_key=True, index=True)
    item_id = Column(MySQLBigInt(unsigned=True), ForeignKey('items.id'), nullable=False)
    opening_quantity = Column(Float, nullable=False)
    opening_rate = Column(Float, nullable=False)
    opening_value = Column(Float, nullable=False)
    opening_date = Column(Date, nullable=False)
    
    item = relationship("Item", back_populates="opening_stocks")