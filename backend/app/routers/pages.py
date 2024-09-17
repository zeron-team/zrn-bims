# backend/app/routers/pages.py

import re
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.page import Page
from app.schemas.page import PageCreate, PageOut
from typing import List

router = APIRouter(
    prefix="/api/pages",
    tags=["pages"]
)

# Función para generar una URL amigable a partir del nombre
def generate_url(name: str) -> str:
    return re.sub(r'[^a-zA-Z0-9]+', '-', name).lower()

# Obtener todas las páginas
@router.get("/", response_model=List[PageOut])
def get_pages(db: Session = Depends(get_db)):
    return db.query(Page).all()

# Crear una nueva página
@router.post("/", response_model=PageOut)
def create_page(page: PageCreate, db: Session = Depends(get_db)):
    # Generar URL amigable
    url = generate_url(page.nombre)
    
    # Crear la página en la base de datos
    new_page = Page(
        nombre=page.nombre,
        contenido=page.contenido,
        estado=page.estado,
        url=url
    )
    db.add(new_page)
    db.commit()
    db.refresh(new_page)
    return new_page

# Actualizar una página existente
@router.put("/{page_id}", response_model=PageOut)
def update_page(page_id: int, page: PageCreate, db: Session = Depends(get_db)):
    db_page = db.query(Page).filter(Page.id == page_id).first()
    if not db_page:
        raise HTTPException(status_code=404, detail="Página no encontrada")
    
    db_page.nombre = page.nombre
    db_page.contenido = page.contenido
    db_page.estado = page.estado
    db_page.url = generate_url(page.nombre)  # Actualizar la URL si cambia el nombre
    
    db.commit()
    db.refresh(db_page)
    return db_page

# Eliminar una página
@router.delete("/{page_id}", response_model=PageOut)
def delete_page(page_id: int, db: Session = Depends(get_db)):
    db_page = db.query(Page).filter(Page.id == page_id).first()
    if not db_page:
        raise HTTPException(status_code=404, detail="Página no encontrada")
    
    db.delete(db_page)
    db.commit()
    return db_page

# Obtener una página por ID
@router.get("/{id}", response_model=PageOut)
def get_page(id: int, db: Session = Depends(get_db)):
    page = db.query(Page).filter(Page.id == id).first()
    if not page:
        raise HTTPException(status_code=404, detail="Página no encontrada")
    return page