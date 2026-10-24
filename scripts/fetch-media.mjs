import sharp from 'sharp';
import {mkdir, writeFile, readFile} from 'node:fs/promises';
import {existsSync} from 'node:fs';

const assets = {
  portrait: '27776002',
  bridal: '9418783',
  gold: '12089493',
  festive: '15181109',
  modern: '31450187',
  green: '35212994',
  jewels: '5814563',
  garden: '30458510',
  loom: '14695808',
  detail: '9419032',
  divine: '19284703',
  celebration: '34538958',
};

const fonts = {
  'serif-regular': 'https://cdn.jsdelivr.net/fontsource/fonts/cormorant-garamond@latest/latin-400-normal.woff',
  'serif-italic': 'https://cdn.jsdelivr.net/fontsource/fonts/cormorant-garamond@latest/latin-400-italic.woff',
  'sans-regular': 'https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-400-normal.woff',
  'sans-medium': 'https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-500-normal.woff',
};

await mkdir('public/assets', {recursive: true});

async function download(url) {
  const res = await fetch(url, {headers: {'User-Agent': 'Mozilla/5.0'}, redirect: 'follow'});
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

const catalog = JSON.parse(await readFile('components/assets.json', 'utf8'));

for (const [name, id] of Object.entries(assets)) {
  const url = `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=2400`;
  process.stdout.write(`photo ${name}... `);
  let buf = await sharp(await download(url)).rotate().toBuffer();
  if (name === 'detail') {
    const {width, height} = await sharp(buf).metadata();
    const left = Math.round(width * 0.18);
    const top = Math.round(height * 0.45);
    const cropW = Math.round(width * 0.72);
    const cropH = Math.round(height * 0.5);
    buf = await sharp(buf).extract({left, top, width: Math.min(cropW, width - left), height: Math.min(cropH, height - top)}).toBuffer();
  }
  const meta = await sharp(buf).metadata();
  const full = Math.min(1600, meta.width);
  const fullHeight = Math.round(meta.height * full / meta.width);
  for (const width of [640, 1000, 1600]) {
    const size = Math.min(width, meta.width);
    const height = Math.round(meta.height * size / meta.width);
    await sharp(buf).resize({width: size, height, fit: 'fill'}).webp({quality: width === 1600 ? 89 : 84}).toFile(`public/assets/${name}-${width}.webp`);
  }
  if (catalog[name]) {
    catalog[name].width = full;
    catalog[name].height = fullHeight;
    for (const variant of catalog[name].variants) {
      const size = Math.min(variant.width > 1296 ? 1600 : variant.width, meta.width);
      const requested = variant.src.match(/-(\d+)\.webp$/)?.[1];
      const target = Number(requested);
      const outW = Math.min(target, meta.width);
      variant.width = outW;
      variant.height = Math.round(meta.height * outW / meta.width);
    }
  }
  console.log(`${full}x${fullHeight}`);
}

await writeFile('components/assets.json', JSON.stringify(catalog, null, 2) + '\n');

for (const [name, url] of Object.entries(fonts)) {
  const dest = `public/assets/${name}.woff`;
  if (existsSync(dest)) { console.log(`font ${name} exists`); continue; }
  process.stdout.write(`font ${name}... `);
  await writeFile(dest, await download(url));
  console.log('ok');
}

const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="8" fill="#570d19"/><path d="M32 8C15 24 23 41 32 49C41 41 49 24 32 8ZM32 49C16 49 7 36 9 23C22 25 31 36 32 49ZM32 49C48 49 57 36 55 23C42 25 33 36 32 49ZM13 51Q32 62 51 51" fill="none" stroke="#f3e6c8" stroke-width="1.6"/></svg>`;
await writeFile('public/favicon.svg', favicon);
console.log('favicon ok');
