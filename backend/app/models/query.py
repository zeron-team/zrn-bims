# backend/app/models/query.py

from sqlalchemy import Column, Integer, String, Text, ForeignKey
from app.core.database import Base

class Query(Base):
    __tablename__ = "queries"

    id = Column(Integer, primary_key=True, index=True)
    connection_id = Column(Integer, ForeignKey('db_connections.id'))
    query = Column(Text, nullable=False)
    result = Column(Text)  # Define la columna result
    name = Column(String, nullable=False, default="Unnamed Query")  # Define la columna name con valor predeterminado
