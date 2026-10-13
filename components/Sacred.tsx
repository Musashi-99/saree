// Shared devotional ornaments. `spin` is seconds per turn (negative turns anticlockwise); Interactive drives it.
export function Rangoli({className='',spin}:{className?:string;spin?:number}){
 return <svg className={`intro-rangoli ${className}`} data-spin={spin} viewBox="0 0 600 600" fill="none" aria-hidden="true"><g stroke="currentColor" strokeWidth="1.1"><circle cx="300" cy="300" r="284"/><circle cx="300" cy="300" r="272" strokeDasharray="1 9" strokeWidth="5"/><circle cx="300" cy="300" r="248"/><circle cx="300" cy="300" r="195"/><circle cx="300" cy="300" r="99"/>{Array.from({length:16},(_,i)=><g key={i} transform={`rotate(${i*22.5} 300 300)`}><path d="M300 65 Q390 170 300 205 Q210 170 300 65Z"/><path d="M300 18 Q332 61 300 86 Q268 61 300 18Z"/><path d="M300 204 Q350 245 300 296 Q250 245 300 204Z"/><circle cx="300" cy="47" r="4" fill="currentColor"/></g>)}<circle cx="300" cy="300" r="22"/><circle cx="300" cy="300" r="9" fill="currentColor"/></g></svg>;
}

// A prabhavali: the radiant halo that frames a deity or a figure in devotion.
export function Halo({className='',spin}:{className?:string;spin?:number}){
 return <svg className={`halo ${className}`} data-spin={spin} viewBox="0 0 400 400" fill="none" aria-hidden="true"><g stroke="currentColor" strokeWidth=".9">
  <circle cx="200" cy="200" r="194"/><circle cx="200" cy="200" r="186" strokeDasharray="1 7" strokeWidth="3.2"/>
  {Array.from({length:72},(_,i)=><line key={i} x1="200" y1={i%2?40:22} x2="200" y2="78" transform={`rotate(${i*5} 200 200)`} strokeWidth={i%2?.6:1}/>)}
  {Array.from({length:24},(_,i)=><path key={i} d="M200 84 Q214 108 200 126 Q186 108 200 84Z" transform={`rotate(${i*15} 200 200)`}/>)}
  <circle cx="200" cy="200" r="128"/><circle cx="200" cy="200" r="120" strokeDasharray="2 6"/>
  {Array.from({length:12},(_,i)=><path key={i} d="M200 126 Q226 160 200 196 Q174 160 200 126Z" transform={`rotate(${i*30} 200 200)`} strokeWidth=".7"/>)}
  {Array.from({length:24},(_,i)=><circle key={i} cx="200" cy="12" r="2.4" fill="currentColor" transform={`rotate(${i*15} 200 200)`}/>)}
 </g></svg>;
}
