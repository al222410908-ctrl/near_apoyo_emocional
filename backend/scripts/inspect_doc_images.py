import zipfile
import xml.etree.ElementTree as ET

with zipfile.ZipFile('DOCUMENTO_TECNICO_BD_NEAR_ACTUALIZADO.docx') as z:
    xml_content = z.read('word/document.xml')
    rels_content = z.read('word/_rels/document.xml.rels')

tree = ET.fromstring(xml_content)
rels_tree = ET.fromstring(rels_content)

rel_map = {}
for rel in rels_tree:
    rel_id = rel.attrib.get('Id')
    target = rel.attrib.get('Target')
    rel_map[rel_id] = target

ns = {
    'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main',
    'a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
    'r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships',
}

p_idx = 0
for elem in tree.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}p'):
    p_text = ''.join(elem.itertext()).strip()
    drawings = elem.findall('.//w:drawing', ns)
    if drawings:
        for d in drawings:
            blips = d.findall('.//a:blip', ns)
            for b in blips:
                embed_id = b.attrib.get('{http://schemas.openxmlformats.org/officeDocument/2006/relationships}embed')
                target = rel_map.get(embed_id, 'unknown')
                print(f'P[{p_idx}] "{p_text[:70]}" -> {target}')
    p_idx += 1
