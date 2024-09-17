# backend/app/schemas/page.py

from pydantic import BaseModel
from datetime import datetime
from typing import Optional

# Esquema para crear una nueva página
class PageCreate(BaseModel):
    nombre: str
    contenido: str
    estado: Optional[bool] = False
    url: Optional[str]  # URL es opcional pero debe ser una cadena si está presente

# Esquema para devolver información de una página existente
class PageOut(BaseModel):
    id: int
    nombre: str
    contenido: str
    estado: bool
    url: str  # URL es obligatorio al devolver la página
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True  # Para habilitar la conversión ORM a Pydantic
