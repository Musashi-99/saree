'use client';
import {useLayoutEffect} from 'react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
export default function Motion({replay=0}:{replay?:number}) {
 useLayoutEffect(() => {
  const mm=gsap.matchMedia();
  mm.add({motion:'(prefers-reduced-motion: no-preference)',desktop:'(min-width: 900px)'}, context=>{
   if(!context.conditions?.motion)return;

   // Durga enters first. Her portrait is centred independently of its entrance transform.
   const entrance=gsap.timeline({paused:true,defaults:{ease:'power3.out'}});
   entrance.from('.intro-rangoli-layer',{scale:.8,opacity:0,duration:2.4,stagger:.18,ease:'power2.out'},0)
    .from('.intro-durga-face',{yPercent:105,duration:1.85},0)
    .from('.intro-halo',{scale:.3,opacity:0,duration:2.2,ease:'power2.out'},.6)
    .from('.intro-hero-title span',{y:50,opacity:0,duration:1.1,stagger:.1},.7)
    .from('.intro-hero-kicker,.intro-hero-note,.intro-hero-scroll',{y:25,opacity:0,duration:.8,stagger:.1},1.25);
   // The hero entrance waits for the opening rite to open its ring, and for Durga's portrait to load.
   const hero=document.querySelector<HTMLImageElement>('.intro-durga-face');
   const playOpening=()=>{entrance.play();};
   const whenLoaded=()=>{
    if(!hero || hero.complete)playOpening();
    else {hero.addEventListener('load',playOpening,{once:true});hero.addEventListener('error',playOpening,{once:true});}
   };
   if(document.documentElement.dataset.revealed==='0')window.addEventListener('aaradhya:reveal',whenLoaded,{once:true});
   else whenLoaded();
   gsap.timeline({scrollTrigger:{trigger:'.intro-hero',start:'top top',end:'bottom bottom',scrub:.75}})
    .to('.intro-portrait',{yPercent:-15,ease:'none'},0)
    .to('.intro-hero-rangoli,.intro-hero-rangoli-inner',{scale:1.22,ease:'none'},0)
    .to('.intro-hero-title,.intro-hero-note,.intro-hero-kicker,.intro-hero-scroll,.intro-hero-foot',{opacity:0,y:-35,ease:'none'},0);

   // The dancers rise first on cream; then the diya is lit and the night courtyard spreads out from its flame.
   const celStage=document.querySelector<HTMLElement>('.intro-cel-stage');
   const lamp=document.querySelector<HTMLElement>('.intro-cel-lamp');
   const origin=()=>celStage&&lamp?`${((lamp.offsetLeft+lamp.offsetWidth/2)/celStage.offsetWidth*100).toFixed(2)}% ${((lamp.offsetTop+lamp.offsetHeight*.4)/celStage.offsetHeight*100).toFixed(2)}%`:'50% 80%';
   gsap.timeline({scrollTrigger:{trigger:'.intro-celebration',start:'top 75%',end:'bottom bottom',scrub:.8,invalidateOnRefresh:true}})
    .fromTo('.intro-dancer-left',{yPercent:115},{yPercent:0,duration:1.4,ease:'power2.out'},0)
    .fromTo('.intro-dancer-right',{yPercent:115},{yPercent:0,duration:1.4,ease:'power2.out'},.15)
    .fromTo('.intro-cel-lamp',{scale:0,opacity:0},{scale:1,opacity:1,duration:.55,ease:'back.out(2.2)'},1.15)
    .fromTo('.intro-cel-reveal',{clipPath:()=>`circle(0% at ${origin()})`},{clipPath:()=>`circle(150% at ${origin()})`,duration:2.1,ease:'power1.in'},1.7)
    .fromTo('.intro-courtyard',{scale:1.3},{scale:1,duration:2.3,ease:'power1.out'},1.7)
    .to('.intro-cel-base',{opacity:0,duration:.8},2.4)
    .fromTo('.intro-dance-heading',{y:45,opacity:0},{y:0,opacity:1,duration:.8,ease:'power2.out'},3.1)
    .fromTo('.intro-dance-bottom',{y:30,opacity:0},{y:0,opacity:1,duration:.8,ease:'power2.out'},3.3)
    .to({},{duration:.4});

   // Shared reference choreography: large rising figures, text behind, native scrolling.
   // A chapter may slide its background word in from one side, and grow its colour field out from behind the figures.
   gsap.utils.toArray<HTMLElement>('[data-rise-chapter]').forEach(chapter=>{
    const figures=chapter.querySelectorAll('[data-rise-figure]');
    const panels=chapter.querySelectorAll('[data-rise-panel]');
    const words=chapter.querySelectorAll('[data-rise-text]');
    const echo=chapter.querySelector('.chapter-echo');
    const wipe=chapter.querySelector<HTMLElement>('.chapter-colour-wipe');
    const side=chapter.dataset.wordFrom==='left'?-1:chapter.dataset.wordFrom==='right'?1:0;
    const tl=gsap.timeline({scrollTrigger:{trigger:chapter,start:chapter.dataset.riseStart||'top 82%',end:chapter.dataset.riseEnd||'top 8%',scrub:.75,invalidateOnRefresh:true}});
    if(wipe?.dataset.wipe==='depth')tl.fromTo(wipe,{x:0,xPercent:0,scale:.18,opacity:0,borderRadius:'50%'},{scale:1,opacity:1,borderRadius:'0%',duration:1.25,ease:'power2.out'},0);
    else if(wipe)tl.fromTo(wipe,{xPercent:100},{xPercent:0,duration:.9,ease:'power2.inOut'},0);
    if(figures.length)tl.fromTo(figures,{yPercent:125},{yPercent:0,duration:1.5,stagger:.13,ease:'power2.out'},side?.2:0);
    if(panels.length)tl.fromTo(panels,{yPercent:95},{yPercent:0,duration:1.5,ease:'power2.out'},0);
    if(words.length&&side)tl.fromTo(words,{xPercent:side*65,opacity:0},{xPercent:0,opacity:1,duration:1.35,ease:'power2.out'},0);
    else if(words.length)tl.fromTo(words,{yPercent:50,opacity:.35},{yPercent:0,opacity:1,duration:1.1,ease:'power2.out'},.2);
    if(echo&&side)tl.fromTo(echo,{xPercent:side*95},{xPercent:-side*4,duration:1.75,ease:'power1.out'},0);
   });

   // Woven in / Divinity meet from opposite sides while her halo opens behind her, once the saree has lifted.
   gsap.timeline({scrollTrigger:{trigger:'.editorial',start:'top 38%',end:'top -8%',scrub:1}})
    .fromTo('.editorial-title > span:first-child',{xPercent:-35,opacity:0},{xPercent:0,opacity:1,ease:'power2.out'},0)
    .fromTo('.editorial-title > span:last-child',{xPercent:35,opacity:0},{xPercent:0,opacity:1,ease:'power2.out'},0);
   gsap.fromTo('.bride-halo',{scale:.3,opacity:0},{scale:1,opacity:1,ease:'power2.out',scrollTrigger:{trigger:'.editorial',start:'top 30%',end:'top -30%',scrub:1}});

   gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach(el=>{
    gsap.from(el,{y:45,opacity:0,duration:1,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 94%',once:true}});
   });
   gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach(el=>{
    gsap.fromTo(el,{yPercent:-4,scale:1.1},{yPercent:4,scale:1.1,ease:'none',scrollTrigger:{trigger:el.parentElement,start:'top bottom',end:'bottom top',scrub:1}});
   });

   // Her story: captions arrive from either edge; the five expressions rise one after another.
   gsap.timeline({scrollTrigger:{trigger:'.monochrome-frame',start:'top 70%',end:'top 5%',scrub:1}})
    .fromTo('.caption-left',{x:-90,opacity:0},{x:0,opacity:1,ease:'power2.out'},0)
    .fromTo('.caption-right',{x:90,opacity:0},{x:0,opacity:1,ease:'power2.out'},0)
    .fromTo('.portrait-lotus',{rotation:-120,opacity:0},{rotation:0,opacity:1,ease:'power2.out'},0);
   gsap.fromTo('.emotion-card',{yPercent:65,opacity:0,clipPath:'inset(100% 0% 0% 0%)'},{yPercent:0,opacity:1,clipPath:'inset(0% 0% 0% 0%)',duration:1.15,stagger:.12,ease:'power3.out',scrollTrigger:{trigger:'.emotion-cards',start:'top 92%',toggleActions:'play none none reverse'}});

   gsap.timeline({scrollTrigger:{trigger:'.craft-grid',start:'top 90%',end:'top 35%',scrub:1}})
    .fromTo('.craft-visual',{xPercent:-14,opacity:0},{xPercent:0,opacity:1,ease:'power2.out'},0)
    .fromTo('.craft-copy',{xPercent:14,opacity:0},{xPercent:0,opacity:1,ease:'power2.out'},0);

   // Durga remains a complete, upright devotional composition, never split or distorted.
   const divine=gsap.timeline({scrollTrigger:{trigger:'.divine',start:'top 28%',end:'bottom bottom',scrub:.85}});
   divine.fromTo('.durga-figure',{yPercent:125},{yPercent:0,duration:1.35,ease:'power2.out'},0)
    .fromTo('.divine-aura',{scale:.4,opacity:0},{scale:1,opacity:1,duration:1.5,ease:'power2.out'},.3)
    .fromTo('.divine-word-one',{xPercent:-25,opacity:.3},{xPercent:0,opacity:1,duration:1.25,ease:'power2.out'},.15)
    .fromTo('.divine-word-two',{xPercent:25,opacity:.3},{xPercent:0,opacity:1,duration:1.25,ease:'power2.out'},.25)
    .fromTo('.divine-colour-wipe',{xPercent:100},{xPercent:0,duration:1,ease:'power2.inOut'},1.3)
    .fromTo('.divine-statement',{opacity:0,y:25},{opacity:1,y:0,duration:.65},1.3)
    .to('.durga-figure',{yPercent:-3,duration:.65,ease:'none'},1.65);

   // Cards in the left column arrive from the left, the right column from the right; each image unveils upward.
   const slideCards=(selector:string,media:string)=>gsap.utils.toArray<HTMLElement>(selector).forEach((card,i)=>{
    const side=i%2===0?-1:1;
    gsap.timeline({scrollTrigger:{trigger:card,start:'top 90%',toggleActions:'play none none reverse'}})
     .fromTo(card,{x:side*80,y:70,opacity:0},{x:0,y:0,opacity:1,duration:1.25,ease:'power3.out'},0)
     .fromTo(card.querySelector(media),{clipPath:'inset(100% 0% 0% 0%)'},{clipPath:'inset(0% 0% 0% 0%)',duration:1.35,ease:'power3.inOut'},.05);
   });
   slideCards('.collection','.collection-photo');
   slideCards('.gallery-item','button');

   gsap.timeline({scrollTrigger:{trigger:'#manifesto-title',start:'top 95%',end:'top 45%',scrub:1}})
    .fromTo('.mf-left',{xPercent:-30,opacity:0},{xPercent:0,opacity:1,ease:'power2.out'},0)
    .fromTo('.mf-right',{xPercent:30,opacity:0},{xPercent:0,opacity:1,ease:'power2.out'},0);

   gsap.fromTo('.footer-mandala',{scale:.6,opacity:0},{scale:1,opacity:1,ease:'none',scrollTrigger:{trigger:'.footer',start:'top bottom',end:'bottom bottom',scrub:1}});
   gsap.from('.footer-blessing,.footer-col',{y:40,opacity:0,duration:1,stagger:.1,ease:'power3.out',scrollTrigger:{trigger:'.footer',start:'top 85%',once:true}});
   gsap.fromTo('.footer-giant>span',{yPercent:105},{yPercent:0,duration:1.2,stagger:.06,ease:'power4.out',scrollTrigger:{trigger:'.footer-giant',start:'top bottom',toggleActions:'play none none reverse'}});

   let active=true;
   const refresh=()=>{if(active)ScrollTrigger.refresh();};
   document.fonts.ready.then(refresh);
   const photos=Array.from(document.images).filter(img=>!img.complete);
   photos.forEach(img=>img.addEventListener('load',refresh,{once:true}));
   return()=>{active=false;photos.forEach(img=>img.removeEventListener('load',refresh));window.removeEventListener('aaradhya:reveal',whenLoaded);hero?.removeEventListener('load',playOpening);hero?.removeEventListener('error',playOpening);};
  });
  return()=>mm.revert();
 },[replay]);
 return null;
}
