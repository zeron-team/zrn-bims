# backend/app/routers/db.py

from sqlalchemy import create_engine, inspect
from pymongo import MongoClient
from sqlalchemy.exc import SQLAlchemyError
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.db_connection import DBConnection
from app.schemas.db_connection import DBConnectionCreate, DBConnectionCheck, DBConnectionOut

router = APIRouter()

# Endpoint para verificar la conexión a la base de datos
@router.post("/api/check-db")
def check_db_connection(connection_details: DBConnectionCheck):
    db_type = connection_details.db_type.lower()
    host = connection_details.host
    port = connection_details.port
    username = connection_details.username
    password = connection_details.password

    if db_type == 'mysql':
        db_url = f"mysql+pymysql://{username}:{password}@{host}:{port}/"
    elif db_type == 'postgresql':
        db_url = f"postgresql://{username}:{password}@{host}:{port}/postgres"
    elif db_type == 'sqlserver':
        db_url = f"mssql+pyodbc://{username}:{password}@{host}:{port}/?driver=ODBC+Driver+17+for+SQL+Server"
    elif db_type == 'mongodb':
        db_url = f"mongodb://{username}:{password}@{host}:{port}/"
    else:
        raise HTTPException(status_code=400, detail="Tipo de base de datos no soportado")

    try:
        if db_type in ['mysql', 'postgresql', 'sqlserver']:
            engine = create_engine(db_url)
            inspector = inspect(engine)
            if db_type == 'mysql':
                databases = inspector.get_schema_names()
            elif db_type == 'postgresql':
                with engine.connect() as conn:
                    result = conn.execute("SELECT datname FROM pg_database WHERE datistemplate = false;")
                    databases = [row['datname'] for row in result]
            elif db_type == 'sqlserver':
                with engine.connect() as conn:
                    result = conn.execute("SELECT name FROM sys.databases;")
                    databases = [row['name'] for row in result]
            return databases
        elif db_type == 'mongodb':
            client = MongoClient(db_url)
            databases = client.list_database_names()
            return databases
    except SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Endpoint para guardar la conexión a la base de datos
@router.post("/api/save-connection", response_model=DBConnectionOut)
def save_db_connection(connection_details: DBConnectionCreate, db: Session = Depends(get_db)):
    try:
        existing_connection = db.query(DBConnection).filter(DBConnection.name == connection_details.name).first()
        if existing_connection:
            raise HTTPException(status_code=400, detail="Ya existe una conexión con este nombre.")

        new_connection = DBConnection(
            name=connection_details.name,
            db_type=connection_details.db_type.lower(),
            host=connection_details.host,
            port=connection_details.port,
            username=connection_details.username,
            password=connection_details.password,
            db_name=connection_details.db_name,
        )
        db.add(new_connection)
        db.commit()
        db.refresh(new_connection)
        return new_connection
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

# Endpoint para obtener todas las conexiones guardadas
@router.get("/api/get-connections", response_model=list[DBConnectionOut])
def get_connections(db: Session = Depends(get_db)):
    return db.query(DBConnection).all()

# Endpoint para obtener la estructura de una conexión específica
@router.get("/api/connection/{connection_id}/structure")
def get_connection_structure(connection_id: int, db: Session = Depends(get_db)):
    connection = db.query(DBConnection).filter(DBConnection.id == connection_id).first()
    if not connection:
        raise HTTPException(status_code=404, detail="Conexión no encontrada")
    
    db_type = connection.db_type
    host = connection.host
    port = connection.port
    username = connection.username
    password = connection.password
    database = connection.db_name

    if db_type == 'mysql':
        url = f"mysql+pymysql://{username}:{password}@{host}:{port}/{database}"
    elif db_type == 'postgresql':
        url = f"postgresql://{username}:{password}@{host}:{port}/{database}"
    elif db_type == 'sqlserver':
        url = f"mssql+pyodbc://{username}:{password}@{host}:{port}/{database}"
    elif db_type == 'mongodb':
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

# Endpoint para eliminar una conexión
@router.delete("/api/delete-connection/{connection_id}")
def delete_connection(connection_id: int, db: Session = Depends(get_db)):
    connection = db.query(DBConnection).filter(DBConnection.id == connection_id).first()
    if not connection:
        raise HTTPException(status_code=404, detail="Conexión no encontrada")
    
    db.delete(connection)
    db.commit()
    return {"message": "Conexión eliminada correctamente"}
