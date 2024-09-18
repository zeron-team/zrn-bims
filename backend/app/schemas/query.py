# backend/app/schemas/query.py

from pydantic import BaseModel

class QueryCreate(BaseModel):
    name: str
    query: str
    connection_id: int

class QueryOut(BaseModel):
    id: int
    name: str
    query: str
    connection_id: int

    class Config:
        from_attributes = True  # En lugar de orm_mode
