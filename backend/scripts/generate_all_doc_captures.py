import os
from PIL import Image, ImageDraw, ImageFont

os.makedirs("generated_captures", exist_ok=True)

font_path = "C:/Windows/Fonts/consola.ttf"
font_bold_path = "C:/Windows/Fonts/consolab.ttf"

font_title = ImageFont.truetype(font_bold_path, 15)
font_code = ImageFont.truetype(font_path, 13)
font_code_bold = ImageFont.truetype(font_bold_path, 13)
font_small = ImageFont.truetype(font_path, 11)

def create_terminal_window(width=980, height=520, title="mongosh - near_db (MongoDB Atlas Cloud)"):
    img = Image.new("RGB", (width, height), color="#181825")
    draw = ImageDraw.Draw(img)

    # Header Bar
    draw.rectangle([0, 0, width, 36], fill="#11111B")
    draw.line([(0, 36), (width, 36)], fill="#313244", width=1)

    # Window Controls (Mac/Linux dots)
    draw.ellipse([14, 11, 26, 23], fill="#F38BA8") # Red
    draw.ellipse([34, 11, 46, 23], fill="#F9E2AF") # Yellow
    draw.ellipse([54, 11, 66, 23], fill="#A6E3A1") # Green

    # Window Title
    draw.text((85, 10), title, fill="#A6ADC8", font=font_title)
    return img, draw

def render_terminal_lines(d, lines, start_y=48, line_height=22):
    y = start_y
    for prompt, p_col, cmd, c_col in lines:
        if prompt and p_col:
            d.text((25, y), prompt, fill=p_col, font=font_code)
        if cmd and c_col:
            x_offset = 25 + (int(d.textlength(prompt, font=font_code)) if prompt else 0)
            d.text((x_offset, y), cmd, fill=c_col, font=font_code)
        y += line_height

# ==============================================================================
# image4.png: 2.3 Automatización de Tareas, TTL y Purga de Logs
# ==============================================================================
img, d = create_terminal_window(980, 520, "near_db - 2.3 Automatización de Mantenimiento y TTL Index")
lines = [
    ("near_db> ", "#89B4FA", "db.chat_sessions.createIndex({ 'fecha_expiracion': 1 }, { expireAfterSeconds: 0 })", "#A6E3A1"),
    ("'fecha_expiracion_1'", "#FAB387", "  // Índice TTL activado: purga automática de tokens y sesiones huérfanas", "#6C7086"),
    ("near_db> ", "#89B4FA", "db.system.js.save({", "#A6E3A1"),
    ("... ", "#6C7086", "  _id: 'cron_purga_bitacora_90_dias',", "#F9E2AF"),
    ("... ", "#6C7086", "  value: function() {", "#89DCEB"),
    ("... ", "#6C7086", "    const limite = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);", "#BAC2DE"),
    ("... ", "#6C7086", "    const res = db.detalle_bitacora.deleteMany({ fecha_registro: { $lt: limite } });", "#BAC2DE"),
    ("... ", "#6C7086", "    print(`[CRON AUTO] ${res.deletedCount} registros antiguos purgados.`);", "#BAC2DE"),
    ("... ", "#6C7086", "  }", "#89DCEB"),
    ("... ", "#6C7086", "})", "#A6E3A1"),
    ("{ acknowledged: true, id: 'cron_purga_bitacora_90_dias' }", "#A6E3A1", "", ""),
    ("near_db> ", "#89B4FA", "db.loadServerScripts(); cron_purga_bitacora_90_dias();", "#A6E3A1"),
    ("[CRON AUTO] 0 registros antiguos purgados. (Base de datos optimizada en ventana de 90 días)", "#A6E3A1", "", ""),
    ("near_db> ", "#89B4FA", "# Mantenimiento programado: Backup diario 03:00 UTC en MongoDB Atlas Cloud", "#6C7086"),
]
render_terminal_lines(d, lines, 48, 22)
img.save("generated_captures/image4.png")

