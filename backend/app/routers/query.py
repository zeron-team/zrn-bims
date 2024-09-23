#backend/app/routers/query.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text, create_engine
from app.core.database import get_db
from app.models.query import Query
from app.schemas.query import QueryCreate, QueryOut
from app.models.db_connection import DBConnection

router = APIRouter(
    prefix="/api/queries",  # Asegúrate de que esté correctamente definido
    tags=["queries"]
)

@router.post("/run", response_model=QueryOut)
def run_and_save_query(query_data: QueryCreate, db: Session = Depends(get_db)):
    connection = db.query(DBConnection).filter(DBConnection.id == query_data.connection_id).first()
    if not connection:
        raise HTTPException(status_code=404, detail="Connection not found")
    
    db_url = f"{connection.db_type}+pymysql://{connection.username}:{connection.password}@{connection.host}:{connection.port}/{connection.db_name}"

    try:
        engine = create_engine(db_url)
        with engine.connect() as conn:
            result = conn.execute(text(query_data.query))
            columns = result.keys()
            rows = [dict(zip(columns, row)) for row in result]

        query_name = query_data.name or query_data.query.split(' ')[0]

        # Serializar filas a cadena para guardarlas en la base de datos
        result_serialized = str(rows)

        new_query = Query(
            connection_id=query_data.connection_id,
            query=query_data.query,
            result=result_serialized,
            name=query_name
        )
        db.add(new_query)
        db.commit()
        db.refresh(new_query)

        return {
            "id": new_query.id,
            "connection_id": new_query.connection_id,
            "query": new_query.query,
            "result": result_serialized,
            "columns": list(columns),  # Convertir a lista para evitar problemas de serialización
            "rows": rows,  # Devolver filas deserializadas
            "name": new_query.name
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error running query: {str(e)}")


@router.get("/", response_model=list[QueryOut])
def get_queries(db: Session = Depends(get_db)):
    queries = db.query(Query).all()
    
    query_out_list = []
    for query in queries:
        try:
            # Convertir el resultado guardado en el campo `result` a su forma original
            result = eval(query.result) if query.result else []
            if result:
                columns = list(result[0].keys()) if result else []
                rows = result
            else:
                columns = []
                rows = []
        except Exception as e:
            columns = []
            rows = []
        
        query_out = {
            "id": query.id,
            "connection_id": query.connection_id,
            "query": query.query,
            "result": query.result,
            "columns": columns,
            "rows": rows,
            "name": query.name
        }
        query_out_list.append(query_out)

    return query_out_list


@router.delete("/{query_id}", response_model=QueryOut)
def delete_query(query_id: int, db: Session = Depends(get_db)):
    query = db.query(Query).filter(Query.id == query_id).first()
    if not query:
        raise HTTPException(status_code=404, detail="Query not found")
    db.delete(query)
    db.commit()
    return query
