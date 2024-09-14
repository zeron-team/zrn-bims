from sqlalchemy import Column, Integer, String
from core.database import Base

class DBConnection(Base):
    __tablename__ = "db_connections"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    db_type = Column(String, nullable=False)  # 'mysql', 'postgresql', 'sqlserver', 'mongodb'
    host = Column(String, nullable=False)
    port = Column(Integer, nullable=False)
    username = Column(String, nullable=False)
    password = Column(String, nullable=False)
    database = Column(String, nullable=False)