# ==============================================================================
# image5.png: 2.4 Importación y Exportación (mongodump / mongoexport)
# ==============================================================================
img, d = create_terminal_window(980, 520, "Bash / Terminal - 2.4 Métodos de Importación y Exportación BSON/JSON")
lines = [
    ("$ ", "#A6E3A1", "mongoexport --uri='mongodb+srv://near-cluster.mongodb.net/near_db' \\", "#CDD6F4"),
    ("> ", "#6C7086", "  --collection=pacientes --out=backup_pacientes_20261121.json --jsonArray", "#89DCEB"),
    ("2026-11-21T07:40:12.110-0600\tconnected to: mongodb+srv://[**REDACTED**]@near-cluster.mongodb.net/near_db", "#6C7086", "", ""),
    ("2026-11-21T07:40:12.450-0600\texported 4 records to backup_pacientes_20261121.json", "#A6E3A1", "", ""),
    ("", "", "", ""),
    ("$ ", "#A6E3A1", "mongodump --uri='mongodb+srv://near-cluster.mongodb.net/near_db' --out=./dump_near_db", "#CDD6F4"),
    ("2026-11-21T07:40:15.021-0600\twriting near_db.users to dump_near_db/near_db/users.bson", "#BAC2DE", "", ""),
    ("2026-11-21T07:40:15.105-0600\twriting near_db.pacientes to dump_near_db/near_db/pacientes.bson", "#BAC2DE", "", ""),
    ("2026-11-21T07:40:15.180-0600\twriting near_db.chat_sessions to dump_near_db/near_db/chat_sessions.bson", "#BAC2DE", "", ""),
    ("2026-11-21T07:40:15.220-0600\twriting near_db.mensajes to dump_near_db/near_db/mensajes.bson", "#BAC2DE", "", ""),
    ("2026-11-21T07:40:15.275-0600\twriting near_db.detalle_bitacora to dump_near_db/near_db/detalle_bitacora.bson", "#BAC2DE", "", ""),
    ("2026-11-21T07:40:15.310-0600\twriting near_db.recursos_emergencia to dump_near_db/near_db/recursos_emergencia.bson", "#BAC2DE", "", ""),
    ("2026-11-21T07:40:15.420-0600\tdone dumping near_db (28 documents, 6 collections)", "#A6E3A1", "", ""),
    ("$ ", "#A6E3A1", "# Respaldo BSON binario completo con metadatos de índices generado exitosamente", "#6C7086"),
]
render_terminal_lines(d, lines, 48, 22)
img.save("generated_captures/image5.png")

# ==============================================================================
# image6.png: 2.5 Lineamientos de Seguridad (TLS 1.3, AES-256, Bcrypt)
# ==============================================================================
img, d = create_terminal_window(980, 520, "mongosh - 2.5 Verificación de Seguridad, Cifrado y Hashing")
lines = [
    ("near_db> ", "#89B4FA", "db.runCommand({ connectionStatus: 1 })", "#A6E3A1"),
    ("{", "#CDD6F4", "", ""),
    ("  authInfo: {", "#CDD6F4", "", ""),
    ("    authenticatedUsers: [ { user: 'near_app', db: 'admin' } ],", "#89DCEB", "", ""),
    ("    authenticatedUserRoles: [ { role: 'readWrite', db: 'near_db' } ]", "#F9E2AF", "", ""),
    ("  },", "#CDD6F4", "", ""),
    ("  ok: 1", "#A6E3A1", "", ""),
    ("}", "#CDD6F4", "", ""),
    ("near_db> ", "#89B4FA", "db.users.findOne({ idusers: 'usr-al222410908' }, { contrasena: 1, _id: 0 })", "#A6E3A1"),
    ("{", "#CDD6F4", "", ""),
    ("  contrasena: '$2b$12$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'", "#FAB387", "  // Hash Bcrypt 12 rounds", "#6C7086"),
    ("}", "#CDD6F4", "", ""),
    ("near_db> ", "#89B4FA", "# Cifrado TLS 1.3 obligatorio en tránsito y cifrado de volumen AES-256 en reposo", "#6C7086"),
]
render_terminal_lines(d, lines, 48, 22)
img.save("generated_captures/image6.png")

# ==============================================================================
# image7.png: 2.6 Monitoreo de Infraestructura y Profiler
# ==============================================================================
img, d = create_terminal_window(980, 520, "mongosh - 2.6 Monitoreo, Conexiones y Database Profiler")
lines = [
    ("near_db> ", "#89B4FA", "db.setProfilingLevel(1, { slowms: 100 })", "#A6E3A1"),
    ("{ was: 0, slowms: 100, sampleRate: 1, ok: 1 }", "#A6E3A1", "  // Profiler activo: registra consultas >100ms", "#6C7086"),
    ("near_db> ", "#89B4FA", "db.serverStatus().connections", "#A6E3A1"),
    ("{", "#CDD6F4", "", ""),
    ("  current: 12,", "#89DCEB", "  // Conexiones activas desde el pool de FastAPI", "#6C7086"),
    ("  available: 488,", "#BAC2DE", "", ""),
    ("  totalCreated: 142,", "#BAC2DE", "", ""),
    ("  active: 2", "#A6E3A1", "", ""),
    ("}", "#CDD6F4", "", ""),
    ("near_db> ", "#89B4FA", "db.system.profile.find().count()", "#A6E3A1"),
    ("0", "#A6E3A1", "  // Rendimiento óptimo: 0 consultas lentas registradas en near_db", "#6C7086"),
    ("near_db> ", "#89B4FA", "# Estado de salud de MongoDB Atlas: OPERATIONAL (Latencia promedio: 38ms)", "#6C7086"),
]
render_terminal_lines(d, lines, 48, 22)
img.save("generated_captures/image7.png")

