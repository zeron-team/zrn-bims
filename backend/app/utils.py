# backend/app/utils.py

from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

SECRET_KEY = "292125eb01efff1483ed66df751d5ccd7050a433b9b775d443729520293a516f"
ALGORITHM = "HS256"

# Hashear contraseñas
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

# Verificar contraseñas
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

# Crear un token JWT
def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt
