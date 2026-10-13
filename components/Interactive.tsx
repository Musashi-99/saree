'use client';
import {useEffect,useRef} from 'react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

const petalColours=['#f4a300','#ec8a12','#e0601a','#c2263f','#fff1d0'];

// Ambient, pointer and scroll-velocity behaviour. Scroll-scrubbed choreography stays in Motion.
export default function Interactive({paused}:{paused:boolean}){
 const pausedRef=useRef(paused);
 useEffect(()=>{pausedRef.current=paused;},[paused]);
 useEffect(()=>{
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const fine=matchMedia('(hover: hover) and (pointer: fine)').matches;
  const off:(()=>void)[]=[];
  const on=<K extends keyof HTMLElementEventMap>(el:EventTarget,type:K,fn:(e:HTMLElementEventMap[K])=>void,opts?:AddEventListenerOptions)=>{el.addEventListener(type,fn as EventListener,opts);off.push(()=>el.removeEventListener(type,fn as EventListener));};

  const ctx=gsap.context(()=>{
   // Mandalas and halos turn continuously and spin faster while the visitor scrolls.
   const spins=gsap.utils.toArray<HTMLElement>('[data-spin]').map(el=>{const s=parseFloat(el.dataset.spin||'60');return gsap.to(el,{rotation:s>0?360:-360,duration:Math.abs(s),repeat:-1,ease:'none'});});
   // Two ribbon rows drift in opposite directions; scrolling up reverses them.
   const rows=gsap.utils.toArray<HTMLElement>('[data-marquee]').map(row=>({track:row.querySelector<HTMLElement>('.marquee-track')!,dir:parseFloat(row.dataset.marquee||'1'),pos:0}));
   let boost=0,direction=1,flow=1;
   ScrollTrigger.create({start:0,end:'max',onUpdate:self=>{boost=Math.max(boost,Math.min(Math.abs(self.getVelocity())/260,7));direction=self.direction;}});
   const tick=(_t:number,dt:number)=>{
    // Decay by elapsed time, not frame count, so the burst settles at the same pace at any frame rate.
    const frames=Math.min(dt,100)/16.667;
    boost*=Math.pow(.93,frames);
    const stopped=pausedRef.current;
    spins.forEach(t=>t.timeScale(stopped?0:1+boost));
    flow+=((stopped?0:direction*(1+boost*1.6))-flow)*(1-Math.pow(.92,frames));
    rows.forEach(r=>{r.pos=(r.pos+flow*r.dir*dt*.0016+50)%50;gsap.set(r.track,{xPercent:-r.pos});});
   };
   gsap.ticker.add(tick);off.push(()=>gsap.ticker.remove(tick));

   // Reading progress along the top edge.
   gsap.fromTo('.scroll-progress i',{scaleX:0},{scaleX:1,ease:'none',scrollTrigger:{start:0,end:'max',scrub:.3}});

   // Petals offered with a tap or click anywhere in the opening scene.
   document.querySelectorAll<HTMLElement>('[data-petals]').forEach(stage=>{
    on(stage,'click',e=>{
     if((e.target as HTMLElement).closest('a,button'))return;
     if(stage.querySelectorAll('.petal').length>70)return;
     const box=stage.getBoundingClientRect(),x=e.clientX-box.left,y=e.clientY-box.top;
     const ring=document.createElement('span');ring.className='petal-ripple';stage.appendChild(ring);
     gsap.fromTo(ring,{x,y,scale:.2,opacity:.9},{scale:2.6,opacity:0,duration:1.3,ease:'power2.out',onComplete:()=>ring.remove()});
     for(let i=0;i<11;i++){
      const p=document.createElement('span');p.className='petal';p.style.background=gsap.utils.random(petalColours);stage.appendChild(p);
      const angle=gsap.utils.random(-Math.PI,0),dist=gsap.utils.random(50,170);
      gsap.set(p,{x,y,rotation:gsap.utils.random(0,360),scale:gsap.utils.random(.55,1.15)});
      gsap.timeline({onComplete:()=>p.remove()})
       .to(p,{x:x+Math.cos(angle)*dist,y:y+Math.sin(angle)*dist*.75,duration:.75,ease:'power3.out'})
       .to(p,{y:`+=${gsap.utils.random(220,380)}`,x:`+=${gsap.utils.random(-70,70)}`,rotation:`+=${gsap.utils.random(-300,300)}`,duration:gsap.utils.random(2.4,3.6),ease:'sine.in'},'>-.15')
       .to(p,{opacity:0,duration:.9},'-=.9');
     }
    });
   });

   // The celebration diya flares when approached; a tap takes aarti and lifts a shower of sparks.
   document.querySelectorAll<HTMLElement>('[data-flare]').forEach(lamp=>{
    const flame=lamp.querySelector('.diya-flame'),parts=[flame,lamp.querySelector('.diya-glow')].filter(Boolean);
    const flare=()=>{gsap.timeline().to(parts,{scale:1.45,duration:.22,ease:'power2.out',overwrite:true}).to(parts,{scale:1,duration:1,ease:'elastic.out(1,.35)'});};
    on(lamp,'pointerenter',flare);
    on(lamp,'click',()=>{
     flare();
     const host=lamp.offsetParent as HTMLElement|null;if(!host||!flame)return;
     const b=host.getBoundingClientRect(),f=flame.getBoundingClientRect(),x=f.left+f.width/2-b.left,y=f.top+f.height*.3-b.top;
     const ring=document.createElement('span');ring.className='spark-ring';host.appendChild(ring);
     gsap.fromTo(ring,{x,y,scale:.2,opacity:1},{scale:3.2,opacity:0,duration:1.1,ease:'power2.out',onComplete:()=>ring.remove()});
     for(let i=0;i<22;i++){
      const s=document.createElement('span');s.className='spark';host.appendChild(s);
      const life=gsap.utils.random(1.3,2.2);
      gsap.timeline({onComplete:()=>s.remove()})
       .fromTo(s,{x,y,scale:gsap.utils.random(.6,1.4),opacity:1},{x:x+gsap.utils.random(-130,130),y:y-gsap.utils.random(110,300),duration:life,ease:'power2.out'},0)
       .to(s,{opacity:0,duration:life*.45,ease:'power1.in'},life*.55);
     }
    });
   });

   if(!fine)return;

   // A gold zari thread, twisted with a crimson one, trails the pointer through the craft chapter.
   const loom=document.querySelector<HTMLCanvasElement>('[data-thread]');
   const pen=loom?.getContext('2d');
   if(loom&&pen){
    const host=loom.parentElement!,dpr=Math.min(devicePixelRatio,2),life=1100;
    let w=0,h=0,dirty=false;
    const size=()=>{w=host.offsetWidth;h=host.offsetHeight;loom.width=w*dpr;loom.height=h*dpr;pen.setTransform(dpr,0,0,dpr,0,0);};
    size();const ro=new ResizeObserver(size);ro.observe(host);off.push(()=>ro.disconnect());
    const pts:{x:number,y:number,t:number}[]=[];
    on(host,'pointermove',e=>{const b=host.getBoundingClientRect();pts.push({x:e.clientX-b.left,y:e.clientY-b.top,t:performance.now()});});
    const weave=()=>{
     const now=performance.now();
     while(pts.length&&now-pts[0].t>life)pts.shift();
     if(pts.length<2){if(dirty){pen.clearRect(0,0,w,h);dirty=false;}return;}
     pen.clearRect(0,0,w,h);dirty=true;pen.lineCap='round';
     for(let i=1;i<pts.length;i++){
      const a=pts[i-1],c=pts[i],k=1-(now-c.t)/life,wob=Math.sin(c.t/90)*3;
      pen.strokeStyle=`rgba(122,24,34,${k*.5})`;pen.lineWidth=.5+k;pen.beginPath();pen.moveTo(a.x+wob,a.y-wob);pen.lineTo(c.x+wob,c.y-wob);pen.stroke();
      pen.strokeStyle=`rgba(190,146,66,${k*.9})`;pen.lineWidth=.6+k*1.6;pen.beginPath();pen.moveTo(a.x,a.y);pen.lineTo(c.x,c.y);pen.stroke();
     }
     const head=pts[pts.length-1];pen.fillStyle='rgba(255,226,150,.95)';pen.beginPath();pen.arc(head.x,head.y,2.4,0,Math.PI*2);pen.fill();
    };
    gsap.ticker.add(weave);off.push(()=>gsap.ticker.remove(weave));
   }

   // Layers drift against the pointer for depth.
   const layers=gsap.utils.toArray<HTMLElement>('[data-depth]').map(el=>({d:parseFloat(el.dataset.depth||'0'),x:gsap.quickTo(el,'x',{duration:1.1,ease:'power3'}),y:gsap.quickTo(el,'y',{duration:1.1,ease:'power3'})}));
   on(window,'pointermove',e=>{const nx=e.clientX/innerWidth*2-1,ny=e.clientY/innerHeight*2-1;layers.forEach(l=>{l.x(nx*l.d);l.y(ny*l.d*.6);});},{passive:true});

   // Soft lamplight that follows the pointer inside its section.
   document.querySelectorAll<HTMLElement>('[data-light]').forEach(light=>{
    const host=light.parentElement!;
    const lx=gsap.quickTo(light,'x',{duration:.7,ease:'power3'}),ly=gsap.quickTo(light,'y',{duration:.7,ease:'power3'});
    on(host,'pointermove',e=>{const b=host.getBoundingClientRect();lx(e.clientX-b.left);ly(e.clientY-b.top);});
    on(host,'pointerenter',e=>{const b=host.getBoundingClientRect();gsap.set(light,{x:e.clientX-b.left,y:e.clientY-b.top});light.classList.add('is-lit');});
    on(host,'pointerleave',()=>light.classList.remove('is-lit'));
   });

   // The bride turns gently toward the visitor.
   const bride=document.querySelector<HTMLElement>('.editorial-portrait .rising-figure img');
   const story=document.querySelector<HTMLElement>('.editorial');
   if(bride&&story){
    const ry=gsap.quickTo(bride,'rotationY',{duration:1.2,ease:'power3'}),rx=gsap.quickTo(bride,'rotationX',{duration:1.2,ease:'power3'});
    on(story,'pointermove',e=>{const b=story.getBoundingClientRect();ry(((e.clientX-b.left)/b.width-.5)*10);rx(-((e.clientY-b.top)/b.height-.5)*4);});
    on(story,'pointerleave',()=>{ry(0);rx(0);});
   }

   // Cards tilt under the pointer with a moving sheen.
   gsap.utils.toArray<HTMLElement>('[data-tilt]').forEach(el=>{
    const rx=gsap.quickTo(el,'rotationX',{duration:.6,ease:'power3'}),ry=gsap.quickTo(el,'rotationY',{duration:.6,ease:'power3'});
    on(el,'pointermove',e=>{const b=el.getBoundingClientRect(),px=(e.clientX-b.left)/b.width,py=(e.clientY-b.top)/b.height;ry((px-.5)*9);rx(-(py-.5)*9);el.style.setProperty('--gx',`${px*100}%`);el.style.setProperty('--gy',`${py*100}%`);});
    on(el,'pointerleave',()=>{rx(0);ry(0);});
   });

   // Small controls lean toward the pointer.
   gsap.utils.toArray<HTMLElement>('[data-magnetic]').forEach(el=>{
    const mx=gsap.quickTo(el,'x',{duration:.8,ease:'elastic.out(1,.45)'}),my=gsap.quickTo(el,'y',{duration:.8,ease:'elastic.out(1,.45)'});
    on(el,'pointermove',e=>{const b=el.getBoundingClientRect();mx((e.clientX-b.left-b.width/2)*.35);my((e.clientY-b.top-b.height/2)*.35);});
    on(el,'pointerleave',()=>{mx(0);my(0);});
   });

   // A trailing ring that grows over links and names what a click will do.
   const ring=document.querySelector<HTMLElement>('.cursor-ring'),dot=document.querySelector<HTMLElement>('.cursor-dot');
   if(ring&&dot){
    document.documentElement.classList.add('has-cursor');off.push(()=>document.documentElement.classList.remove('has-cursor'));
    const label=ring.querySelector('span')!;
    const rx=gsap.quickTo(ring,'x',{duration:.5,ease:'power3'}),ry=gsap.quickTo(ring,'y',{duration:.5,ease:'power3'}),dx=gsap.quickTo(dot,'x',{duration:.12}),dy=gsap.quickTo(dot,'y',{duration:.12});
    on(window,'pointermove',e=>{rx(e.clientX);ry(e.clientY);dx(e.clientX);dy(e.clientY);ring.classList.add('is-visible');dot.classList.add('is-visible');},{passive:true});
    on(document,'pointerleave',()=>{ring.classList.remove('is-visible');dot.classList.remove('is-visible');});
    on(document,'pointerover',e=>{
     const t=e.target as HTMLElement;
     const labelled=t.closest<HTMLElement>('[data-cursor]'),link=t.closest('a,button');
     const text=labelled&&(!link||link===labelled)?labelled.dataset.cursor||'':'';
     label.textContent=text;
     ring.classList.toggle('has-label',!!text);
     ring.classList.toggle('is-link',!text&&!!link);
    });
    on(window,'pointerdown',()=>ring.classList.add('is-pressed'));
    on(window,'pointerup',()=>ring.classList.remove('is-pressed'));
   }
  });
  return()=>{off.forEach(f=>f());ctx.revert();};
 },[]);
 return <><div className="scroll-progress" aria-hidden="true"><i/></div><div className="cursor-ring" aria-hidden="true"><span/></div><div className="cursor-dot" aria-hidden="true"/></>;
}