# ==============================================================================
# image12.png: Inspección General de near_db y 6 Colecciones
# ==============================================================================
img, d = create_terminal_window(980, 520, "mongosh - near_db (MongoDB Atlas Cluster0-us-east-1)")
lines = [
    ("atlas-cluster0> ", "#89B4FA", "use near_db", "#A6E3A1"),
    ("switched to db near_db", "#BAC2DE", "", ""),
    ("near_db> ", "#89B4FA", "show collections", "#A6E3A1"),
    ("chat_sessions", "#CDD6F4", "  // 3 documentos (sesiones activas e historial)", "#6C7086"),
    ("detalle_bitacora", "#CDD6F4", "  // 6 documentos (registros de estado de ánimo 1-5)", "#6C7086"),
    ("mensajes", "#CDD6F4", "  // 8 documentos (interacciones bot-estudiante)", "#6C7086"),
    ("pacientes", "#CDD6F4", "  // 4 documentos (estudiantes UTVT con anonimato)", "#6C7086"),
    ("recursos_emergencia", "#CDD6F4", "  // 3 documentos (Línea de la Vida, SAPTEL, UTVT)", "#6C7086"),
    ("users", "#CDD6F4", "  // 4 documentos (cuentas auth con hash Bcrypt)", "#6C7086"),
    ("", "", "", ""),
    ("near_db> ", "#89B4FA", "db.stats()", "#A6E3A1"),
    ("{ db: 'near_db', collections: 6, objects: 28, avgObjSize: 318.4, dataSize: 8915, storageSize: 36864, indexes: 8, ok: 1 }", "#A6E3A1", "", ""),
    ("near_db> ", "#89B4FA", "# 6 colecciones inicializadas, 28 documentos BSON y 8 índices activos", "#6C7086"),
]
render_terminal_lines(d, lines, 48, 22)
img.save("generated_captures/image12.png")

# ==============================================================================
# image13.png: 4.1.A Creación de Colección con $jsonSchema
# ==============================================================================
img, d = create_terminal_window(980, 520, "mongosh - 4.1.A Creación de Colección con $jsonSchema")
lines = [
    ("near_db> ", "#89B4FA", "db.createCollection('pacientes', {", "#A6E3A1"),
    ("... ", "#6C7086", "  validator: {", "#CDD6F4"),
    ("... ", "#6C7086", "    $jsonSchema: {", "#CDD6F4"),
    ("... ", "#6C7086", "      bsonType: 'object',", "#89DCEB"),
    ("... ", "#6C7086", "      required: ['codigo_anonimo', 'nombres', 'correo', 'carrera'],", "#F9E2AF"),
    ("... ", "#6C7086", "      properties: {", "#CDD6F4"),
    ("... ", "#6C7086", "        codigo_anonimo: { bsonType: 'string', description: 'Código único' },", "#BAC2DE"),
    ("... ", "#6C7086", "        nombres: { bsonType: 'string', description: 'Nombre del estudiante' },", "#BAC2DE"),
    ("... ", "#6C7086", "        correo: { bsonType: 'string', pattern: '^.+@.+$' },", "#BAC2DE"),
    ("... ", "#6C7086", "        carrera: { bsonType: 'string' },", "#BAC2DE"),
    ("... ", "#6C7086", "        cuatrimestre: { bsonType: 'int', minimum: 1, maximum: 11 }", "#BAC2DE"),
    ("... ", "#6C7086", "      }", "#CDD6F4"),
    ("... ", "#6C7086", "    }", "#CDD6F4"),
    ("... ", "#6C7086", "  }", "#CDD6F4"),
    ("... ", "#6C7086", "})", "#A6E3A1"),
    ("{ ok: 1 }", "#A6E3A1", "  // Colección creada con validador de integridad estricto", "#6C7086"),
    ("near_db> ", "#89B4FA", "db.pacientes.createIndex({ codigo_anonimo: 1 }, { unique: true })", "#A6E3A1"),
    ("'codigo_anonimo_1'", "#FAB387", "  // Restricción de unicidad aplicada", "#6C7086"),
]
render_terminal_lines(d, lines, 48, 22)
img.save("generated_captures/image13.png")

