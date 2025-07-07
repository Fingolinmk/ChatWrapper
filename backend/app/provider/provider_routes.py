# backend/app/provider/provider_routes.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.provider import provider_schemas, provider_controller, model_controller
from app.user.user_controller import get_current_user
from app.models.user_model import User
from typing import List

provider_router = APIRouter()

@provider_router.post("/providers/", response_model=provider_schemas.Provider)
def create_provider(
    provider: provider_schemas.ProviderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Creates a new provider.
    """
    return provider_controller.create_provider(db=db, provider=provider)

@provider_router.get("/providers/{provider_id}", response_model=provider_schemas.Provider)
def read_provider(
    provider_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Retrieves a provider.
    """
    db_provider = provider_controller.get_provider(db, provider_id=provider_id)
    if db_provider is None:
        raise HTTPException(status_code=404, detail="Provider not found")
    return db_provider

@provider_router.get("/providers/", response_model=List[provider_schemas.Provider])
def read_providers(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Retrieves all providers.
    """
    return provider_controller.get_providers(db)

@provider_router.post("/models/", response_model=provider_schemas.Model)
def create_model(
    model: provider_schemas.ModelCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Creates a new model.
    """
    return model_controller.create_model(db=db, model=model)

@provider_router.get("/models/", response_model=List[provider_schemas.Model])
def read_models(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Retrieves all models.
    """
    return model_controller.get_models(db)