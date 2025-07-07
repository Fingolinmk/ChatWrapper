# backend/app/models/api_key_model.py
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class APIKey(Base):
    __tablename__ = "api_keys"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    provider_id = Column(Integer, ForeignKey("providers.id"))
    key = Column(String, index=True)

    user = relationship("User", back_populates="api_keys")
    provider = relationship("Provider", back_populates="api_keys")