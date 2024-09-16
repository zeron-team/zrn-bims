# backend/app/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, charts, admin, users  # Asegúrate de importar el router de usuarios

# Crear instancia de la aplicación FastAPI
app = FastAPI()

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
