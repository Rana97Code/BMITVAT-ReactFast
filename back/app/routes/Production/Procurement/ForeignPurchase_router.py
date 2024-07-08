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
from app.models.Production.Procurement.ForeignPurchase_model import foreignPurchase, foreignPurchaseInsertSchema
from app.models.relationship.supplier_model import Supplier, supplierBase, SupplierSchema


ForeignPurchase_router = APIRouter()

# API For all_Suppliers:

@ForeignPurchase_router.get("/bmitvat/api/supplier/all_supplier", response_model=List[SupplierSchema], dependencies=[Depends(get_current_active_user)])
async def index(db:Session = Depends(get_db)):
    return db.query(Supplier).all()


@ForeignPurchase_router.get("/bmitvat/api/supplier/get_supplier/{supplier_id}", response_model=List[SupplierSchema], dependencies=[Depends(get_current_active_user)])
async def get_itm(supplier_id:int,db:Session=Depends(get_db)):
    try:
        u=db.query(Supplier).filter(Supplier.id == supplier_id).first()
        return (u)
    except:
        return HTTPException(status_code=422, details="supplier not found")

# @supplier_router.get("/bmitvat/api/supplier/get_supplier/{supplier_id}",response_model=SupplierSchema, dependencies=[Depends(get_current_active_user)])
# async def get_itm(supplier_id:int,db:Session=Depends(get_db)):
#     try:
#         u=db.query(Supplier).filter(Supplier.id == supplier_id).first()
#         return (u)
#     except:
#         return HTTPException(status_code=422, details="supplier not found")
