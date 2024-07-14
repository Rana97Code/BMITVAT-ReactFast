
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.schemas.purchase_item import PurchaseItem, PurchaseItemCreate, PurchaseItemUpdate
from app.models.production.local_purchase.purchase_model import PurchaseItem as PurchaseItemModel, Purchase, Item
from app.config import get_db

router = APIRouter()


# Create Purchase Item
@router.post("/purchase_items/", response_model=PurchaseItem, status_code=status.HTTP_201_CREATED)
def create_purchase_item(purchase_item: PurchaseItemCreate, db: Session = Depends(get_db)):
    db_purchase_item = PurchaseItemModel(**purchase_item.dict())

    # Check if the Purchase exists or create a new one
    db_purchase = db.query(Purchase).filter(Purchase.id == purchase_item.purchase_id).first()
    if not db_purchase:
        db_purchase = Purchase(id=purchase_item.purchase_id)
        db.add(db_purchase)
        db.commit()
        db.refresh(db_purchase)

    # Check if the Item exists or create a new one
    db_item = db.query(Item).filter(Item.id == purchase_item.item_id).first()
    if not db_item:
        db_item = Item(id=purchase_item.item_id)
        db.add(db_item)
        db.commit()
        db.refresh(db_item)

    db_purchase_item.purchase_id = purchase_item.purchase_id
    db_purchase_item.item_id = purchase_item.item_id

    db.add(db_purchase_item)
    db.commit()
    db.refresh(db_purchase_item)

    return db_purchase_item


# Read all Purchase Items
@router.get("/purchase_items/", response_model=List[PurchaseItem])
def read_purchase_items(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    purchase_items = db.query(PurchaseItemModel).offset(skip).limit(limit).all()
    return purchase_items


# Read a single Purchase Item by ID
@router.get("/purchase_items/{purchase_item_id}", response_model=PurchaseItem)
def read_purchase_item(purchase_item_id: int, db: Session = Depends(get_db)):
    purchase_item = db.query(PurchaseItemModel).filter(PurchaseItemModel.id == purchase_item_id).first()
    if purchase_item is None:
        raise HTTPException(status_code=404, detail="Purchase item not found")
    return purchase_item


# Update a Purchase Item
@router.put("/purchase_items/{purchase_item_id}", response_model=PurchaseItem)
def update_purchase_item(purchase_item_id: int, purchase_item: PurchaseItemUpdate, db: Session = Depends(get_db)):
    db_purchase_item = db.query(PurchaseItemModel).filter(PurchaseItemModel.id == purchase_item_id).first()
    if db_purchase_item is None:
        raise HTTPException(status_code=404, detail="Purchase item not found")

    for key, value in purchase_item.dict().items():
        setattr(db_purchase_item, key, value)

    db.commit()
    db.refresh(db_purchase_item)
    return db_purchase_item


# Delete a Purchase Item
@router.delete("/purchase_items/{purchase_item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_purchase_item(purchase_item_id: int, db: Session = Depends(get_db)):
    db_purchase_item = db.query(PurchaseItemModel).filter(PurchaseItemModel.id == purchase_item_id).first()
    if db_purchase_item is None:
        raise HTTPException(status_code=404, detail="Purchase item not found")

    db.delete(db_purchase_item)
    db.commit()
    return None
