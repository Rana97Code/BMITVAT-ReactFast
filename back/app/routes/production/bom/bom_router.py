from fastapi import APIRouter, Depends, HTTPException, requests,Request, File, UploadFile
from typing import Any, Union,List,Optional
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.routes.auth_router import get_current_active_user;
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from pathlib import *
import os
from sqlalchemy.sql.sqltypes import Numeric

from app.models.production.bom_production.Bom_model import Bom,BomCosting,BomRawMaterials
from app.schemas.production.bom.Bom_schema import AllFinishGoods,SingleFinishGoods,RawItemSuggestSchema


from app.models.general_settings.hs_code_model import Hscode
from app.models.inventory.item_model import Item
from app.models.general_settings.unit_model import Unit

Bom_router = APIRouter()



@Bom_router.get("/bmitvat/api/item/all_finish_goods_in",response_model=List[AllFinishGoods], dependencies=[Depends(get_current_active_user)])
async def index(db:Session=Depends(get_db)):

    #In ITEM shows data From unit data table 
    index=db.query(Item, Unit, Hscode).filter(Item.item_type == 2, Item.stock_status == 1)\
    .join(Unit, Item.unit_id == Unit.id).join(Hscode, Item.hs_code_id == Hscode.id)\
    .add_columns(
        Item.id, 
        Item.item_name, 
        Unit.unit_name, 
        Hscode.hs_code).all()
    goods_index_item =[]
    for pp in index:
        goods_index_item.append({
           'id': pp.id,
           'item_name': pp.item_name,
           'unit_name': pp.unit_name,
           'hs_code': pp.hs_code
           })

    junit = jsonable_encoder(goods_index_item)
    return JSONResponse(content=junit)


@Bom_router.get("/bmitvat/api/item/get_item_details/{item_id}", response_model=List[SingleFinishGoods], dependencies=[Depends(get_current_active_user)])
async def get_item_details_by_id(item_id: int, db: Session = Depends(get_db)) -> Any:
    try:
        print(item_id)
        item = (
            db.query(
                Item.id,
                Item.item_name,
                Item.hs_code_id,
                Item.hs_code,
                Hscode.hs_code.label("hscode"),  # Aliased to avoid name clash
                Unit.unit_name,
                Unit.id.label("unit_id")  # Include unit_id in the query
            )
            .join(Hscode, Item.hs_code_id == Hscode.id)
            .join(Unit, Item.unit_id == Unit.id)
            .filter(Item.id == item_id)
            .first()
        )

        if item is None:
            raise HTTPException(status_code=404, detail="Item not found")

        item_details = {
            "id": item.id,
            "item_name": item.item_name,
            "hs_code_id": item.hs_code_id,
            "hs_code": item.hs_code,
            "hscode": item.hscode,
            "unit_name": item.unit_name,
            "unit_id": item.unit_id
        }

        return item_details
    except HTTPException as e:
        raise e
    except Exception as e:
        print(f"Unexpected error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")
    




# Function to get all suggested items from the database
async def all_suggestitm(db: Session) -> List[dict]:
    result = db.query(Item).filter(Item.stock_status == 1)\
            .add_columns(Item.id, Item.item_name).all()
    items = [{'id': y.id, 'item_name': y.item_name} for y in result]
    return jsonable_encoder(items)



# Endpoint to get suggestions for raw materials
@Bom_router.post("/bmitvat/api/item/getAllRawMaterialsSuggestions", response_model=List[RawItemSuggestSchema])
async def suggest_items(request: Request, db: Session = Depends(get_db)) -> List[Any]:
    try:
        request_body = await request.json()
        searchTerm = request_body.get('searchTerm', "").lower()

        if not searchTerm:
            raise HTTPException(status_code=400, detail="searchTerm is required")

        items = await all_suggestitm(db=db)
        data = [item for item in items if searchTerm in item['item_name'].lower()]
        return data
    except Exception as e:
        print(f"Unexpected error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")






