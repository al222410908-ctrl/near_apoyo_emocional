import os
import re
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import qn, nsdecls

DOCX_PATH = "DOCUMENTO_TECNICO_BD_NEAR_ACTUALIZADO.docx"

doc = docx.Document(DOCX_PATH)

# ==============================================================================
# COLORES CORPORATIVOS Y ESTILOS
# ==============================================================================
COLOR_NAVY_PRIMARY = RGBColor(0x1F, 0x49, 0x7D)   # #1F497D Azul Marino Institucional
COLOR_NAVY_SECONDARY = RGBColor(0x2E, 0x5B, 0x88) # #2E5B88 Azul Pizarra
COLOR_TEXT_MAIN = RGBColor(0x26, 0x26, 0x26)      # #262626 Gris Carbón Lectura
COLOR_TEXT_MUTED = RGBColor(0x59, 0x59, 0x59)     # #595959 Gris Medio Subtítulos
COLOR_WHITE = RGBColor(0xFF, 0xFF, 0xFF)          # #FFFFFF Blanco
HEX_NAVY_PRIMARY = "1F497D"
HEX_ROW_EVEN = "FFFFFF"
HEX_ROW_ODD = "F4F7FA"                            # Azul Grisáceo Muy Suave (Zebra)
HEX_BORDER_MAIN = "1F497D"
HEX_BORDER_DIVIDER = "E2E8F0"

# ==============================================================================
# FUNCIONES AUXILIARES DE TIPOGRAFÍA Y TABLAS
# ==============================================================================
def set_run_font_arial(run, size_pt=None, bold=None, italic=None, color_rgb=None):
    run.font.name = "Arial"
    rPr = run._r.get_or_add_rPr()
    rFonts = rPr.find(qn('w:rFonts'))
    if rFonts is None:
        rFonts = OxmlElement('w:rFonts')
        rPr.insert(0, rFonts)
    rFonts.set(qn('w:ascii'), 'Arial')
    rFonts.set(qn('w:hAnsi'), 'Arial')
    rFonts.set(qn('w:cs'), 'Arial')
    rFonts.set(qn('w:eastAsia'), 'Arial')

    if size_pt is not None:
        run.font.size = Pt(size_pt)
    if bold is not None:
        run.font.bold = bold
    if italic is not None:
        run.font.italic = italic
    if color_rgb is not None:
        run.font.color.rgb = color_rgb

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    # Limpiar shd previo si existe
    old_shd = tcPr.find(qn('w:shd'))
    if old_shd is not None:
        tcPr.remove(old_shd)
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=90, bottom=90, left=110, right=110):
    tcPr = cell._tc.get_or_add_tcPr()
    old_mar = tcPr.find(qn('w:tcMar'))
    if old_mar is not None:
        tcPr.remove(old_mar)
    tcMar = parse_xml(
        f'<w:tcMar {nsdecls("w")}>'
        f'<w:top w:w="{top}" w:type="dxa"/>'
        f'<w:bottom w:w="{bottom}" w:type="dxa"/>'
        f'<w:left w:w="{left}" w:type="dxa"/>'
        f'<w:right w:w="{right}" w:type="dxa"/>'
        f'</w:tcMar>'
    )
    tcPr.append(tcMar)

