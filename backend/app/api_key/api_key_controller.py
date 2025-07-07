# backend/app/api_key/api_key_controller.py
from sqlalchemy.orm import Session
from app.models.api_key_model import APIKey
from app.models.model_model import Model
from app.api_key import api_key_schemas
from typing import List

def get_api_key(db: Session, api_key_id: int, user_id: int):
    return db.query(APIKey).filter(APIKey.id == api_key_id, APIKey.user_id == user_id).first()

def create_api_key(db: Session, api_key: api_key_schemas.APIKeyCreate, user_id: int):
    db_api_key = APIKey(**api_key.dict(), user_id=user_id)
    db.add(db_api_key)
    db.commit()
    db.refresh(db_api_key)
    return db_api_key

def delete_api_key(db: Session, api_key_id: int, user_id: int):
    db_api_key = db.query(APIKey).filter(APIKey.id == api_key_id, APIKey.user_id == user_id).first()
    if db_api_key:
        db.delete(db_api_key)
        db.commit()
    return db_api_key

def get_all_api_keys(db: Session, user_id: int) -> List[APIKey]:
    return db.query(APIKey).filter(APIKey.user_id == user_id).all()

def get_api_key_by_model_id(db: Session, model_id: int, user_id: int):
    model = db.query(Model).filter(Model.id == model_id).first()
    if model:
        return db.query(APIKey).filter(APIKey.provider_id == model.provider_id, APIKey.user_id == user_id).first()
    return None