# backend/app/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, charts, admin, users, pages  # Importar correctamente todos los routers
from app.models.page import Page  # Importa el modelo Page para la creación de la tabla
from app.core.database import engine  # Importa el engine para la conexión de la base de datos

# Crear instancia de la aplicación FastAPI
app = FastAPI()

# Crea las tablas en la base de datos si no existen
Page.metadata.create_all(bind=engine)

# Incluir el router de páginas correctamente
app.include_router(pages.router)

# Configuración del middleware CORS
origins = [
    "http://localhost:3000",  # Frontend local en desarrollo
    # Agregar otros orígenes permitidos, como dominios de producción
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Permitir todos los métodos HTTP
    allow_headers=["*"],  # Permitir todos los encabezados
)

# Incluir los routers de autenticación, gráficos, administración y usuarios
app.include_router(auth.router)
app.include_router(charts.router)
app.include_router(admin.router)
app.include_router(users.router)  # Asegúrate de incluir este router

# Endpoint básico para verificar que la API funciona
@app.get("/")
def read_root():
    return {"message": "BI System Backend running"}
