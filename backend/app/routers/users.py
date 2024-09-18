# backend/app/routers/user.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserOut
from app.utils import hash_password  # Asegúrate de tener esta función implementada en utils

router = APIRouter(
    prefix="/api/users",  # Este prefijo debe coincidir con lo que esperas en tu frontend
    tags=["users"]
)

@router.get("/", response_model=List[UserOut])
def get_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return users

@router.post("/", response_model=UserOut)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    # Hash de la contraseña antes de guardarla
    hashed_password = hash_password(user.password)
    
    # Creamos el nuevo usuario con su rol y la contraseña hasheada
    new_user = User(username=user.username, hashed_password=hashed_password, role=user.role)
    
    # Guardamos el nuevo usuario en la base de datos
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user
