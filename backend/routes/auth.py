import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, status
from backend.database import get_database, db_manager
from backend.models import UserLoginRequest, UserRegisterRequest, TokenResponse
from backend.security import hash_password, verify_password, create_access_token

router = APIRouter(prefix="/api/v1/auth", tags=["Autenticación"])

# Almacén de contingencia en memoria si MongoDB Atlas no está conectado
_IN_MEMORY_USERS = {
    "al222410908@alumnos.utvt.edu.mx": {
        "contrasena": hash_password("Near2026!"),
        "codigo_anonimo": "AL-222410908",
        "rol": "paciente",
        "nombres": "Alan",
    },
    "admin@near.salud": {
        "contrasena": hash_password("AdminNear2026!"),
        "codigo_anonimo": "ADMIN-01",
        "rol": "admin",
        "nombres": "Administrador Clínico",
    },
}

@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(payload: UserRegisterRequest):
    """Registra un nuevo estudiante y genera su código anónimo de paciente"""
    db = get_database()
    correo_clean = payload.correo.lower().strip()
    
    # 1. Verificar si ya existe
    if db_manager.is_connected and db is not None:
        existing = await db.users.find_one({"correo": correo_clean})
        if existing:
            raise HTTPException(status_code=400, detail="El correo ya se encuentra registrado.")
    elif correo_clean in _IN_MEMORY_USERS:
        raise HTTPException(status_code=400, detail="El correo ya se encuentra registrado.")

    # 2. Crear código anónimo
    student_id = correo_clean.split("@")[0].upper()
    codigo_anonimo = f"AL-{student_id}" if "AL" in student_id else f"AL-{uuid.uuid4().hex[:8].upper()}"
    hashed_pw = hash_password(payload.contrasena)
    now_iso = datetime.now(timezone.utc).isoformat()

    user_doc = {
        "idusers": str(uuid.uuid4()),
        "correo": correo_clean,
        "contrasena": hashed_pw,
        "fecha_create": now_iso,
        "rol_id": 2, # Paciente
        "activo": True,
    }

    paciente_doc = {
        "idpacientes": str(uuid.uuid4()),
        "codigo_anonimo": codigo_anonimo,
        "correo": correo_clean,
        "nombres": payload.nombres,
        "apellido_p": payload.apellido_p,
        "apellido_m": payload.apellido_m,
        "carrera": payload.carrera,
        "cuatrimestre": payload.cuatrimestre,
        "telefono": payload.telefono,
        "fecha_create": now_iso,
    }

    if db_manager.is_connected and db is not None:
        await db.users.insert_one(user_doc)
        await db.pacientes.insert_one(paciente_doc)
    else:
        _IN_MEMORY_USERS[correo_clean] = {
            "contrasena": hashed_pw,
            "codigo_anonimo": codigo_anonimo,
            "rol": "paciente",
            "nombres": payload.nombres,
        }

    token = create_access_token({"sub": correo_clean, "codigo_anonimo": codigo_anonimo, "rol": "paciente"})
    return TokenResponse(access_token=token, codigo_anonimo=codigo_anonimo, rol="paciente")

@router.post("/login", response_model=TokenResponse)
async def login(payload: UserLoginRequest):
    """Valida credenciales contra MongoDB users con hash Bcrypt y retorna JWT (8 hrs)"""
    db = get_database()
    correo_clean = payload.correo.lower().strip()

    user = None
    if db_manager.is_connected and db is not None:
        user = await db.users.find_one({"correo": correo_clean})
    else:
        mem_user = _IN_MEMORY_USERS.get(correo_clean)
        if mem_user:
            user = {
                "correo": correo_clean,
                "contrasena": mem_user["contrasena"],
                "codigo_anonimo": mem_user["codigo_anonimo"],
                "rol": mem_user["rol"],
            }

    if not user or not verify_password(payload.contrasena, user["contrasena"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Correo o contraseña incorrectos.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    codigo_anonimo = user.get("codigo_anonimo", "AL-222410908")
    rol = "admin" if user.get("rol_id") == 1 or user.get("rol") == "admin" else "paciente"

    token = create_access_token({"sub": correo_clean, "codigo_anonimo": codigo_anonimo, "rol": rol})
    return TokenResponse(access_token=token, codigo_anonimo=codigo_anonimo, rol=rol)
