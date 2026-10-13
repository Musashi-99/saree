'use client';
import {useLayoutEffect,useRef,type CSSProperties} from 'react';
import gsap from 'gsap';
import Diya from './Diya';

const FLAMES=24;
const RING=2*Math.PI*180;

// The opening rite: the diya is lit, an aarti ring of fire circles it, Maa Durga appears within the ring,
// and the ring opens onto the site. Motion waits for `aaradhya:reveal` before playing the hero entrance.
export default function OpeningRite({replay}:{replay:number}){
 const root=useRef<HTMLDivElement>(null);
 useLayoutEffect(()=>{
  const el=root.current!,html=document.documentElement;
  const reveal=()=>{html.dataset.revealed='1';window.dispatchEvent(new Event('aaradhya:reveal'));};
  el.style.animation='none';el.style.pointerEvents='';
  if(matchMedia('(prefers-reduced-motion: reduce)').matches){gsap.set(el,{autoAlpha:0});reveal();return;}
  html.dataset.revealed='0';
  if('scrollRestoration' in history)history.scrollRestoration='manual';
  window.scrollTo(0,0);
  html.classList.add('rite-active');
  const stage=el.querySelector<HTMLElement>('.rite-stage')!;
  const centre=()=>{const b=stage.getBoundingClientRect();el.style.setProperty('--hx',`${b.left+b.width/2}px`);el.style.setProperty('--hy',`${b.top+b.height/2}px`);};
  let tl:gsap.core.Timeline;
  const ctx=gsap.context(()=>{
   centre();
   gsap.set(el,{autoAlpha:1,'--hole':'-8vmax'});
   tl=gsap.timeline({defaults:{ease:'power2.out'},onComplete:()=>{gsap.set(el,{autoAlpha:0});html.classList.remove('rite-active');}});
   // The unlit diya fades in with CSS before the script loads. Take over from wherever that fade is
   // (a replay starts it from hidden) so GSAP can later carry the diya down to Durga's feet.
   const diya=el.querySelector<HTMLElement>('.rite-diya')!,shown=replay>0?0:parseFloat(getComputedStyle(diya).opacity);
   diya.style.animation='none';gsap.set(diya,{opacity:shown,y:26*(1-shown)});
   tl.to(diya,{opacity:1,y:0,duration:.8*(1-shown)+.01},.15)
    .fromTo('.rite-diya .diya-flame',{scale:0},{scale:1,duration:.75,ease:'back.out(2.6)'},.9)
    .fromTo('.rite-diya .diya-glow',{scale:0,opacity:0},{scale:1,opacity:1,duration:1},.9)
    .fromTo('.rite-light',{opacity:0,scale:.5},{opacity:1,scale:1,duration:1.4},1.05)
    .set('.rite-ring',{opacity:1},1.45)
    .fromTo('.rite-orbit',{rotation:0},{rotation:360,svgOrigin:'200 200',duration:1.5,ease:'power1.inOut'},1.45)
    .fromTo('.rite-trail',{strokeDashoffset:RING},{strokeDashoffset:0,duration:1.5,ease:'power1.inOut'},1.45)
    .fromTo('.rite-flames i',{scale:0,opacity:0},{scale:1,opacity:1,duration:.35,ease:'back.out(3)',stagger:1.4/FLAMES},1.52)
    .to('.rite-spark',{opacity:0,duration:.3},2.9)
    .to('.rite-diya',{y:()=>stage.offsetHeight*.43,scale:.74,duration:1.1,ease:'power3.inOut'},2.85)
    .fromTo('.rite-durga',{opacity:0,scale:.8,filter:'brightness(2.6) blur(10px)'},{opacity:1,scale:1,filter:'brightness(1) blur(0px)',duration:1.4},3.0)
    .fromTo('.rite-words>*',{opacity:0,y:14},{opacity:1,y:0,duration:.8,stagger:.15},3.55)
    .addLabel('open',4.75)
    .call(()=>{reveal();el.style.pointerEvents='none';html.classList.remove('rite-active');},undefined,'open')
    .to(el,{'--hole':'150vmax',duration:1.7,ease:'power2.in'},'open')
    .to('.rite-stage',{scale:1.3,duration:1.7,ease:'power2.in'},'open')
    .to('.rite-words,.rite-skip',{opacity:0,duration:.5},'open');
  },el);
  // Any click, tap or key skips to the opening of the ring.
  const skip=(e:Event)=>{if(e instanceof KeyboardEvent&&!['Escape','Enter',' '].includes(e.key))return;if(tl.time()<tl.labels.open-.05)tl.seek(tl.labels.open-.05);};
  el.addEventListener('click',skip);window.addEventListener('keydown',skip);window.addEventListener('resize',centre);
  return()=>{el.removeEventListener('click',skip);window.removeEventListener('keydown',skip);window.removeEventListener('resize',centre);ctx.revert();html.classList.remove('rite-active');};
 },[replay]);
 return <div className="rite" ref={root} aria-hidden="true">
  <div className="rite-stage">
   <div className="rite-light"/>
   <div className="rite-durga"><img src="/assets/generated/durga-face.webp" alt="" width="1199" height="1312" fetchPriority="high"/></div>
   <svg className="rite-ring" viewBox="0 0 400 400"><defs><linearGradient id="rite-fire" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff1b8"/><stop offset=".45" stopColor="#ffb43c"/><stop offset="1" stopColor="#ff6a10"/></linearGradient></defs><circle cx="200" cy="200" r="190" className="rite-guide"/><circle cx="200" cy="200" r="180" className="rite-trail" transform="rotate(-90 200 200)" strokeDasharray={RING}/><g className="rite-orbit"><circle className="rite-spark" cx="200" cy="20" r="6"/></g></svg>
   <div className="rite-flames">{Array.from({length:FLAMES},(_,i)=><b key={i} style={{'--a':`${i*360/FLAMES}deg`} as CSSProperties}><i/></b>)}</div>
   <Diya className="rite-diya"/>
  </div>
  <div className="rite-words"><p className="rite-name">AARADHYA</p><p className="rite-chant"><span lang="hi">जय माता दी</span> · JAI MATA DI</p></div>
  <button className="rite-skip" tabIndex={-1}>Skip</button>
 </div>;
}
