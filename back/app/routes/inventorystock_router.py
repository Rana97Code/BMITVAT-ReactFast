from fastapi import APIRouter, Depends, HTTPException, requests,Request, File, UploadFile
from typing import Union,List,Optional
from sqlalchemy.orm import Session
from app.models.Production.inventorystock import InventoryStock_model
from app.config import get_db
from app.routes.auth_router import get_current_active_user;
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from pathlib import *
import os

InventoryStock_router = APIRouter()