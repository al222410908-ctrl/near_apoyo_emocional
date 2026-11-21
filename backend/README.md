# Backend API REST - Near Apoyo Emocional

Microservicios backend asíncronos para la plataforma **Near Apoyo Emocional**, construidos con **FastAPI** y **MongoDB Atlas NoSQL (`near_db`)**, cumpliendo con todas las especificaciones del **Documento Técnico de Base de Datos y Arquitectura de Software**.

---

## 🛠️ Tecnologías Empleadas
- **Python 3.12+ / 3.14**
- **FastAPI**: Framework web asíncrono de alto rendimiento.
- **Motor / PyMongo**: Driver asíncrono no bloqueante para MongoDB con BSON nativo.
- **Pydantic v2**: Validación estricta de esquemas de datos y sanitización contra inyecciones.
- **Bcrypt**: Hashing unidireccional de contraseñas de grado militar (salt rounds = 12).
- **PyJWT**: Emisión y validación de tokens de sesión con expiración a 8 horas.
- **Uvicorn**: Servidor ASGI con soporte HTTP/1.1 y WebSockets.

---

## 📦 Colecciones de MongoDB (`near_db`)

El backend opera sobre 6 colecciones documentales optimizadas con `$jsonSchema` e índices únicos:
1. `users`: Credenciales institucionales, rol (`paciente` o `admin`) y hash Bcrypt.
2. `pacientes`: Perfil seudonimizado con `codigo_anonimo`, carrera y cuatrimestre (LFPDPPP).
3. `chat_sessions`: Sesiones activas, conteo de mensajes y estado de alerta de crisis.
4. `mensajes`: Historial cronológico de interacciones de usuario y Near con análisis de riesgo.
5. `detalle_bitacora`: Check-ins diarios de estado de ánimo (calmado, ansioso, cansado, etc.).
6. `recursos_emergencia`: Directorio oficial de líneas telefónicas de crisis 24/7 (Línea de la Vida, SAPTEL).

---

## 🚀 Puesta en Marcha Rápida

### 1. Variables de Entorno (`backend/.env`)
Configura tu cadena de conexión de MongoDB Atlas o local en `backend/.env`:
```env
PORT=8000
HOST=0.0.0.0
DEBUG=True
MONGODB_URI=mongodb+srv://near_app_user:<password>@cluster0.mongodb.net/near_db?retryWrites=true&w=majority
MONGODB_DB_NAME=near_db
JWT_SECRET=near_secret_jwt_key_2026_super_secure_utvt_7mo
JWT_EXPIRE_HOURS=8
CORS_ORIGINS=http://localhost:8080,http://localhost:5173,https://near-apoyo-emocional.vercel.app
```

### 2. Inicializar la Base de Datos e Índices
Ejecuta el script de aprovisionamiento para crear las 6 colecciones con sus validadores `$jsonSchema`, índices y datos semilla:
```bash
npm run backend:init
```
*(O directamente con `backend\.venv\Scripts\python.exe backend/scripts/init_db.py`)*

### 3. Iniciar el Servidor de Microservicios
```bash
npm run backend
```
El servidor quedará disponible en:
- **API Base:** `http://localhost:8000`
- **Documentación Interactiva Swagger:** `http://localhost:8000/docs`
- **Documentación ReDoc:** `http://localhost:8000/redoc`

---

## 📡 Catálogo de Endpoints REST

| Método | Endpoint | Descripción | Acceso |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/register` | Registro de nuevo estudiante y asignación de código anónimo. | Público |
| `POST` | `/api/v1/auth/login` | Login con email y contraseña. Emite token JWT (8 hrs). | Público |
| `POST` | `/api/v1/chat/message` | Envío de mensaje a Near IA con análisis de riesgo y protocolo de crisis. | Protegido / Sesión |
| `POST` | `/api/v1/bitacora/entry` | Registro de check-in emocional en `detalle_bitacora`. | Estudiante |
| `GET` | `/api/v1/pacientes/{codigo}/bitacora` | Historial emocional para radar y gráficas de progreso. | Estudiante |
| `GET` | `/api/v1/emergencias/lineas` | Catálogo público de líneas de contención 24/7. | Público |
| `GET` | `/api/v1/admin/dashboard` | Métricas consolidadas del sistema para el panel administrativo. | Administrador |
| `GET` | `/api/v1/admin/export/{col}` | Exportación de colecciones en formato JSON para auditoría. | Administrador |
| `GET` | `/health` | Healthcheck y estado de conexión a MongoDB Atlas. | Público |

---

## 🛡️ Seguridad y Resiliencia
- **Cifrado en Tránsito:** Forzado TLS 1.3 con certificados SSL.
- **Protección de Datos Sensibles (LFPDPPP):** Seudonimización estricta mediante `codigo_anonimo` para garantizar el anonimato del estudiante.
- **Modo Resiliente:** Si MongoDB Atlas pierde conectividad temporalmente, el backend conmuta automáticamente a un almacén en memoria sin lanzar errores 500 al cliente.
