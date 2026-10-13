'use client';
import {useEffect,useRef} from 'react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

// One sheet of real saree silk, drawn with WebGL so it can ripple, sway and catch the light.
// Each `.saree-transition` marker owns a scroll range; the sheet floats in from above, rests while
// its verse is shown, then floats away below. Progress is eased toward the scroll position every frame,
// and the cloth keeps breathing on its own clock, so it never moves in steps.

const VERT=`
attribute vec2 a_uv;
uniform float u_time,u_p,u_m,u_aspect,u_touch;
uniform mediump float u_shadow;
uniform vec2 u_mouse;
varying vec2 v_uv;varying vec3 v_n;
float surface(vec2 uv){
 float t=u_time;
 float calm=.030*sin(uv.x*4.6+t*.85+uv.y*1.6)+.022*sin(uv.y*5.8-t*1.05+uv.x*2.1)+.010*sin((uv.x+uv.y)*9.0+t*1.6);
 float drift=.10*sin(uv.x*3.0-t*1.3+uv.y*3.6)+.06*sin(uv.y*7.0+t*1.9-uv.x*1.2);
 float rim=.55+.9*pow(abs(uv.x-.5)*2.,2.)+.6*pow(abs(uv.y-.5)*2.,2.);
 vec2 d=(uv-u_mouse)*vec2(u_aspect,1.);
 float touch=u_touch*.07*exp(-dot(d,d)*7.);
 return (calm+u_m*drift)*rim-touch;
}
void main(){
 v_uv=a_uv;
 float z=surface(a_uv),e=.004;
 float du=(surface(a_uv+vec2(e,0.))-surface(a_uv-vec2(e,0.)))/(2.*e);
 float dv=(surface(a_uv+vec2(0.,e))-surface(a_uv-vec2(0.,e)))/(2.*e);
 v_n=normalize(vec3(-du*.42,dv*.42,1.));
 float pin=smoothstep(0.,.44,u_p),pout=smoothstep(.56,1.,u_p);
 float travel=(1.-pin)*2.8-pout*2.8;
 float sway=sin(u_p*6.2832)*.085,tilt=sin(u_p*6.2832+.8)*.042;
 vec2 pos=vec2((a_uv.x-.5)*2.24,(.5-a_uv.y)*2.36);
 pos.y+=u_m*.11*pow(abs(a_uv.x-.5)*2.,2.);
 float c=cos(tilt),s=sin(tilt),px=pos.x*u_aspect;
 pos=vec2((px*c-pos.y*s)/u_aspect,px*s+pos.y*c)+vec2(sway,travel);
 if(u_shadow>.5)pos+=vec2(.012,-.045);
 gl_Position=vec4(pos,0.,1.-z*.55);
}`;

const FRAG=`
precision mediump float;
uniform sampler2D u_tex;uniform vec2 u_cover;uniform float u_has,u_gain;uniform mediump float u_shadow;uniform vec3 u_base;
varying vec2 v_uv;varying vec3 v_n;
float band(float x,float w){return smoothstep(0.,w,x)*smoothstep(0.,w,1.-x);}
void main(){
 if(u_shadow>.5){gl_FragColor=vec4(.06,.02,.01,.34*band(v_uv.x,.16)*band(v_uv.y,.16));return;}
 vec3 col=(u_has>.5?texture2D(u_tex,(v_uv-.5)*u_cover+.5).rgb:u_base)*u_gain;
 vec3 n=normalize(v_n),L=normalize(vec3(-.4,.5,.8)),H=normalize(L+vec3(0.,0.,1.));
 float nh=max(dot(n,H),0.);
 col=col*(.70+.42*max(dot(n,L),0.))+vec3(1.,.93,.8)*(pow(nh,34.)*.38+pow(nh,5.)*.09);
 col*=mix(.82,1.,band(v_uv.x,.03)*band(v_uv.y,.03));
 gl_FragColor=vec4(col,band(v_uv.x,.002)*band(v_uv.y,.002));
}`;

function build(gl:WebGLRenderingContext){
 const shader=(type:number,src:string)=>{const s=gl.createShader(type)!;gl.shaderSource(s,src);gl.compileShader(s);return s;};
 const prog=gl.createProgram()!;gl.attachShader(prog,shader(gl.VERTEX_SHADER,VERT));gl.attachShader(prog,shader(gl.FRAGMENT_SHADER,FRAG));gl.linkProgram(prog);
 if(gl.getProgramParameter(prog,gl.LINK_STATUS))return prog;
 console.warn('Silk veil falling back:',gl.getProgramInfoLog(prog));return null;
}

