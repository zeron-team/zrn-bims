from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

hashed_password = '$2b$12$7RoKkbwKqcO1Q/GqE8i0puXIG4H3anMmTAf2ytWtmN0oio5okVONy'  # Contraseña del usuario 'zeron'
plain_password = 'prueba'  # Contraseña que estás probando

pwd_context.verify(plain_password, hashed_password)