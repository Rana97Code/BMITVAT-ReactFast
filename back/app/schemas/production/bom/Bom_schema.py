from pydantic import BaseModel
from datetime import datetime, date
from typing import List, Optional


class AllFinishGoods(BaseModel):
    id:int
    item_name: Optional[str] = None
    hs_code: Optional[str] = None
    hs_code_id: Optional[int] = None
    unit_name: Optional[str] = None
    unit_id: Optional[int] = None
    class Config:
        from_mode = True

class SingleFinishGoods(BaseModel):
    id:int
    item_name: Optional[str] = None
    hs_code: Optional[str] = None
    hs_code_id: Optional[int] = None
    unit_name: Optional[str] = None
    unit_id: Optional[int] = None
    class Config:
        from_mode = True


class RawItemSuggestSchema(BaseModel):
    id: int
    item_name: str

    class Config:
        orm_mode = True

class RawItemDetailsSchema(BaseModel):
    id: int
    item_name: str

    class Config:
        from_mode = True
   