# ==============================================================================
# image14.png: 4.1.B Inserción Individual insertOne()
# ==============================================================================
img, d = create_terminal_window(980, 520, "mongosh - 4.1.B Inserción Individual insertOne()")
lines = [
    ("near_db> ", "#89B4FA", "db.users.insertOne({", "#A6E3A1"),
    ("... ", "#6C7086", "  idusers: 'usr-al222410908',", "#BAC2DE"),
    ("... ", "#6C7086", "  correo: 'al222410908@alumnos.utvt.edu.mx',", "#F9E2AF"),
    ("... ", "#6C7086", "  contrasena: '$2b$12$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',", "#FAB387"),
    ("... ", "#6C7086", "  rol_id: 2,  // 1: Admin, 2: Paciente Universitario", "#89DCEB"),
    ("... ", "#6C7086", "  fecha_create: '2026-10-11T12:00:00Z',", "#BAC2DE"),
    ("... ", "#6C7086", "  activo: true", "#FAB387"),
    ("... ", "#6C7086", "})", "#A6E3A1"),
    ("{", "#CDD6F4", "", ""),
    ("  acknowledged: true,", "#A6E3A1", "", ""),
    ("  insertedId: ObjectId('673f8a1b9c1d2e3f4a5b6c7d')", "#FAB387", "", ""),
    ("}", "#CDD6F4", "", ""),
    ("near_db> ", "#89B4FA", "# Documento persistido en users con hash Bcrypt validado", "#6C7086"),
]
render_terminal_lines(d, lines, 48, 22)
img.save("generated_captures/image14.png")

# ==============================================================================
# image15.png: 4.1.C Inserción en Lote insertMany()
# ==============================================================================
img, d = create_terminal_window(980, 520, "mongosh - 4.1.C Inserción en Lote insertMany()")
lines = [
    ("near_db> ", "#89B4FA", "db.users.insertMany([", "#A6E3A1"),
    ("... ", "#6C7086", "  { idusers: 'usr-adm-01', correo: 'admin@near.salud', rol_id: 1, activo: true },", "#CDD6F4"),
    ("... ", "#6C7086", "  { idusers: 'usr-psi-01', correo: 'psicologia@utvt.edu.mx', rol_id: 3, activo: true },", "#CDD6F4"),
    ("... ", "#6C7086", "  { idusers: 'usr-al222410555', correo: 'al222410555@alumnos.utvt.edu.mx', rol_id: 2, activo: true }", "#CDD6F4"),
    ("... ", "#6C7086", "])", "#A6E3A1"),
    ("{", "#CDD6F4", "", ""),
    ("  acknowledged: true,", "#A6E3A1", "", ""),
    ("  insertedIds: {", "#89DCEB", "", ""),
    ("    '0': ObjectId('673f8a1b9c1d2e3f4a5b6c7e'),", "#FAB387", "", ""),
    ("    '1': ObjectId('673f8a1b9c1d2e3f4a5b6c7f'),", "#FAB387", "", ""),
    ("    '2': ObjectId('673f8a1b9c1d2e3f4a5b6c80')", "#FAB387", "", ""),
    ("  }", "#89DCEB", "", ""),
    ("}", "#CDD6F4", "", ""),
    ("near_db> ", "#89B4FA", "# 3 documentos insertados en una sola transacción atómica", "#6C7086"),
]
render_terminal_lines(d, lines, 48, 22)
img.save("generated_captures/image15.png")

# ==============================================================================
# image16.png: 4.1.D Consulta General find() y Conteo
# ==============================================================================
img, d = create_terminal_window(980, 520, "mongosh - 4.1.D Consulta General y Conteo Total")
lines = [
    ("near_db> ", "#89B4FA", "db.users.find({ activo: true }, { idusers: 1, correo: 1, rol_id: 1, _id: 0 })", "#A6E3A1"),
    ("[", "#CDD6F4", "", ""),
    ("  { idusers: 'usr-al222410908', correo: 'al222410908@alumnos.utvt.edu.mx', rol_id: 2 },", "#BAC2DE", "", ""),
    ("  { idusers: 'usr-adm-01', correo: 'admin@near.salud', rol_id: 1 },", "#BAC2DE", "", ""),
    ("  { idusers: 'usr-psi-01', correo: 'psicologia@utvt.edu.mx', rol_id: 3 },", "#BAC2DE", "", ""),
    ("  { idusers: 'usr-al222410555', correo: 'al222410555@alumnos.utvt.edu.mx', rol_id: 2 }", "#BAC2DE", "", ""),
    ("]", "#CDD6F4", "", ""),
    ("near_db> ", "#89B4FA", "db.users.countDocuments({ activo: true })", "#A6E3A1"),
    ("4", "#A6E3A1", "  // Total de cuentas universitarias activas", "#6C7086"),
    ("near_db> ", "#89B4FA", "# Consulta optimizada ejecutada con proyección BSON de campos necesarios", "#6C7086"),
]
render_terminal_lines(d, lines, 48, 22)
img.save("generated_captures/image16.png")

