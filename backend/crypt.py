from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Generar el hash de una nueva contraseña
new_password = "prueba"
hashed_password = pwd_context.hash(new_password)
print(hashed_password)