const BASE:Record<string,[number,number,number]>={gold:[.55,.42,.2],red:[.7,.12,.1],tissue:[.66,.3,.22]};
// The golden silk was photographed in low light; lift it so it reads as gold rather than bronze.
const GAIN:Record<string,number>={gold:1.32,red:1,tissue:1.06};
const SX=72,SY=48;

export default function SilkVeil({paused}:{paused:boolean}){
 const ref=useRef<HTMLCanvasElement>(null);
 const pausedRef=useRef(paused);
 useEffect(()=>{pausedRef.current=paused;},[paused]);
 useEffect(()=>{
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const canvas=ref.current!;
  const veils=[...document.querySelectorAll<HTMLElement>('.saree-transition')].map(el=>({el,verse:el.querySelector<HTMLElement>('.saree-verse'),fabric:el.dataset.fabric||'gold',target:0,p:0,tex:null as WebGLTexture|null,ratio:1}));
  const triggers=veils.map(v=>ScrollTrigger.create({trigger:v.el,start:'top 92%',end:'top 8%',onUpdate:s=>{v.target=s.progress;},onRefresh:s=>{v.target=s.progress;}}));
  veils.forEach((v,i)=>{v.target=v.p=triggers[i].progress;});
  const fine=matchMedia('(hover: hover) and (pointer: fine)').matches;
  const mouse={x:.5,y:.5,amt:0,goal:0};
  const onMove=(e:PointerEvent)=>{mouse.x=e.clientX/innerWidth;mouse.y=e.clientY/innerHeight;mouse.goal=1;};
  if(fine)window.addEventListener('pointermove',onMove,{passive:true});

  // The renderer is prepared once the opening rite has opened, when the browser is idle, so compiling
  // shaders and uploading the silk never stalls the opening. Without WebGL, a single sheet of the same
  // fabric still floats across using a transform.
  let draw:(v:typeof veils[number],t:number,m:number)=>void=()=>{};
  let clear=()=>{};
  let dispose=()=>{};
  let ready=false;
  const prepare=()=>{
  if(ready)return;ready=true;
  const gl=canvas.getContext('webgl',{alpha:true,premultipliedAlpha:false,antialias:true});
  const prog=gl&&build(gl);
  if(!gl||!prog){
   const sheet=document.createElement('div');sheet.className='silk-fallback';canvas.after(sheet);
   draw=v=>{const pin=gsap.parseEase('power3.out')(Math.min(v.p/.44,1)),pout=gsap.parseEase('sine.inOut')(Math.max((v.p-.56)/.44,0));sheet.style.backgroundImage=`url(/assets/saree/${v.fabric}.webp)`;sheet.style.visibility='visible';sheet.style.transform=`translate3d(${Math.sin(v.p*6.283)*3}vw,${(pin-1)*120+pout*120}vh,0) rotate(${Math.sin(v.p*6.283+.8)*2}deg)`;};
   clear=()=>{sheet.style.visibility='hidden';};
   dispose=()=>sheet.remove();
  } else {
   gl.useProgram(prog);
   const uvs=new Float32Array((SX+1)*(SY+1)*2),idx=new Uint16Array(SX*SY*6);
   for(let j=0,k=0;j<=SY;j++)for(let i=0;i<=SX;i++){uvs[k++]=i/SX;uvs[k++]=j/SY;}
   for(let j=0,k=0;j<SY;j++)for(let i=0;i<SX;i++){const a=j*(SX+1)+i,b=a+1,c=a+SX+1,d=c+1;idx.set([a,c,b,b,c,d],k);k+=6;}
   gl.bindBuffer(gl.ARRAY_BUFFER,gl.createBuffer());gl.bufferData(gl.ARRAY_BUFFER,uvs,gl.STATIC_DRAW);
   const loc=gl.getAttribLocation(prog,'a_uv');gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
   gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,gl.createBuffer());gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,idx,gl.STATIC_DRAW);
   gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);
   const u=(n:string)=>gl.getUniformLocation(prog,n);
   const U={time:u('u_time'),p:u('u_p'),m:u('u_m'),aspect:u('u_aspect'),shadow:u('u_shadow'),touch:u('u_touch'),mouse:u('u_mouse'),cover:u('u_cover'),has:u('u_has'),gain:u('u_gain'),base:u('u_base'),tex:u('u_tex')};
   gl.uniform1i(U.tex,0);
   veils.forEach(v=>{const img=new Image();img.decoding='async';img.onload=()=>{const tex=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,tex);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,img);v.tex=tex;v.ratio=img.naturalWidth/img.naturalHeight;};img.src=`/assets/saree/${v.fabric}.webp`;});
   const size=()=>{const dpr=Math.min(devicePixelRatio,1.5);canvas.width=Math.round(innerWidth*dpr);canvas.height=Math.round(innerHeight*dpr);gl.viewport(0,0,canvas.width,canvas.height);};
   size();window.addEventListener('resize',size);
   draw=(v,t,m)=>{
    const aspect=innerWidth/innerHeight,sheet=aspect*2.24/2.36;
    gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform1f(U.time,t);gl.uniform1f(U.p,v.p);gl.uniform1f(U.m,m);gl.uniform1f(U.aspect,aspect);
    gl.uniform1f(U.touch,mouse.amt);gl.uniform2f(U.mouse,mouse.x,mouse.y);
    gl.uniform2f(U.cover,sheet>v.ratio?1:sheet/v.ratio,sheet>v.ratio?v.ratio/sheet:1);
    gl.uniform1f(U.has,v.tex?1:0);gl.uniform1f(U.gain,GAIN[v.fabric]??1);gl.uniform3fv(U.base,BASE[v.fabric]||BASE.gold);
    if(v.tex)gl.bindTexture(gl.TEXTURE_2D,v.tex);
    for(const s of [1,0]){gl.uniform1f(U.shadow,s);gl.drawElements(gl.TRIANGLES,idx.length,gl.UNSIGNED_SHORT,0);}
    canvas.style.visibility='visible';
   };
   clear=()=>{gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);canvas.style.visibility='hidden';};
   dispose=()=>window.removeEventListener('resize',size);
  }
  };
  const html=document.documentElement,ric='requestIdleCallback' in window?window.requestIdleCallback.bind(window):null;
  let idle=0;
  const schedule=()=>{idle=ric?ric(prepare,{timeout:2500}):window.setTimeout(prepare,600);};
  if(html.dataset.revealed==='0')window.addEventListener('aaradhya:reveal',schedule,{once:true});else schedule();

  let clock=0,motion=0,shown=false;
  const tick=(_t:number,dtMs:number)=>{
   const dt=Math.min(dtMs,64)/1000;
   if(!pausedRef.current)clock+=dt;
   const ease=1-Math.exp(-dt*3.2);
   let active:typeof veils[number]|undefined,speed=0,cover=-1;
   for(const v of veils){
    // A jump (a menu link, a flung scroll) skips the veil instead of sweeping it over the destination.
    const before=v.p;v.p=Math.abs(v.target-v.p)>.6?v.target:v.p+(v.target-v.p)*ease;if(Math.abs(v.target-v.p)<1e-4)v.p=v.target;
    // Draw whichever sheet covers the most of the screen.
    if(v.p>.0005&&v.p<.9995&&1-Math.abs(v.p-.5)>cover){cover=1-Math.abs(v.p-.5);active=v;speed=Math.abs(v.p-before)/Math.max(dt,1e-3);}
    if(v.verse){const o=Math.min(Math.max((v.p-.34)/.1,0),1)*(1-Math.min(Math.max((v.p-.56)/.1,0),1));v.verse.style.opacity=o.toFixed(3);v.verse.style.transform=`translate3d(0,${((.5-v.p)*90).toFixed(1)}px,0)`;}
   }
   mouse.amt+=(mouse.goal-mouse.amt)*(1-Math.exp(-dt*4));mouse.goal*=Math.exp(-dt*1.5);
   if(!active){if(shown){clear();shown=false;}return;}
   if(!ready)prepare();
   const rest=Math.min(Math.max((active.p-.3)/.14,0),1)*(1-Math.min(Math.max((active.p-.56)/.14,0),1));
   motion+=(Math.min(Math.max((1-rest)*.45,speed*2.2),1)-motion)*(1-Math.exp(-dt*3));
   draw(active,clock,motion);shown=true;
  };
  gsap.ticker.add(tick);
  return()=>{gsap.ticker.remove(tick);triggers.forEach(t=>t.kill());window.removeEventListener('pointermove',onMove);window.removeEventListener('aaradhya:reveal',schedule);if(ric)window.cancelIdleCallback(idle);else window.clearTimeout(idle);dispose();};
 },[]);
 return <canvas ref={ref} className="silk-canvas" aria-hidden="true"/>;
}
