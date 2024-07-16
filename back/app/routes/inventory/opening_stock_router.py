from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.config import SessionLocal
from app.models.inventory.opening_stock_model import OpeningStockEntity, OpeningAddModel, OpeningStockModel
from app.models.inventory.item_model import Item
from typing import List

router = APIRouter(
    prefix="/bmitvat/api/opening_stock",
    tags=["opening_stock"]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=OpeningStockModel)
def create_opening_stock(opening_stock: OpeningAddModel, db: Session = Depends(get_db)):
    item = db.query(Item).filter(Item.id == opening_stock.item_id).first()
    if item is None:
        raise HTTPException(status_code=400, detail="Item does not exist")

    db_opening_stock = OpeningStockEntity(**opening_stock.dict())
    db.add(db_opening_stock)
    db.commit()
    db.refresh(db_opening_stock)

    item.stock_status = 1
    db.commit()

    return db_opening_stock


@router.get("/", response_model=List[OpeningStockModel])
def read_opening_stocks(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    opening_stocks = db.query(OpeningStockEntity).offset(skip).limit(limit).all()
    return opening_stocks


@router.get("/{opening_stock_id}", response_model=OpeningStockModel)
def read_opening_stock(opening_stock_id: int, db: Session = Depends(get_db)):
    opening_stock = db.query(OpeningStockEntity).filter(OpeningStockEntity.id == opening_stock_id).first()
    if opening_stock is None:
        raise HTTPException(status_code=404, detail="Opening stock not found")
    return opening_stock
