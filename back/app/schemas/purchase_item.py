from pydantic import BaseModel
from typing import Optional

class PurchaseItemBase(BaseModel):
    purchase_id: int
    item_id: int
    quantity: float
    rate: float
    price_value: float
    sd: Optional[float] = None
    sd_amount: Optional[float] = None
    vatable_value: float
    vat_type: Optional[str] = None
    vat_rate: Optional[float] = None
    vat_amount: Optional[float] = None
    vds: Optional[int] = None
    rebate: Optional[int] = None
    total_amount: float

class PurchaseItemCreate(PurchaseItemBase):
    pass

class PurchaseItemUpdate(PurchaseItemBase):
    pass

class PurchaseItem(PurchaseItemBase):
    id: int

    class Config:
        orm_mode = True
