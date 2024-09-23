# backend/app/routers/charts.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.chart import Chart
from app.schemas.chart import ChartCreate, ChartOut, ChartUpdate

router = APIRouter(
    prefix="/api/charts",
    tags=["charts"]
)

@router.get("/", response_model=list[ChartOut])
def get_charts(db: Session = Depends(get_db)):
    charts = db.query(Chart).all()
    return charts

@router.post("/", response_model=ChartOut)
def create_chart(chart: ChartCreate, db: Session = Depends(get_db)):
    try:
        new_chart = Chart(
            name=chart.chart_title,
            query_id=chart.query_id,
            chart_type=chart.chart_type,
            chart_title=chart.chart_title,
            chart_options=chart.chart_options,
            chart_data=chart.chart_data  # Añadir chart_data si está disponible
        )
        db.add(new_chart)
        db.commit()
        db.refresh(new_chart)
        return new_chart
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{chart_id}", response_model=ChartOut)
def get_chart(chart_id: int, db: Session = Depends(get_db)):
    chart = db.query(Chart).filter(Chart.id == chart_id).first()
    if not chart:
        raise HTTPException(status_code=404, detail="Chart not found")
    return chart

@router.delete("/{chart_id}", response_model=ChartOut)
def delete_chart(chart_id: int, db: Session = Depends(get_db)):
    chart = db.query(Chart).filter(Chart.id == chart_id).first()
    if not chart:
        raise HTTPException(status_code=404, detail="Chart not found")
    db.delete(chart)
    db.commit()
    return chart

@router.put("/{chart_id}", response_model=ChartOut)  # Endpoint de actualización
def update_chart(chart_id: int, updated_chart: ChartUpdate, db: Session = Depends(get_db)):
    chart = db.query(Chart).filter(Chart.id == chart_id).first()
    if not chart:
        raise HTTPException(status_code=404, detail="Chart not found")
    
    chart.name = updated_chart.chart_title  # Asegúrate de actualizar el nombre del gráfico también
    chart.query_id = updated_chart.query_id
    chart.chart_type = updated_chart.chart_type
    chart.chart_title = updated_chart.chart_title
    chart.chart_options = updated_chart.chart_options
    chart.chart_data = updated_chart.chart_data  # Actualiza el campo chart_data si es necesario
    
    db.commit()
    db.refresh(chart)
    return chart
