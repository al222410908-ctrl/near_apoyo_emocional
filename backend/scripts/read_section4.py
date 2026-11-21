import docx

doc = docx.Document(r'c:\Users\Alan Alcantara\OneDrive\Escritorio\near_apoyo_emocional\DOCUMENTO_TECNICO_BD_NEAR_ACTUALIZADO.docx')
start = False
for idx, p in enumerate(doc.paragraphs):
    if '4.0 Estructura de almacenamiento' in p.text:
        start = True
    if '4.2 Métodos o sintaxis' in p.text:
        start = False
    if start and p.text.strip():
        print(f'P[{idx}]: {p.text}')
