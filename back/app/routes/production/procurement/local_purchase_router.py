import logging
from fastapi import APIRouter, Depends, HTTPException, requests,Request, File, UploadFile
from typing import Union,List,Optional,Dict,Any
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.routes.auth_router import get_current_active_user;
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from pathlib import *
import os
from sqlalchemy.sql.sqltypes import Numeric
from app.models.inventory.opening_stock_model import OpeningStock, OpeningInsertSchema , OpeningStockSchema
from app.models.relationship.supplier_model import Supplier, supplierBase, SupplierSchema
from app.models.Production.Procurement.Purchase_model import Purchase,Purchase_item
from app.schemas.production.procurement.LocalPurchase_schema import PurchaseTableDetailsModel
from app.schemas.production.procurement.LocalPurchase_schema import LocalPurchaseInsertSchema,ItemDetailsModel
from app.models.general_settings.hs_code_model import Hscode
from app.models.inventory.item_model import Item, ItemSuggest
from app.models.Production.inventorystock.InventoryStock_model import Stock, StockHistory


Purchase_router = APIRouter()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@Purchase_router.post("/bmitvat/api/purchase/add-local-purchase", dependencies=[Depends(get_current_active_user)])
async def create_local_purchase(lpurchase: LocalPurchaseInsertSchema, db: Session = Depends(get_db)):
    try:
        srv = Purchase(
            invoice_no=lpurchase.invoice_no,
            vendor_inv=lpurchase.vendor_inv,
            supplier_id=lpurchase.supplier_id,
            purchase_type=lpurchase.purchase_type,
            purchase_category=lpurchase.purchase_category,
            lc_number=lpurchase.lc_number,
            custom_house_id=lpurchase.custom_house_id,
            country_origin=lpurchase.country_origin,
            data_source=lpurchase.data_source,
            cpc_code_id=lpurchase.cpc_code_id,
            grand_total=lpurchase.grand_total,
            total_tax=lpurchase.total_tax,
            total_at=lpurchase.total_at,
            fiscal_year=lpurchase.fiscal_year,
            notes=lpurchase.notes,
            user_id=lpurchase.user_id,
            lc_date=lpurchase.lc_date,
            chalan_date=lpurchase.chalan_date,
            entry_date=lpurchase.entry_date
            )
        db.add(srv)
        db.flush()  # Get the srv.id before committing

        for item in lpurchase.items:
            purchase_item = Purchase_item(
                item_id=item.item_id,
                purchase_id=srv.id,
                boe_item_no = item.boe_item_no,
                access_amount = item.access_amount,
                at_amount = item.at_amount,
                item_cd = item.item_cd,
                cd_amount = item.cd_amount,
                hs_code = item.hs_code,
                hs_code_id = item.hs_code_id,
                item_at = item.item_at,
                item_rd = item.item_rd,
                item_sd = item.item_sd,
                qty=float(item.qty) if item.qty is not None else 0.0,
                rate=float(item.rate) if item.rate is not None else 0.0,
                vds = item.vds,
                rd_amount = item.rd_amount,
                rebate = item.rebate,
                sd_amount = item.sd_amount,
                t_amount = item.t_amount,
                vat_rate = item.vat_rate,
                vat_type = item.vat_type,
                vatable_value = item.vatable_value,
                purchase_date = srv.entry_date,
                entry_date = srv.entry_date,
                p_date = srv.entry_date
                )
            db.add(purchase_item)
           
            # Update stock
            stock_item = db.query(Stock).filter(Stock.item_id == item.item_id).first()
            if stock_item:
                if stock_item.qty is None:
                    stock_item.qty = 0.0
                logger.info(f"Updating stock for item_id {item.item_id}. Old qty: {stock_item.qty}, Purchase qty: {float(item.qty)}")
                stock_item.qty = float(stock_item.qty) + float(item.qty)
            else:
                logger.info(f"Adding new stock entry for item_id {item.item_id} with qty {float(item.qty)}")
                new_stock_item = Stock(
                    item_id=item.item_id,
                    qty=float(item.qty),
                    rate=float(item.rate),
                    status=1,  # assuming 1 is for active status
                    user_id=lpurchase.user_id
                )
                db.add(new_stock_item)
            
        db.commit()
        return {"Message": "Successfully Added"}

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Error occurred: {e}")
    finally:
        db.close()

@Purchase_router.get("/bmitvat/api/local_purchase/all-purchase", response_model=List[PurchaseTableDetailsModel], dependencies=[Depends(get_current_active_user)])
async def index(db: Session = Depends(get_db)):
    try:
        # Check Purchase Table Data
        purchases = db.query(Purchase).all()
        print("Purchase Table Data:", purchases)

        # Check Supplier Table Data
        suppliers = db.query(Supplier).all()
        print("Supplier Table Data:", suppliers)

        # Log each Purchase entry's supplier_id
        for purchase in purchases:
            print(f"Purchase ID: {purchase.id}, Supplier ID: {purchase.supplier_id}")

        # Log each Supplier entry's id
        for supplier in suppliers:
            print(f"Supplier ID: {supplier.id}, Supplier Name: {supplier.supplier_name}")

        # Query the database with join
        index = db.query(Purchase, Supplier).join(Supplier, Purchase.supplier_id == Supplier.id)\
            .add_columns(Purchase.id, Purchase.invoice_no, Supplier.supplier_name).all()

        if not index:
            print("Query returned no results")

        # Log the query results
        print("Query Results:", index)

        pur_index_item = []
        for pp in index:
            print("Processing record:", pp)
            pur_index_item.append({
                'id': pp.id,
                'invoice_no': pp.invoice_no,
                'supplier_name': pp.supplier_name,
            })

        if not pur_index_item:
            print("Parsed results are empty")

        # Log the parsed results
        print("Parsed Results:", pur_index_item)

        junit = jsonable_encoder(pur_index_item)
        return JSONResponse(content=junit)

    except Exception as e:
        # Log any errors
        print("Error:", str(e))
        raise HTTPException(status_code=500, detail="Internal Server Error")





#local purchase ITem Search function
async def all_suggestitm(year: int, db:Session=Depends(get_db)):
    result = db.query(Item,Hscode).join(Hscode, Item.hs_code_id==Hscode.id)\
            .filter(Item.stock_status == 1, Hscode.calculate_year == year)\
            .add_columns(Item.id, Item.item_name, Item.hs_code, Item.calculate_year).all()
            
    items = []
    for y in result:
        items.append({
            'id' : y.id,
            'item_name': y.item_name,
            'hs_code': y.hs_code,
            'calculate_year': y.calculate_year,
        })

    json_items = jsonable_encoder(items)
    return json_items

#local purchase ITem Search query
@Purchase_router.post("/bmitvat/api/item/getItemSuggestions", response_model=List[ItemSuggest])
async def suggest_items(request: Request,db:Session=Depends(get_db)):
    request_body = await request.body()
    decoded_string = request_body.decode()
    parts = decoded_string.split("/")
    
    if len(parts) > 1:
        year = parts[0]
        part2 = parts[1]
        items = await all_suggestitm(year = year, db = db)
        searchTerm = part2.lower()
        if searchTerm:
            data= [item for item in items if 'item_name' in item and searchTerm in item['item_name'].lower()]
            return data

        else:
            return []
    else:
        return []


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












