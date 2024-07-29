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

@InventoryStock_router.get("/bmitvat/api/stocks/", response_model=List[Stock])
def read_stocks(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    stocks = db.query(StockModel).offset(skip).limit(limit).all()
    return stocks

@InventoryStock_router.get("/stocks/{stock_id}", response_model=Stock)
def read_stock(stock_id: int, db: Session = Depends(get_db)):
    stock = db.query(StockModel).filter(StockModel.id == stock_id).first()
    if stock is None:
        raise HTTPException(status_code=404, detail="Stock not found")
    return stock

@InventoryStock_router.post("/stocks/", response_model=Stock)
def create_stock(stock: StockCreate, db: Session = Depends(get_db)):
    db_stock = StockModel(
        item_id=stock.item_id,
        qty=stock.qty,
        rate=stock.rate,
        status=stock.status,
        user_id=stock.user_id
    )
    db.add(db_stock)
    db.commit()
    db.refresh(db_stock)
    return db_stock

@InventoryStock_router.put("/stocks/{stock_id}", response_model=Stock)
def update_stock(stock_id: int, stock: StockUpdate, db: Session = Depends(get_db)):
    db_stock = db.query(StockModel).filter(StockModel.id == stock_id).first()
    if db_stock is None:
        raise HTTPException(status_code=404, detail="Stock not found")
    
    db_stock.qty = stock.qty
    db_stock.rate = stock.rate
    db_stock.status = stock.status
    db_stock.user_id = stock.user_id
    
    db.commit()
    db.refresh(db_stock)
    return db_stock

@InventoryStock_router.delete("/stocks/{stock_id}", response_model=Stock)
def delete_stock(stock_id: int, db: Session = Depends(get_db)):
    db_stock = db.query(StockModel).filter(StockModel.id == stock_id).first()
    if db_stock is None:
        raise HTTPException(status_code=404, detail="Stock not found")
    
    db.delete(db_stock)
    db.commit()
    return db_stock

@InventoryStock_router.get("/stock-history/", response_model=List[StockHistory])
def read_stock_histories(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    stock_histories = db.query(StockHistoryModel).offset(skip).limit(limit).all()
    return stock_histories

@InventoryStock_router.get("/stock-history/{history_id}", response_model=StockHistory)
def read_stock_history(history_id: int, db: Session = Depends(get_db)):
    stock_history = db.query(StockHistoryModel).filter(StockHistoryModel.id == history_id).first()
    if stock_history is None:
        raise HTTPException(status_code=404, detail="Stock history not found")
    return stock_history

@InventoryStock_router.post("/stock-history/", response_model=StockHistory)
def create_stock_history(stock_history: StockHistoryCreate, db: Session = Depends(get_db)):
    db_stock_history = StockHistoryModel(
        item_id=stock_history.item_id,
        action_tbl=stock_history.action_tbl,
        action_tbl_id=stock_history.action_tbl_id,
        previous_stock=stock_history.previous_stock,
        qty=stock_history.qty,
        action_type=stock_history.action_type,
        status=stock_history.status,
        user_id=stock_history.user_id
    )
    db.add(db_stock_history)
    db.commit()
    db.refresh(db_stock_history)
    return db_stock_history
