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
from app.schemas.production.bom.Bom_schema import AllFinishGoods,SingleFinishGoods,RawItemSuggestSchema, RawItemDetailsSchema, CostingSuggestSchema,BomInsertSchema, ProductionBomIndexSchema
from app.models.general_settings.hs_code_model import Hscode
from app.models.production.procurement.Purchase_model import Purchase,Purchase_item
from app.models.inventory.item_model import Item
from app.models.general_settings.unit_model import Unit
from app.models.general_settings.costing_model import Costing
import logging
logger= logging.getLogger("uvicorn.error")

Bom_router = APIRouter()



@Bom_router.get("/bmitvat/api/item/all_finish_goods_in",response_model=List[AllFinishGoods], dependencies=[Depends(get_current_active_user)])
async def index(db:Session=Depends(get_db)):

    #In ITEM shows data From unit data table 
    index=db.query(Item).filter(Item.item_type == 2, Item.stock_status == 1)\
    .add_columns(
        Item.id, 
        Item.item_name
        ).all()
    goods_index_item =[]
    for pp in index:
        goods_index_item.append({
           'id': pp.id,
           'item_name': pp.item_name
           })

    junit = jsonable_encoder(goods_index_item)
    return JSONResponse(content=junit)


@Bom_router.get("/bmitvat/api/item/get_item_details/{item_id}", response_model=SingleFinishGoods, dependencies=[Depends(get_current_active_user)])
async def get_item_details_by_id(item_id: int, db: Session = Depends(get_db)) -> Any:
    try:
        item = (
            db.query(
                Item.id,
                Item.item_name,
                Item.hs_code_id,
                Hscode.hs_code.label("hs_code"),
                Unit.unit_name,
                Unit.id.label("unit_id")
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
            "hs_code_id": str(item.hs_code_id),  # Convert to string
            "hs_code": item.hs_code,
            "unit_name": item.unit_name,
            "unit_id": str(item.unit_id)  # Convert to string
        }

        return item_details
    except HTTPException as e:
        raise e
    except Exception as e:
        print(f"Unexpected error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")
    


#foreing purchase Item Search function
async def all_suggestitm(db:Session=Depends(get_db)):
    result = db.query(Item).filter(Item.stock_status == 1,Item.item_type == 1)\
            .add_columns(Item.id, Item.item_name).all()
            
    items = []
    for y in result:
        items.append({
            'id' : y.id,
            'item_name': y.item_name,
           
        })

    json_items = jsonable_encoder(items)
    return json_items

#foreing purchase ITem Search query
@Bom_router.post("/bmitvat/api/item/getAllRawMaterialsSuggestions", response_model=List[RawItemSuggestSchema])
async def suggest_items(request: Request,db:Session=Depends(get_db)):
    request_body = await request.body()
    decoded_string = request_body.decode()
    print(decoded_string)
    if len(decoded_string) >= 1:
        items = await all_suggestitm( db = db)
        searchTerm = decoded_string.lower()
        print(searchTerm)

        if searchTerm:
            data= [item for item in items if 'item_name' in item and searchTerm in item['item_name'].lower()]
            return data

        else:
            return []
    else:
        return []
    

@Bom_router.get("/bmitvat/api/production-bom/get_bom_item_details/{item_id}", response_model=RawItemDetailsSchema, dependencies=[Depends(get_current_active_user)])
async def get_item_details_by_id(item_id: int, db: Session = Depends(get_db)):
    try:
        # print(item_id)
        item = db.query(
                Item.id,
                Item.item_name,
                Item.unit_id,
                Unit.unit_name,
                Purchase_item.rate,
            ).join(Unit, Unit.id== Item.unit_id).join(Purchase_item, Item.id == Purchase_item.item_id).filter(Item.id == item_id).first()
        
        if item is None:
            raise HTTPException(status_code=404, detail="Item not found")


        item_details = {
            "id": item.id, 
            "item_name":item.item_name,  
            "unit_id":item.unit_id,  
            "unit_name":item.unit_name, 
            "rate":str(item.rate), 
            }

        return item_details
    except HTTPException as e:
        raise e
    except Exception as e:
        print(f"Unexpected error: {e}")
    




async def all_suggestcosting(db: Session = Depends(get_db)):
    result = db.query(Costing).add_columns(Costing.id, Costing.costing_name).all()
    
    costings = [{'id': y.id, 'costing_name': y.costing_name} for y in result]

    json_costings = jsonable_encoder(costings)
    return json_costings



@Bom_router.post("/bmitvat/api/costing/getAllCostingSuggestions", response_model=List[CostingSuggestSchema])
async def suggest_costing(request: Request,db:Session=Depends(get_db)):
    request_body = await request.body()
    decoded_string = request_body.decode()
    print(decoded_string)
    if len(decoded_string) >= 1:
        costings = await all_suggestcosting( db = db)
        searchTerm1 = decoded_string.lower()
        print(searchTerm1)

        if searchTerm1:
            data= [costing for costing in costings if 'costing_name' in costing and searchTerm1 in costing['costing_name'].lower()]
            return data

        else:
            return []
    else:
        return []
    

@Bom_router.post("/bmitvat/api/production-bom/add-bom", dependencies=[Depends(get_current_active_user)])
async def create(Pbom:BomInsertSchema,db:Session=Depends(get_db)): 
    # print(Pbom)
    srv=Bom(
            item_sku=Pbom.item_sku, 
            bom_no=Pbom.bom_no, 
            product_code=Pbom.item_sku, 
            item_id=Pbom.item_id, 
            hs_code =Pbom.hs_code, 
            unit_name=Pbom.unit_name, 
            remarks =Pbom.remarks, 
            reference =Pbom.reference,
            total_costing =Pbom.total_costing, 
            item_price =Pbom.item_price, 
            sales_price =Pbom.sales_price, 
            service_code =Pbom.hs_code,
            status =Pbom.status,  
            mrp_type =Pbom.mrp_type, 
            bom_type =Pbom.bom_type,  
            submission_date =Pbom.submission_date, 
            effective_date =Pbom.effective_date, 
            user_id =Pbom.user_id, 
        )
    db.add(srv)
    print(srv)
    db.flush()  # Get the srv.id before committing
    db.commit()

    #Push data in Bom_raw_materials data table

    # for item in Pbom.BRawitems:
    #     bom_raw_mat_item = BomRawMaterials(
    #         bom_id = srv.id,
    #         raw_material_id = item.raw_material_id,
    #         unit_name = srv.unit_name,
    #         material_qty = item.material_qty,
    #         material_rate = item.material_rate,
    #         material_price = item.material_price,
    #         wastage_percent = item.wastage_percent ,
    #         wastage_qty = item.wastage_qty,
    #         wastage_price = item.wastage_price ,
    #         total_qty = item.total_qty,
    #         total_price = item.total_price,
    #         c_date = item.c_date,
    #         user_id = 1
    #         )
    #     db.add(bom_raw_mat_item)

        #print(bom_raw_mat_item)

    #Push data in Bom_Costing data table

    # for item in Pbom.BCostingitems:
    #     bom_cost = BomCosting(
    #         bom_id = srv.id,
    #         costing_id = item.costing_id,
    #         cost = item.cost,
    #         user_id = 1
    #         )
    #     db.add(bom_cost)

    

    return {"Message":"Successfully Add"}


##get BOM Index value::

# @Bom_router.get("/bmitvat/api/production-bom/get_all_bom",response_model=List[ProductionBomIndexSchema], dependencies=[Depends(get_current_active_user)])
# async def index(db:Session=Depends(get_db)):
#     return db.query(Bom).all()


@Bom_router.get("/bmitvat/api/production-bom/get_all_bom",response_model=List[ProductionBomIndexSchema], dependencies=[Depends(get_current_active_user)])
async def index(db:Session=Depends(get_db)):
    #In ITEM shows data From unit data table 
    index=db.query(Bom, Item).join(Item, Bom.item_id == Item.id )\
        .add_columns(Bom.bom_no, Item.item_name, Bom.hs_code, Bom.unit_name, Bom.sales_price, Bom.status).all()
    bom_index_item =[]
    for pp in index:
        bom_index_item.append({
            'bom_no': pp.bom_no,
            'item_name': pp.item_name,
            'hs_code': pp.hs_code,
            'unit_name':pp.unit_name,
            'sales_price':pp.sales_price,
            'status':pp.status
           })

    junit = jsonable_encoder(bom_index_item)
    print(junit)
    return JSONResponse(content=junit)