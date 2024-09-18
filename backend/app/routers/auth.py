# backend/app/routes/auth.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db, SessionLocal  # Importar SessionLocal
from app.models.user import User
from app.schemas.user import UserCreate, UserOut
from app.utils import hash_password, verify_password, create_access_token
from jose import JWTError, jwt
from datetime import timedelta
from fastapi.security import OAuth2PasswordBearer

# JWT configurations
SECRET_KEY = "292125eb01efff1483ed66df751d5ccd7050a433b9b775d443729520293a516f"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

router = APIRouter(
    prefix="/auth",
    tags=["auth"]
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# Obtener la sesión de base de datos
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Registro de usuarios
@router.post("/register", response_model=UserOut)
def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="El nombre de usuario ya está registrado.")
    hashed_pw = hash_password(user.password)
    new_user = User(username=user.username, hashed_password=hashed_pw, role=user.role)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.post("/login")
def login(user_data: UserCreate, db: Session = Depends(get_db)):
    print(f"Recibido en el backend: {user_data.username}, {user_data.password}")

    db_user = db.query(User).filter(User.username == user_data.username).first()

    if not db_user or not verify_password(user_data.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": db_user.username, "role": db_user.role},
        expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

# Obtener usuario actual usando el token JWT
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="No se pudo validar las credenciales.",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        user = db.query(User).filter(User.username == username).first()
        if user is None:
            raise credentials_exception
        return {"username": user.username, "role": user.role}
    except JWTError:
        raise credentials_exception

# Decorador para verificar si es administrador
def admin_required(current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Acceso de administrador requerido.")
    return current_user

# Ruta protegida para administradores
@router.get("/admin-only")
def admin_only_route(current_user: dict = Depends(admin_required)):
    return {"message": f"Hola {current_user['username']}, tienes acceso de administrador."}
