from PIL import Image,ImageOps
from pathlib import Path
from fontTools import subset

ROOT=Path(__file__).resolve().parents[1]
source=ROOT/'reference-research'; dest=ROOT/'public/assets'
assets={'portrait':'27776002','bridal':'9418783','gold':'12089493','festive':'15181109','modern':'31450187','green':'35212994','jewels':'5814563','garden':'30458510','loom':'14695808','detail':'9419032','divine':'19284703','celebration':'34538958'}
for name,ident in assets.items():
 im=ImageOps.exif_transpose(Image.open(source/f'{ident}.jpg')).convert('RGB')
 if name=='detail':
  w,h=im.size; im=im.crop((int(w*.18),int(h*.45),int(w*.90),int(h*.95)))
 for width in (640,1000,1600):
  size=min(width,im.width); out=im.resize((size,round(im.height*size/im.width)),Image.Resampling.LANCZOS)
  out.save(dest/f'{name}-{width}.webp',quality=89 if width==1600 else 84,method=6)
hero=ImageOps.exif_transpose(Image.open(source/'15889856.jpg')).convert('RGB')
hero.save(dest/'opening.webp',quality=90,method=6)
w,h=hero.size
# The portrait crop keeps the photographed woman and her flowing red drape in view.
hero.crop((0,0,int(w*.44),h)).save(dest/'opening-mobile.webp',quality=89,method=6)
for name in ['serif-regular','serif-italic','sans-regular','sans-medium']:
 path=source/f'{name}.ttf'
 options=subset.Options();options.flavor='woff';options.desubroutinize=True
 font=subset.load_font(str(path),options);sub=subset.Subsetter(options=options);sub.populate(unicodes=list(range(32,383))+[8211,8212,8216,8217,8220,8221,8226,8594,8599,8734,10023]);sub.subset(font);subset.save_font(font,str(dest/f'{name}.woff'),options)
print('Prepared',len(list(dest.glob('*.webp'))),'local WebP assets and four subset fonts.')
