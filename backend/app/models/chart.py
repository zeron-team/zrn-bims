# backend/app/models/chart.py
from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class Chart(Base):
    __tablename__ = "charts"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    query_id = Column(Integer, ForeignKey('queries.id'), nullable=True)
    chart_type = Column(String(50), nullable=False)
    chart_title = Column(String(255), nullable=False)  # Agregar chart_title al modelo
    chart_options = Column(Text, nullable=False)
    chart_data = Column(Text, nullable=True)  # Permitir null en chart_data

    query = relationship("Query")  # Relación con el modelo Query
