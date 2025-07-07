# backend/app/api_key/api_key_schemas.py
from pydantic import BaseModel

class APIKeyBase(BaseModel):
    
    provider_id: int
    key: str

class APIKeyCreate(APIKeyBase):
    pass

class APIKey(APIKeyBase):
    user_id: int
    id: int

    class Config:
        from_attributes = True