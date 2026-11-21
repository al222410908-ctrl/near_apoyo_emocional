"""
Script de Inicialización y Aprovisionamiento para MongoDB (near_db)
Cumple con las especificaciones técnicas de las Secciones 4.0, 4.1 y 4.2 del Documento Técnico:
1. Crea las 6 colecciones documentales
2. Aplica esquemas estrictos de validación con $jsonSchema
3. Genera índices únicos y de búsqueda rápida
4. Inserta registros semilla (usuarios, paciente de prueba y líneas de emergencia)
"""

import asyncio
import os
import sys
from motor.motor_asyncio import AsyncIOMotorClient

# Asegurar import de backend
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))
from backend.config import settings
from backend.security import hash_password

COLLECTIONS_SCHEMA = {
    "users": {
        "validator": {
            "$jsonSchema": {
                "bsonType": "object",
                "required": ["correo", "contrasena", "rol_id"],
                "properties": {
                    "correo": {"bsonType": "string", "pattern": "^.+@.+$", "description": "Email único requerido"},
                    "contrasena": {"bsonType": "string", "description": "Hash Bcrypt requerido"},
                    "rol_id": {"bsonType": "int", "description": "1: Admin, 2: Paciente"},
                    "fecha_create": {"bsonType": "string"},
                    "activo": {"bsonType": "bool"},
                },
            }
        }
    },
    "pacientes": {
        "validator": {
            "$jsonSchema": {
                "bsonType": "object",
                "required": ["codigo_anonimo", "nombres", "correo"],
                "properties": {
                    "codigo_anonimo": {"bsonType": "string"},
                    "nombres": {"bsonType": "string"},
                    "apellido_p": {"bsonType": "string"},
                    "carrera": {"bsonType": "string"},
                    "cuatrimestre": {"bsonType": "int"},
                },
            }
        }
    },
    "chat_sessions": {
        "validator": {
            "$jsonSchema": {
                "bsonType": "object",
                "required": ["session_id", "codigo_anonimo"],
                "properties": {
                    "session_id": {"bsonType": "string"},
                    "codigo_anonimo": {"bsonType": "string"},
                    "estilo_interaccion": {"bsonType": "string"},
                    "mensajes_count": {"bsonType": "int"},
                    "alerta_crisis_activada": {"bsonType": "bool"},
                },
            }
        }
    },
    "mensajes": {
        "validator": {
            "$jsonSchema": {
                "bsonType": "object",
                "required": ["session_id", "remitente", "contenido"],
                "properties": {
                    "session_id": {"bsonType": "string"},
                    "remitente": {"enum": ["user", "near"]},
                    "contenido": {"bsonType": "string"},
                    "timestamp": {"bsonType": "string"},
                },
            }
        }
    },
    "detalle_bitacora": {
        "validator": {
            "$jsonSchema": {
                "bsonType": "object",
                "required": ["codigo_anonimo", "mood", "fecha"],
                "properties": {
                    "codigo_anonimo": {"bsonType": "string"},
                    "mood": {"bsonType": "string"},
                    "intensidad": {"bsonType": "int"},
                    "notas": {"bsonType": "string"},
                },
            }
        }
    },
    "recursos_emergencia": {
        "validator": {
            "$jsonSchema": {
                "bsonType": "object",
                "required": ["nombre", "telefono"],
                "properties": {
                    "nombre": {"bsonType": "string"},
                    "telefono": {"bsonType": "string"},
                },
            }
        }
    },
}

async def initialize_near_database():
    print(f"🚀 Conectando a MongoDB en: {settings.MONGODB_URI}")
    client = AsyncIOMotorClient(settings.MONGODB_URI, serverSelectionTimeoutMS=4000)
    db = client[settings.MONGODB_DB_NAME]

    try:
        await client.admin.command("ping")
        print("✅ Ping a MongoDB exitoso.")
    except Exception as e:
        print(f"❌ Error al conectar a MongoDB: {e}")
        print("💡 Verifica que MongoDB esté corriendo localmente o que la cadena de Atlas sea válida.")
        return

    # 1. Crear colecciones con sus esquemas de validación
    existing_cols = await db.list_collection_names()
    for col_name, opts in COLLECTIONS_SCHEMA.items():
        if col_name not in existing_cols:
            print(f"📦 Creando colección con $jsonSchema: {col_name}")
            await db.create_collection(col_name, **opts)
        else:
            print(f"ℹ️ Colección '{col_name}' ya existe. Aplicando validador...")
            try:
                await db.command({
                    "collMod": col_name,
                    "validator": opts["validator"],
                    "validationLevel": "moderate",
                })
            except Exception as ex:
                print(f"   (Advertencia al actualizar validador en {col_name}: {ex})")

    # 2. Creación de Índices Únicos y de Búsqueda Rápida
    print("🔑 Creando índices...")
    await db.users.create_index("correo", unique=True)
    await db.pacientes.create_index("codigo_anonimo", unique=True)
    await db.chat_sessions.create_index("session_id", unique=True)
    await db.mensajes.create_index([("session_id", 1), ("timestamp", -1)])
    await db.detalle_bitacora.create_index([("codigo_anonimo", 1), ("fecha", -1)])
    await db.recursos_emergencia.create_index("telefono", unique=True)
    print("✅ Índices creados exitosamente.")

    # 3. Insertar datos semilla
    print("🌱 Insertando datos semilla...")
    # Admin
    admin_mail = "admin@near.salud"
    if not await db.users.find_one({"correo": admin_mail}):
        await db.users.insert_one({
            "correo": admin_mail,
            "contrasena": hash_password("AdminNear2026!"),
            "rol_id": 1,
            "fecha_create": "2026-01-01T00:00:00Z",
            "activo": True,
        })
        print(f"   + Usuario Admin creado: {admin_mail}")

    # Estudiante de prueba UTVT
    student_mail = "al222410908@alumnos.utvt.edu.mx"
    if not await db.users.find_one({"correo": student_mail}):
        await db.users.insert_one({
            "correo": student_mail,
            "contrasena": hash_password("Near2026!"),
            "rol_id": 2,
            "fecha_create": "2026-10-11T12:00:00Z",
            "activo": True,
        })
        await db.pacientes.insert_one({
            "codigo_anonimo": "AL-222410908",
            "correo": student_mail,
            "nombres": "Alan",
            "apellido_p": "Alcántara",
            "apellido_m": "Valencia",
            "carrera": "Tecnologías de la Información y Comunicación",
            "cuatrimestre": 7,
            "telefono": "7221234567",
        })
        print(f"   + Estudiante UTVT creado: {student_mail} (AL-222410908)")

    # Recursos de Emergencia Oficiales
    lineas = [
        {"nombre": "Línea de la Vida (Secretaría de Salud)", "telefono": "800 911 2000", "horario": "24/7", "cobertura": "Nacional"},
        {"nombre": "SAPTEL Cruz Roja Mexicana", "telefono": "55 5259 8121", "horario": "24/7", "cobertura": "Nacional"},
        {"nombre": "Línea Calma Edomex / UTVT", "telefono": "800 012 3456", "horario": "Lunes a Viernes 08:00 a 20:00", "cobertura": "Estado de México"},
    ]
    for linea in lineas:
        await db.recursos_emergencia.update_one(
            {"telefono": linea["telefono"]},
            {"$set": linea},
            upsert=True,
        )
    print("✅ Líneas de emergencia aprovisionadas.")

    print("\n🎉 Base de datos 'near_db' inicializada al 100% con éxito.")
    client.close()

if __name__ == "__main__":
    asyncio.run(initialize_near_database())
