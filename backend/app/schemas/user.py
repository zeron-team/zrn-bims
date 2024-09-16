# backend/app/schemas/user.py

from pydantic import BaseModel

class UserCreate(BaseModel):
    username: str
    password: str

class UserOut(BaseModel):
    username: str
    role: str

    class Config:
        orm_mode = True