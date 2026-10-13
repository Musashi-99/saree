'use client';
import type {CSSProperties} from 'react';
import {ArrowDown,Pause,Play,RotateCcw} from 'lucide-react';
import {Rangoli,Halo} from './Sacred';
import Diya from './Diya';

function Embers(){return <div className="intro-embers" aria-hidden="true">{Array.from({length:16},(_,i)=><i key={i} style={{'--x':`${(i*37+7)%100}%`,'--delay':`${-(i%8)}s`,'--time':`${6+i%5}s`,'--drift':`${(i%3-1)*70}px`} as CSSProperties}/>)}</div>}

export default function DevotionalIntro({onReplay,paused,onToggleMotion}:{onReplay:()=>void;paused:boolean;onToggleMotion:()=>void}){
 return <>
  <section className="intro-hero" id="home" aria-labelledby="intro-title"><div className="intro-hero-stage" data-cursor="Offer a flower" data-petals>
   <div className="intro-blue-aura"/><div className="cursor-light hero-light" data-light aria-hidden="true"/>
   <div className="depth-layer intro-rangoli-layer" data-depth="-22"><Rangoli className="intro-hero-rangoli" spin={42}/></div>
   <div className="depth-layer intro-rangoli-layer" data-depth="12"><Rangoli className="intro-hero-rangoli-inner" spin={-30}/></div>
   <Embers/>
   <p className="intro-hero-kicker">AARADHYA · A CELEBRATION OF SHAKTI</p>
   <div className="depth-layer intro-title-layer" data-depth="14"><h1 className="intro-hero-title" id="intro-title"><span>Maa</span><span><em>Durga.</em></span></h1></div>
   <div className="intro-portrait"><div className="intro-halo"><Halo spin={-55}/></div><div className="intro-portrait-depth" data-depth="7"><img className="intro-durga-face" src="/assets/generated/durga-face.webp" alt="The centred face of Maa Durga, wearing her radiant gold crown and red sari" width="1199" height="1312" loading="eager" fetchPriority="high"/></div></div>
   <p className="intro-hero-note intro-note-left">The mother.<br/>The warrior. The light.</p><p className="intro-hero-note intro-note-right">Courage in her gaze.<br/>Grace in every thread.</p>
   <a className="intro-hero-scroll" href="#celebration">Let the celebration unfold <ArrowDown size={16}/></a>
   <div className="intro-hero-foot"><span>JAI MATA DI</span><span className="intro-hero-hint">✿ <span className="hint-touch">Tap</span><span className="hint-click">Click</span> anywhere to offer flowers</span><button onClick={onReplay}><RotateCcw size={12}/> Replay opening</button><button onClick={onToggleMotion} aria-pressed={paused}>{paused?<Play size={12}/>:<Pause size={12}/>} {paused?'Resume':'Pause'} effects</button></div>
  </div></section>
  <section className="intro-celebration" id="celebration" aria-labelledby="intro-dance-title"><div className="intro-cel-stage">
   <div className="intro-cel-base" aria-hidden="true"><Rangoli className="intro-cel-base-rangoli" spin={-60}/></div>
   <div className="intro-cel-reveal" aria-hidden="true"><img className="intro-courtyard" src="/assets/generated/festival-night.webp" alt="" width="1672" height="941" loading="lazy"/><div className="intro-dance-shade"/><Rangoli className="intro-dance-rangoli" spin={70}/><Embers/></div>
   <div className="intro-dance-heading"><p>A CELEBRATION OF HER</p><h2 id="intro-dance-title">In her light,<br/><em>we celebrate.</em></h2></div>
   <div className="intro-dancer intro-dancer-left" data-depth="16"><img src="/assets/generated/garba-left.webp" alt="A woman on the left dancing Garba in red and gold" width="1024" height="1536" loading="lazy"/></div>
   <div className="intro-dancer intro-dancer-right" data-depth="-16"><img src="/assets/generated/garba-right.webp" alt="A woman on the right dancing Garba in teal and saffron gold" width="1024" height="1536" loading="lazy"/></div>
   <button className="intro-cel-lamp" aria-label="Take aarti: the diya flares and sends up sparks" data-flare><Diya/></button>
   <div className="intro-dance-bottom"><p>THE SAREE. THE SPIRIT. THE STORY.</p><a href="#story">Enter the world of Aaradhya <ArrowDown size={16}/></a></div>
  </div></section>
 </>;
}
