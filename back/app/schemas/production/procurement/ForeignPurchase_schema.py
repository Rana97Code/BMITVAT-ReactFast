from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

#foreign purchase item insert Schema
class foreignPurchaseItemInsertSchema(BaseModel):
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

#foreign purchase insert Schema  
class foreignPurchaseInsertSchema(BaseModel):
    invoice_no: str| None
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
    custom_house_id: str| None
    country_origin: str| None
    data_source: str| None
    cpc_code_id: int| None
    items: List[foreignPurchaseItemInsertSchema]

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







