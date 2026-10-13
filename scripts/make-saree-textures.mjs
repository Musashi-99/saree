// Builds the three saree-transition textures from the photographs in public/assets.
// Run after the photos are in place:  node scripts/make-saree-textures.mjs
// Uses sharp, which npm installs alongside Next.js.
import sharp from 'sharp';
import {mkdir} from 'node:fs/promises';

// [source photo, left, top, width, height] in the 1600px version of each photo.
const crops = {
  red: ['detail', 120, 480, 930, 860],     // red net saree with gold zari border
  gold: ['gold', 480, 1700, 600, 700],     // golden Kanjivaram silk pleats
  tissue: ['portrait', 500, 1740, 580, 650], // rose-gold tissue silk with silver lace
};

await mkdir('public/assets/saree', {recursive: true});
for (const [name, [src, left, top, width, height]] of Object.entries(crops)) {
  await sharp(`public/assets/${src}-1600.webp`)
    .extract({left, top, width, height})
    .resize({width: 1400, kernel: 'lanczos3'})
    .sharpen({sigma: 0.8})
    .webp({quality: 84})
    .toFile(`public/assets/saree/${name}.webp`);
  console.log(`wrote public/assets/saree/${name}.webp`);
}
