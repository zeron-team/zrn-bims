# backend/app/schemas/user.py

from pydantic import BaseModel

class UserCreate(BaseModel):
    username: str
    password: str
    role: str  # 'admin' o 'viewer'

class UserOut(BaseModel):
    id: int
    username: str
    role: str

    class Config:
        from_attributes = True  # Actualizado de orm_mode
