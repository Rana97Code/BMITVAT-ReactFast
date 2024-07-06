from fastapi import APIRouter, Depends, HTTPException, requests,Request, File, UploadFile
from typing import Union,List,Optional
from sqlalchemy.orm import Session
from app.config import get_db
from app.routes.auth_router import get_current_active_user;
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from pathlib import *
import os
from sqlalchemy.sql.sqltypes import Numeric
from app.models.inventory.opening_stock_model import OpeningStock, OpeningInsertSchema , OpeningStockSchema
from app.models.general_settings.unit_model import Unit
from app.models.general_settings.hs_code_model import Hscode
from app.models.inventory.item_model import Item, ItemBase 





# route define
FinishGoods_router = APIRouter()

@FinishGoods_router.get("/bmitvat/api/item/all_finish_goods", response_model=List[ItemBase], dependencies=[Depends(get_current_active_user)])
async def index(db: Session = Depends(get_db)):  
    return db.query(Item).filter(Item.item_type == 2, Item.status == 1).all()

@FinishGoods_router.post("/bmitvat/api/opening_stock/add-opening-stock", dependencies=[Depends(get_current_active_user)])
async def create(openingStock:OpeningInsertSchema, db:Session=Depends(get_db)):
    print(openingStock)
    srv= OpeningStock( item_id=openingStock.item_id, item_type=openingStock.item_type, opening_date=openingStock.opening_date, 
                      opening_quantity=openingStock.opening_quantity, opening_rate= openingStock.opening_rate, opening_value= openingStock.opening_value)
    db.add(srv)
    db.commit()
    return {"Message":"Successfully Add"}


@FinishGoods_router.get("/bmitvat/api/opening_stock/all_finish_stock", response_model=List[OpeningStockSchema], dependencies=[Depends(get_current_active_user)])
async def index(db:Session = Depends(get_db)):
    return db.query(OpeningStock).all()

    # x=db.query(OpeningStock,Item).join(Item, OpeningStock.item_id == Item.id)\
    #     .add_column(OpeningStock.item_id, OpeningStock.item_type,Item.item_name, Item.hs_code, OpeningStock.opening_date, OpeningStock.opening_quantity, 
    #                 OpeningStock.opening_rate, OpeningStock.opening_value, OpeningStock.closing_date).all()
    # p_Finishgoods = []
    # for y in x:
    #     p_Finishgoods.append({
    #         'item_id': y.item_id,
    #         'item_name': y.item_name,
    #         'hs_code' : y.hs_code,
    #         'item_type': y.item_type,
    #         'opening_date' : y.opening_date,
    #         'opening_quantity' : y.opening_quantity,
    #         'opening_rate' :y.opening_rate,
    #         'opening_value': y.opening_value,
    #         'closing_date' : y.closing_date
    #     })
    
    # junit = jsonable_encoder(p_Finishgoods)
    # return JSONResponse(content=junit)
