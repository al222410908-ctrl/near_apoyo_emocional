import docx

target_path = r"c:\Users\Alan Alcantara\OneDrive\Escritorio\near_apoyo_emocional\DOCUMENTO_TECNICO_BD_NEAR_ACTUALIZADO.docx"
source_path = r"C:/Users/Alan Alcantara/.gemini/antigravity/brain/4a67492b-ec0e-4c0d-8d0c-4232c4447746/.user_uploaded/media_1795106372091_9f165097.docx"

doc = docx.Document(target_path)

replacements = [
    ("PRAGMA optimize; y VACUUM;", "compactación de colecciones (db.runCommand({compact: 'mensajes'})) y mantenimiento de índices WiredTiger"),
    ("MongoDB Atlas / SQLite Cloud", "MongoDB Atlas Cloud con cifrado de disco nativo AES-256"),
    ("FastAPI combinado con SQLite Cloud", "FastAPI (asíncrono) combinado con MongoDB Atlas M0 (Free Tier)"),
    ("4. Capa de Persistencia (SQLite Cloud)", "4. Capa de Persistencia (MongoDB Atlas NoSQL near_db)"),
    ("SQLite Cloud", "MongoDB Atlas Cloud"),
    ("sqlite3 nearbd.db", "mongosh near_db"),
]

updated_paras = 0
for p in doc.paragraphs:
    orig = p.text
    new_val = orig
    for old_s, new_s in replacements:
        if old_s in new_val:
            new_val = new_val.replace(old_s, new_s)
    if new_val != orig:
        p.text = new_val
        updated_paras += 1

updated_cells = 0
for table in doc.tables:
    for row in table.rows:
        for cell in row.cells:
            orig = cell.text
            new_val = orig
            for old_s, new_s in replacements:
                if old_s in new_val:
                    new_val = new_val.replace(old_s, new_s)
            if new_val != orig:
                cell.text = new_val
                updated_cells += 1

print(f"Párrafos ajustados extra: {updated_paras}")
print(f"Celdas ajustadas extra: {updated_cells}")

doc.save(target_path)
try:
    doc.save(source_path)
except Exception:
    pass
print("✅ Documento guardado.")
