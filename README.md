# ZRN - BIMS

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