from app.config import engine, Base, SessionLocal
from sqlalchemy import Column, Float,String,Integer,Boolean,SmallInteger,DateTime
from sqlalchemy.orm import relationship
from pydantic import BaseModel
from datetime import datetime,date, time


class foreignPurchase(Base):
    __tablename__="Purchase"
    id=Column(Integer,primary_key=True,index=True)
    closing_date = Column(DateTime, index=True, default=datetime.utcnow)
    item_id = Column(Integer, nullable=True)
    item_type = Column(Integer, nullable=True)
    opening_date = Column(DateTime,index=True, default=datetime.utcnow())
    opening_quantity = Column(Float, nullable=True)
    opening_rate = Column(Float, nullable=True)
    opening_value = Column(Float, nullable=True)

    supplier_name = Column(String(255),index=True)
    s_address = Column(String(255),index=True)
    entry_date = Column(DateTime, index=True, default=datetime.utcnow)
    invoice_no = Column(String(255), nullable=True)
    lc_number = Column(String(255), nullable=True)

    # hs_code = Column(String(255), nullable=True)
    # item_name = Column(String(255), nullable=True)
    #created_at =Column(DateTime, index=True, default=datetime.utcnow())
    # prod = relationship(Product)
   


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

class foreignPurchaseInsertSchema(BaseModel):
    item_id:int
    item_type: int
    opening_date:datetime | None
    opening_quantity: float
    opening_rate:float | None
    opening_value:float | None
    supplier_name :str
    s_address :str
    entry_date :datetime | None
    invoice_no :str
    lc_number :str
    # hs_code: str |None

    class Config:
        from_attributes = True