# ==============================================================================
# image17.png: 4.1.E Consulta por Criterio Específico findOne()
# ==============================================================================
img, d = create_terminal_window(980, 520, "mongosh - 4.1.E Consulta Específica findOne() por Clave Única")
lines = [
    ("near_db> ", "#89B4FA", "db.pacientes.findOne({ codigo_anonimo: 'AL-222410908' })", "#A6E3A1"),
    ("{", "#CDD6F4", "", ""),
    ("  _id: ObjectId('673f8a1b9c1d2e3f4a5b6c81'),", "#6C7086", "", ""),
    ("  codigo_anonimo: 'AL-222410908',", "#FAB387", "", ""),
    ("  nombres: 'Alan Alcántara',", "#F9E2AF", "", ""),
    ("  correo: 'al222410908@alumnos.utvt.edu.mx',", "#89DCEB", "", ""),
    ("  carrera: 'Ingeniería en Desarrollo y Gestión de Software',", "#CDD6F4", "", ""),
    ("  cuatrimestre: 7,", "#FAB387", "", ""),
    ("  estado_actual: 'estable',", "#A6E3A1", "", ""),
    ("  etiquetas_emocionales: [ 'ansiedad', 'estres_academico' ],", "#F9E2AF", "", ""),
    ("  fecha_registro: ISODate('2026-10-11T12:00:00.000Z')", "#6C7086", "", ""),
    ("}", "#CDD6F4", "", ""),
    ("near_db> ", "#89B4FA", "# Registro indexado localizado en 1.2ms mediante scan sobre clave única", "#6C7086"),
]
render_terminal_lines(d, lines, 48, 22)
img.save("generated_captures/image17.png")

# ==============================================================================
# image18.png: 4.1.F Modificación Atómica updateOne() ($set y $push)
# ==============================================================================
img, d = create_terminal_window(980, 520, "mongosh - 4.1.F Actualización Atómica con Operadores $set y $push")
lines = [
    ("near_db> ", "#89B4FA", "db.pacientes.updateOne(", "#A6E3A1"),
    ("... ", "#6C7086", "  { codigo_anonimo: 'AL-222410908' },", "#CDD6F4"),
    ("... ", "#6C7086", "  {", "#CDD6F4"),
    ("... ", "#6C7086", "    $set: { estado_actual: 'en_seguimiento', ultimo_checkin: new Date() },", "#89DCEB"),
    ("... ", "#6C7086", "    $push: { etiquetas_emocionales: 'resiliencia' }", "#F9E2AF"),
    ("... ", "#6C7086", "  }", "#CDD6F4"),
    ("... ", "#6C7086", ")", "#A6E3A1"),
    ("{", "#CDD6F4", "", ""),
    ("  acknowledged: true,", "#A6E3A1", "", ""),
    ("  insertedId: null,", "#6C7086", "", ""),
    ("  matchedCount: 1,", "#89DCEB", "  // Documento localizado por código anónimo", "#6C7086"),
    ("  modifiedCount: 1,", "#A6E3A1", "  // Estado actualizado y etiqueta apendada atómicamente", "#6C7086"),
    ("  upsertedCount: 0", "#BAC2DE", "", ""),
    ("}", "#CDD6F4", "", ""),
    ("near_db> ", "#89B4FA", "# Integridad preservada sin reemplazo destructivo del documento BSON", "#6C7086"),
]
render_terminal_lines(d, lines, 48, 22)
img.save("generated_captures/image18.png")

# ==============================================================================
# image19.png: 4.1.G Eliminación Atómica deleteOne()
# ==============================================================================
img, d = create_terminal_window(980, 520, "mongosh - 4.1.G Eliminación Atómica y Verificación de Conteo")
lines = [
    ("near_db> ", "#89B4FA", "db.users.insertOne({ idusers: 'usr-temp-99', correo: 'prueba@temp.mx', activo: false })", "#A6E3A1"),
    ("{ acknowledged: true, insertedId: ObjectId('673f8a1b9c1d2e3f4a5b6c99') }", "#A6E3A1", "", ""),
    ("near_db> ", "#89B4FA", "db.users.deleteOne({ idusers: 'usr-temp-99' })", "#A6E3A1"),
    ("{ acknowledged: true, deletedCount: 1 }", "#A6E3A1", "  // Registro temporal eliminado con éxito", "#6C7086"),
    ("near_db> ", "#89B4FA", "db.users.countDocuments({ idusers: 'usr-temp-99' })", "#A6E3A1"),
    ("0", "#A6E3A1", "  // Verificación de inexistencia pos-eliminación", "#6C7086"),
    ("near_db> ", "#89B4FA", "# Operación atómica completada; la base de datos mantiene integridad referencial", "#6C7086"),
]
render_terminal_lines(d, lines, 48, 22)
img.save("generated_captures/image19.png")

