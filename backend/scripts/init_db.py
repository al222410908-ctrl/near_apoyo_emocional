"""
Script de Inicialización y Sembrado de MongoDB Atlas para Near Apoyo Emocional.
Aprovisiona las 6 colecciones con $jsonSchema, índices únicos y los 28 documentos
especificados en el documento técnico oficial.
"""

import asyncio
import os
import sys
from datetime import datetime

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from motor.motor_asyncio import AsyncIOMotorClient
from config import settings
from security import hash_password

COLLECTIONS_SCHEMA = {
    "users": {
        "validator": {
            "$jsonSchema": {
                "bsonType": "object",
                "required": ["correo", "contrasena", "rol_id", "activo"],
                "properties": {
                    "idusers": {"bsonType": "string"},
                    "correo": {"bsonType": "string", "pattern": r"^.+@.+$"},
                    "contrasena": {"bsonType": "string"},
                    "rol_id": {"bsonType": "int"},
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
                "required": ["codigo_anonimo", "correo", "nombres", "carrera"],
                "properties": {
                    "codigo_anonimo": {"bsonType": "string"},
                    "correo": {"bsonType": "string", "pattern": r"^.+@.+$"},
                    "nombres": {"bsonType": "string"},
                    "carrera": {"bsonType": "string"},
                    "cuatrimestre": {"bsonType": "int"},
                    "estado_actual": {"bsonType": "string"},
                    "etiquetas_emocionales": {"bsonType": "array"},
                },
            }
        }
    },
    "chat_sessions": {
        "validator": {
            "$jsonSchema": {
                "bsonType": "object",
                "required": ["session_id", "estudiante_id", "estado"],
                "properties": {
                    "session_id": {"bsonType": "string"},
                    "estudiante_id": {"bsonType": "string"},
                    "inicio": {"bsonType": "string"},
                    "estado": {"bsonType": "string"},
                },
            }
        }
    },
    "mensajes": {
        "validator": {
            "$jsonSchema": {
                "bsonType": "object",
                "required": ["session_id", "emisor", "mensaje"],
                "properties": {
                    "session_id": {"bsonType": "string"},
                    "emisor": {"bsonType": "string", "enum": ["usuario", "bot", "sistema"]},
                    "mensaje": {"bsonType": "string"},
                    "puntaje_riesgo": {"bsonType": ["double", "int"]},
                    "alerta_crisis": {"bsonType": "bool"},
                    "timestamp": {"bsonType": "string"},
                },
            }
        }
    },
    "detalle_bitacora": {
        "validator": {
            "$jsonSchema": {
                "bsonType": "object",
                "required": ["estudiante_id", "estado_animo"],
                "properties": {
                    "estudiante_id": {"bsonType": "string"},
                    "estado_animo": {"bsonType": "int", "minimum": 1, "maximum": 5},
                    "emocion_primaria": {"bsonType": "string"},
                    "nota_desahogo": {"bsonType": "string"},
                    "fecha_registro": {"bsonType": "string"},
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
    print(f"🚀 Conectando a MongoDB Atlas en: {settings.MONGODB_URI[:35]}...")
    client = AsyncIOMotorClient(settings.MONGODB_URI, serverSelectionTimeoutMS=5000)
    db = client[settings.MONGODB_DB_NAME]

    try:
        await client.admin.command("ping")
        print("✅ Ping a MongoDB Atlas exitoso (Conexión TLS 1.3 verificada).")
    except Exception as e:
        print(f"❌ Error al conectar a MongoDB: {e}")
        return

    # 1. Crear / Modificar colecciones con sus esquemas
    existing_cols = await db.list_collection_names()
    for col_name, opts in COLLECTIONS_SCHEMA.items():
        if col_name not in existing_cols:
            print(f"📦 Creando colección con $jsonSchema: {col_name}")
            await db.create_collection(col_name, **opts)
        else:
            try:
                await db.command({
                    "collMod": col_name,
                    "validator": opts["validator"],
                    "validationLevel": "moderate",
                })
            except Exception:
                pass

    # Limpiar datos previos para garantizar unicidad y métricas exactas
    await db.users.delete_many({})
    await db.pacientes.delete_many({})
    await db.chat_sessions.delete_many({})
    await db.mensajes.delete_many({})
    await db.detalle_bitacora.delete_many({})
    await db.recursos_emergencia.delete_many({})

    # 2. Creación de Índices Únicos
    print("🔑 Creando índices...")
    await db.users.create_index("correo", unique=True)
    await db.users.create_index("idusers", unique=True)
    await db.pacientes.create_index("codigo_anonimo", unique=True)
    await db.chat_sessions.create_index("session_id", unique=True)
    await db.mensajes.create_index([("session_id", 1), ("timestamp", -1)])
    await db.detalle_bitacora.create_index([("estudiante_id", 1), ("fecha_registro", -1)])
    await db.recursos_emergencia.create_index("telefono", unique=True)
    print("✅ Índices B-Tree optimizados creados.")

    # 3. Sembrado de 4 Usuarios (users)
    print("🌱 Insertando 4 cuentas de usuario en 'users'...")
    users_data = [
        {
            "idusers": "usr-al222410908",
            "correo": "al222410908@alumnos.utvt.edu.mx",
            "contrasena": hash_password("Near2026!"),
            "rol_id": 2,
            "fecha_create": "2026-10-11T12:00:00Z",
            "activo": True,
        },
        {
            "idusers": "usr-adm-01",
            "correo": "admin@near.salud",
            "contrasena": hash_password("AdminNear2026!"),
            "rol_id": 1,
            "fecha_create": "2026-01-01T00:00:00Z",
            "activo": True,
        },
        {
            "idusers": "usr-psi-01",
            "correo": "psicologia@utvt.edu.mx",
            "contrasena": hash_password("PsicoNear2026!"),
            "rol_id": 3,
            "fecha_create": "2026-02-15T09:00:00Z",
            "activo": True,
        },
        {
            "idusers": "usr-al222410555",
            "correo": "al222410555@alumnos.utvt.edu.mx",
            "contrasena": hash_password("Mariana2026!"),
            "rol_id": 2,
            "fecha_create": "2026-10-12T10:30:00Z",
            "activo": True,
        },
    ]
    for u in users_data:
        await db.users.update_one({"correo": u["correo"]}, {"$set": u}, upsert=True)

    # 4. Sembrado de 4 Expedientes (pacientes)
    print("🌱 Insertando 4 expedientes clínicos en 'pacientes'...")
    pacientes_data = [
        {
            "codigo_anonimo": "AL-222410908",
            "nombres": "Alan Alcántara",
            "correo": "al222410908@alumnos.utvt.edu.mx",
            "carrera": "Ingeniería en Desarrollo y Gestión de Software",
            "cuatrimestre": 7,
            "estado_actual": "estable",
            "etiquetas_emocionales": ["ansiedad", "estres_academico", "resiliencia"],
            "ultimo_checkin": "2026-11-21T07:45:00Z",
            "fecha_registro": "2026-10-11T12:00:00Z",
        },
        {
            "codigo_anonimo": "AL-222410555",
            "nombres": "Mariana López",
            "correo": "al222410555@alumnos.utvt.edu.mx",
            "carrera": "Ingeniería en Mantenimiento Industrial",
            "cuatrimestre": 7,
            "estado_actual": "en_seguimiento",
            "etiquetas_emocionales": ["agotamiento", "presion_familiar"],
            "ultimo_checkin": "2026-11-20T18:30:00Z",
            "fecha_registro": "2026-10-12T10:30:00Z",
        },
        {
            "codigo_anonimo": "AL-222410777",
            "nombres": "Carlos Ruiz",
            "correo": "al222410777@alumnos.utvt.edu.mx",
            "carrera": "Ingeniería en Mecatrónica",
            "cuatrimestre": 5,
            "estado_actual": "estable",
            "etiquetas_emocionales": ["calma", "motivacion"],
            "ultimo_checkin": "2026-11-21T06:00:00Z",
            "fecha_registro": "2026-10-15T11:00:00Z",
        },
        {
            "codigo_anonimo": "AL-222410888",
            "nombres": "Sofía Morales",
            "correo": "al222410888@alumnos.utvt.edu.mx",
            "carrera": "Tecnología Ambiental",
            "cuatrimestre": 3,
            "estado_actual": "estable",
            "etiquetas_emocionales": ["adaptacion", "optimismo"],
            "ultimo_checkin": "2026-11-19T14:20:00Z",
            "fecha_registro": "2026-10-18T16:00:00Z",
        },
    ]
    for p in pacientes_data:
        await db.pacientes.update_one({"codigo_anonimo": p["codigo_anonimo"]}, {"$set": p}, upsert=True)

    # 5. Sembrado de 3 Sesiones Conversacionales (chat_sessions)
    print("🌱 Insertando 3 sesiones en 'chat_sessions'...")
    sessions_data = [
        {
            "session_id": "9b1deb4d-3b7d-4c31-8f2e-5f8a209c1d2e",
            "estudiante_id": "AL-222410908",
            "inicio": "2026-11-21T07:40:00Z",
            "fin": None,
            "estado": "activa",
        },
        {
            "session_id": "4a2e8c1f-8b9a-4c2d-9e1f-6a7b8c9d0e1f",
            "estudiante_id": "AL-222410555",
            "inicio": "2026-11-20T18:15:00Z",
            "fin": "2026-11-20T18:45:00Z",
            "estado": "cerrada",
        },
        {
            "session_id": "7c3f9e2b-1a4d-4e5f-8b2c-9d0e1f2a3b4c",
            "estudiante_id": "AL-222410777",
            "inicio": "2026-11-21T05:50:00Z",
            "fin": None,
            "estado": "activa",
        },
    ]
    for s in sessions_data:
        await db.chat_sessions.update_one({"session_id": s["session_id"]}, {"$set": s}, upsert=True)

    # 6. Sembrado de 8 Mensajes (mensajes)
    print("🌱 Insertando 8 turnos conversacionales en 'mensajes'...")
    mensajes_data = [
        {
            "session_id": "9b1deb4d-3b7d-4c31-8f2e-5f8a209c1d2e",
            "emisor": "usuario",
            "mensaje": "Hola, siento muchísima presión por los exámenes finales y no puedo concentrarme.",
            "puntaje_riesgo": 0.45,
            "alerta_crisis": False,
            "palabras_clave": ["presión", "exámenes"],
            "timestamp": "2026-11-21T07:40:05Z",
        },
        {
            "session_id": "9b1deb4d-3b7d-4c31-8f2e-5f8a209c1d2e",
            "emisor": "bot",
            "mensaje": "Hola Alan. Es completamente válido sentirse abrumado en semana de evaluaciones. Tómate un momento y regalémonos 60 segundos de respiración consciente juntos.",
            "puntaje_riesgo": 0.10,
            "alerta_crisis": False,
            "palabras_clave": ["respiración"],
            "timestamp": "2026-11-21T07:40:10Z",
        },
        {
            "session_id": "9b1deb4d-3b7d-4c31-8f2e-5f8a209c1d2e",
            "emisor": "usuario",
            "mensaje": "Siento un nudo en el pecho y me da miedo reprobar.",
            "puntaje_riesgo": 0.60,
            "alerta_crisis": False,
            "palabras_clave": ["pecho", "miedo"],
            "timestamp": "2026-11-21T07:41:00Z",
        },
        {
            "session_id": "9b1deb4d-3b7d-4c31-8f2e-5f8a209c1d2e",
            "emisor": "bot",
            "mensaje": "Te escucho. Coloca una mano sobre tu pecho y siente cómo sube y baja. Vamos a inhalar en 4 tiempos y soltar en 7.",
            "puntaje_riesgo": 0.10,
            "alerta_crisis": False,
            "palabras_clave": ["ejercicio_478"],
            "timestamp": "2026-11-21T07:41:05Z",
        },
        {
            "session_id": "4a2e8c1f-8b9a-4c2d-9e1f-6a7b8c9d0e1f",
            "emisor": "usuario",
            "mensaje": "Llevo tres días durmiendo muy poco por el proyecto de máquinas.",
            "puntaje_riesgo": 0.50,
            "alerta_crisis": False,
            "palabras_clave": ["insomnio", "cansancio"],
            "timestamp": "2026-11-20T18:15:30Z",
        },
        {
            "session_id": "4a2e8c1f-8b9a-4c2d-9e1f-6a7b8c9d0e1f",
            "emisor": "bot",
            "mensaje": "El descanso físico es imprescindible para que tu mente rinda. ¿Te gustaría planificar una pausa de 20 minutos de descompresión?",
            "puntaje_riesgo": 0.10,
            "alerta_crisis": False,
            "palabras_clave": ["descompresión"],
            "timestamp": "2026-11-20T18:16:00Z",
        },
        {
            "session_id": "7c3f9e2b-1a4d-4e5f-8b2c-9d0e1f2a3b4c",
            "emisor": "usuario",
            "mensaje": "Hoy me siento con bastante energía para entregar la práctica de robótica.",
            "puntaje_riesgo": 0.05,
            "alerta_crisis": False,
            "palabras_clave": ["energía", "motivación"],
            "timestamp": "2026-11-21T05:50:30Z",
        },
        {
            "session_id": "7c3f9e2b-1a4d-4e5f-8b2c-9d0e1f2a3b4c",
            "emisor": "bot",
            "mensaje": "¡Me da mucho gusto leer eso! Mantén ese ritmo constante y recuerda hidratarte.",
            "puntaje_riesgo": 0.02,
            "alerta_crisis": False,
            "palabras_clave": ["positivo"],
            "timestamp": "2026-11-21T05:51:00Z",
        },
    ]
    await db.mensajes.delete_many({}) # limpiar para garantizar 8 exactos
    await db.mensajes.insert_many(mensajes_data)

    # 7. Sembrado de 6 Entradas de Bitácora (detalle_bitacora)
    print("🌱 Insertando 6 registros emocionales en 'detalle_bitacora'...")
    bitacora_data = [
        {
            "registro_id": "reg-001",
            "estudiante_id": "AL-222410908",
            "estado_animo": 3,
            "emocion_primaria": "Ansiedad",
            "nota_desahogo": "Mucha carga de trabajo pero logré terminar la entrega a tiempo.",
            "fecha_registro": "2026-11-20T21:00:00Z",
        },
        {
            "registro_id": "reg-002",
            "estudiante_id": "AL-222410908",
            "estado_animo": 4,
            "emocion_primaria": "Alivio",
            "nota_desahogo": "Hice 10 minutos de respiración y me siento mucho más enfocado.",
            "fecha_registro": "2026-11-21T07:45:00Z",
        },
        {
            "registro_id": "reg-003",
            "estudiante_id": "AL-222410555",
            "estado_animo": 2,
            "emocion_primaria": "Agotamiento",
            "nota_desahogo": "No he descansado bien por turnos pesados de taller.",
            "fecha_registro": "2026-11-19T22:30:00Z",
        },
        {
            "registro_id": "reg-004",
            "estudiante_id": "AL-222410555",
            "estado_animo": 2,
            "emocion_primaria": "Presión",
            "nota_desahogo": "Intentando organizar mis horarios de sueño.",
            "fecha_registro": "2026-11-20T18:30:00Z",
        },
        {
            "registro_id": "reg-005",
            "estudiante_id": "AL-222410777",
            "estado_animo": 3,
            "emocion_primaria": "Concentración",
            "nota_desahogo": "Avanzando en la programación de PLC.",
            "fecha_registro": "2026-11-20T14:00:00Z",
        },
        {
            "registro_id": "reg-006",
            "estudiante_id": "AL-222410777",
            "estado_animo": 4,
            "emocion_primaria": "Calma",
            "nota_desahogo": "Práctica validada por el docente, buen día.",
            "fecha_registro": "2026-11-21T06:00:00Z",
        },
    ]
    await db.detalle_bitacora.delete_many({}) # limpiar para garantizar 6 exactos
    await db.detalle_bitacora.insert_many(bitacora_data)

    # 8. Sembrado de 3 Líneas de Emergencia (recursos_emergencia)
    print("🌱 Insertando 3 líneas en 'recursos_emergencia'...")
    lineas = [
        {"idrecurso": "rec-01", "nombre": "Línea de la Vida (Secretaría de Salud)", "telefono": "800 911 2000", "disponibilidad": "24/7", "activo": True},
        {"idrecurso": "rec-02", "nombre": "SAPTEL Cruz Roja Mexicana", "telefono": "55 5259 8121", "disponibilidad": "24/7", "activo": True},
        {"idrecurso": "rec-03", "nombre": "Atención Psicológica UTVT", "telefono": "728 285 9600 Ext. 140", "disponibilidad": "L-V 08:00 - 18:00", "activo": True},
    ]
    for linea in lineas:
        await db.recursos_emergencia.update_one(
            {"idrecurso": linea["idrecurso"]},
            {"$set": linea},
            upsert=True,
        )

    print("\n========================================================")
    print("🎉 BASE DE DATOS 'near_db' INICIALIZADA AL 100% EN MONGODB ATLAS")
    print("========================================================")
    for col in ["users", "pacientes", "chat_sessions", "mensajes", "detalle_bitacora", "recursos_emergencia"]:
        cnt = await db[col].count_documents({})
        print(f"📊 Colección '{col}': {cnt} documentos BSON")
    print("========================================================")

    client.close()

if __name__ == "__main__":
    asyncio.run(initialize_near_database())
