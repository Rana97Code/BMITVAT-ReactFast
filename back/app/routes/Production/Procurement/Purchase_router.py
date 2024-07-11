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
from app.models.relationship.supplier_model import Supplier, supplierBase, SupplierSchema
from app.models.Production.Procurement.Purchase_model import Purchase,Purchase_item, foreignPurchaseInsertSchema, ItemDetailsModel, foreignPurchaseInsertSchema,foreignPurchaseInsertSchema




from app.models.general_settings.hs_code_model import Hscode
# from app.models.Production.Procurement.PurchaseItem_model import Purchase_item
from app.models.inventory.item_model import Item
Purchase_router = APIRouter()

# API For purchase::
@Purchase_router.post("/bmitvat/api/purchase/ad-foreign-purchase/", dependencies=[Depends(get_current_active_user)])
async def create(fpurchase:foreignPurchaseInsertSchema,db:Session=Depends(get_db)): 

    srv=Purchase(
        item_id= fpurchase.purchase_id,
        invoice_no = fpurchase.invoice_no,
        purchase_id=fpurchase.purchase_id,
        purchase_type=fpurchase.purchase_type,
        purchase_category=fpurchase.purchase_category,
        service_category=fpurchase.service_category,
        lc_number=fpurchase.lc_number,
        lc_date=fpurchase.lc_date,
        chalan_date=fpurchase.chalan_date,
        total_vds=fpurchase.total_vds,
        grand_total=fpurchase.grand_total,
        total_tax=fpurchase.total_tax,
        supplier_id=fpurchase.supplier_id,
        vendor_invoice=fpurchase.vendor_invoice,
        entry_date=fpurchase.entry_date,
        notes=fpurchase.notes,
        user_id=fpurchase.user_id,
        custom_house=fpurchase.custom_house,
        country_origin=fpurchase.country_origin,
        boe_item_no=fpurchase.boe_item_no,
        data_source=fpurchase.data_source,
        cpc_code=fpurchase.cpc_code )
    db.add(srv)
    db.commit()

    for item in fpurchase.items:
        purchase_item = Purchase_item(
            item_id = item.item_id,
            purchase_id = srv.id,
            boe_item_no = item.boe_item_no,
            hs_code_id = item.hs_code_id,
            service_code = item.service_code,
            quantity = item.qty,
            rate = item.rate,
            vatable_value = item.vatable_value,
            vat_rate = item.vat_rate,
            tax_amount = item.tax_amount,
            item_cd = item.item_cd,
            cd_amount = item.cd_amount,
            item_sd = item.item_sd,
            sd_amount = item.sd_amount,
            item_rd = item.item_rd,
            rd_amount = item.rd_amount,
            item_at = item.item_at,
            at_amount = item.at_amount,
            item_ait = item.item_ait,
            ait_amount = item.ait_amount,
            item_tti = item.item_tti,
            tti_amount = item.tti_amount,
            amount = item.amount,
            t_amount = item.t_amount,
            access_amount = item.access_amount,
            vat_type = item.vat_type,
            vds = item.vds,
            rebate = item.rebate,
            purchase_date = item.purchase_date,
            entry_date = item.entry_date,
            p_date = item.p_date,
        )
        db.add(purchase_item)
    
    db.commit()
    return {"Message":"Successfully Add"}

# @Purchase_router.get("/bmitvat/api/purchase/get_item_details/{clickedValue}", response_model= ItemDetailsModel, dependencies=[Depends(get_current_active_user)])
# async def get_item_details_by_id(item_id:int,db:Session=Depends(get_db)):

#     try:
#         print(item_id)
#         item = db.query(Item.id, Item.item_name, Item.hs_code_id, Item.hs_code,Hscode.sd, Hscode.vat, Hscode.cd, Hscode.ait, Hscode.rd, Hscode.at, Hscode.tti)\
#         .join(Hscode, Item.hs_code_id == Hscode.id).filter(Item.id == item_id).first()

#         # if item is None:
#         #     raise HTTPException(status_code=404, detail="Item not found")

#         return item
#     except:
#         return HTTPException(status_code=422, details="item not found")

@Purchase_router.get("/bmitvat/api/purchase/get_item_details/{item_id}", response_model=ItemDetailsModel, dependencies=[Depends(get_current_active_user)])
async def get_item_details_by_id(item_id: int, db: Session = Depends(get_db)):
    try:
        print(item_id)
        item = db.query(Item.id, Item.item_name, Item.hs_code_id, Item.hs_code, Hscode.sd, Hscode.vat, Hscode.cd, Hscode.ait, Hscode.rd, Hscode.at, Hscode.tti)\
            .join(Hscode, Item.hs_code_id == Hscode.id).filter(Item.id == item_id).first()
        
        if item is None:
            raise HTTPException(status_code=404, detail="Item not found")


        item_details = {
            "id": item.id, 
            "item_name": item.item_name, 
            "hs_code_id": item.hs_code_id,
            "hs_code": item.hs_code,
            "sd": item.sd,
            "vat": item.vat,
            "cd": item.cd,
            "ait": item.ait,
            "rd": item.rd,
            "at": item.at,
            "tti": item.tti
        }

        return item_details
    except HTTPException as e:
        raise e
    except Exception as e:
        print(f"Unexpected error: {e}")
        raise HTTPException(status_code=422, detail="Unprocessable Entity")
    
    #API for POST data foreign purchase table to Purchase table::




    

# @hscode_route.post("/bmitvat/api/hs_code/add_hs_code", dependencies=[Depends(get_current_active_user)])
# async def create(hscode:HscodeCreateSchema,db:Session=Depends(get_db)): 

#     srv=Hscode(hscode=hscode.hs_code, description=hscode.description,cd=hscode.cd,sd=hscode.sd, vat=hscode.vat,
#                 ait=hscode.ait, rd=hscode.rd,at=hscode.at,tti=hscode.tti,schedule=hscode.schedule,
#                 user_id=hscode.user_id,delete_status=hscode.delete_status,vat_type=hscode.vat_type,type=hscode.type,
#                 year_start=hscode.year_start, year_end=hscode.year_end, calculate_year=hscode.calculate_year, keycode=hscode.keycode)
#     db.add(srv)
#     db.commit()
#     return {"Message":"Successfully Add"}