# backend/app/models/query.py

from sqlalchemy import Column, Integer, String, ForeignKey
from app.core.database import Base

class Query(Base):
    __tablename__ = "queries"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=True)  # Limita a 255 caracteres
    query = Column(String(2000), nullable=False)  # Establece una longitud máxima, por ejemplo 2000 caracteres
    connection_id = Column(Integer, ForeignKey("db_connections.id"), nullable=False)
