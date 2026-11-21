from typing import List
from fastapi import APIRouter
from backend.database import get_database, db_manager
from backend.models import RecursoEmergencia

router = APIRouter(prefix="/api/v1/emergencias", tags=["Recursos de Emergencia"])

DEFAULT_LINEAS = [
    RecursoEmergencia(
        nombre="Línea de la Vida (Oficial Secretaría de Salud)",
        telefono="800 911 2000",
        horario="24 horas / 365 días al año",
        tipo="Atención en crisis, ideación suicida y adicciones",
        cobertura="Nacional Gratuita (México)",
        icono="🛡️",
    ),
    RecursoEmergencia(
        nombre="SAPTEL (Cruz Roja Mexicana)",
        telefono="55 5259 8121",
        horario="24 horas",
        tipo="Apoyo psicológico en momentos de angustia y duelo",
        cobertura="Nacional Gratuita",
        icono="❤️",
    ),
    RecursoEmergencia(
        nombre="Línea Calma Edomex / UTVT Enlace",
        telefono="800 012 3456",
        horario="Lunes a Viernes 08:00 a 20:00 hrs",
        tipo="Orientación para estudiantes del Valle de Toluca",
        cobertura="Estado de México",
        icono="🎓",
    ),
]

@router.get("/lineas", response_model=List[RecursoEmergencia])
async def list_emergency_lines():
    """
    Endpoint público de alta disponibilidad:
    Devuelve el catálogo de líneas telefónicas de contención gratuitas y confidenciales.
    """
    db = get_database()
    if db_manager.is_connected and db is not None:
        cursor = db.recursos_emergencia.find({}, {"_id": 0})
        items = []
        async for doc in cursor:
            items.append(RecursoEmergencia(**doc))
        if items:
            return items

    return DEFAULT_LINEAS
