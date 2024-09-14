from pydantic import BaseModel

class DBConnectionCreate(BaseModel):
    name: str
    db_type: str  # 'mysql', 'postgresql', 'sqlserver', 'mongodb'
    host: str
    port: int
    username: str
    password: str
    database: str

class DBConnectionOut(BaseModel):
    id: int
    name: str
    db_type: str
    host: str
    port: int
    username: str
    database: str

    class Config:
        orm_mode = True
