// The four Diwali edits, one per weave. Each opens a detail dialog that links into the shop, filtered to its category.
export const collections = [
  { id: 'kanjivaram', name: 'The Lakshmi Puja Edit', image: 'gold', number: '01', mood: 'Gold, for the night she visits.', tag: 'KANJIVARAM · LAKSHMI PUJA', description: 'Heavy Kanjivaram silks with temple borders and real zari, made for the evening you open the doors, light the lamps and welcome Maa Lakshmi home.', palette: ['#a47e35','#683021','#d9bb7c'], detail: 'Pure mulberry silk / temple borders / antique zari' },
  { id: 'banarasi', name: 'The Banarasi Edit', image: 'bridal', number: '02', mood: 'A promise, in sindoor red.', tag: 'BANARASI · DIWALI NIGHT', description: 'Katan and kora silks from Varanasi, brocaded in gold and silver. The classic Diwali drape, in sindoor, saffron, lotus pink and Amavasya blue.', palette: ['#9b252c','#c19c55','#dfb69c'], detail: 'Katan silk / kadhua brocade / gold buttis' },
  { id: 'tissue-organza', name: 'Tissue & Organza', image: 'festive', number: '03', mood: 'Silk that catches the diya light.', tag: 'TISSUE · ORGANZA · PARTIES', description: 'Sheer, luminous weaves that turn liquid in candlelight. Feather-light for long card-party nights and Diwali dinners.', palette: ['#ca7925','#e8b4a6','#e7a640'], detail: 'Silk tissue / organza / woven zari' },
  { id: 'handloom', name: 'Handloom & Soft Silk', image: 'modern', number: '04', mood: 'For Dhanteras mornings and Bhai Dooj lunches.', tag: 'HANDLOOM · GIFTING', description: 'Kasavu, Chanderi and soft silks: lighter hand-woven sarees for daytime puja, family visits and the gifts you bring.', palette: ['#754537','#efe6d2','#ab8b77'], detail: 'Kasavu / Chanderi silk-cotton / soft silk' },
];
export type Collection = typeof collections[number];
export const gallery = [
  {image:'diya-girl', label:'The first diya', note:'Lakshmi Puja · sindoor & lamplight'},
  {image:'sparkler', label:'A sparkler at dusk', note:'Diwali night · gold & smoke'},
  {image:'aarti', label:'An aarti thali', note:'Evening puja · marigold & flame'},
  {image:'lamps-together', label:'Lamps, lit together', note:'Bhai Dooj · sisters & silk'},
];
