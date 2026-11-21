import re
import uuid
from datetime import datetime, timezone
from typing import List, Tuple
from fastapi import APIRouter
from backend.database import get_database, db_manager
from backend.models import (
    ChatMessageRequest,
    ChatMessageResponse,
    RiskAnalysis,
    ActionType,
    CompanionStyle,
)

router = APIRouter(prefix="/api/v1/chat", tags=["Chat e IA Conversacional"])

CRISIS_PATTERNS = [
    r"suicid",
    r"matarm",
    r"quitarme la vida",
    r"no quiero vivir",
    r"acabar con todo",
    r"terminar con mi vida",
    r"autolesi",
    r"cortarm",
    r"desaparecer para siempre",
    r"morirm",
]

def analyze_risk(text: str) -> Tuple[RiskAnalysis, ActionType | None]:
    lower = text.lower()
    matched = [pat for pat in CRISIS_PATTERNS if re.search(pat, lower)]
    
    if matched:
        return (
            RiskAnalysis(
                puntaje_riesgo=1.0,
                alerta_crisis=True,
                motivo_alerta="Detección de ideación o riesgo severo según protocolo LFPDPPP",
                palabras_clave=matched,
            ),
            "sos",
        )

    # Detección de tensión, ansiedad o estrés
    if re.search(r"ansied|panico|pecho|asfixi|miedo|desesperad", lower):
        return (
            RiskAnalysis(puntaje_riesgo=0.6, alerta_crisis=False, palabras_clave=["ansiedad"]),
            "respiracion",
        )

    # Detección de fatiga, sobrecarga, insomnio
    if re.search(r"cansad|agotad|no dormi|bloqueo|pesad|sueño", lower):
        return (
            RiskAnalysis(puntaje_riesgo=0.4, alerta_crisis=False, palabras_clave=["agotamiento"]),
            "sonidos",
        )

    return (RiskAnalysis(puntaje_riesgo=0.1, alerta_crisis=False), None)

def generate_reply(text: str, style: CompanionStyle, action: ActionType | None) -> Tuple[str, List[str]]:
    if action == "sos":
        return (
            "Escucho que estás pasando por un momento muy difícil y doloroso. Tu vida y tu tranquilidad son lo más importante. Por favor, comunícate en este instante con un profesional de la Línea de la Vida (800 911 2000). Es gratis y confidencial las 24 horas. No estás solo/a.",
            ["Llamar a Línea de la Vida (800 911 2000)", "Contactar a SAPTEL", "Hablar con un tutor"],
        )

    lower = text.lower()
    if action == "respiracion":
        if style == "directo":
            return (
                "Siento la tensión que traes. Cuando el cuerpo se satura, pensar más solo enreda las cosas. Hagamos un ciclo de respiración 4-7-8 ahora mismo para bajar el ritmo cardíaco.",
                ["Hacer respiración 4-7-8", "Desahogarme sin filtro", "Ordenar mis pendientes"],
            )
        elif style == "silencioso":
            return (
                "Aquí estoy. Respira profundo conmigo un momento.",
                ["Respiración 4-7-8", "Silencio"],
            )
        else: # Cálido
            return (
                "Te leo y noto lo pesado que se siente el pecho. No tienes que resolver todo hoy ni en este minuto. Tómate una pausa y regalémonos 60 segundos de respiración consciente juntos.",
                ["Empezar respiración guiada", "Contarte más a fondo", "Pausar pendientes"],
            )

    if action == "sonidos":
        return (
            "Llevas mucho tiempo forzando la máquina y la mente necesita descansar para volver a enfocarse. Te sugiero poner un paisaje de lluvia o bosque 5 minutos mientras estiras los hombros.",
            ["Escuchar lluvia suave", "Hacer pausa pomodoro", "Registrar en bitácora"],
        )

    # Respuestas generales compasivas
    if "examen" in lower or "proyecto" in lower or "tarea" in lower:
        return (
            "La presión de las entregas puede sentirse asfixiante, pero recuerda: una calificación no define tu valor como persona. Dividamos ese pendiente gigante en una sola micro-acción de 10 minutos.",
            ["Dividir la tarea en pasos", "Hacer pausa de 5 min", "Platicar con Near"],
        )

    return (
        "Te escucho con calma. Cada emoción que experimentas tiene una razón de ser y este es un espacio seguro para ordenarla sin presiones. ¿Quieres que profundicemos o prefieres solo desahogarte?",
        ["Quiero desahogarme", "Ayúdame a ver opciones", "Hacer una pausa"],
    )

@router.post("/message", response_model=ChatMessageResponse)
async def process_chat_message(payload: ChatMessageRequest):
    """
    Endpoint principal de chat con Near IA:
    - Analiza el riesgo preventivo
    - Persiste en MongoDB (colección 'mensajes' y 'chat_sessions')
    - Devuelve respuesta contextual empática
    """
    db = get_database()
    session_id = payload.session_id or str(uuid.uuid4())
    now_iso = datetime.now(timezone.utc).isoformat()

    risk_analysis, action = analyze_risk(payload.contenido)
    bot_reply, suggestions = generate_reply(payload.contenido, payload.estilo, action)

    # Persistencia en MongoDB
    if db_manager.is_connected and db is not None:
        # 1. Guardar mensaje de usuario
        await db.mensajes.insert_one({
            "message_id": str(uuid.uuid4()),
            "session_id": session_id,
            "codigo_anonimo": payload.codigo_anonimo or "AL-222410908",
            "remitente": "user",
            "contenido": payload.contenido,
            "timestamp": now_iso,
            "puntaje_riesgo": risk_analysis.puntaje_riesgo,
            "alerta_crisis": risk_analysis.alerta_crisis,
        })
        # 2. Guardar mensaje de Near
        await db.mensajes.insert_one({
            "message_id": str(uuid.uuid4()),
            "session_id": session_id,
            "codigo_anonimo": payload.codigo_anonimo or "AL-222410908",
            "remitente": "near",
            "contenido": bot_reply,
            "timestamp": now_iso,
            "accion_sugerida": action,
        })
        # 3. Actualizar sesión
        await db.chat_sessions.update_one(
            {"session_id": session_id},
            {
                "$set": {
                    "ultima_actividad": now_iso,
                    "estilo_interaccion": payload.estilo,
                    "alerta_crisis_activada": risk_analysis.alerta_crisis,
                },
                "$inc": {"mensajes_count": 2},
                "$setOnInsert": {
                    "session_id": session_id,
                    "codigo_anonimo": payload.codigo_anonimo or "AL-222410908",
                    "inicio": now_iso,
                },
            },
            upsert=True,
        )

    return ChatMessageResponse(
        session_id=session_id,
        reply=bot_reply,
        respuesta_bot=bot_reply,
        accion=action,
        analisis_ia=risk_analysis,
        suggestions=suggestions,
        timestamp=now_iso,
    )
