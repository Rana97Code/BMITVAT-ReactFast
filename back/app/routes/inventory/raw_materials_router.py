from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.models.inventory.opening_stock_model import OpeningStockModel, OpeningAddModel, OpeningStockEntity
from app.config import get_db

router = APIRouter()

def get_all_raw_stock(db: Session):
    return db.query(OpeningStockEntity).filter(OpeningStockEntity.item_type == 1).all()

def get_all_finish_stock(db: Session):
    return db.query(OpeningStockEntity).filter(OpeningStockEntity.item_type == 2).all()

def save_opening_stock(db: Session, opening_add_model: OpeningAddModel):
    db_stock = OpeningStockEntity(**opening_add_model.dict())
    db.add(db_stock)
    db.commit()
    db.refresh(db_stock)
    return db_stock

@router.get("/opening_stock/all_raw_stock", response_model=List[OpeningStockModel])
def get_raw_materials(db: Session = Depends(get_db)):
    return get_all_raw_stock(db)

@router.get("/opening_stock/all_finish_stock", response_model=List[OpeningStockModel])
def get_finish_goods(db: Session = Depends(get_db)):
    return get_all_finish_stock(db)

@router.post("/opening_stock/add_opening_stock", response_model=OpeningAddModel)
def save_raw_stock(opening_add_model: OpeningAddModel, db: Session = Depends(get_db)):
    return save_opening_stock(db, opening_add_model)
