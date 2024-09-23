# backend/app/schemas/chart.py

from pydantic import BaseModel, Field
from typing import Optional

class ChartCreate(BaseModel):
    query_id: Optional[int]
    chart_type: str
    chart_title: str
    chart_options: str  # Aquí se guardan las opciones de Highcharts como JSON
    chart_data: Optional[str] = None  # Hacer que chart_data sea opcional

class ChartOut(ChartCreate):
    id: int
    name: str

    class Config:
        orm_mode = True

class ChartUpdate(BaseModel):
    query_id: Optional[int] = None
    chart_type: Optional[str] = None
    chart_title: Optional[str] = None
    chart_options: Optional[str] = None
    chart_data: Optional[str] = None
