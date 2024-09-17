# backend/app/models/page.py

from sqlalchemy import Column, Integer, String, Boolean, DateTime
from app.core.database import Base
from datetime import datetime

class Page(Base):
    __tablename__ = "paginas"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, index=True)
    contenido = Column(String)
    estado = Column(Boolean, default=False)
    url = Column(String, unique=True)  # Añadido campo 'url'
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
