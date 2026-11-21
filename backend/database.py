import logging
from typing import Optional
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from backend.config import settings

logger = logging.getLogger("near.database")

class DatabaseManager:
    client: Optional[AsyncIOMotorClient] = None
    db: Optional[AsyncIOMotorDatabase] = None
    is_connected: bool = False

    async def connect(self):
        """Inicializa la conexión asíncrona hacia MongoDB Atlas o local"""
        try:
            logger.info("Conectando con MongoDB (%s)...", settings.MONGODB_URI[:30] + "...")
            self.client = AsyncIOMotorClient(
                settings.MONGODB_URI,
                serverSelectionTimeoutMS=3000,
                connectTimeoutMS=3000,
            )
            # Test ping
            await self.client.admin.command("ping")
            self.db = self.client[settings.MONGODB_DB_NAME]
            self.is_connected = True
            logger.info("✅ Conexión exitosa a MongoDB: %s", settings.MONGODB_DB_NAME)
        except Exception as e:
            self.is_connected = False
            logger.warning("⚠️ No se pudo conectar a MongoDB en vivo (%s). Modo resiliente activado.", e)

    async def disconnect(self):
        """Cierra el pool de conexiones al apagar el servidor"""
        if self.client:
            self.client.close()
            logger.info("Conexión con MongoDB cerrada.")

db_manager = DatabaseManager()

def get_database() -> Optional[AsyncIOMotorDatabase]:
    return db_manager.db
