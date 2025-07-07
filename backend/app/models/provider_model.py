# backend/app/models/provider_model.py
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.database import Base

class Provider(Base):
    __tablename__ = "providers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    api_schema = Column(String)  # Store the API schema as a JSON string

    api_keys = relationship("APIKey", back_populates="provider")
    models = relationship("Model", back_populates="provider")
