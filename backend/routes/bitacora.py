import uuid
from datetime import datetime, timezone
from typing import List
from fastapi import APIRouter
from backend.database import get_database, db_manager
from backend.models import BitacoraEntryRequest, BitacoraEntryResponse

router = APIRouter(prefix="/api/v1", tags=["Bitácora Emocional"])

_MEMORY_BITACORA = [
    {
        "id": "sample-1",
        "codigo_anonimo": "AL-222410908",
        "fecha": datetime.now(timezone.utc).isoformat(),
        "mood": "calmado",
        "intensidad": 8,
        "notas": "Día productivo, me sentí en paz con mis avances en el proyecto.",
        "tags": ["estudio", "calma", "salud"],
    }
]

@router.post("/bitacora/entry", response_model=BitacoraEntryResponse, status_code=201)
async def create_bitacora_entry(payload: BitacoraEntryRequest):
    """Registra un check-in de ánimo en la colección 'detalle_bitacora'"""
    db = get_database()
    now_iso = payload.date or datetime.now(timezone.utc).isoformat()
    entry_id = str(uuid.uuid4())
    resolved_notes = payload.notas or payload.note or ""
    resolved_tags = payload.tags or payload.triggers or []

    doc = {
        "id": entry_id,
        "codigo_anonimo": payload.codigo_anonimo or "AL-222410908",
        "fecha": now_iso,
        "mood": payload.mood,
        "intensidad": payload.intensidad,
        "notas": resolved_notes,
        "tags": resolved_tags,
    }

    if db_manager.is_connected and db is not None:
        await db.detalle_bitacora.insert_one(doc)
    else:
        _MEMORY_BITACORA.insert(0, doc)

    return BitacoraEntryResponse(**doc)

@router.get("/pacientes/{codigo_anonimo}/bitacora", response_model=List[BitacoraEntryResponse])
async def get_patient_bitacora(codigo_anonimo: str):
    """Obtiene el historial de estados de ánimo para el radar y métricas de evolución"""
    db = get_database()

    if db_manager.is_connected and db is not None:
        cursor = db.detalle_bitacora.find({"codigo_anonimo": codigo_anonimo}).sort("fecha", -1).limit(50)
        items = []
        async for doc in cursor:
            items.append(
                BitacoraEntryResponse(
                    id=doc.get("id", str(doc.get("_id"))),
                    codigo_anonimo=doc["codigo_anonimo"],
                    fecha=doc["fecha"],
                    mood=doc["mood"],
                    intensidad=doc.get("intensidad", 5),
                    notas=doc.get("notas", ""),
                    tags=doc.get("tags", []),
                )
            )
        return items

    return [BitacoraEntryResponse(**item) for item in _MEMORY_BITACORA if item["codigo_anonimo"] == codigo_anonimo]
