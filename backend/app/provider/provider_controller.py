# backend/app/provider/provider_controller.py
from sqlalchemy.orm import Session
from app.models.provider_model import Provider
from app.provider import provider_schemas
from typing import List

def get_provider(db: Session, provider_id: int):
    return db.query(Provider).filter(Provider.id == provider_id).first()

def create_provider(db: Session, provider: provider_schemas.ProviderCreate):
    db_provider = Provider(**provider.dict())
    db.add(db_provider)
    db.commit()
    db.refresh(db_provider)
    return db_provider

def get_providers(db: Session) -> List[Provider]:
    return db.query(Provider).all()

def add_provider_if_not_exists(db: Session, provider_name: str, api_schema: str):
    existing_provider = db.query(Provider).filter(Provider.name == provider_name).first()
    if not existing_provider:
        provider_data = provider_schemas.ProviderCreate(name=provider_name, api_schema=api_schema)
        create_provider(db, provider_data)