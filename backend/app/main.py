# backend/app/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, charts, admin, users, pages, query, db
from app.core.database import engine, Base

app = FastAPI()

# Crear las tablas en la base de datos si no existen
Base.metadata.create_all(bind=engine)

# Configuración del middleware CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Permitir solicitudes desde el frontend
    allow_credentials=True,
    allow_methods=["*"],  # Permitir todos los métodos HTTP
    allow_headers=["*"],  # Permitir todos los encabezados
)

# Incluir los routers después de configurar CORS
app.include_router(auth.router)
app.include_router(charts.router)
app.include_router(admin.router)
app.include_router(users.router)
app.include_router(pages.router)
app.include_router(db.router)
app.include_router(query.router)

# Endpoint básico para verificar que la API funciona
@app.get("/")
def read_root():
    return {"message": "BI System Backend running"}