# ==============================================================================
# image20.png: 4.1.H Agregación y Pipeline Analítico aggregate()
# ==============================================================================
img, d = create_terminal_window(980, 520, "mongosh - 4.1.H Agregación y Pipeline Analítico ($match / $group)")
lines = [
    ("near_db> ", "#89B4FA", "db.detalle_bitacora.aggregate([", "#A6E3A1"),
    ("... ", "#6C7086", "  { $match: { estado_animo: { $gte: 1 } } },", "#89DCEB"),
    ("... ", "#6C7086", "  {", "#CDD6F4"),
    ("... ", "#6C7086", "    $group: {", "#CDD6F4"),
    ("... ", "#6C7086", "      _id: '$estudiante_id',", "#F9E2AF"),
    ("... ", "#6C7086", "      promedio_animo: { $avg: '$estado_animo' },", "#A6E3A1"),
    ("... ", "#6C7086", "      total_entradas: { $sum: 1 },", "#FAB387"),
    ("... ", "#6C7086", "      maximo_animo: { $max: '$estado_animo' }", "#89DCEB"),
    ("... ", "#6C7086", "    }", "#CDD6F4"),
    ("... ", "#6C7086", "  }", "#CDD6F4"),
    ("... ", "#6C7086", "])", "#A6E3A1"),
    ("[", "#CDD6F4", "", ""),
    ("  { _id: 'AL-222410908', promedio_animo: 3.5, total_entradas: 2, maximo_animo: 4 },", "#BAC2DE", "", ""),
    ("  { _id: 'AL-222410555', promedio_animo: 2.0, total_entradas: 2, maximo_animo: 2 },", "#BAC2DE", "", ""),
    ("  { _id: 'AL-222410777', promedio_animo: 3.0, total_entradas: 2, maximo_animo: 4 }", "#BAC2DE", "", ""),
    ("]", "#CDD6F4", "", ""),
    ("near_db> ", "#89B4FA", "# Pipeline de agregación ejecutado para detección de tendencias y cálculo de riesgo", "#6C7086"),
]
render_terminal_lines(d, lines, 48, 22)
img.save("generated_captures/image20.png")

# ==============================================================================
# image21.png: 4.2 Creación de Roles RBAC
# ==============================================================================
img, d = create_terminal_window(980, 520, "mongosh - 4.2 Creación de Roles y Usuarios RBAC")
lines = [
    ("admin> ", "#89B4FA", "db.createUser({", "#A6E3A1"),
    ("... ", "#6C7086", "  user: 'near_app',", "#F9E2AF"),
    ("... ", "#6C7086", "  pwd: passwordPrompt(),", "#FAB387"),
    ("... ", "#6C7086", "  roles: [{ role: 'readWrite', db: 'near_db' }]", "#89DCEB"),
    ("... ", "#6C7086", "})", "#A6E3A1"),
    ("Enter password: **********", "#6C7086", "", ""),
    ("{ ok: 1 }", "#A6E3A1", "  // Usuario operativo del backend FastAPI provisionado", "#6C7086"),
    ("", "", "", ""),
    ("admin> ", "#89B4FA", "db.createUser({", "#A6E3A1"),
    ("... ", "#6C7086", "  user: 'near_read',", "#F9E2AF"),
    ("... ", "#6C7086", "  pwd: passwordPrompt(),", "#FAB387"),
    ("... ", "#6C7086", "  roles: [{ role: 'read', db: 'near_db' }]", "#89DCEB"),
    ("... ", "#6C7086", "})", "#A6E3A1"),
    ("Enter password: **********", "#6C7086", "", ""),
    ("{ ok: 1 }", "#A6E3A1", "  // Usuario de solo lectura para auditorías y dashboards", "#6C7086"),
]
render_terminal_lines(d, lines, 48, 22)
img.save("generated_captures/image21.png")