def apply_unified_table_style(table):
    # Centrar la tabla en la página
    table.alignment = WD_TABLE_ALIGNMENT.CENTER

    # Configurar bordes modernos ejecutivos (sin líneas verticales pesadas)
    tblPr = table._tbl.tblPr
    old_borders = tblPr.find(qn('w:tblBorders'))
    if old_borders is not None:
        tblPr.remove(old_borders)
    borders = parse_xml(
        f'<w:tblBorders {nsdecls("w")}>'
        f'<w:top w:val="single" w:sz="6" w:space="0" w:color="{HEX_BORDER_MAIN}"/>'
        f'<w:left w:val="none"/>'
        f'<w:bottom w:val="single" w:sz="8" w:space="0" w:color="{HEX_BORDER_MAIN}"/>'
        f'<w:right w:val="none"/>'
        f'<w:insideH w:val="single" w:sz="4" w:space="0" w:color="{HEX_BORDER_DIVIDER}"/>'
        f'<w:insideV w:val="none"/>'
        f'</w:tblBorders>'
    )
    tblPr.append(borders)

    # 1. Fila de Encabezados (Fila 0)
    header_row = table.rows[0]
    trPr = header_row._tr.get_or_add_trPr()
    if trPr.find(qn('w:tblHeader')) is None:
        trPr.append(parse_xml(f'<w:tblHeader {nsdecls("w")}/>'))
    if trPr.find(qn('w:cantSplit')) is None:
        trPr.append(parse_xml(f'<w:cantSplit {nsdecls("w")}/>'))

    for cell in header_row.cells:
        cell.vertical_alignment = WD_ALIGN_VERTICAL.CENTER
        set_cell_background(cell, HEX_NAVY_PRIMARY)
        set_cell_margins(cell, top=130, bottom=130, left=130, right=130)
        for p in cell.paragraphs:
            p.paragraph_format.space_before = Pt(0)
            p.paragraph_format.space_after = Pt(0)
            p.paragraph_format.line_spacing = 1.05
            txt = cell.text.strip()
            # Centrar textos cortos de cabecera
            if len(txt) <= 12 or txt in ["Docs", "Campos", "Nulo", "Tipo BSON", "Restricción"]:
                p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            else:
                p.alignment = WD_ALIGN_PARAGRAPH.LEFT
            for r in p.runs:
                set_run_font_arial(r, size_pt=9.5, bold=True, color_rgb=COLOR_WHITE)

    # 2. Filas de Datos (Filas 1+)
    for row_idx, row in enumerate(table.rows[1:]):
        r_trPr = row._tr.get_or_add_trPr()
        if r_trPr.find(qn('w:cantSplit')) is None:
            r_trPr.append(parse_xml(f'<w:cantSplit {nsdecls("w")}/>'))

        # Zebra striping: Fila par Blanca, impar Azul Grisáceo Suave
        bg_color = HEX_ROW_ODD if row_idx % 2 == 1 else HEX_ROW_EVEN

        for c_idx, cell in enumerate(row.cells):
            cell.vertical_alignment = WD_ALIGN_VERTICAL.CENTER
            set_cell_background(cell, bg_color)
            set_cell_margins(cell, top=90, bottom=90, left=110, right=110)

            for p in cell.paragraphs:
                p.paragraph_format.space_before = Pt(0)
                p.paragraph_format.space_after = Pt(0)
                p.paragraph_format.line_spacing = 1.10

                # Detectar imágenes embebidas en la celda
                has_drawing = bool(p._p.findall('.//w:drawing', {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}))
                txt = cell.text.strip()

                if has_drawing:
                    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
                elif len(txt) <= 6 and "\n" not in txt and not any(char.isdigit() and len(txt) > 4 for char in txt):
                    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
                else:
                    p.alignment = WD_ALIGN_PARAGRAPH.LEFT

                for r in p.runs:
                    bold = r.font.bold
                    italic = r.font.italic
                    # Conservar negritas/cursivas pero forzar siempre Arial 8.5pt
                    set_run_font_arial(r, size_pt=8.5, bold=bold, italic=italic, color_rgb=COLOR_TEXT_MAIN)

# ==============================================================================
# CONFIGURAR MÁRGENES DE PÁGINA (ESTÁNDAR 2.5 CM)
# ==============================================================================
for section in doc.sections:
    section.top_margin = Inches(1.0)
    section.bottom_margin = Inches(1.0)
    section.left_margin = Inches(1.0)
    section.right_margin = Inches(1.0)

# ==============================================================================
# PASO 1: UNIFICAR TODAS LAS TABLAS AL MISMO ESTILO EJECUTIVO
# ==============================================================================
print(f"Homogeneizando el estilo visual de las {len(doc.tables)} tablas...")

# Ajustar contenido de Table 8 (Arquitectura)
if len(doc.tables) > 8:
    t8 = doc.tables[8]
    t8.rows[0].cells[0].text = "Capa / Componente de Arquitectura"
    t8.rows[0].cells[1].text = "Descripción Funcional y Tecnologías en Near"
    if len(t8.rows) > 4:
        # Reemplazar palabra "relacional" por "NoSQL distribuido" en fila 4
        c4 = t8.rows[4].cells[1]
        c4.text = "Clúster NoSQL distribuido en la nube (MongoDB Atlas near_db) encargado de garantizar alta disponibilidad, persistencia atómica en documentos de usuarios, mensajes, sesiones y resúmenes de bitácora."

for idx, tbl in enumerate(doc.tables):
    apply_unified_table_style(tbl)

print("✅ Todas las tablas formateadas con idéntico estilo corporativo.")

# ==============================================================================
# PASO 2: FORMATEAR PÁRRAFOS, TÍTULOS Y JERARQUÍA EN ARIAL
# ==============================================================================
print("Aplicando tipografía Arial y jerarquía de encabezados a todo el documento...")

