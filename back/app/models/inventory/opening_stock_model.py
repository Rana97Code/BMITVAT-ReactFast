from app.config import engine, Base
from sqlalchemy import Column, Float, Date, BigInteger, ForeignKey
from sqlalchemy.orm import relationship
from pydantic import BaseModel
from datetime import date


class OpeningStockEntity(Base):
    __tablename__ = "opening_stock"
    id = Column(BigInteger, primary_key=True, index=True, autoincrement=True)
    item_id = Column(BigInteger, ForeignKey("items.id"), nullable=False)
    opening_quantity = Column(Float, nullable=False)
    opening_rate = Column(Float, nullable=False)
    opening_value = Column(Float, nullable=False)
    opening_date = Column(Date, nullable=False)

    item = relationship("app.models.inventory.item_model.Item")

Base.metadata.create_all(bind=engine)


class OpeningAddModel(BaseModel):
    item_id: int
    opening_quantity: float
    opening_rate: float
    opening_value: float
    opening_date: date

    class Config:
        from_attributes = True


class OpeningStockModel(BaseModel):
    id: int
    item_id: int
    opening_quantity: float
    opening_rate: float
    opening_value: float
    opening_date: date

    class Config:
        from_attributes = True
