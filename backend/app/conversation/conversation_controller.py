# backend/app/conversation/conversation_controller.py
from sqlalchemy.orm import Session
from app.models.conversation_model import Conversation
from app.models.message_model import Message
from app.conversation import conversation_schemas
from typing import List

def get_conversation(db: Session, conversation_id: int, user_id: int):
    return db.query(Conversation).filter(Conversation.id == conversation_id, Conversation.user_id == user_id).first()

def create_conversation(db: Session, conversation: conversation_schemas.ConversationCreate, user_id: int):
    db_conversation = Conversation(title=conversation.title, user_id=user_id)
    db.add(db_conversation)
    db.commit()
    db.refresh(db_conversation)

    # Add messages with auto-incremented message_number
    for index, message in enumerate(conversation.messages):
        db_message = Message(content=message.content, role=message.role, message_number=index + 1, conversation_id=db_conversation.id)
        db.add(db_message)

    db.commit()
    db.refresh(db_conversation)
    return db_conversation

def update_conversation(db: Session, conversation_id: int, conversation: conversation_schemas.ConversationUpdate, user_id: int):
    db_conversation = get_conversation(db, conversation_id, user_id)
    if db_conversation is None:
        return None

    # Update the conversation title if provided
    if conversation.title:
        db_conversation.title = conversation.title

    # Update or create messages
    for index, message in enumerate(conversation.messages):
        db_message = db.query(Message).filter(Message.conversation_id == conversation_id, Message.message_number == index + 1).first()
        if db_message:
            db_message.content = message.content
            db_message.role = message.role
        else:
            db_message = Message(content=message.content, role=message.role, message_number=index + 1, conversation_id=conversation_id)
            db.add(db_message)

    db.commit()
    db.refresh(db_conversation)
    return db_conversation

def get_all_conversations(db: Session, user_id: int) -> List[Conversation]:
    return db.query(Conversation).filter(Conversation.user_id == user_id).all()