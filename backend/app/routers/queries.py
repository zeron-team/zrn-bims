# backend/app/routers/queries.py

from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy import create_engine, text
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.db_connection import DBConnection
from app.models.query import Query
from app.schemas.query import QueryCreate, QueryOut

router = APIRouter()

@router.post("/execute-query")
def execute_query(connection_id: int, query: str, db: Session = Depends(get_db)):
    connection = db.query(DBConnection).filter(DBConnection.id == connection_id).first()

    if not connection:
        raise HTTPException(status_code=404, detail="Conexión no encontrada")

    try:
        db_url = f"{connection.db_type}://{connection.username}:{connection.password}@{connection.host}:{connection.port}/{connection.db_name}"
        engine = create_engine(db_url)
        with engine.connect() as conn:
            result = conn.execute(text(query))
            return {"result": [dict(row) for row in result]}
    except SQLAlchemyError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/save-query", response_model=QueryOut)
def save_query(query_data: QueryCreate, db: Session = Depends(get_db)):
    query = Query(
        name=query_data.name,
        query=query_data.query,
        connection_id=query_data.connection_id
    )
    db.add(query)
    db.commit()
    db.refresh(query)
    return query
