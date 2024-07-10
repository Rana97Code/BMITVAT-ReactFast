from app.config import engine, Base, SessionLocal
from sqlalchemy import Column,String,Integer,Boolean,SmallInteger,DateTime,Date,Text,Double,Float,BigInteger,Numeric
from sqlalchemy.sql import func
from datetime import datetime, time ,date
from sqlalchemy.orm import relationship
from pydantic import BaseModel
from typing import Optional

class Production(Base):
    __tablename__ = 'production'

    id = Column(Integer, primary_key=True, autoincrement=True)
    finish_goods_id = Column(Integer, nullable=True, name="finish_goods_id")
    pro_invoice_id = Column(String, nullable=True, name="pro_invoice_id")
    production_qty = Column(Numeric(precision=10, scale=2), nullable=True, name="production_qty")
    notes = Column(String, nullable=True, name="notes")
    production_date = Column(Date, nullable=True, name="production_date")
    user_id = Column(Integer, nullable=True, name="user_id")
    created_at = Column(Date, nullable=False, server_default=func.now(), name="created_at")

    
class ProductionRawMaterials(Base):
    __tablename__ = 'production_raw_materials'

    id = Column(Integer, primary_key=True, autoincrement=True)
    productionId = Column(Integer, nullable=True, name="production_id")
    rawMaterialsId = Column(Integer, nullable=True, name="raw_materials_id")
    stockQty = Column(Numeric(precision=10, scale=2), nullable=True, name="stock_qty")
    usedQtyRate = Column(Numeric(precision=10, scale=2), nullable=True, name="used_qty_rate")
    usedQty = Column(Numeric(precision=10, scale=2), nullable=True, name="used_qty")
    wastageQtyRate = Column(Numeric(precision=10, scale=2), nullable=True, name="wastage_qty_rate")
    wastageQty = Column(Numeric(precision=10, scale=2), nullable=True, name="wastage_qty")
    remainStockQty = Column(Numeric(precision=10, scale=2), nullable=True, name="remain_stock_qty")
    productionDate = Column(Date, nullable=True, name="production_date")
    userId = Column(Integer, nullable=True, name="user_id")
    createdAt = Column(Date, nullable=False, server_default=func.now(), name="created_at")

Base.metadata.create_all(bind=engine)