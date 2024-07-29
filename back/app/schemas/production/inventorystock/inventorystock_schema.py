from pydantic import BaseModel
from typing import Optional

class StockBase(BaseModel):
    item_id: int
    qty: float
    rate: Optional[float] = None
    status: int
    user_id: Optional[int] = None

class StockCreate(StockBase):
    pass

class StockUpdate(StockBase):
    pass

class Stock(StockBase):
    id: int

    class Config:
        from_attributes = True  # Updated from orm_mode to from_attributes

class StockHistoryBase(BaseModel):
    item_id: int
    action_tbl: str
    action_tbl_id: Optional[int] = None
    previous_stock: Optional[float] = None
    qty: Optional[float] = None
    action_type: str
    status: int
    user_id: Optional[int] = None

class StockHistoryCreate(StockHistoryBase):
    pass

class StockHistory(StockHistoryBase):
    id: int

    class Config:
        from_attributes = True  # Updated from orm_mode to from_attributes
