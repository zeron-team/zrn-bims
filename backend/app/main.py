from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Importa los routers desde tu estructura
from routers import auth, charts, admin

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

# Incluir los routers de autenticación, gráficos y administración
app.include_router(auth.router)
app.include_router(charts.router)
app.include_router(admin.router)

# Endpoint básico para verificar que la API funciona
@app.get("/")
def read_root():
    return {"message": "BI System Backend running"}
