from pydantic import BaseModel
from datetime import datetime, date
from typing import List, Optional


class AllFinishGoods(BaseModel):
    id:int
    item_name: Optional[str] = None
    # hs_code: Optional[str] = None
    # hs_code_id: Optional[int] = None
    # unit_name: Optional[str] = None
    # unit_id: Optional[int] = None
    class Config:
        from_mode = True

class SingleFinishGoods(BaseModel):
    id:int
    item_name: Optional[str] = None
    hs_code: Optional[str] = None
    hs_code_id: Optional[str] = None
    unit_name: Optional[str] = None
    unit_id: Optional[str] = None
    class Config:
        from_mode = True


class RawItemSuggestSchema(BaseModel):
    id: int
    item_name: str

    class Config:
        from_mode = True

class RawItemDetailsSchema(BaseModel):
    id: int
    item_name: Optional[str] = None
    unit_name:Optional[str] = None
    unit_id:Optional[int] = None
    rate:Optional[str] = None
    class Config:
        from_mode = True

class CostingSuggestSchema(BaseModel):
    id: int
    costing_name: str
    class Config:
        from_mode = True  


class BomInsertSchema(BaseModel):
    id: int
    item_sku: str
    bom_no: str
    product_code: str
    item_id: int
    hs_code: str
    unit_name: str
    remark: str
    reference: str
    total_costing: float
    item_price: float
    sales_price: float
    service_code: str
    status: int
    mrp_type: int
    bom_type: int
    subbmission_date: date
    effective_date: date
    user_id: int
    created_at: date
    class Config:
        from_mode = True  