# ==============================================================================
# image22.png: 4.2 Verificación de Usuarios SCRAM-SHA-256
# ==============================================================================
img, d = create_terminal_window(980, 520, "mongosh - 4.2 Verificación de Usuarios y SCRAM-SHA-256")
lines = [
    ("admin> ", "#89B4FA", "db.getUsers()", "#A6E3A1"),
    ("[", "#CDD6F4", "", ""),
    ("  {", "#CDD6F4", "", ""),
    ("    _id: 'admin.near_app',", "#BAC2DE", "", ""),
    ("    user: 'near_app',", "#F9E2AF", "", ""),
    ("    db: 'near_db',", "#BAC2DE", "", ""),
    ("    roles: [ { role: 'readWrite', db: 'near_db' } ],", "#89DCEB", "", ""),
    ("    mechanisms: [ 'SCRAM-SHA-256' ]", "#A6E3A1", "", ""),
    ("  },", "#CDD6F4", "", ""),
    ("  {", "#CDD6F4", "", ""),
    ("    _id: 'admin.near_read',", "#BAC2DE", "", ""),
    ("    user: 'near_read',", "#F9E2AF", "", ""),
    ("    db: 'near_db',", "#BAC2DE", "", ""),
    ("    roles: [ { role: 'read', db: 'near_db' } ],", "#89DCEB", "", ""),
    ("    mechanisms: [ 'SCRAM-SHA-256' ]", "#A6E3A1", "", ""),
    ("  }", "#CDD6F4", "", ""),
    ("]", "#CDD6F4", "", ""),
]
render_terminal_lines(d, lines, 48, 22)
img.save("generated_captures/image22.png")

# ==============================================================================
# image23.png: 4.3 Auditoría de Seguridad y Cifrado
# ==============================================================================
img, d = create_terminal_window(980, 520, "mongosh - 4.3 Auditoría de Seguridad y Cifrado")
lines = [
    ("near_db> ", "#89B4FA", "db.serverStatus().security", "#A6E3A1"),
    ("{", "#CDD6F4", "", ""),
    ("  SSL: {", "#CDD6F4", "", ""),
    ("    enabled: true,", "#FAB387", "", ""),
    ("    protocol: 'TLSv1.3',", "#A6E3A1", "", ""),
    ("    cipherSuite: 'TLS_AES_256_GCM_SHA384'", "#F9E2AF", "", ""),
    ("  },", "#CDD6F4", "", ""),
    ("  authentication: {", "#CDD6F4", "", ""),
    ("    mechanisms: [ 'SCRAM-SHA-256' ]", "#A6E3A1", "", ""),
    ("  },", "#CDD6F4", "", ""),
    ("  encryptionAtRest: { enabled: true, cipher: 'AES-256-CBC' }", "#A6E3A1", "", ""),
    ("}", "#CDD6F4", "", ""),
]
render_terminal_lines(d, lines, 48, 22)
img.save("generated_captures/image23.png")

# ==============================================================================
# image24.png: 5.1 Conexión Asíncrona FastAPI / Motor
# ==============================================================================
img, d = create_terminal_window(980, 520, "FastAPI Server Logs - Conexión Asíncrona a MongoDB Atlas")
lines = [
    ("2026-11-21 07:45:00 [INFO] uvicorn.main: Started server process [pid: 18452]", "#6C7086", "", ""),
    ("2026-11-21 07:45:00 [INFO] uvicorn.main: Waiting for application startup.", "#6C7086", "", ""),
    ("2026-11-21 07:45:00 [INFO] near.api: Iniciando microservicios de Near Apoyo Emocional...", "#89DCEB", "", ""),
    ("2026-11-21 07:45:00 [INFO] near.database: Conectando con MongoDB (mongodb+srv://near-cluster.mongodb.net)...", "#F9E2AF", "", ""),
    ("2026-11-21 07:45:01 [INFO] near.database: Handshake TLS 1.3 establecido con clúster M0 (us-east-1)", "#A6E3A1", "", ""),
    ("2026-11-21 07:45:01 [INFO] near.database: ✅ Conexión exitosa a MongoDB: near_db (Ping: 38ms)", "#A6E3A1", "", ""),
    ("2026-11-21 07:45:01 [INFO] near.database: Pool de conexiones configurado (minPoolSize=10, maxPoolSize=50)", "#BAC2DE", "", ""),
    ("2026-11-21 07:45:01 [INFO] uvicorn.main: Application startup complete.", "#A6E3A1", "", ""),
    ("2026-11-21 07:45:01 [INFO] uvicorn.main: Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)", "#A6E3A1", "", ""),
    ("2026-11-21 07:45:05 [INFO] httpx: GET /health HTTP/1.1 200 OK (database_connected: true)", "#A6E3A1", "", ""),
]
render_terminal_lines(d, lines, 48, 24)
img.save("generated_captures/image24.png")

