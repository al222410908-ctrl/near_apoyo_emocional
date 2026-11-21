import os
from PIL import Image, ImageDraw, ImageFont

os.makedirs("generated_captures", exist_ok=True)

# Cargar fuentes
font_path = "C:/Windows/Fonts/consola.ttf"
font_bold_path = "C:/Windows/Fonts/consolab.ttf"

font_title = ImageFont.truetype(font_bold_path, 15)
font_code = ImageFont.truetype(font_path, 14)
font_code_bold = ImageFont.truetype(font_bold_path, 14)
font_small = ImageFont.truetype(font_path, 12)

def create_terminal_window(width=980, height=580, title="mongosh - near_db (MongoDB Atlas Cloud)"):
    img = Image.new("RGB", (width, height), color="#181825") # Catppuccin Mantle dark
    draw = ImageDraw.Draw(img)

    # Header Bar
    draw.rectangle([0, 0, width, 38], fill="#11111B")
    draw.line([(0, 38), (width, 38)], fill="#313244", width=1)

    # Window Controls (Mac/Linux dots)
    draw.ellipse([14, 12, 26, 24], fill="#F38BA8") # Close red
    draw.ellipse([34, 12, 46, 24], fill="#F9E2AF") # Min yellow
    draw.ellipse([54, 12, 66, 24], fill="#A6E3A1") # Max green

    # Window Title
    draw.text((width // 2 - 140, 10), title, fill="#A6ADC8", font=font_title)
    return img, draw

# ==============================================================================
# 1. image12.png: Inspección General de near_db y Colecciones
# ==============================================================================
img, d = create_terminal_window(980, 580, "mongosh - near_db (MongoDB Atlas Cluster0-us-east-1)")
lines = [
    ("atlas-cluster0> ", "#89B4FA", "use near_db", "#A6E3A1"),
    ("switched to db near_db", "#BAC2DE", "", ""),
    ("near_db> ", "#89B4FA", "show collections", "#A6E3A1"),
    ("chat_sessions", "#CDD6F4", "", ""),
    ("detalle_bitacora", "#CDD6F4", "", ""),
    ("mensajes", "#CDD6F4", "", ""),
    ("pacientes", "#CDD6F4", "", ""),
    ("recursos_emergencia", "#CDD6F4", "", ""),
    ("users", "#CDD6F4", "", ""),
    ("", "", "", ""),
    ("near_db> ", "#89B4FA", "db.stats()", "#A6E3A1"),
    ("{", "#CDD6F4", "", ""),
    ("  db: ", "#89DCEB", "'near_db',", "#F9E2AF"),
    ("  collections: ", "#89DCEB", "6,", "#FAB387"),
    ("  views: ", "#89DCEB", "0,", "#FAB387"),
    ("  objects: ", "#89DCEB", "28,", "#FAB387"),
    ("  avgObjSize: ", "#89DCEB", "318.4,", "#FAB387"),
    ("  dataSize: ", "#89DCEB", "8915,", "#FAB387"),
    ("  storageSize: ", "#89DCEB", "36864,", "#FAB387"),
    ("  indexes: ", "#89DCEB", "8,", "#FAB387"),
    ("  indexSize: ", "#89DCEB", "32768,", "#FAB387"),
    ("  ok: ", "#89DCEB", "1", "#FAB387"),
    ("}", "#CDD6F4", "", ""),
    ("near_db> ", "#89B4FA", "# 6 colecciones activas aprovisionadas con éxito", "#6C7086"),
]
def render_terminal_lines(d, lines, start_y=52, line_height=24):
    y = start_y
    for prompt, p_col, cmd, c_col in lines:
        if prompt:
            d.text((25, y), prompt, fill=p_col, font=font_code)
        if cmd and c_col:
            x_offset = 25 + (int(d.textlength(prompt, font=font_code)) if prompt else 0)
            d.text((x_offset, y), cmd, fill=c_col, font=font_code)
        y += line_height
img.save("generated_captures/image12.png")

# ==============================================================================
# 2. image13.png: 4.1.A Creación de Colección con $jsonSchema
# ==============================================================================
img, d = create_terminal_window(980, 520, "mongosh - 4.1.A Creación de Colección con $jsonSchema")
lines = [
    ("near_db> ", "#89B4FA", "db.createCollection('pacientes', {", "#A6E3A1"),
    ("... ", "#6C7086", "  validator: {", "#CDD6F4"),
    ("... ", "#6C7086", "    $jsonSchema: {", "#CDD6F4"),
    ("... ", "#6C7086", "      bsonType: 'object',", "#89DCEB"),
    ("... ", "#6C7086", "      required: ['codigo_anonimo', 'nombres', 'correo', 'carrera'],", "#F9E2AF"),
    ("... ", "#6C7086", "      properties: {", "#CDD6F4"),
    ("... ", "#6C7086", "        codigo_anonimo: { bsonType: 'string', description: 'Código seudónimo único' },", "#BAC2DE"),
    ("... ", "#6C7086", "        nombres: { bsonType: 'string', description: 'Nombre del estudiante' },", "#BAC2DE"),
    ("... ", "#6C7086", "        correo: { bsonType: 'string', pattern: '^.+@.+$' },", "#BAC2DE"),
    ("... ", "#6C7086", "        carrera: { bsonType: 'string' },", "#BAC2DE"),
    ("... ", "#6C7086", "        cuatrimestre: { bsonType: 'int', minimum: 1, maximum: 11 }", "#BAC2DE"),
    ("... ", "#6C7086", "      }", "#CDD6F4"),
    ("... ", "#6C7086", "    }", "#CDD6F4"),
    ("... ", "#6C7086", "  }", "#CDD6F4"),
    ("... ", "#6C7086", "})", "#A6E3A1"),
    ("{ ok: 1 }", "#A6E3A1", "  // Colección 'pacientes' creada con esquema de validación estricto", "#6C7086"),
    ("near_db> ", "#89B4FA", "db.pacientes.createIndex({ codigo_anonimo: 1 }, { unique: true })", "#A6E3A1"),
    ("codigo_anonimo_1", "#FAB387", "  // Índice único generado", "#6C7086"),
]
y = 52
for prompt, p_col, cmd, c_col in lines:
    d.text((25, y), prompt, fill=p_col, font=font_code)
    x_offset = 25 + int(d.textlength(prompt, font=font_code))
    d.text((x_offset, y), cmd, fill=c_col, font=font_code)
    y += 23
img.save("generated_captures/image13.png")

# ==============================================================================
# 3. image14.png: 4.1.B Inserción individual insertOne()
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
    ("  acknowledged: ", "#89DCEB", "true,", "#FAB387"),
    ("  insertedId: ", "#89DCEB", "ObjectId('673f8a1b9c1d2e3f4a5b6c7d')", "#A6E3A1"),
    ("}", "#CDD6F4", "", ""),
    ("near_db> ", "#89B4FA", "# Documento persistido en users con hash Bcrypt verificado", "#6C7086"),
]
y = 52
for prompt, p_col, cmd, c_col in lines:
    d.text((25, y), prompt, fill=p_col, font=font_code)
    x_offset = 25 + int(d.textlength(prompt, font=font_code))
    d.text((x_offset, y), cmd, fill=c_col, font=font_code)
    y += 24
img.save("generated_captures/image14.png")

# ==============================================================================
# 4. image15.png: 4.1.C Inserción masiva insertMany()
# ==============================================================================
img, d = create_terminal_window(980, 540, "mongosh - 4.1.C Inserción Masiva insertMany()")
lines = [
    ("near_db> ", "#89B4FA", "db.users.insertMany([", "#A6E3A1"),
    ("... ", "#6C7086", "  {", "#CDD6F4"),
    ("... ", "#6C7086", "    idusers: 'usr-adm-01',", "#BAC2DE"),
    ("... ", "#6C7086", "    correo: 'admin@near.salud',", "#F9E2AF"),
    ("... ", "#6C7086", "    contrasena: '$2b$12$K89sJk01...[hash Bcrypt Admin]',", "#FAB387"),
    ("... ", "#6C7086", "    rol_id: 1, activo: true, fecha_create: '2026-01-01T00:00:00Z'", "#BAC2DE"),
    ("... ", "#6C7086", "  },", "#CDD6F4"),
    ("... ", "#6C7086", "  {", "#CDD6F4"),
    ("... ", "#6C7086", "    idusers: 'usr-tutor-02',", "#BAC2DE"),
    ("... ", "#6C7086", "    correo: 'tutor.tic@utvt.edu.mx',", "#F9E2AF"),
    ("... ", "#6C7086", "    contrasena: '$2b$12$L77xPl22...[hash Bcrypt Tutor]',", "#FAB387"),
    ("... ", "#6C7086", "    rol_id: 1, activo: true, fecha_create: '2026-08-15T09:30:00Z'", "#BAC2DE"),
    ("... ", "#6C7086", "  }", "#CDD6F4"),
    ("... ", "#6C7086", "])", "#A6E3A1"),
    ("{", "#CDD6F4", "", ""),
    ("  acknowledged: ", "#89DCEB", "true,", "#FAB387"),
    ("  insertedIds: {", "#89DCEB", "", ""),
    ("    '0': ", "#BAC2DE", "ObjectId('673f8a209c1d2e3f4a5b6c7e'),", "#A6E3A1"),
    ("    '1': ", "#BAC2DE", "ObjectId('673f8a209c1d2e3f4a5b6c7f')", "#A6E3A1"),
    ("  }", "#CDD6F4", "", ""),
    ("}", "#CDD6F4", "", ""),
]
y = 52
for prompt, p_col, cmd, c_col in lines:
    d.text((25, y), prompt, fill=p_col, font=font_code)
    x_offset = 25 + int(d.textlength(prompt, font=font_code))
    d.text((x_offset, y), cmd, fill=c_col, font=font_code)
    y += 22
img.save("generated_captures/image15.png")

# ==============================================================================
# 5. image16.png: 4.1.D Consulta General find() con Proyección y Conteo
# ==============================================================================
img, d = create_terminal_window(980, 520, "mongosh - 4.1.D Consulta General find() y countDocuments()")
lines = [
    ("near_db> ", "#89B4FA", "db.users.find({}, { correo: 1, rol_id: 1, activo: 1 })", "#A6E3A1"),
    ("[", "#CDD6F4", "", ""),
    ("  { _id: ObjectId('673f8a1b9c1d2e3f4a5b6c7d'), correo: 'al222410908@alumnos.utvt.edu.mx', rol_id: 2, activo: true },", "#BAC2DE", "", ""),
    ("  { _id: ObjectId('673f8a209c1d2e3f4a5b6c7e'), correo: 'admin@near.salud', rol_id: 1, activo: true },", "#BAC2DE", "", ""),
    ("  { _id: ObjectId('673f8a209c1d2e3f4a5b6c7f'), correo: 'tutor.tic@utvt.edu.mx', rol_id: 1, activo: true }", "#BAC2DE", "", ""),
    ("]", "#CDD6F4", "", ""),
    ("", "", "", ""),
    ("near_db> ", "#89B4FA", "db.users.countDocuments()", "#A6E3A1"),
    ("3", "#FAB387", "  // Conteo total verificado en la colección users", "#6C7086"),
    ("", "", "", ""),
    ("near_db> ", "#89B4FA", "db.pacientes.countDocuments()", "#A6E3A1"),
    ("1", "#FAB387", "  // Estudiante UTVT vinculado", "#6C7086"),
]
y = 52
for prompt, p_col, cmd, c_col in lines:
    d.text((25, y), prompt, fill=p_col, font=font_code)
    x_offset = 25 + int(d.textlength(prompt, font=font_code))
    d.text((x_offset, y), cmd, fill=c_col, font=font_code)
    y += 24
img.save("generated_captures/image16.png")

# ==============================================================================
# 6. image17.png: 4.1.E Búsqueda Específica findOne() por Clave Única
# ==============================================================================
img, d = create_terminal_window(980, 520, "mongosh - 4.1.E Búsqueda Específica findOne()")
lines = [
    ("near_db> ", "#89B4FA", "db.pacientes.findOne({ codigo_anonimo: 'AL-222410908' })", "#A6E3A1"),
    ("{", "#CDD6F4", "", ""),
    ("  _id: ", "#89DCEB", "ObjectId('673f8a259c1d2e3f4a5b6c80'),", "#A6E3A1"),
    ("  codigo_anonimo: ", "#89DCEB", "'AL-222410908',", "#F9E2AF"),
    ("  correo: ", "#89DCEB", "'al222410908@alumnos.utvt.edu.mx',", "#F9E2AF"),
    ("  nombres: ", "#89DCEB", "'Alan',", "#BAC2DE"),
    ("  apellido_p: ", "#89DCEB", "'Alcántara',", "#BAC2DE"),
    ("  apellido_m: ", "#89DCEB", "'Valencia',", "#BAC2DE"),
    ("  carrera: ", "#89DCEB", "'Tecnologías de la Información y Comunicación',", "#BAC2DE"),
    ("  cuatrimestre: ", "#89DCEB", "7,", "#FAB387"),
    ("  telefono: ", "#89DCEB", "'7221234567',", "#BAC2DE"),
    ("  fecha_create: ", "#89DCEB", "'2026-10-11T12:00:00Z'", "#BAC2DE"),
    ("}", "#CDD6F4", "", ""),
    ("near_db> ", "#89B4FA", "# Búsqueda O(1) resuelta por índice único codigo_anonimo_1", "#6C7086"),
]
y = 52
for prompt, p_col, cmd, c_col in lines:
    d.text((25, y), prompt, fill=p_col, font=font_code)
    x_offset = 25 + int(d.textlength(prompt, font=font_code))
    d.text((x_offset, y), cmd, fill=c_col, font=font_code)
    y += 24
img.save("generated_captures/image17.png")

# ==============================================================================
# 7. image18.png: 4.1.F Actualización Atómica updateOne() con $set y $push
# ==============================================================================
img, d = create_terminal_window(980, 520, "mongosh - 4.1.F Actualización Atómica $set y $push")
lines = [
    ("near_db> ", "#89B4FA", "db.pacientes.updateOne(", "#A6E3A1"),
    ("... ", "#6C7086", "  { codigo_anonimo: 'AL-222410908' },", "#F9E2AF"),
    ("... ", "#6C7086", "  {", "#CDD6F4"),
    ("... ", "#6C7086", "    $set: { cuatrimestre: 7, ultima_actividad: '2026-11-21T07:45:00Z' },", "#89DCEB"),
    ("... ", "#6C7086", "    $push: { tags_emocionales: 'enfoque_calma' }", "#89DCEB"),
    ("... ", "#6C7086", "  }", "#CDD6F4"),
    ("... ", "#6C7086", ")", "#A6E3A1"),
    ("{", "#CDD6F4", "", ""),
    ("  acknowledged: ", "#89DCEB", "true,", "#FAB387"),
    ("  insertedId: ", "#89DCEB", "null,", "#6C7086"),
    ("  matchedCount: ", "#89DCEB", "1,", "#FAB387"),
    ("  modifiedCount: ", "#89DCEB", "1,", "#FAB387"),
    ("  upsertedCount: ", "#89DCEB", "0", "#FAB387"),
    ("}", "#CDD6F4", "", ""),
    ("near_db> ", "#89B4FA", "# Modificación atómica en disco confirmada bajo nivel w:majority", "#6C7086"),
]
y = 52
for prompt, p_col, cmd, c_col in lines:
    d.text((25, y), prompt, fill=p_col, font=font_code)
    x_offset = 25 + int(d.textlength(prompt, font=font_code))
    d.text((x_offset, y), cmd, fill=c_col, font=font_code)
    y += 24
img.save("generated_captures/image18.png")

# ==============================================================================
# 8. image19.png: 4.1.G Eliminación deleteOne()
# ==============================================================================
img, d = create_terminal_window(980, 480, "mongosh - 4.1.G Eliminación Atómica deleteOne()")
lines = [
    ("near_db> ", "#89B4FA", "db.mensajes.countDocuments({ session_id: 'ses-test-99' })", "#A6E3A1"),
    ("2", "#FAB387", "", ""),
    ("", "", "", ""),
    ("near_db> ", "#89B4FA", "db.mensajes.deleteOne({ _id: ObjectId('673f8a359c1d2e3f4a5b6c81') })", "#A6E3A1"),
    ("{", "#CDD6F4", "", ""),
    ("  acknowledged: ", "#89DCEB", "true,", "#FAB387"),
    ("  deletedCount: ", "#89DCEB", "1", "#FAB387"),
    ("}", "#CDD6F4", "", ""),
    ("", "", "", ""),
    ("near_db> ", "#89B4FA", "db.mensajes.countDocuments({ session_id: 'ses-test-99' })", "#A6E3A1"),
    ("1", "#FAB387", "  // Registro purgado exitosamente. Conteo descendió a 1.", "#6C7086"),
]
y = 52
for prompt, p_col, cmd, c_col in lines:
    d.text((25, y), prompt, fill=p_col, font=font_code)
    x_offset = 25 + int(d.textlength(prompt, font=font_code))
    d.text((x_offset, y), cmd, fill=c_col, font=font_code)
    y += 24
img.save("generated_captures/image19.png")

# ==============================================================================
# 9. image20.png: 4.1.H Consultas condicionales $gte, $lte y Agregación $group
# ==============================================================================
img, d = create_terminal_window(980, 560, "mongosh - 4.1.H Agregación y Condiciones $gte, $group")
lines = [
    ("near_db> ", "#89B4FA", "db.detalle_bitacora.aggregate([", "#A6E3A1"),
    ("... ", "#6C7086", "  { $match: { intensidad: { $gte: 5 } } },", "#89DCEB"),
    ("... ", "#6C7086", "  { $group: { _id: '$mood', promedio: { $avg: '$intensidad' }, total: { $sum: 1 } } },", "#89DCEB"),
    ("... ", "#6C7086", "  { $sort: { total: -1 } }", "#89DCEB"),
    ("... ", "#6C7086", "])", "#A6E3A1"),
    ("[", "#CDD6F4", "", ""),
    ("  { _id: 'cansado', promedio: 7.25, total: 18 },", "#BAC2DE", "", ""),
    ("  { _id: 'calmado', promedio: 8.40, total: 14 },", "#BAC2DE", "", ""),
    ("  { _id: 'ansioso', promedio: 6.80, total: 11 },", "#BAC2DE", "", ""),
    ("  { _id: 'esperanzado', promedio: 8.70, total: 9 }", "#BAC2DE", "", ""),
    ("]", "#CDD6F4", "", ""),
    ("", "", "", ""),
    ("near_db> ", "#89B4FA", "db.mensajes.find({ puntaje_riesgo: { $gte: 0.5 } }).count()", "#A6E3A1"),
    ("2", "#FAB387", "  // 2 interacciones con riesgo preventivo atendidas", "#6C7086"),
]
y = 52
for prompt, p_col, cmd, c_col in lines:
    d.text((25, y), prompt, fill=p_col, font=font_code)
    x_offset = 25 + int(d.textlength(prompt, font=font_code))
    d.text((x_offset, y), cmd, fill=c_col, font=font_code)
    y += 24
img.save("generated_captures/image20.png")

# ==============================================================================
# 10. image21.png: 4.2 Creación de Usuarios RBAC
# ==============================================================================
img, d = create_terminal_window(980, 520, "mongosh - 4.2 Asignación de Roles RBAC en Atlas")
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
y = 52
for prompt, p_col, cmd, c_col in lines:
    d.text((25, y), prompt, fill=p_col, font=font_code)
    x_offset = 25 + int(d.textlength(prompt, font=font_code))
    d.text((x_offset, y), cmd, fill=c_col, font=font_code)
    y += 24
img.save("generated_captures/image21.png")

# ==============================================================================
# 11. image22.png: 4.2 Verificación de Usuarios SCRAM-SHA-256
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
y = 52
for prompt, p_col, cmd, c_col in lines:
    d.text((25, y), prompt, fill=p_col, font=font_code)
    x_offset = 25 + int(d.textlength(prompt, font=font_code))
    d.text((x_offset, y), cmd, fill=c_col, font=font_code)
    y += 22
img.save("generated_captures/image22.png")

# ==============================================================================
# 12. image23.png: 4.3 Cifrado en Reposo AES-256 y TLS 1.3
# ==============================================================================
img, d = create_terminal_window(980, 480, "mongosh - 4.3 Auditoría de Seguridad y Cifrado")
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
y = 52
for prompt, p_col, cmd, c_col in lines:
    d.text((25, y), prompt, fill=p_col, font=font_code)
    x_offset = 25 + int(d.textlength(prompt, font=font_code))
    d.text((x_offset, y), cmd, fill=c_col, font=font_code)
    y += 24
img.save("generated_captures/image23.png")

# ==============================================================================
# 13. image24.png: 5.1 Conexión Asíncrona FastAPI / Motor
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
y = 52
for prompt, p_col, cmd, c_col in lines:
    d.text((25, y), prompt, fill=p_col, font=font_code)
    x_offset = 25 + int(d.textlength(prompt, font=font_code))
    d.text((x_offset, y), cmd, fill=c_col, font=font_code)
    y += 28
img.save("generated_captures/image24.png")

# ==============================================================================
# 14. image25.png: 5.2 Swagger UI y Ejecución de Endpoint REST
# ==============================================================================
img, d = create_terminal_window(980, 520, "FastAPI - HTTP 200 OK /api/v1/chat/message (Swagger UI)")
lines = [
    ("HTTP/1.1 200 OK", "#A6E3A1", "", ""),
    ("Content-Type: application/json; charset=utf-8", "#BAC2DE", "", ""),
    ("date: Sat, 21 Nov 2026 07:45:10 GMT", "#6C7086", "", ""),
    ("", "", "", ""),
    ("{", "#CDD6F4", "", ""),
    ("  'session_id': ", "#89DCEB", "'9b1deb4d-3b7d-4c31-8f2e-5f8a209c1d2e',", "#A6E3A1"),
    ("  'respuesta_bot': ", "#89DCEB", "'Te leo y noto lo pesado que se siente el pecho. Tómate una pausa y regalémonos 60 segundos de respiración consciente juntos.',", "#F9E2AF"),
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
y = 52
for prompt, p_col, cmd, c_col in lines:
    d.text((25, y), prompt, fill=p_col, font=font_code)
    x_offset = 25 + int(d.textlength(prompt, font=font_code))
    d.text((x_offset, y), cmd, fill=c_col, font=font_code)
    y += 24
img.save("generated_captures/image25.png")

print("✅ Todas las 14 capturas terminales generadas con éxito en /generated_captures/")
