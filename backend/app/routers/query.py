#backend/app/routers/query.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text, create_engine
from app.core.database import get_db
from app.models.query import Query
from app.schemas.query import QueryCreate, QueryOut
from app.models.db_connection import DBConnection

router = APIRouter(
    prefix="/api/queries",
    tags=["queries"]
)

@router.post("/run", response_model=QueryOut)
def run_and_save_query(query_data: QueryCreate, db: Session = Depends(get_db)):
    # Obtener la conexión de la base de datos
    connection = db.query(DBConnection).filter(DBConnection.id == query_data.connection_id).first()
    if not connection:
        raise HTTPException(status_code=404, detail="Connection not found")
    
    # Construir la URL de conexión
    db_url = f"{connection.db_type}+pymysql://{connection.username}:{connection.password}@{connection.host}:{connection.port}/{connection.db_name}"

    try:
        # Ejecutar la consulta
        engine = create_engine(db_url)
        with engine.connect() as conn:
            result = conn.execute(text(query_data.query))
            # Obtener nombres de las columnas y filas
            columns = result.keys()
            rows = [dict(zip(columns, row)) for row in result]

        # Proporcionar un nombre predeterminado para la consulta si es necesario
        query_name = query_data.query.split(' ')[0]  # Puedes personalizar el nombre según lo que necesites

        # Guardar la consulta en la base de datos
        new_query = Query(
            connection_id=query_data.connection_id,
            query=query_data.query,
            result=str(rows),  # Guardar los resultados en formato de cadena (si es necesario)
            name=query_name  # Agregar el nombre de la consulta
        )
        db.add(new_query)
        db.commit()
        db.refresh(new_query)

        # Devolver la respuesta con columnas y filas
        return {
            "id": new_query.id,
            "connection_id": new_query.connection_id,
            "query": new_query.query,
            "result": new_query.result,
            "columns": list(columns),  # Convertir los nombres de las columnas en lista
            "rows": rows,  # Devolver las filas con los datos
            "name": new_query.name  # Incluir el nombre en la respuesta
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error running query: {str(e)}")


@router.get("/", response_model=list[QueryOut])
def get_queries(db: Session = Depends(get_db)):
    queries = db.query(Query).all()
    
    # Procesar cada consulta y agregar las columnas y filas correspondientes
    query_out_list = []
    for query in queries:
        try:
            result = eval(query.result)  # Convertir el resultado guardado a una lista de diccionarios
            if result:
                columns = list(result[0].keys())
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
            "name": query.name  # Incluir el nombre en la lista de consultas guardadas
        }
        query_out_list.append(query_out)

    return query_out_list
