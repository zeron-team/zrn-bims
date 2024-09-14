from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from core.database import SessionLocal
from models.db_connection import DBConnection
from schemas.db_connection import DBConnectionCreate, DBConnectionOut
from routers.auth import admin_required

router = APIRouter(
    prefix="/admin",
    tags=["admin"]
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/db-connections", response_model=DBConnectionOut, dependencies=[Depends(admin_required)])
def create_db_connection(conn: DBConnectionCreate, db: Session = Depends(get_db)):
    db_conn = db.query(DBConnection).filter(DBConnection.name == conn.name).first()
    if db_conn:
        raise HTTPException(status_code=400, detail="Connection name already exists")
    new_conn = DBConnection(**conn.dict())
    db.add(new_conn)
    db.commit()
    db.refresh(new_conn)
    return new_conn

@router.get("/db-connections", response_model=list[DBConnectionOut], dependencies=[Depends(admin_required)])
def get_db_connections(db: Session = Depends(get_db)):
    connections = db.query(DBConnection).all()
    return connections

@router.delete("/db-connections/{conn_id}", dependencies=[Depends(admin_required)])
def delete_db_connection(conn_id: int, db: Session = Depends(get_db)):
    conn = db.query(DBConnection).filter(DBConnection.id == conn_id).first()
    if not conn:
        raise HTTPException(status_code=404, detail="Connection not found")
    db.delete(conn)
    db.commit()
    return {"detail": "Connection deleted"}
