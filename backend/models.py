from datetime import datetime, timezone
from typing import List, Optional, Literal
from pydantic import BaseModel, Field, EmailStr

# ==============================================================================
# Modelos de Autenticación y Usuarios
# ==============================================================================
class UserLoginRequest(BaseModel):
    correo: EmailStr
    contrasena: str

class UserRegisterRequest(BaseModel):
    correo: EmailStr
    contrasena: str
    nombres: str
    apellido_p: str
    apellido_m: Optional[str] = None
    carrera: Optional[str] = "Tecnologías de la Información y Comunicación"
    cuatrimestre: Optional[int] = 7
    telefono: Optional[str] = None

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in_hours: int = 8
    codigo_anonimo: str
    rol: str = "paciente"

# ==============================================================================
# Modelos de Chat e Inteligencia Artificial
# ==============================================================================
CompanionStyle = Literal["calido", "directo", "silencioso"]
ActionType = Literal["respiracion", "sonidos", "sos"]

class RiskAnalysis(BaseModel):
    puntaje_riesgo: float = Field(default=0.0, ge=0.0, le=1.0)
    alerta_crisis: bool = False
    motivo_alerta: Optional[str] = None
    palabras_clave: List[str] = Field(default_factory=list)

class ChatMessageRequest(BaseModel):
    session_id: Optional[str] = None
    codigo_anonimo: Optional[str] = None
    contenido: str = Field(..., min_length=1)
    estilo: CompanionStyle = "calido"

class ChatMessageResponse(BaseModel):
    session_id: str
    reply: str
    respuesta_bot: str
    accion: Optional[ActionType] = None
    analisis_ia: RiskAnalysis
    suggestions: List[str] = Field(default_factory=list)
    timestamp: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

# ==============================================================================
# Modelos de Bitácora y Seguimiento Anímico
# ==============================================================================
MoodId = Literal["calmado", "ansioso", "cansado", "esperanzado", "abrumado"]

class BitacoraEntryRequest(BaseModel):
    codigo_anonimo: Optional[str] = "AL-222410908"
    mood: MoodId
    intensidad: int = Field(default=5, ge=1, le=10)
    notas: Optional[str] = ""
    note: Optional[str] = None
    tags: List[str] = Field(default_factory=list)
    triggers: List[str] = Field(default_factory=list)
    date: Optional[str] = None

class BitacoraEntryResponse(BaseModel):
    id: str
    codigo_anonimo: str
    fecha: str
    mood: MoodId
    intensidad: int
    notas: Optional[str] = ""
    tags: List[str] = Field(default_factory=list)

# ==============================================================================
# Modelos de Recursos de Emergencia
# ==============================================================================
class RecursoEmergencia(BaseModel):
    nombre: str
    telefono: str
    horario: str = "24 horas, 365 días"
    tipo: str = "Apoyo psicológico gratuito"
    cobertura: str = "Nacional (México)"
    icono: str = "📞"
