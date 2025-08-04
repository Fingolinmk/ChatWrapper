# backend/app/image/image_schemas.py
from pydantic import BaseModel

class ImageBase(BaseModel):
    file_name: str
    file_type: str

class ImageCreate(ImageBase):
    file_content: bytes

class Image(ImageBase):
    id: int
    conversation_id: int

    class Config:
        from_attributes = True