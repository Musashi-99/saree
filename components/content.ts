// The four Diwali edits: one per shop category, plus everything. Each opens a detail dialog that links into
// the shop, filtered to its category ('all' shows every product).
export const collections = [
  { id: 'silk-sarees', name: 'The Lakshmi Puja Edit', image: 'gold', number: '01', mood: 'Silk, for the night she visits.', tag: 'SILK SAREES · LAKSHMI PUJA', description: 'Banarasi and Kanjivaram-weave silk sarees with zari borders and blouse pieces, for the evening you open the doors, light the lamps and welcome Maa Lakshmi home.', palette: ['#a47e35','#683021','#d9bb7c'], detail: 'Soft silk / zari borders / blouse piece included' },
  { id: 'cotton-sarees', name: 'Cotton Sarees', image: 'modern', number: '02', mood: 'For Dhanteras mornings and Diwali visits.', tag: 'COTTON · COTTON-SILK', description: 'Breathable cotton, cotton-silk and handloom sarees: light enough for a long day of shopping, visits and sweets, and festive enough for the puja.', palette: ['#754537','#efe6d2','#ab8b77'], detail: 'Cotton / cotton-silk / handloom weaves' },
  { id: 'kurtis', name: 'Festive Kurta Sets', image: 'a-b0gtqy6bm7-1', number: '03', mood: 'Easy to wear, all five days.', tag: 'KURTA · PANT · DUPATTA', description: 'Embroidered kurta sets with pants and dupattas, in maroon, red, blue and peach. Choose your size, from S to 5XL.', palette: ['#8f1d2c','#1f3a6b','#e8b49a'], detail: 'Kurta, pant and dupatta sets / sizes S–5XL' },
  { id: 'all', name: 'The Full Diwali Edit', image: 'bridal', number: '04', mood: 'Everything for the festival of lights.', tag: 'SAREES · KURTIS · GIFTING', description: 'Every silk saree, cotton saree and kurta set in the collection, from Dhanteras to Bhai Dooj, and for every gift in between.', palette: ['#9b252c','#c19c55','#dfb69c'], detail: 'Free shipping / delivered in time for Diwali' },
];
export type Collection = typeof collections[number];
export const gallery = [
  {image:'diya-girl', label:'The first diya', note:'Lakshmi Puja · sindoor & lamplight'},
  {image:'sparkler', label:'A sparkler at dusk', note:'Diwali night · gold & smoke'},
  {image:'aarti', label:'An aarti thali', note:'Evening puja · marigold & flame'},
  {image:'lamps-together', label:'Lamps, lit together', note:'Bhai Dooj · sisters & silk'},
];
