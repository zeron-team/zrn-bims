# backend/app/routers/db_connection.py

from fastapi import APIRouter, HTTPException
from sqlalchemy import create_engine, inspect
from pymongo import MongoClient

router = APIRouter()

@router.post("/api/connect-db")
def connect_db(db_type: str, host: str, port: int, username: str, password: str, database: str):
    if db_type == "mysql":
        url = f"mysql+pymysql://{username}:{password}@{host}:{port}/{database}"
    elif db_type == "postgresql":
        url = f"postgresql://{username}:{password}@{host}:{port}/{database}"
    elif db_type == "sqlserver":
        url = f"mssql+pyodbc://{username}:{password}@{host}:{port}/{database}"
    elif db_type == "mongodb":
        client = MongoClient(f"mongodb://{username}:{password}@{host}:{port}/{database}")
        return {"structure": client[database].list_collection_names()}
    else:
        raise HTTPException(status_code=400, detail="Tipo de base de datos no soportado")
    
    engine = create_engine(url)
    inspector = inspect(engine)
    
    structure = []
    for table_name in inspector.get_table_names():
        columns = inspector.get_columns(table_name)
        structure.append({
            "name": table_name,
            "columns": [column['name'] for column in columns]
        })

    return {"structure": structure}
