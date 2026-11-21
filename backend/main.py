import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.config import settings
from backend.database import db_manager
from backend.routes import auth, chat, bitacora, emergencias, admin

# Configuración de Logging institucional
logging.basicConfig(
    level=logging.INFO if settings.DEBUG else logging.WARNING,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("near.api")

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Ciclo de vida de la aplicación:
    Paso 5 del Documento Técnico: Conecta con MongoDB Atlas en el inicio
    y cierra el pool de conexiones al terminar.
    """
    logger.info("Iniciando microservicios de Near Apoyo Emocional...")
    await db_manager.connect()
    yield
    logger.info("Deteniendo microservicios de Near...")
    await db_manager.disconnect()

app = FastAPI(
    title="Near Apoyo Emocional - API REST",
    description=(
        "Microservicios REST construidos con FastAPI y MongoDB Atlas NoSQL (near_db). "
        "Provee canal de escucha con IA, detección preventiva de crisis, registro en bitácora "
        "y protocolos de derivación inmediata para estudiantes universitarios."
    ),
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# Configuración de CORS para cliente web Vercel y local
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if settings.DEBUG else settings.cors_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Montaje de routers modulares
app.include_router(auth.router)
app.include_router(chat.router)
app.include_router(bitacora.router)
app.include_router(emergencias.router)
app.include_router(admin.router)

@app.get("/")
async def root():
    return {
        "sistema": "Near Apoyo Emocional - API REST",
        "version": "1.0.0",
        "estado": "operativo",
        "base_de_datos": {
            "motor": "MongoDB NoSQL (Atlas Cloud)",
            "db_name": settings.MONGODB_DB_NAME,
            "conectado": db_manager.is_connected,
        },
        "documentacion": "/docs",
        "institucion": "Universidad Tecnológica del Valle de Toluca (UTVT)",
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "database_connected": db_manager.is_connected,
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host=settings.HOST, port=settings.PORT, reload=settings.DEBUG)
