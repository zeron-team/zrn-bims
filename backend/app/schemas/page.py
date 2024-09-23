# backend/app/schemas/page.py

from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class Estructura(BaseModel):
    superior: int
    medio: int
    inferior: int

class PageCreate(BaseModel):
    nombre: str
    descripcion: str
    contenido: str
    estado: Optional[bool] = False
    url: Optional[str]
    estructura: Estructura  # Usar el tipo Estructura en lugar de un dict

class PageOut(BaseModel):
    id: int
    nombre: str
    descripcion: str
    contenido: str
    estado: bool
    url: str
    estructura: Estructura  # Debería estar definido así, como un objeto Pydantic
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True  # Esto habilita la conversión de datos de SQLAlchemy a Pydantic
