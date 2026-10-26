"""Validate the built homepage (after `npm run build`): local asset references, anchors, alt text, section count."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
import re
ROOT=Path(__file__).resolve().parents[1]
BUILT=ROOT/'.next'
# Built pages are in .next/server/app; /_next/static/* is served from .next/static, everything else from public/.
def local(ref):
    path=unquote(urlsplit(ref).path)
    if path.startswith('/_next/static/'):return BUILT/'static'/path[len('/_next/static/'):]
    if path.endswith('/'):return BUILT/'server'/'app'/((path.strip('/') or 'index')+'.html')  # a prerendered page
    return ROOT/'public'/path.lstrip('/')
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
doc=Inspector();doc.feed((BUILT/'server'/'app'/'index.html').read_text())
failures=[]
for ref in set(doc.refs):
    path=local(ref)
    if not path.exists():failures.append(f'Missing reference: {ref}')
for link in doc.links:
    if link.startswith('#') and link[1:] not in doc.ids:failures.append(f'Broken anchor: {link}')
for im in doc.images:
    if 'alt' not in im:failures.append(f'Image missing alt: {im.get("src")}')
for css in (BUILT/'static').rglob('*.css'):
    for ref in re.findall(r'url\([\"\']?(/[^)\"\']+)',css.read_text()):
        if not local(ref).exists():failures.append(f'Missing CSS asset: {ref}')
if doc.sections!=10:failures.append(f'Expected ten sections, found {doc.sections}')
if failures:
    raise SystemExit('\n'.join(failures))
print(f'PASS: {doc.sections} sections, {len(doc.images)} images with alt text, {len(set(doc.refs))} local asset references and all anchor destinations.')
