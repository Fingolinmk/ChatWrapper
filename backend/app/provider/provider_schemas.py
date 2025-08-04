import datetime
from pydantic import BaseModel
from typing import List, Optional

class ProviderBase(BaseModel):
    name: str
    api_schema: str

class ProviderCreate(ProviderBase):
    pass

class Provider(ProviderBase):
    id: int

    class Config:
        from_attributes = True

class ModelBase(BaseModel):
    name: str
    description: str
    provider_id: int

class ModelCreate(ModelBase):
    pass

class Model(ModelBase):
    id: int

    class Config:
        from_attributes = True

class Tool(BaseModel):
    type: str

class CompletionArgs(BaseModel):
    temperature: Optional[float] = None
    top_p: Optional[float] = None

class AgentBase(BaseModel):
    model: str
    name: str
    description: str
    instructions: str
    tools: List[Tool]
    completion_args: CompletionArgs

class AgentCreate(AgentBase):
    id: str
    

class Agent(AgentBase):
    id: str
    version: int
    created_at: datetime.datetime
    updated_at: datetime.datetime

    class Config:
        from_attributes = True