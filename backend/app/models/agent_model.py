from sqlalchemy import Column, Integer, String, ForeignKey, JSON, Float, DateTime
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime

class Agent(Base):
    __tablename__ = "agents"

    id = Column(String, primary_key=True, index=True)
    model = Column(String, index=True)
    name = Column(String, index=True)
    description = Column(String)
    instructions = Column(String)
    tools = Column(JSON)
    completion_args = Column(JSON)
    version = Column(Integer, default=1)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    provider_id = Column(Integer, ForeignKey("providers.id"))
    provider = relationship("Provider", back_populates="agents")