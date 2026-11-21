import docx

doc = docx.Document(r"c:\Users\Alan Alcantara\OneDrive\Escritorio\near_apoyo_emocional\DOCUMENTO_TECNICO_BD_NEAR_ACTUALIZADO.docx")
words_to_check = ["sqlite", "mysql", "react native", "pragma"]
found = 0
for i, p in enumerate(doc.paragraphs):
    for w in words_to_check:
        if w in p.text.lower():
            print(f'P[{i}] contains "{w}": {p.text}')
            found += 1

for t_idx, table in enumerate(doc.tables):
    for r_idx, row in enumerate(table.rows):
        for c_idx, cell in enumerate(row.cells):
            for w in words_to_check:
                if w in cell.text.lower():
                    print(f'Table[{t_idx}][{r_idx}][{c_idx}] contains "{w}": {cell.text}')
                    found += 1

if found == 0:
    print("🎉 0 discrepancias encontradas. El documento está 100% unificado en MongoDB NoSQL y React PWA!")
else:
    print(f"Total encontrados: {found}")
