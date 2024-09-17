# backend/app/schemas/db_connection.py

from pydantic import BaseModel

class DBConnectionCheck(BaseModel):
    db_type: str
    host: str
    port: int
    username: str
    password: str

class DBConnectionCreate(BaseModel):
    name: str
    db_type: str
    host: str
    port: int
    username: str
    password: str
    db_name: str  # Asegúrate de usar 'db_name' en lugar de 'database'

class DBConnectionOut(BaseModel):
    id: int
    name: str
    db_type: str
    host: str
    port: int
    username: str
    db_name: str

    class Config:
        from_attributes = True
