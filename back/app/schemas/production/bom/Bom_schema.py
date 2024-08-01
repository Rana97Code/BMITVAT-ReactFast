from pydantic import BaseModel
from datetime import datetime, date
from typing import List, Optional


class AllFinishGoods(BaseModel):
    id:int
    item_name: Optional[str] = None
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

#Schema for Insert Data into BomRawMaterials DB Table
class BomRawItemSchema(BaseModel):
    bom_id: int
    raw_material_id: int
    material_qty: float
    material_rate: float
    material_price: float
    wastage_percent: int
    wastage_qty: float
    wastage_price: float
    total_qty: float
    total_price: float
    c_date: date
    user_id: int

    class Config:
        from_mode = True 

#Schema for Insert Data into BomCosting DB Table
class BomCostingItemSchema(BaseModel):
    costing_id: int
    cost: float
    user_id: int

    class Config:
        from_mode = True 


class BomInsertSchema(BaseModel):
    item_sku: str
    bom_no: str
    product_code: str
    item_id: int
    hs_code: str
    unit_name: str
    remarks: str
    reference: str
    total_costing: float
    item_price: float
    sales_price: float
    service_code: str
    status: int
    mrp_type: int
    bom_type: int
    submission_date: date
    effective_date: date
    user_id: int
    # BRawitems: List[BomRawItemSchema]
    # BCostingitems: List[BomCostingItemSchema]


    class Config:
        from_mode = True  





class ProductionBomIndexSchema(BaseModel):
    id: int
    bom_no: Optional[str] = None
    item_name: Optional[str] = None
    hs_code: Optional[str] = None
    unit_name:Optional[str] = None
    sales_price:Optional[int] = None
    status:Optional[str] = None
    class Config:
        from_mode = True

class CostingSuggestSchema(BaseModel):
    id: int
    costing_name: str
    class Config:
        from_mode = True  