# ZRN - BIMS

## INDICE

1. Tecnologías y Herramientas Recomendadas
2. Estructura del Proyecto
3. Configuración del Entorno de Desarrollo
4. Desarrollo del Backend con Python
    4.1. Inicialización del Proyecto
    4.2. Gestión de Dependencias
    4.3. Configuración de la Base de Datos
    4.4. Implementación de la Autenticación y Roles
    4.5. API para Gráficos
    4.6. Ventana de Administración para Conexiones de DB
5. Desarrollo del Frontend
    5.1. Inicialización del Proyecto Frontend
    5.2. Implementación de la Autenticación
    5.3. Creación de la Landing Page
    5.4. Desarrollo de Páginas con Highcharts
    5.5. Ventana de Administración
6. Integración Frontend y Backend
7. Despliegue
8. Estructura Final del Proyecto
9. Consideraciones Adicionales


Tecnologías y Herramientas Recomendadas
Backend:

Framework: FastAPI (moderno, rápido y con soporte para asincronía) o Django (completo y con un robusto sistema de autenticación).
ORM: SQLAlchemy para manejar múltiples bases de datos.
Autenticación: JWT para tokens de acceso.
Administración: Crear endpoints específicos o usar herramientas como FastAPI Admin si usas FastAPI.
Frontend:

Framework: React.js (popular y con gran ecosistema) o Vue.js.
Librería de Gráficos: Highcharts.
Gestor de Estado: Redux para manejar estados complejos (opcional).
Estilos: Bootstrap o Material-UI.
Base de Datos:

Relacionales: MySQL, PostgreSQL, SQL Server.
NoSQL: MongoDB.
Otras Herramientas:

Control de Versiones: Git.
Contenedores: Docker (opcional, para facilitar despliegues).
Documentación de API: Swagger UI (integrado en FastAPI).


## ESTRUCTURA

```text
bi_system/
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── models/
│   │   │   ├── user.py
│   │   │   └── db_connection.py
│   │   ├── schemas/
│   │   │   ├── user.py
│   │   │   └── db_connection.py
│   │   ├── routers/
│   │   │   ├── auth.py
│   │   │   ├── charts.py
│   │   │   └── admin.py
│   │   ├── core/
│   │   │   └── database.py
│   │   └── utils.py
│   ├── requirements.txt
│   └── Dockerfile
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   └── PrivateRoute.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── pages/
│   │   │   ├── LandingPage.js
│   │   │   ├── LoginPage.js
│   │   │   ├── Dashboard.js
│   │   │   ├── Page1.js
│   │   │   ├── Page2.js
│   │   │   └── Admin.js
│   │   ├── services/
│   │   │   ├── authService.js
│   │   │   ├── chartService.js
│   │   │   └── adminService.js
│   │   └── App.js
│   ├── package.json
│   └── Dockerfile
│
├── docker-compose.yml
└── README.md

```
## LIBRERIAS

instalar dependencias

```python
pip install -r requirements.txt
```

## FRONTEND

```js
npx create-react-app frontend
```
- ### DEPENDENCIAS FRONTEND

    ```js
        npm install axios react-router-dom highcharts highcharts-react-official jwt-decode
    ```

## INICIO

Probar la Comunicación:

Iniciar el backend:

```bash
uvicorn app.main:app --reload
```
Iniciar el frontend:
```bash
npm start
```
Verificar que el frontend puede comunicarse con el backend realizando operaciones de login, registro, y visualización de gráficos.

## USUARIOS

- Administrador:

    - Username: admin
    - Password: password

- Visualizador:

    - Username: viewer
    - Password: password

## GIT
- git add .
- git commit -m "beta 0.11.0.240915"
- git push -u origin master

## DATABASE

- usuarios
``` sql
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    hashed_password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'viewer') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
``` sql
-- Insertar un usuario admin
INSERT INTO usuarios (username, hashed_password, role) 
VALUES ('admin', 'hashed_password_aqui', 'admin');

-- Insertar un usuario viewer
INSERT INTO usuarios (username, hashed_password, role) 
VALUES ('viewer', 'hashed_password_aqui', 'viewer');
```

- paginas
``` sql
CREATE TABLE paginas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    contenido TEXT NOT NULL,
    estado ENUM('activo', 'inactivo') DEFAULT 'activo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```
``` sql
-- Insertar una página de prueba
INSERT INTO paginas (nombre, contenido, estado) 
VALUES ('Página de Ejemplo', 'Contenido de la página', 'activo');
```

- db_conecciones
``` sql
CREATE TABLE db_connections (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    db_type ENUM('mysql', 'postgresql', 'sqlserver', 'mongodb') NOT NULL,
    host VARCHAR(100) NOT NULL,
    port INT NOT NULL,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    db_name VARCHAR(100) NOT NULL,  -- Cambiar "database" a "db_name"
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
``` sql
-- Insertar una conexión de base de datos
INSERT INTO db_connections (name, db_type, host, port, username, password, database) 
VALUES ('Conexión MySQL', 'mysql', 'localhost', 3306, 'root', 'password', 'mi_base_de_datos');
```