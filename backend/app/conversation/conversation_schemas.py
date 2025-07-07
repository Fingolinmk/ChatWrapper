# backend/app/conversation/conversation_schemas.py
from pydantic import BaseModel
from typing import List, Optional

class MessageBase(BaseModel):
    content: str
    role: str

class MessageCreate(MessageBase):
    pass

class Message(MessageBase):
    id: int
    conversation_id: int
    message_number: int  # Add message_number here

    class Config:
        from_attributes = True

class ConversationBase(BaseModel):
    title: str

class ConversationCreate(ConversationBase):
    messages: List[MessageCreate] = []

class ConversationUpdate(ConversationBase):
    messages: List[MessageCreate] = []

class Conversation(ConversationBase):
    id: int
    user_id: int
    messages: List[Message] = []

    class Config:
        from_attributes = True

class ConversationSummary(BaseModel):
    id: int
    title: str

    class Config:
        from_attributes = True