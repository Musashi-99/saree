export type FigureName = 'woman-vermilion' | 'woman-ivory' | 'durga-mata' | 'editorial-bride';
const descriptions: Record<FigureName,string> = {
 'woman-vermilion':'An Indian woman in a flowing vermilion and gold saree, in a graceful dance pose',
 'woman-ivory':'An Indian woman in an ivory saree with red and gold borders, in a graceful dance pose',
 'durga-mata':'A devotional depiction of Goddess Durga with her traditional attributes, golden halo and lion',
 'editorial-bride':'An Indian bride wearing an ornate gold headpiece and red saree',
};
export default function RisingFigure({name,className='',priority=false,decorative=false,depth}:{name:FigureName;className?:string;priority?:boolean;decorative?:boolean;depth?:number}) {
 const size=name==='durga-mata'?1254:1024;
 return <div className={`rising-figure ${className}`} data-rise-figure data-depth={depth}><img src={`/assets/generated/${name}.webp`} alt={decorative?'':descriptions[name]} width={size} height={name==='durga-mata'?1254:1536} loading={priority?'eager':'lazy'} fetchPriority={priority?'high':'auto'} decoding="async"/></div>;
}

// One figure stands centred; two stand at the edges, the second mirrored to face outward.
// `wordFrom` slides the large background word in from that side; a `depth` wipe grows out from behind the figures.
export function ChapterScene({word,caption,tone='saffron',figures=['woman-ivory'],wordFrom,wipe='slide'}:{word:string;caption:string;tone?:string;figures?:FigureName[];wordFrom?:'left'|'right';wipe?:'slide'|'depth'}) {
 const [first,second]=figures;
 return <div className={`chapter-scene tone-${tone}`} data-rise-chapter data-word-from={wordFrom}>
  <div className="chapter-scene-stage">
   <div className="chapter-colour-wipe" data-wipe={wipe} aria-hidden="true"/>
   <span className="chapter-caption">{caption}</span>
   <p className="chapter-echo" aria-hidden="true">{word}</p>
   <p className="chapter-word" data-rise-text>{word}</p>
   <RisingFigure name={first} className={second?'chapter-figure-left':'chapter-figure-centre'} decorative depth={second?14:8}/>
   {second&&<RisingFigure name={second} className="chapter-figure-right mirrored" decorative depth={-14}/>}
   <span className="chapter-bottom">A CELEBRATION IN EVERY DRAPE</span>
  </div>
 </div>;
}
