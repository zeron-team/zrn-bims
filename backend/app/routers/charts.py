# backend/app/routers/charts.py

from fastapi import APIRouter, Depends, HTTPException, status
from jose import JWTError, jwt
from fastapi.security import OAuth2PasswordBearer
from app.utils import SECRET_KEY, ALGORITHM

# Definir el router para las rutas de gráficos
router = APIRouter(
    prefix="/charts",
    tags=["charts"]
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

# Función para obtener el usuario actual a partir del token
def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        role: str = payload.get("role")
        if username is None:
            raise credentials_exception
        return {"username": username, "role": role}
    except JWTError:
        raise credentials_exception

# Función para verificar si el usuario es administrador
def admin_required(current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not enough permissions")
    return current_user

# Ruta protegida que solo pueden acceder los administradores
@router.get("/admin-data")
def get_admin_data(current_user: dict = Depends(admin_required)):
    return {"message": f"Hello {current_user['username']}, you are an admin!"}

# Ruta pública para obtener datos de gráficos
@router.get("/")
def get_chart():
    return {"message": "This is a public chart endpoint"}