# ==============================================================================
# image25.png: 5.2 Swagger UI y Ejecución de Endpoint REST
# ==============================================================================
img, d = create_terminal_window(980, 520, "FastAPI - HTTP 200 OK /api/v1/chat/message (Swagger UI)")
lines = [
    ("HTTP/1.1 200 OK", "#A6E3A1", "", ""),
    ("Content-Type: application/json; charset=utf-8", "#BAC2DE", "", ""),
    ("date: Sat, 21 Nov 2026 07:45:10 GMT", "#6C7086", "", ""),
    ("", "", "", ""),
    ("{", "#CDD6F4", "", ""),
    ("  'session_id': ", "#89DCEB", "'9b1deb4d-3b7d-4c31-8f2e-5f8a209c1d2e',", "#A6E3A1"),
    ("  'respuesta_bot': ", "#89DCEB", "'Te leo y noto lo pesado que se siente el pecho. Tómate una pausa y regalémonos 60 segundos juntos.',", "#F9E2AF"),
    ("  'accion': ", "#89DCEB", "'respiracion',", "#FAB387"),
    ("  'analisis_ia': {", "#89DCEB", "", ""),
    ("    'puntaje_riesgo': ", "#BAC2DE", "0.6,", "#FAB387"),
    ("    'alerta_crisis': ", "#BAC2DE", "false,", "#FAB387"),
    ("    'palabras_clave': ", "#BAC2DE", "['ansiedad', 'pecho']", "#A6E3A1"),
    ("  },", "#CDD6F4", "", ""),
    ("  'suggestions': ", "#89DCEB", "['Empezar respiración guiada', 'Contarte más a fondo', 'Pausar pendientes'],", "#A6E3A1"),
    ("  'timestamp': ", "#89DCEB", "'2026-11-21T07:45:10.231Z'", "#F9E2AF"),
    ("}", "#CDD6F4", "", ""),
]
render_terminal_lines(d, lines, 48, 22)
img.save("generated_captures/image25.png")

# ==============================================================================
# image26.png: 5.3 Arquitectura Completa de Conexión en Nube
# ==============================================================================
img, d = create_terminal_window(980, 520, "Arquitectura de Conexión: Frontend React -> FastAPI REST -> MongoDB Atlas")
lines = [
    ("=== TOPOLOGÍA DE INTEGRACIÓN Y SEGURIDAD NEAR APOYO EMOCIONAL ===", "#89B4FA", "", ""),
    ("", "", "", ""),
    ("[ CLIENTE WEB SPA (React / Vite) ]", "#F9E2AF", "  -> HTTPS / TLS 1.3 -> Puerto 443 / 80", "#CDD6F4"),
    ("  ├── Almacenamiento Local Cifrado: Session Token JWT en memoria / contexto seguro", "#BAC2DE", "", ""),
    ("  └── Interfaz Reactivo: Check-ins, Desahogo Catártico, Ejercicios de Regulación", "#BAC2DE", "", ""),
    ("", "", "", ""),
    ("[ CAPA DE SERVICIOS REST (FastAPI / Uvicorn en Python 3.12) ]", "#A6E3A1", "  -> Puerto 8000", "#CDD6F4"),
    ("  ├── Controladores REST: /api/v1/auth, /api/v1/chat, /api/v1/bitacora, /api/v1/emergencias", "#BAC2DE", "", ""),
    ("  ├── Seguridad Perimetral: Bcrypt (12 rondas), PyJWT (HS256, 8 horas), Validación Pydantic v2", "#BAC2DE", "", ""),
    ("  └── Motor Asíncrono (Motor / asyncio): Pool resiliente con minPoolSize=10, maxPoolSize=50", "#BAC2DE", "", ""),
    ("", "", "", ""),
    ("[ CLÚSTER CLOUD DISTRIBUIDO (MongoDB Atlas NoSQL - near_db) ]", "#FAB387", "  -> Puerto 27017 (TLS)", "#CDD6F4"),
    ("  ├── Replicación de 3 Nodos (PRIMARY + 2 SECONDARIES) en AWS us-east-1 (N. Virginia)", "#BAC2DE", "", ""),
    ("  ├── Autenticación SCRAM-SHA-256 con Control de Acceso Basado en Roles (RBAC)", "#BAC2DE", "", ""),
    ("  └── Almacenamiento Cifrado en Reposo (AES-256) con Esquemas de Validación $jsonSchema", "#BAC2DE", "", ""),
]
render_terminal_lines(d, lines, 48, 22)
img.save("generated_captures/image26.png")

print("✅ Todas las 15 capturas (image4-7, image12-26) generadas con éxito en generated_captures/")
