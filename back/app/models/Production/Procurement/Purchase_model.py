from app.db.database import engine, Base, SessionLocal
from sqlalchemy import Column, Float,String,Integer,Boolean,SmallInteger,DateTime
from sqlalchemy.orm import relationship
from pydantic import BaseModel
from datetime import datetime,date, time
from typing import Optional, List


class Purchase(Base):
    __tablename__="purchase"
    id=Column(Integer,primary_key=True,index=True)
    invoice_no = Column(String(255), nullable=True)
    purchase_type = Column(Integer, nullable=True)
    purchase_category= Column(Integer, nullable=True)
    lc_number = Column(String(255), nullable=True)
    lc_date = Column(DateTime, index=True, default= datetime.utcnow)
    chalan_date = Column(DateTime, index=True, default= datetime.utcnow)
    total_vds = Column(Float(10, 2), nullable=True)
    grand_total = Column(Float(10, 2), nullable=True)
    total_tax = Column(Float(10, 2), nullable=True)
    total_at= Column(Float(10, 2), nullable=True)
    supplier_id = Column(Integer, nullable=False)
    entry_date = Column(DateTime, index=True, default=datetime.utcnow)
    notes = Column(String(255), nullable=True)
    user_id = Column(Integer, default='1', nullable=True)
    custom_house_id = Column(Integer, nullable=True)
    country_origin = Column(Integer, nullable=True)
    boe_item_no = Column(Integer, nullable=True)
    data_source = Column(String(255),index=True, nullable=True)
    cpc_code_id = Column(Integer, nullable=True)


class Purchase_item(Base):
    __tablename__='purchase_item'
    id = Column(Integer,primary_key=True,index=True)
    purchase_id = Column(Integer,nullable=True)
    item_id= Column(Integer,nullable=True)
    boe_item_no = Column(Integer, nullable=True)
    hs_code = Column(String(255), nullable=True)
    hs_code_id = Column(Integer, nullable=True)
    
    qty = Column(Float, nullable=True)
    rate = Column(Float, nullable=True)
    vatable_value = Column(Float, nullable=True)
    vat_rate = Column(Float, nullable=True)
    tax_amount = Column(Float, nullable=True)
    item_cd = Column(Float, nullable=True)
    cd_amount = Column(Float, nullable=True)
    item_sd = Column(Float, nullable=True)
    sd_amount = Column(Float, nullable=True)
    item_rd = Column(Float, nullable=True)
    rd_amount = Column(Float, nullable=True)
    item_at = Column(Float, nullable=True)
    at_amount = Column(Float, nullable=True)
    # item_ait = Column(Float, nullable=True)
    # ait_amount = Column(Float, nullable=True)
    # item_tti = Column(Float, nullable=True)
    # tti_amount = Column(Float, nullable=True)
    # amount = Column(Float, nullable=True)
    t_amount = Column(Float, nullable=True)
    access_amount = Column(Float, nullable=True)
    vat_type = Column(Integer, nullable=True)
    vds = Column(Integer, nullable=True)
    rebate = Column(Integer, nullable=True)
    purchase_date = Column(DateTime, default=True, index=datetime.utcnow)
    entry_date = Column(DateTime, default=True, index=datetime.utcnow)
    p_date = Column(DateTime, default=True, index=datetime.utcnow)

Base.metadata.create_all(bind=engine)