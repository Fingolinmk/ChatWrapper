# backend/app/image/image_controller.py
from sqlalchemy.orm import Session
from app.models.image_model import Image
from app.image import image_schemas
from typing import List

def create_image(db: Session, image: image_schemas.ImageCreate, conversation_id: int):
    # Create a new image record in the database
    db_image = Image(
        file_name=image.file_name,
        file_type=image.file_type,
        conversation_id=conversation_id,
        image_data=image.file_content  # Store the image blob
    )
    db.add(db_image)
    db.commit()
    db.refresh(db_image)
    return db_image

def get_images_by_conversation(db: Session, conversation_id: int) -> List[Image]:
    return db.query(Image).filter(Image.conversation_id == conversation_id).all()