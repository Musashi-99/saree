'use client';
import {useEffect, useState} from 'react';

// True while the header should be tucked away: after scrolling down past the top of the page. A small scroll
// back up (or reaching the top) brings it back; tiny jitters are ignored. Keyboard focus inside the header
// always shows it.
export function useHideOnScroll(threshold = 8, top = 80) {
 const [hidden,setHidden]=useState(false);
 useEffect(()=>{
  let last=window.scrollY, frame=0;
  const update=()=>{
   frame=0;
   const y=window.scrollY, delta=y-last;
   if(y<top) setHidden(false);
   else if(Math.abs(delta)<threshold) return;
   else setHidden(delta>0);
   last=y;
  };
  const onScroll=()=>{if(!frame) frame=requestAnimationFrame(update);};
  window.addEventListener('scroll',onScroll,{passive:true});
  return ()=>{window.removeEventListener('scroll',onScroll);cancelAnimationFrame(frame);};
 },[threshold,top]);
 return hidden;
}
