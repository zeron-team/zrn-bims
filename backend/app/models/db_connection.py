# backend/app/models/db_connection.py

from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from app.core.database import Base

class DBConnection(Base):
    __tablename__ = "db_connections"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), unique=True, index=True, nullable=False)
    db_type = Column(String(50), nullable=False)    # 'mysql', 'postgresql', 'sqlserver', 'mongodb'
    host = Column(String(255), nullable=False)
    port = Column(Integer, nullable=False)
    username = Column(String(255), nullable=False)
    password = Column(String(255), nullable=False)
    db_name = Column(String(255), nullable=False)    # Cambiado de 'database' a 'db_name'
    created_at = Column(DateTime(timezone=True), server_default=func.now())  # Ahora con timestamp automático
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())        # Actualiza automáticamente en cambios
