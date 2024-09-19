# backend/app/schemas/query.py

from pydantic import BaseModel
from typing import List, Any

class QueryCreate(BaseModel):
    connection_id: int
    query: str

class QueryOut(BaseModel):
    id: int
    connection_id: int
    query: str
    result: str
    columns: List[str]  # Nombres de columnas
    rows: List[Any]     # Filas de datos
    name: str          # Nombre de la consulta

    class Config:
        from_attributes = True
