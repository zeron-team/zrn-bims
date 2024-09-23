# backend/app/routers/pages.py

import re
import json
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.core.database import get_db
from app.models.page import Page
from app.schemas.page import PageCreate, PageOut, Estructura
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
    pages = db.query(Page).all()
    for page in pages:
        if isinstance(page.estructura, str):
            page.estructura = json.loads(page.estructura)
    return pages

# Crear una nueva página
@router.post("/", response_model=PageOut)
def create_page(page: PageCreate, db: Session = Depends(get_db)):
    try:
        # Verifica si la URL ya existe antes de continuar
        existing_page = db.query(Page).filter(Page.url == page.url).first()
        if existing_page:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"La URL '{page.url}' ya está en uso. Por favor elige otro nombre."
            )

        # Asegúrate de que la estructura se convierta correctamente
        estructura_json = page.estructura.dict()  # Convertir Estructura a dict

        new_page = Page(
            nombre=page.nombre,
            descripcion=page.descripcion,
            contenido=page.contenido,
            estado=page.estado,
            url=page.url,
            estructura=estructura_json  # Almacenar como dict en la base de datos
        )
        db.add(new_page)
        db.commit()
        db.refresh(new_page)
        return new_page
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"La URL '{page.url}' ya está en uso. Por favor elige otro nombre."
        )

# Actualizar una página existente
@router.put("/{page_id}", response_model=PageOut)
def update_page(page_id: int, page: PageCreate, db: Session = Depends(get_db)):
    db_page = db.query(Page).filter(Page.id == page_id).first()
    if not db_page:
        raise HTTPException(status_code=404, detail="Página no encontrada")

    # Convertir Estructura a dict antes de almacenarla
    estructura_dict = page.estructura.dict()

    db_page.nombre = page.nombre
    db_page.descripcion = page.descripcion
    db_page.contenido = page.contenido
    db_page.estado = page.estado
    db_page.url = generate_url(page.nombre)
    db_page.estructura = estructura_dict  # Actualizar la estructura

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
@router.get("/{page_id}", response_model=PageOut)
def get_page(page_id: int, db: Session = Depends(get_db)):
    page = db.query(Page).filter(Page.id == page_id).first()
    if not page:
        raise HTTPException(status_code=404, detail="Página no encontrada")
    
    # Convertir el campo `estructura` a un objeto `Estructura` antes de devolverlo
    if isinstance(page.estructura, str):
        page.estructura = Estructura(**json.loads(page.estructura))
    elif isinstance(page.estructura, dict):
        page.estructura = Estructura(**page.estructura)
    
    return page
