from fastapi import FastAPI
from routers import auth, charts, admin

app = FastAPI()

app.include_router(auth.router)
app.include_router(charts.router)
app.include_router(admin.router)

@app.get("/")
def read_root():
    return {"message": "BI System Backend"}
