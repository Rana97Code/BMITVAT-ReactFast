from pydantic import BaseModel
from datetime import datetime, date
from typing import List, Optional


#for purchase 

# class PurchaseEntityModel(BaseModel):
#     id: Optional[int]
#     p_invoice_no: Optional[str]
#     purchase_type: Optional[int]
#     purchase_category: Optional[int]
#     service_category: Optional[int]
#     lc_date: Optional[date]
#     lc_no: Optional[str]
#     vendor_invoice: Optional[str]
#     chalan_date: Optional[datetime]  # Changed to datetime
#     total_vds: Optional[Decimal]
#     grand_total: Optional[Decimal]
#     supplier_id: Optional[int]
#     total_tax: Optional[Decimal]
#     entry_date: Optional[date]
#     notes: Optional[str]
#     user_id: Optional[int]
#     custom_house: Optional[int]
#     country_origin: Optional[int]
#     boe_item_no: Optional[int]
#     data_source: Optional[str]
#     cpc_code_id: Optional[int]
#     created_at: Optional[date]

#     class Config:
#         orm_mode = True

#for purchase item

# class PurchaseItemModel(BaseModel):
#     id: Optional[int]
    # purchase_id : int |None
    # item_id : int |None
    # boe_item_no : int |None
    # hs_code : str |None
    # hs_code_id : int |None
    # service_code : str |None
    # qty : float |None
    # rate : float |None
    # vatable_value : float |None
    # vat_rate : float |None
    # tax_amount : float |None
    # item_cd : float |None
    # cd_amount : float |None
    # item_sd : float |None
    # sd_amount :float  |None
    # item_rd : float |None
    # rd_amount :float  |None
    # item_at : float |None
    # at_amount : float |None
    # item_ait :float  |None
    # ait_amount :float  |None
    # item_tti : float |None
    # tti_amount : float |None
    # amount : float |None
    # t_amount : float |None
    # access_amount : float |None
    # vat_type: str |None
    # vds : int |None
    # rebate: int |None
    # purchase_date :datetime |None
    # entry_date: datetime |None
    # p_date : datetime |None

    # class Config:
    #     from_attributes = True
#foreign purchase item insert Schema
class foreignPurchaseItemInsertSchema(BaseModel):
    # purchase_id : int |None
    item_id : int |None
    item_name: str | None
    boe_item_no : int |None
    hs_code : str |None
    hs_code_id : int |None
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
    item_ait : float |None
    ait_amount : float |None
    t_amount : float |None
    access_amount : float |None
    vat_type: int |None
    rebate: int |None
    # purchase_date :date |None
    # entry_date: date |None
    # p_date : date |None

    class Config:
        from_attributes = True

#foreign purchase insert Schema  
class foreignPurchaseInsertSchema(BaseModel):
    invoice_no: str| None
    purchase_type: int| None
    purchase_category: int| None
    service_category: int| None
    lc_number: str| None
    lc_date: date
    chalan_date: date
    grand_total: float| None
    total_tax: float | None
    # total_at: float | None
    supplier_id: int | None
    entry_date: date
    notes: str| None
    user_id: int| None
    custom_house_id: int| None
    country_origin: int| None
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







