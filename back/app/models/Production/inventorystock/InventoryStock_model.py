from app.config import engine, Base, SessionLocal
from sqlalchemy import Column,String,Integer,Boolean,SmallInteger,DateTime,Date,Text,Double,Float,Numeric,Integer
from sqlalchemy.sql import func
from datetime import datetime, time ,date
from sqlalchemy.orm import relationship
from pydantic import BaseModel
from typing import Optional



class Stock(Base):
    __tablename__ = 'stock'

    id=Column(Integer,primary_key=True,index=True)
    item_id = Column(Integer, nullable=False)
    qty = Column(Float, nullable=True)
    rate = Column(Float, nullable=True)
    status = Column(Integer, nullable=False)
    user_id = Column(Integer, nullable=True)
    created_at = Column(DateTime,index=True, default=datetime.utcnow())


class StockHistory(Base):
    __tablename__ = 'stock_history'

    id=Column(Integer,primary_key=True,index=True)
    item_id = Column(Integer, nullable=False)
    action_tbl = Column(String(255), nullable=False)
    action_tbl_id = Column(Integer, nullable=True)
    previous_stock = Column(Float, nullable=True)
    qty = Column(Float, nullable=True)
    action_type = Column(String(255), nullable=False)
    status = Column(Integer, nullable=False)
    user_id = Column(Integer, nullable=True)
    created_at = Column(DateTime,index=True, default=datetime.utcnow())

Base.metadata.create_all(bind=engine)