# backend/app/provider/model_controller.py
from sqlalchemy.orm import Session
from app.models.provider_model import Provider
from app.models.model_model import Model
from app.provider import provider_schemas
from typing import List

def get_model(db: Session, model_id: int):
    return db.query(Model).filter(Model.id == model_id).first()

def create_model(db: Session, model: provider_schemas.ModelCreate):
    db_model = Model(**model.dict())
    db.add(db_model)
    db.commit()
    db.refresh(db_model)
    return db_model

def get_models(db: Session) -> List[Model]:
    return db.query(Model).all()

def add_model_if_not_exists(db: Session, model_name: str, description: str, provider_name: str):
    existing_model = db.query(Model).filter(Model.name == model_name).first()
    if not existing_model:
        provider = db.query(Provider).filter(Provider.name == provider_name).first()
        if provider:
            model_data = provider_schemas.ModelCreate(name=model_name, description=description, provider_id=provider.id)
            create_model(db, model_data)
        else:
            print(f"Provider {provider_name} not found.")
    else:
        print(f"Model {model_name} already exists.")
