from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy import Column, Integer, Float, String, ForeignKey, Index
from app.config import Base as CustomBase

Base = declarative_base(cls=CustomBase)

class PurchaseItem(Base):
    __tablename__ = 'purchase_items'
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    purchase_id = Column(Integer, ForeignKey('purchases.id'), nullable=False)
    item_id = Column(Integer, ForeignKey('items.id'), nullable=False)
    quantity = Column(Float(10, 2), nullable=False)
    rate = Column(Float(10, 2), nullable=False)
    price_value = Column(Float(10, 2), nullable=False)
    sd = Column(Float(10, 2))
    sd_amount = Column(Float(10, 2))
    vatable_value = Column(Float(10, 2), nullable=False)
    vat_type = Column(String(50))
    vat_rate = Column(Float(10, 2))
    vat_amount = Column(Float(10, 2))
    vds = Column(Integer)
    rebate = Column(Integer)
    total_amount = Column(Float(10, 2), nullable=False)
    
    __table_args__ = (
        Index('idx_purchase_id', 'purchase_id'),
        Index('idx_item_id', 'item_id'),
    )
    
    purchase = relationship("app.models.production.local_purchase.purchase_model.Purchase", back_populates="purchase_items")
    item = relationship("app.models.production.local_purchase.purchase_model.Item", back_populates="purchase_items")


class Item(Base):
    __tablename__ = 'items'
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    item_name = Column(String(255), index=True)
    item_type = Column(String(50))
    hs_code = Column(String(50))
    hs_code_id = Column(String(50))
    calculate_year = Column(String(50))
    unit_id = Column(String(50))
    stock_status = Column(String(50))
    status = Column(String(50))

    
    purchase_items = relationship("app.models.production.local_purchase.purchase_model.PurchaseItem", back_populates="item")


class Purchase(Base):
    __tablename__ = 'purchases'
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)

  
    purchase_items = relationship("PurchaseItem", back_populates="purchase")