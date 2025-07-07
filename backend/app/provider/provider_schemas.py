# backend/app/provider/provider_schemas.py
from pydantic import BaseModel

class ProviderBase(BaseModel):
    name: str
    api_schema: str

class ProviderCreate(ProviderBase):
    pass

class Provider(ProviderBase):
    id: int

    class Config:
        from_attributes = True

class ModelBase(BaseModel):
    name: str
    description: str
    provider_id: int

class ModelCreate(ModelBase):
    pass

class Model(ModelBase):
    id: int

    class Config:
        from_attributes = True