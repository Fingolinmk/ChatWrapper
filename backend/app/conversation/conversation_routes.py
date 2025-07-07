# backend/app/conversation/conversation_routes.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.conversation import conversation_schemas, conversation_controller
from app.user.user_controller import get_current_user
from app.models.user_model import User
from typing import List

conversation_router = APIRouter()

@conversation_router.post("/conversations/", response_model=conversation_schemas.Conversation)
def create_conversation(
    conversation: conversation_schemas.ConversationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Creates a new conversation for the logged-in user.
    """
    return conversation_controller.create_conversation(db=db, conversation=conversation, user_id=current_user.id)

@conversation_router.get("/conversations/{conversation_id}", response_model=conversation_schemas.Conversation)
def read_conversation(
    conversation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Retrieves a conversation for the logged-in user.
    """
    db_conversation = conversation_controller.get_conversation(db, conversation_id=conversation_id, user_id=current_user.id)
    if db_conversation is None:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return db_conversation

@conversation_router.put("/conversations/{conversation_id}", response_model=conversation_schemas.Conversation)
def update_conversation(
    conversation_id: int,
    conversation: conversation_schemas.ConversationUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Updates a conversation for the logged-in user.
    """
    return conversation_controller.update_conversation(db=db, conversation_id=conversation_id, conversation=conversation, user_id=current_user.id)

@conversation_router.get("/conversations/", response_model=List[conversation_schemas.ConversationSummary])
def read_conversations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Retrieves all conversations for the logged-in user.
    """
    return conversation_controller.get_all_conversations(db, user_id=current_user.id)