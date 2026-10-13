"""Validate the actual static export's local asset references and anchors."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
import re
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'out'
class Inspector(HTMLParser):
    def __init__(self):
        super().__init__();self.ids=set();self.links=[];self.refs=[];self.images=[];self.sections=0
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if 'id' in a:self.ids.add(a['id'])
        if tag=='section':self.sections+=1
        if tag=='a':self.links.append(a.get('href',''))
        if tag=='img':self.images.append(a)
        for name in ['src','href']:
            value=a.get(name,'')
            if value.startswith('/') and not value.startswith('//'):self.refs.append(value)
        for src in a.get('srcset','').split(','):
            if src.strip().startswith('/'):self.refs.append(src.strip().split()[0])
doc=Inspector();doc.feed((OUT/'index.html').read_text())
failures=[]
for ref in set(doc.refs):
    path=OUT/unquote(urlsplit(ref).path).lstrip('/')
    if not path.exists():failures.append(f'Missing reference: {ref}')
for link in doc.links:
    if link.startswith('#') and link[1:] not in doc.ids:failures.append(f'Broken anchor: {link}')
for im in doc.images:
    if 'alt' not in im:failures.append(f'Image missing alt: {im.get("src")}')
for css in (OUT/'_next').rglob('*.css'):
    for ref in re.findall(r'url\([\"\']?(/[^)\"\']+)',css.read_text()):
        if not (OUT/ref.lstrip('/')).exists():failures.append(f'Missing CSS asset: {ref}')
if doc.sections!=9:failures.append(f'Expected nine sections, found {doc.sections}')
if failures:
    raise SystemExit('\n'.join(failures))
print(f'PASS: {doc.sections} sections, {len(doc.images)} images with alt text, {len(set(doc.refs))} local asset references and all anchor destinations.')
