from app.config import engine, Base, SessionLocal
from sqlalchemy import Column, Integer, String, ForeignKey, TIMESTAMP, func
from sqlalchemy.orm import relationship
from pydantic import BaseModel
from typing import List, Optional


class Purchase(Base):
    __tablename__ = "purchase"

    id = Column(Integer, primary_key=True, index=True)
    item = Column(String(255), nullable=False)
    stock = Column(Integer, nullable=False)
    stock_history = relationship("StockHistory", back_populates="purchase")


class StockHistory(Base):
    __tablename__ = "stock_history"

    id = Column(Integer, primary_key=True, index=True)
    purchase_id = Column(Integer, ForeignKey("purchase.id"))
    stock_change = Column(Integer, nullable=False)
    change_date = Column(TIMESTAMP, server_default=func.now())
    purchase = relationship("Purchase", back_populates="stock_history")


class StockHistoryBase(BaseModel):
    stock_change: int
    change_date: Optional[str] = None

class StockHistoryCreate(StockHistoryBase):
    pass

class StockHistory(StockHistoryBase):
    id: int
    purchase_id: int

    class Config:
        orm_mode = True

class PurchaseBase(BaseModel):
    item: str
    stock: int

class PurchaseCreate(PurchaseBase):
    pass

class Purchase(PurchaseBase):
    id: int
    stock_history: List[StockHistory] = []

    class Config:
        orm_mode = True
