# backend/app/models/page.py

from sqlalchemy import Column, Integer, String, Boolean, DateTime, JSON
from app.core.database import Base
from datetime import datetime

class Page(Base):
    __tablename__ = "paginas"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, index=True)
    descripcion = Column(String)  # Campo para descripción
    contenido = Column(String)
    estado = Column(Boolean, default=False)
    url = Column(String, unique=True)
    estructura = Column(JSON)  # Definir estructura como un campo JSON
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
