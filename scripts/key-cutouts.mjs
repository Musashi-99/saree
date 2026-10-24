import sharp from 'sharp';
import {mkdir} from 'node:fs/promises';

const root = 'C:/Users/krris/.cursor/projects/c-Users-krris-Documents-reddy-projects-saree-website/assets';
const out = 'public/assets/generated';
await mkdir(out, {recursive: true});

function keyGreen(data, width, height) {
  const greennessAt = (i) => data[i + 1] - Math.max(data[i], data[i + 2]);
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const greenness = g - Math.max(r, b);
    if (g > 90 && greenness > 24 && b < g * 0.7 && r < 210) {
      const t = Math.min(1, Math.max(0, (greenness - 18) / 48));
      data[i + 3] = Math.round(255 * (1 - t));
    }
  }
  const alpha = new Uint8Array(width * height);
  for (let p = 0; p < alpha.length; p++) alpha[p] = data[p * 4 + 3];
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const p = y * width + x;
      if (alpha[p] < 20) continue;
      let edge = false;
      for (let dy = -1; dy <= 1 && !edge; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (alpha[(y + dy) * width + (x + dx)] < 40) { edge = true; break; }
        }
      }
      if (!edge) continue;
      const i = p * 4;
      const spill = greennessAt(i);
      if (spill > 6) data[i + 1] = Math.max(data[i], data[i + 2]);
      if (spill > 16) data[i + 3] = Math.min(data[i + 3], Math.round(255 * (1 - Math.min(1, (spill - 12) / 36))));
    }
  }
}

async function cutout(name, width, height, gravity) {
  const {data, info} = await sharp(`${root}/${name}.jpg`).ensureAlpha().raw().toBuffer({resolveWithObject: true});
  keyGreen(data, info.width, info.height);
  const keyed = await sharp(data, {raw: {width: info.width, height: info.height, channels: 4}}).png().toBuffer();
  const trimmed = await sharp(keyed).trim({threshold: 12}).toBuffer();
  await sharp(trimmed)
    .resize({width, height, fit: 'inside'})
    .extend({bottom: 0, background: {r: 0, g: 0, b: 0, alpha: 0}})
    .resize({width, height, fit: 'contain', position: gravity, background: {r: 0, g: 0, b: 0, alpha: 0}})
    .webp({quality: 90, alphaQuality: 100})
    .toFile(`${out}/${name}.webp`);
  console.log('cutout', name);
}

const figures = [
  ['durga-face', 1199, 1312, 'centre'],
  ['durga-mata', 1254, 1254, 'south'],
  ['garba-left', 1024, 1536, 'south'],
  ['garba-right', 1024, 1536, 'south'],
  ['editorial-bride', 1024, 1536, 'south'],
  ['woman-ivory', 1024, 1536, 'south'],
  ['woman-vermilion', 1024, 1536, 'south'],
];

for (const figure of figures) await cutout(...figure);

await sharp(`${root}/festival-night.jpg`).resize(1672, 941, {fit: 'cover', position: 'centre'}).webp({quality: 86}).toFile(`${out}/festival-night.webp`);
await sharp(`${root}/bridal-monochrome.jpg`).resize(1672, 941, {fit: 'cover', position: 'attention'}).grayscale().webp({quality: 86}).toFile(`${out}/bridal-monochrome.webp`);
console.log('plates ok');
