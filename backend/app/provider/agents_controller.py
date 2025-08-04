from sqlalchemy.orm import Session
from app.models.agent_model import Agent
from app.provider import provider_schemas
from typing import List

def get_agent(db: Session, agent_id: int):
    return db.query(Agent).filter(Agent.id == agent_id).first()

def create_agent(db: Session, agent: provider_schemas.AgentCreate):
    print("Creating agent provider_schemas.AgentCreate: ", agent)
    db_agent = Agent(**agent.dict())
    print("Creating agent in db: ", db_agent)
    db.add(db_agent)
    db.commit()
    db.refresh(db_agent)
    return db_agent

def get_agents(db: Session) -> List[Agent]:
    return db.query(Agent).all()