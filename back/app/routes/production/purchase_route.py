from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.models.production import purchase_model
from app.config import engine, Base, SessionLocal

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/purchases/", response_model=purchase_model.Purchase)
def create_purchase(purchase: purchase_model.PurchaseCreate, db: Session = Depends(get_db)):
    db_purchase = purchase_model.Purchase(**purchase.dict())
    db.add(db_purchase)
    db.commit()
    db.refresh(db_purchase)
    return db_purchase


@router.get("/purchases/", response_model=List[purchase_model.Purchase])
def read_purchases(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return db.query(purchase_model.Purchase).offset(skip).limit(limit).all()


@router.get("/purchases/{purchase_id}", response_model=purchase_model.Purchase)
def read_purchase(purchase_id: int, db: Session = Depends(get_db)):
    db_purchase = db.query(purchase_model.Purchase).filter(purchase_model.Purchase.id == purchase_id).first()
    if db_purchase is None:
        raise HTTPException(status_code=404, detail="Purchase not found")
    return db_purchase


@router.post("/purchases/{purchase_id}/stock_history/", response_model=purchase_model.StockHistory)
def create_stock_history(purchase_id: int, stock_history: purchase_model.StockHistoryCreate,
                         db: Session = Depends(get_db)):
    db_stock_history = purchase_model.StockHistory(**stock_history.dict(), purchase_id=purchase_id)
    db.add(db_stock_history)
    db.commit()
    db.refresh(db_stock_history)
    return db_stock_history
