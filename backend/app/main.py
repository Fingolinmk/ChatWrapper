# backend/app/main.py
from app.provider.provider_controller import add_provider_if_not_exists
from app.provider.model_controller import add_model_if_not_exists
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.user.user_routes import user_router
from app.api_key.api_key_routes import api_key_router
from app.provider.provider_routes import provider_router
from app.conversation.conversation_routes import conversation_router
from app.models import *
from app.database import Base, engine, get_db

# Import all other models here if they are in separate files

Base.metadata.create_all(bind=engine)

app = FastAPI()
origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:8000",
    "http://localhost:3000/import",
    "*",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_router, prefix="/api", tags=["users"])
app.include_router(api_key_router, prefix="/api", tags=["api_keys"])
app.include_router(provider_router, prefix="/api", tags=["providers"])
app.include_router(conversation_router, prefix="/api", tags=["conversations"])

@app.on_event("startup")
def on_startup():
    db = next(get_db())
    add_provider_if_not_exists(db, "Mistral", "https://api.mistral.ai/v1/chat/completions")

    # Add models
    models = [
        {"name": "mistral-small-2503", "description": "new leader in the small models category with image understanding capabilities, released March 2025."},
        {"name": "mistral-medium-2505", "description": "Mistrals frontier-class multimodal model released May 2025"},
        {"name": "mistral-large-2411", "description": "Mistrals top-tier large model for high-complexity tasks with the lastest version released November 2024."},
        {"name": "magistral-medium-2506", "description": "Mistrals frontier-class reasoning model released June 2025"},
        {"name": "codestral-2501", "description": "Mistrals cutting-edge language model for coding with the second version released January 2025, Codestral specializes in low-latency, high-frequency tasks such as fill-in-the-middle (FIM), code correction and test generation."},
        {"name": "ministral-3b-2410", "description": "Mistrals best edge model"},
        {"name": "ministral-8b-2410", "description": "Powerful edge model with extremely high performance/price ratio."},
    ]

    for model in models:
        add_model_if_not_exists(db, model["name"], model["description"], "Mistral")

@app.get("/")
def read_root():
    return {"message": "Welcome to the Cat Wrapper API"}