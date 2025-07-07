# backend/app/api_key/api_key_routes.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.api_key import api_key_schemas, api_key_controller
from app.user.user_controller import get_current_user
from app.models.user_model import User
from typing import List

api_key_router = APIRouter()

@api_key_router.post("/api_keys/", response_model=api_key_schemas.APIKey)
def create_api_key(
    api_key: api_key_schemas.APIKeyCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Creates a new API key for the logged-in user.
    """
    return api_key_controller.create_api_key(db=db, api_key=api_key, user_id=current_user.id)

@api_key_router.get("/api_keys/{api_key_id}", response_model=api_key_schemas.APIKey)
def read_api_key(
    api_key_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Retrieves an API key for the logged-in user.
    """
    db_api_key = api_key_controller.get_api_key(db, api_key_id=api_key_id, user_id=current_user.id)
    if db_api_key is None:
        raise HTTPException(status_code=404, detail="API Key not found")
    return db_api_key

@api_key_router.delete("/api_keys/{api_key_id}", response_model=api_key_schemas.APIKey)
def delete_api_key(
    api_key_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Deletes an API key for the logged-in user.
    """
    db_api_key = api_key_controller.delete_api_key(db, api_key_id=api_key_id, user_id=current_user.id)
    if db_api_key is None:
        raise HTTPException(status_code=404, detail="API Key not found")
    return db_api_key

@api_key_router.get("/api_keys/", response_model=List[api_key_schemas.APIKey])
def read_api_keys(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Retrieves all API keys for the logged-in user.
    """
    db_api_keys = api_key_controller.get_all_api_keys(db, user_id=current_user.id)
    return db_api_keys

@api_key_router.get("/api_keys/model/{model_id}", response_model=api_key_schemas.APIKey)
def get_api_key_by_model_id(
    model_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Retrieves the API key for a specific model.
    """
    db_api_key = api_key_controller.get_api_key_by_model_id(db, model_id=model_id, user_id=current_user.id)
    if db_api_key is None:
        raise HTTPException(status_code=404, detail="API Key not found for the specified model")
    return db_api_key