export const collections = [
  { id: 'bridal', name: 'The Bridal Edit', image: 'bridal', number: '01', mood: 'A promise, in vermilion.', tag: 'CEREMONY · CELEBRATION', description: 'A study in ceremonial red, intricate borders and the intimacy of getting ready. Drape the moment in something unforgettable.', palette: ['#9b252c','#c19c55','#dfb69c'], detail: 'Vermilion / intricate borders / statement jewellery' },
  { id: 'heritage', name: 'Heritage Silks', image: 'gold', number: '02', mood: 'The colour of a memory.', tag: 'HERITAGE · HEIRLOOM', description: 'Gold catches the light. A familiar silhouette finds a new expression. An editorial celebration of the saree as a living connection between generations.', palette: ['#a47e35','#683021','#d9bb7c'], detail: 'Antique gold / lustrous folds / ceremonial styling' },
  { id: 'festive', name: 'The Festive Edit', image: 'festive', number: '03', mood: 'For days that become stories.', tag: 'COLOUR · JOY', description: 'Sunlit colour, a touch of ornament and the freedom to celebrate. A joyful palette for the moments that bring us together.', palette: ['#ca7925','#b93455','#e7a640'], detail: 'Saffron / rose / expressive colour' },
  { id: 'contemporary', name: 'The Modern Drape', image: 'modern', number: '04', mood: 'Tradition, in your own words.', tag: 'EXPRESSION · EVERYDAY', description: 'A quieter silhouette. An instinctive gesture. The saree moves beyond occasion, finding its place in a modern, personal wardrobe.', palette: ['#754537','#262624','#ab8b77'], detail: 'Earthy red / understated jewellery / effortless draping' },
];
export type Collection = typeof collections[number];
export const gallery = [
  {image:'celebration', label:'A moment to herself', note:'Portrait study · vermilion & light'},
  {image:'green', label:'A softer rhythm', note:'Colour study · sage & rose'},
  {image:'jewels', label:'Held in the details', note:'Adornment · intricate gold'},
  {image:'garden', label:'In her element', note:'An outdoor portrait · light & movement'},
];
