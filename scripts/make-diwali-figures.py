# Builds the figures in public/assets/generated/ for the Diwali edition.
#   pip install "rembg[cpu]" pillow
#   python scripts/make-diwali-figures.py
# Sources: Raja Ravi Varma's "Goddess Lakshmi" (1896, public domain, Wikimedia Commons) and Pexels photographs.
# Cutouts are made with rembg (isnet-general-use); downloads are cached in reference-research/diwali/.
import io, os, urllib.request
from PIL import Image, ImageOps
from rembg import remove, new_session

CACHE = 'reference-research/diwali'
OUT = 'public/assets/generated'
LAKSHMI = 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Raja_Ravi_Varma%2C_Goddess_Lakshmi%2C_1896.jpg'
pexels = lambda id: f'https://images.pexels.com/photos/{id}/pexels-photo-{id}.jpeg?auto=compress&cs=tinysrgb&w=2400'

os.makedirs(CACHE, exist_ok=True)
os.makedirs(OUT, exist_ok=True)
session = new_session('isnet-general-use')

def source(name, url):
    path = f'{CACHE}/{name}.jpg'
    if not os.path.exists(path):
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=120) as r, open(path, 'wb') as f: f.write(r.read())
    im = Image.open(path).convert('RGB')
    im.thumbnail((1800, 1800))
    return im

def cut(im, trim=True):
    res = remove(im, session=session, post_process_mask=True)
    return res.crop(res.getbbox()) if trim else res

def place(fig, w, h, gravity):
    # Fit inside w×h on a transparent canvas, anchored to the bottom (south) or centre.
    fig = fig.copy(); fig.thumbnail((w, h), Image.LANCZOS)
    if fig.width < w * .6 and fig.height < h: fig = fig.resize((round(fig.width * h / fig.height), h), Image.LANCZOS)
    canvas = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    x = (w - fig.width) // 2
    y = h - fig.height if gravity == 'south' else (h - fig.height) // 2
    canvas.paste(fig, (x, y), fig)
    return canvas

def save(im, name, alpha=True):
    im.save(f'{OUT}/{name}.webp', 'WEBP', quality=90, alpha_quality=100, method=6)
    print('wrote', f'{OUT}/{name}.webp', im.size)

painting = cut(source('lakshmi-ravi-varma-1896', LAKSHMI), trim=False)
save(place(painting.crop(painting.getbbox()), 1254, 1254, 'south'), 'lakshmi')
# Crown to waist with both lotuses, for the opening ring and the hero. The sides fade out softly
# where the crop cuts through her lower hands, so no hard edge shows against the cream ground.
w, h = painting.size
bust = painting.crop((round(w * .19), 0, round(w * .81), round(h * .47)))
fade = Image.linear_gradient('L').rotate(90, expand=True).resize((bust.width, bust.height))
edge = Image.eval(fade, lambda v: min(255, min(v, 255 - v) * 9))
bust.putalpha(Image.composite(bust.getchannel('A'), Image.new('L', bust.size, 0), edge))
save(place(bust, 1199, 1312, 'south'), 'lakshmi-face')

for name, id in {'festive-left': 9419023, 'festive-right': 9419032, 'woman-vermilion': 9418783, 'woman-emerald': 35108774, 'editorial-bride': 12089493}.items():
    save(place(cut(source(str(id), pexels(id))), 1024, 1536, 'south'), name)

night = source('18376975', pexels(18376975))
save(ImageOps.fit(night, (1672, 941), Image.LANCZOS, centering=(.5, .5)), 'festival-night')
candle = source('27155551', pexels(27155551))
save(ImageOps.grayscale(ImageOps.fit(candle, (1672, 941), Image.LANCZOS, centering=(.5, .45))), 'diya-monochrome')
