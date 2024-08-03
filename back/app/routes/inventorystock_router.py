from fastapi import APIRouter, Depends, HTTPException, requests,Request, File, UploadFile
from typing import Union,List,Optional
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.Production.inventorystock.InventoryStock_model import Stock as StockModel, StockHistory as StockHistoryModel
from app.schemas.production.inventorystock.inventorystock_schema import StockCreate, StockUpdate, StockHistoryCreate, Stock, StockHistory
from typing import List
from app.routes.auth_router import get_current_active_user;
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder

InventoryStock_router = APIRouter()

