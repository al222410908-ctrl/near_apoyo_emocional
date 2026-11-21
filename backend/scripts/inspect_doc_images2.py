import zipfile
import xml.etree.ElementTree as ET

with zipfile.ZipFile('DOCUMENTO_TECNICO_BD_NEAR_ACTUALIZADO.docx') as z:
    xml_content = z.read('word/document.xml')
    rels_content = z.read('word/_rels/document.xml.rels')

tree = ET.fromstring(xml_content)
rels_tree = ET.fromstring(rels_content)

rel_map = {rel.attrib.get('Id'): rel.attrib.get('Target') for rel in rels_tree}
ns = {
    'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main',
    'a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
    'r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships',
}

all_p = list(tree.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}p'))

for idx, p in enumerate(all_p):
    drawings = p.findall('.//w:drawing', ns)
    if drawings:
        for d in drawings:
            blips = d.findall('.//a:blip', ns)
            for b in blips:
                embed_id = b.attrib.get('{http://schemas.openxmlformats.org/officeDocument/2006/relationships}embed')
                target = rel_map.get(embed_id, 'unknown')
                prev_text = ''.join(all_p[idx-1].itertext()).strip() if idx > 0 else ''
                next_text = ''.join(all_p[idx+1].itertext()).strip() if idx+1 < len(all_p) else ''
                curr_text = ''.join(p.itertext()).strip()
                print(f'=== IMAGE {target} at P[{idx}] ===')
                print('  Before:', prev_text[:100])
                if curr_text:
                    print('  Curr:  ', curr_text[:100])
                print('  After: ', next_text[:100])
