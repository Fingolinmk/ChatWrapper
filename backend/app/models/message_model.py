# backend/app/models/message_model.py
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    conversation_id = Column(Integer, ForeignKey("conversations.id"))
    message_number = Column(Integer)
    content = Column(String)
    role = Column(String)  # 'user' or 'chatbot'

    conversation = relationship("Conversation", back_populates="messages")