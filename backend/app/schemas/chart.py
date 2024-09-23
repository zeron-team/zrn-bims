# backend/app/schemas/chart.py
from pydantic import BaseModel

class ChartCreate(BaseModel):
    query_id: int
    chart_type: str
    chart_title: str
    chart_options: str  # Aquí se guardan las opciones de Highcharts como JSON
    chart_data: str = None  # Hacer que chart_data sea opcional

class ChartOut(BaseModel):
    id: int
    name: str
    query_id: int
    chart_type: str
    chart_title: str  # Agregar chart_title
    chart_options: str
    chart_data: str = None  # Hacer que chart_data sea opcional

    class Config:
        from_attributes = True