for p in doc.paragraphs:
    t = p.text.strip()
    if not t:
        continue

    # 1. Título Principal de la Portada / Documento
    if "DOCUMENTO TÉCNICO DE BASE DE DATOS" in t:
        try: p.style = 'Title'
        except Exception: pass
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.space_before = Pt(12)
        p.paragraph_format.space_after = Pt(8)
        p.paragraph_format.line_spacing = 1.15
        for r in p.runs:
            set_run_font_arial(r, size_pt=20, bold=True, color_rgb=COLOR_NAVY_PRIMARY)
        continue

    if "Proyecto Integrador: Near Apoyo Emocional" in t:
        try: p.style = 'Subtitle'
        except Exception: pass
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(18)
        p.paragraph_format.line_spacing = 1.15
        for r in p.runs:
            set_run_font_arial(r, size_pt=13, bold=True, italic=True, color_rgb=COLOR_TEXT_MUTED)
        continue

    # 2. Encabezados Principales (Nivel 1: Capítulos 1.0, 2.0, 3.0, 4.0, 5.0)
    if re.match(r'^[1-5]\.0\s', t):
        try: p.style = 'Heading 1'
        except Exception: pass
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p.paragraph_format.space_before = Pt(18)
        p.paragraph_format.space_after = Pt(6)
        p.paragraph_format.line_spacing = 1.15
        p.paragraph_format.keep_with_next = True
        for r in p.runs:
            set_run_font_arial(r, size_pt=15, bold=True, color_rgb=COLOR_NAVY_PRIMARY)
        continue

    # 3. Encabezados Secundarios (Nivel 2: 1.1 a 1.4, 2.1 a 2.6, 3.1 a 3.4, 4.1 a 4.3, 5.1 a 5.3)
    if re.match(r'^[1-5]\.[1-9]\s', t) or t.startswith("4.0.1"):
        # Actualizar texto de "1.3 Modelo Relacional" a NoSQL
        if "1.3 Modelo Relacional" in t:
            p.text = "1.3 Modelo de Datos y Entidades NoSQL"
        try: p.style = 'Heading 2'
        except Exception: pass
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p.paragraph_format.space_before = Pt(13)
        p.paragraph_format.space_after = Pt(4)
        p.paragraph_format.line_spacing = 1.15
        p.paragraph_format.keep_with_next = True
        for r in p.runs:
            set_run_font_arial(r, size_pt=12.5, bold=True, color_rgb=COLOR_NAVY_SECONDARY)
        continue

    # 4. Encabezados de Nivel 3 (Colecciones, Métodos CRUD A-H, Tablas numeradas)
    if (
        re.match(r'^[A-H]\.\s', t)
        or t.startswith("Tabla:")
        or t.startswith("Colección NoSQL:")
        or t.startswith("Tabla 4.")
        or t.startswith("Tabla 5.")
        or t.startswith("Verificación de Seguridad")
    ):
        # Renombrar Tabla: X a Colección NoSQL: X
        if t.startswith("Tabla: admin"):
            p.text = "Colección NoSQL: recursos_emergencia"
        elif t.startswith("Tabla:"):
            col_name = t.replace("Tabla:", "").strip()
            p.text = f"Colección NoSQL: {col_name}"

        try: p.style = 'Heading 3'
        except Exception: pass
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p.paragraph_format.space_before = Pt(9)
        p.paragraph_format.space_after = Pt(3)
        p.paragraph_format.line_spacing = 1.15
        p.paragraph_format.keep_with_next = True
        for r in p.runs:
            set_run_font_arial(r, size_pt=11, bold=True, color_rgb=COLOR_NAVY_PRIMARY)
        continue

    # 5. Pies de Figuras y Evidencias Visuales
    if t.startswith("Figure") or t.startswith("Evidencia:") or t.startswith("Figura:"):
        # Si dice "Figure 1 - Modelo Relacional", modernizar
        if "Figure 1 - Modelo Relacional" in t:
            p.text = "Figura 1: Diagrama Entidad-Colección NoSQL de la Base de Datos near_db"
        elif t.startswith("Figure "):
            p.text = p.text.replace("Figure ", "Figura ")

        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.space_before = Pt(4)
        p.paragraph_format.space_after = Pt(10)
        p.paragraph_format.line_spacing = 1.10
        for r in p.runs:
            set_run_font_arial(r, size_pt=9.0, bold=False, italic=True, color_rgb=COLOR_TEXT_MUTED)
        continue

    # 6. Viñetas y Listas
    if t.startswith("•") or t.startswith("-"):
        try: p.style = 'Normal'
        except Exception: pass
        p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(3)
        p.paragraph_format.line_spacing = 1.15
        p.paragraph_format.left_indent = Inches(0.25)
        for r in p.runs:
            bold = r.font.bold
            italic = r.font.italic
            set_run_font_arial(r, size_pt=10.5, bold=bold, italic=italic, color_rgb=COLOR_TEXT_MAIN)
        continue

    # 7. Texto Normal de Párrafos / Cuerpo
    try: p.style = 'Normal'
    except Exception: pass
    p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(5)
    p.paragraph_format.line_spacing = 1.15
    for r in p.runs:
        bold = r.font.bold
        italic = r.font.italic
        set_run_font_arial(r, size_pt=10.5, bold=bold, italic=italic, color_rgb=COLOR_TEXT_MAIN)

# Guardar documento
doc.save(DOCX_PATH)
print("✅ Documento guardado con éxito con formato Arial uniforme y estilos profesionales.")
