from app.config import engine, Base, SessionLocal
from sqlalchemy import Column, Float,String,Integer,Boolean,SmallInteger,DateTime
from sqlalchemy.orm import relationship
from pydantic import BaseModel
from datetime import datetime,date, time
from typing import Optional, List


class Purchase(Base):
    __tablename__="Purchase"
    id=Column(Integer,primary_key=True,index=True)
    invoice_no = Column(String(255), nullable=True)
    purchase_id = Column(Integer, nullable=True)
    purchase_type = Column(Integer, nullable=True)
    purchase_category= Column(Integer, nullable=True)
    service_category= Column(Integer, nullable=True)
    lc_number = Column(String(255), nullable=True)
    lc_date = Column(DateTime, index=True, default= datetime.utcnow)
    chalan_date = Column(DateTime, index=True, default= datetime.utcnow)
    total_vds = Column(Float(10, 2), nullable=True)
    grand_total = Column(Float(10, 2), nullable=True)
    total_tax = Column(Float(10, 2), nullable=True)
    supplier_id = Column(Integer, nullable=False)
    vendor_invoice = Column(String(255), nullable=True)
    entry_date = Column(DateTime, index=True, default=datetime.utcnow)
    notes = Column(String(255), nullable=True)
    delete_status = Column(Integer, default='0', nullable=True)
    delete_date = Column(DateTime, index=True, default=datetime.utcnow, nullable=True)
    user_id = Column(Integer, default='1', nullable=True)
    custom_house = Column(String(255), nullable=True)
    country_origin = Column(String(255), nullable=True)
    boe_item_no = Column(Integer, nullable=True)
    data_source = Column(String(255),index=True, nullable=True)
    cpc_code = Column(Integer, nullable=True)

class Purchase_item(Base):
    __tablename__='purchase_item'
    id = Column(Integer,primary_key=True,index=True)
    item_id = Column(Integer, nullable=False)
    purchase_id = Column(Integer, nullable=False)
    boe_item_no = Column(Integer, nullable=True)
    hs_code = Column(String(255), nullable=True)
    hs_code_id = Column(Integer, nullable=True)
    service_code = Column(String(255), nullable=True)
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
    item_ait = Column(Float, nullable=True)
    ait_amount = Column(Float, nullable=True)
    item_tti = Column(Float, nullable=True)
    tti_amount = Column(Float, nullable=True)
    amount = Column(Float, nullable=True)
    t_amount = Column(Float, nullable=True)
    access_amount = Column(Float, nullable=True)
    vat_type = Column(String(255), nullable=True)
    vds = Column(Integer, nullable=True)
    rebate = Column(Integer, nullable=True)
    purchase_date = Column(DateTime, default=True, index=datetime.utcnow)
    entry_date = Column(DateTime, default=True, index=datetime.utcnow)
    p_date = Column(DateTime, default=True, index=datetime.utcnow)

    # item = db.query(Item.id, Item.item_name, Item.hs_code_id, Item.hs_code,Hscode.sd, Hscode.vat, Hscode.cd, Hscode.ait, Hscode.rd, Hscode.at, Hscode.tti)
Base.metadata.create_all(bind=engine)

class foreignPurchaseCreateSchema(BaseModel):
    closing_date: datetime | None
    item_id: int
    item_type: int | None
    opening_date: datetime | None
    opening_quantity: float
    opening_rate: float | None
    opening_value: float | None
    # updated_at: date
    # created_by: int
    # invoice_id: str
    

    class Config:
        from_attributes = True

class foreignPurchaseSchema(BaseModel):
    id:int
    closing_date: datetime
    item_id:int
    item_type:int | None
    opening_date:datetime | None
    opening_quantity: float
    opening_rate:float | None
    opening_value:float | None
    # hs_code: str| None
    # item_name: str| None





    class Config:
        from_attributes = True

class foreignPurchaseBase(BaseModel):
    closing_date:str
    item_id:int
    item_type:int | None
    opening_date:datetime | None
    opening_quantity: float
    opening_rate:float | None
    opening_value:float | None
    # updated_at: date
    # created_by: int
    # invoice_id: str

    class Config:
        from_attributes = True


class PurchaseItemInsertSchema(BaseModel):
    item_id : int |None
    purchase_id : int |None
    boe_item_no : int |None
    hs_code : str |None
    hs_code_id : int |None
    service_code : float |None
    qty : float |None
    rate : float |None
    vatable_value : float |None
    vat_rate : float |None
    tax_amount : float |None
    item_cd : float |None
    cd_amount : float |None
    item_sd : float |None
    sd_amount :float  |None
    item_rd : float |None
    rd_amount :float  |None
    item_at : float |None
    at_amount : float |None
    item_ait :float  |None
    ait_amount :float  |None
    item_tti : float |None
    tti_amount : float |None
    amount : float |None
    t_amount : float |None
    access_amount : float |None
    vat_type: float |None
    vds : int |None
    rebate: int |None
    purchase_date :datetime |None
    entry_date: datetime |None
    p_date : datetime |None

    class Config:
        from_attributes = True

class foreignPurchaseInsertSchema(BaseModel):
    id: int| None
    invoice_no: str| None
    purchase_id: int| None
    purchase_type: int| None
    purchase_category: int| None
    service_category: int| None
    lc_number: str| None
    lc_date: datetime
    chalan_date: datetime
    total_vds: float| None
    grand_total: float| None
    total_tax: float | None
    supplier_id: int | None
    vendor_invoice: str| None
    entry_date: datetime
    notes: str| None
    user_id: int| None
    custom_house: str| None
    country_origin: str| None
    boe_item_no: int| None
    data_source: str| None
    cpc_code: int| None
    items: List[PurchaseItemInsertSchema]

    class Config:
        from_attributes = True


class ItemDetailsModel(BaseModel):
    id: int
    item_name: str
    hs_code_id: int
    hs_code: str
    sd: int
    vat: int
    cd: int
    ait: int
    rd: int
    at: int
    tti: float

    # item = db.query(Item.id, Item.item_name, Item.hs_code_id, Item.hs_code,Hscode.sd, Hscode.vat, Hscode.cd, Hscode.ait, Hscode.rd, Hscode.at, Hscode.tti)

    class Config:
        from_mode = True