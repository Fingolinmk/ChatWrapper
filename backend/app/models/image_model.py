# backend/app/models/image_model.py
from sqlalchemy import Column, Integer, String, ForeignKey, LargeBinary
from sqlalchemy.orm import relationship
from app.database import Base

class Image(Base):
    __tablename__ = "images"

    id = Column(Integer, primary_key=True, index=True)
    file_name = Column(String, index=True)
    file_type = Column(String)
    conversation_id = Column(Integer, ForeignKey("conversations.id"))
    image_data = Column(LargeBinary)  # Add this column to store the image blob

    conversation = relationship("Conversation", back_populates="images")  # Use string reference