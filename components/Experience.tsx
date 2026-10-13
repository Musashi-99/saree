'use client';
import { Fragment, useState } from 'react';
import { ArrowUpRight, ArrowDown, ArrowUp, ArrowRight, ChevronLeft, ChevronRight, Menu } from 'lucide-react';
import Photo from './Photo';
import Motion from './Motion';
import Interactive from './Interactive';
import OpeningRite from './OpeningRite';
import SareeVeil from './SareeVeil';
import SilkVeil from './SilkVeil';
import DevotionalIntro from './DevotionalIntro';
import RisingFigure, {ChapterScene} from './RisingFigure';
import {Rangoli,Halo} from './Sacred';
import Modal from './Modal';
import {collections, gallery, type Collection} from './content';

function Lotus({className=''}:{className?:string}) { return <svg className={className} viewBox="0 0 64 64" fill="none" aria-hidden="true"><path d="M32 8C15 24 23 41 32 49C41 41 49 24 32 8ZM32 49C16 49 7 36 9 23C22 25 31 36 32 49ZM32 49C48 49 57 36 55 23C42 25 33 36 32 49ZM13 51Q32 62 51 51" stroke="currentColor" strokeWidth="1.2"/></svg>; }
function TextLink({href,children}:{href:string;children:React.ReactNode}) { return <a className="text-link" href={href}>{children}<ArrowUpRight size={17}/></a>; }
// Letters are split so each one can respond to the cursor; the heading keeps its full text as the accessible name.
function SplitWord({text}:{text:string}) { return <span aria-hidden="true">{text.split('').map((c,i)=><span key={i} className={c===' '?'char space':'char'}>{c===' '?' ':c}</span>)}</span>; }
const nav=[['The story','#story'],['Collections','#collections'],['Our essence','#essence'],['The journal','#journal'],['Her story','#her-story']];
const ribbonOne='HERITAGE ✧ EXPRESSION ✧ DEVOTION ✧ ';
const ribbonTwo='GRACE ✧ STRENGTH ✧ JOY ✧ WONDER ✧ ';
function Ribbon({text}:{text:string}) { return <p className="ribbon-text">{text.repeat(2).split('✧').map((part,i,all)=><Fragment key={i}>{part}{i<all.length-1&&<span>✧</span>}</Fragment>)}</p>; }

export default function Experience() {
 const [menuOpen,setMenuOpen]=useState(false);
 const [selected,setSelected]=useState<Collection|null>(null);
 const [galleryIndex,setGalleryIndex]=useState<number|null>(null);
 const [info,setInfo]=useState<string|null>(null);
 const [saved,setSaved]=useState<string[]>([]);
 const [motionPaused,setMotionPaused]=useState(false);
 const [replay,setReplay]=useState(0);
 function toggleSaved(id:string){setSaved(current=>current.includes(id)?current.filter(x=>x!==id):[...current,id]);}
 function goGallery(delta:number){setGalleryIndex(i=>i===null?null:(i+delta+gallery.length)%gallery.length);}
 return <div className={motionPaused?'site motion-paused':'site'}>
  <OpeningRite replay={replay}/>
  <Motion replay={replay}/>
  <Interactive paused={motionPaused}/>
  <SilkVeil paused={motionPaused}/>
  <a href="#story" className="skip-link">Skip introduction</a>
  <header className="header">
   <a className="wordmark" href="#home" aria-label="Aaradhya home"><Lotus/><span>AARADHYA<small>THE ART OF THE DRAPE</small></span></a>
   <nav className="desktop-nav" aria-label="Main navigation">{nav.slice(0,3).map(([text,link])=><a key={link} href={link}>{text}</a>)}</nav>
   <button className="menu-toggle" onClick={()=>setMenuOpen(true)} aria-label="Open navigation menu" aria-haspopup="dialog" data-magnetic><span>Explore</span><Menu size={19}/></button>
  </header>
  <main>
   <DevotionalIntro onReplay={()=>{window.scrollTo({top:0,behavior:'instant'});setReplay(v=>v+1);}} paused={motionPaused} onToggleMotion={()=>setMotionPaused(v=>!v)}/>
   <SareeVeil fabric="gold" verse="या देवी सर्वभूतेषु शक्तिरूपेण संस्थिता" translit="Ya Devi Sarvabhuteshu Shakti-rupena Samsthita" meaning="To the Goddess who dwells in every being as strength."/>
   <section className="editorial editorial-v2 section-pad" data-rise-chapter data-rise-start="top 45%" data-rise-end="top -25%" id="story" aria-labelledby="editorial-title">
    <div className="cursor-light bride-light" data-light aria-hidden="true"/>
    <div className="section-topline"><span>01 / THE WORLD OF AARADHYA</span><span>INDIAN SOUL. TIMELESS EXPRESSION.</span></div>
    <div className="editorial-heading"><p className="script" data-reveal>A thread of eternity</p><h2 className="editorial-title" id="editorial-title" aria-label="Woven in divinity."><SplitWord text="WOVEN IN"/><SplitWord text="DIVINITY."/></h2></div>
    <div className="editorial-composition">
     <div className="editorial-aside" data-reveal><span className="mini-label">MORE THAN WHAT SHE WEARS.</span><p>An expression<br/>of who she is.</p><Lotus className="aside-lotus"/></div>
     <figure className="editorial-portrait"><div className="bride-halo" data-depth="-14"><div className="bride-halo-glow"/><Halo spin={80}/></div><RisingFigure name="editorial-bride" priority/><figcaption>THE PRESENCE EDIT — A PORTRAIT OF GRACE</figcaption></figure>
     <div className="editorial-note" data-reveal><p>Rooted in heritage.<br/>Unbound in spirit.</p><p className="body-small">An exploration of Indian drapes, beautiful rituals, and the strength that is entirely her own.</p><TextLink href="#collections">Explore the edits</TextLink></div>
    </div>
   </section>
   <section className="monochrome" id="her-story" aria-labelledby="monochrome-title" data-rise-chapter>
    <div className="monochrome-frame"><img className="monochrome-photo" data-rise-panel src="/assets/generated/bridal-monochrome.webp" alt="Black-and-white side profile of an Indian bride with jasmine in her hair and intricate bridal jewellery" width="1672" height="941" loading="lazy"/><div className="cursor-light mono-light" data-light aria-hidden="true"/><p className="portrait-caption caption-left">SHE DOES NOT<br/>SIMPLY WEAR A STORY.</p><p className="portrait-caption caption-right">SHE CARRIES<br/>EVERY WOMAN<br/>WHO CAME<br/>BEFORE HER.</p><Lotus className="portrait-lotus"/></div>
    <div className="monochrome-story section-pad"><div className="monochrome-story-title"><h2 id="monochrome-title" data-reveal>SHE CARRIES<br/><em>A WORLD.</em></h2><span>[ A STORY OF HER ]</span></div><div className="monochrome-story-grid"><span className="eyebrow">THE THREAD THAT CONNECTS US</span><Photo name="detail" alt="Red and gold embroidered saree detail" sizes="(max-width: 700px) 43vw, 23vw"/><div><p>A memory in the fold. A mother's grace in the drape. The quiet strength of generations, carried into a new beginning.</p><p>Rooted. Fearless. Entirely her own.</p><TextLink href="#essence">The spirit of Shakti</TextLink></div></div></div>
    <div className="emotion-strip"><div className="emotion-strip-heading"><span>FIVE EXPRESSIONS OF HER</span><span>THE AARADHYA PHILOSOPHY</span></div><div className="emotion-cards">{[{name:'GRACE',image:'portrait',note:'In every quiet gesture.'},{name:'DEVOTION',image:'gold',note:'A connection that endures.'},{name:'JOY',image:'celebration',note:'For the moments we keep.'},{name:'STRENGTH',image:'jewels',note:'Softness, with conviction.'},{name:'WONDER',image:'garden',note:'A world waiting to unfold.'}].map((m,i)=><button className={`emotion-card emotion-${i}`} key={m.name} onClick={()=>setSelected(collections[i%collections.length])} data-tilt data-cursor="Discover"><span>0{i+1}</span><h3>{m.name}</h3><Photo name={m.image} alt={m.name.toLowerCase()+' editorial portrait'} sizes="(max-width: 700px) 38vw, 15vw"/><p>{m.note}</p><ArrowUpRight size={15}/></button>)}</div></div>
   </section>
   <section className="craft craft-v2 section-pad" data-rise-chapter id="craft" aria-labelledby="craft-title">
    <canvas className="thread-canvas" data-thread aria-hidden="true"/>
    <div className="section-topline"><span>02 / THE ART OF THE SAREE</span><span>IN PRAISE OF THE DETAILS</span></div>
    <div className="craft-grid">
     <div className="craft-visual"><RisingFigure name="woman-ivory" className="craft-rising-woman" depth={12}/><figure className="craft-fabric"><Photo name="detail" alt="Close-up of a red saree's intricate embroidered border and gold details" className="parallax-photo" parallax/><figcaption>01 — A LANGUAGE WRITTEN IN THREAD</figcaption></figure><figure className="craft-inset" data-reveal><Photo name="loom" alt="Colourful threads arranged on a traditional weaving loom" sizes="(max-width: 700px) 45vw, 22vw"/><figcaption>THE BEAUTY OF MAKING</figcaption></figure></div>
     <div className="craft-copy"><p className="eyebrow" data-reveal>EVERY THREAD, A REMEMBRANCE.</p><h2 id="craft-title" data-reveal>Some stories<br/>are not written.<br/><em>They are woven.</em></h2><div className="craft-copy-bottom" data-reveal><span className="index">∞</span><div><p>Every thread carries a story. Every weave preserves a legacy. Every drape becomes an expression of her strength.</p><p className="body-small">From the rhythm of a loom to the way a border catches the light, the saree holds a beautiful conversation between the hand and the heart.</p><TextLink href="#essence">Discover our inspiration</TextLink></div></div></div>
    </div>
   </section>
   <SareeVeil fabric="red" verse="नमस्तस्यै नमस्तस्यै नमस्तस्यै नमो नमः" translit="Namastasyai Namastasyai Namastasyai Namo Namah" meaning="Salutations to her, salutations, again and again."/>
   <section className="divine" id="essence" aria-labelledby="divine-title">
    <div className="divine-stage"><div className="divine-top"><span>03 / THE FEMININE SPIRIT</span><Lotus/><span>STRENGTH. BEAUTY. GRACE.</span></div>
     <h2 className="divine-title" id="divine-title"><span className="divine-word-one">JAI MAA</span><span className="divine-word-two">DURGA</span></h2><div className="divine-colour-wipe" aria-hidden="true"/>
     <div className="divine-aura" aria-hidden="true"><Rangoli spin={-90}/></div>
     <div className="divine-image" data-depth="10"><RisingFigure name="durga-mata" className="durga-figure"/></div>
     <div className="divine-statement"><span className="eyebrow">IN REVERENCE TO MAA DURGA.</span><p>Maa Durga — a celebration of courage, compassion and protection. A moment of devotion to the divine feminine, and the strength that lives within her.</p><a href="#collections" aria-label="Continue to collections" data-magnetic><ArrowDown size={20}/></a></div>
    </div>
   </section>
   <section className="collections section-pad" id="collections" aria-labelledby="collections-title">
    <div className="section-topline"><span>04 / THE CURATED EDITS</span><span>FOUR MOODS. COUNTLESS EXPRESSIONS.</span></div>
    <ChapterScene word="CELEBRATE" caption="THE FESTIVE SPIRIT" figures={['woman-vermilion','woman-ivory']} wordFrom="right"/><div className="section-heading-row"><h2 id="collections-title" data-reveal>A drape for<br/><em>every becoming.</em></h2><div data-reveal><p>Find the story that feels like you.</p><span className="mini-label">EXPLORE THE EDITORIAL COLLECTION</span></div></div>
    <div className="collection-grid">{collections.map((c,i)=><article className={`collection collection-${i}`} key={c.id}><button className="collection-photo" onClick={()=>setSelected(c)} aria-label={`Explore ${c.name}`} data-tilt data-cursor="Explore"><Photo name={c.image} alt={`${c.name}: ${c.mood}`} sizes="(max-width: 700px) 90vw, 45vw"/><span className="collection-tag">{c.tag}</span><span className="image-action"><ArrowUpRight size={24}/></span></button><div className="collection-caption"><div><span className="mini-label">{c.number} / AARADHYA</span><h3><button onClick={()=>setSelected(c)}>{c.name}</button></h3><p>{c.mood}</p></div><button className="collection-arrow" onClick={()=>setSelected(c)} aria-label={`Open ${c.name}`} data-magnetic><ArrowUpRight size={24}/></button></div></article>)}</div>
   </section>
   <div className="text-ribbon" aria-hidden="true">
    <div className="marquee-row" data-marquee="1"><div className="marquee-track"><Ribbon text={ribbonOne}/><Ribbon text={ribbonOne}/></div></div>
    <div className="marquee-row marquee-outline" data-marquee="-1"><div className="marquee-track"><Ribbon text={ribbonTwo}/><Ribbon text={ribbonTwo}/></div></div>
   </div>
   <section className="journal section-pad" id="journal" aria-labelledby="journal-title"><div className="section-topline"><span>05 / THE VISUAL JOURNAL</span><span>PAUSE. LOOK CLOSER.</span></div><ChapterScene word="EXPRESSION" caption="MANY MOODS. ONE SPIRIT." tone="sage" figures={['woman-ivory','woman-vermilion']} wordFrom="left" wipe="depth"/><div className="journal-heading"><p className="script" data-reveal>Little moments, infinite beauty</p><h2 id="journal-title" data-reveal>IN HER ELEMENT.</h2></div><div className="gallery-grid">{gallery.map((g,i)=><figure key={g.image} className={`gallery-item gallery-${i}`}><button onClick={()=>setGalleryIndex(i)} aria-label={`Enlarge ${g.label}`} data-tilt data-cursor="View"><Photo name={g.image} alt={g.label} sizes="(max-width: 700px) 85vw, 42vw"/><span className="gallery-open">VIEW IMAGE <ArrowUpRight size={15}/></span></button><figcaption><span>{g.label}</span><span>0{i+1}</span></figcaption></figure>)}</div></section>
   <SareeVeil fabric="tissue" verse="सर्वमङ्गलमाङ्गल्ये शिवे सर्वार्थसाधिके" translit="Sarva-mangala-mangalye Shive Sarvartha-sadhike" meaning="Auspicious of all that is auspicious, who fulfils every purpose."/>
   <section className="manifesto manifesto-v2 section-pad" data-rise-chapter data-rise-start="top 35%" data-rise-end="top -30%" id="manifesto" aria-labelledby="manifesto-title"><span className="eyebrow" data-reveal>06 / OUR BELIEF</span><div className="manifesto-devotion"><div className="manifesto-mandala" data-depth="-16" aria-hidden="true"><Rangoli spin={50}/></div><div className="manifesto-window"><RisingFigure name="durga-mata" decorative/></div></div><p className="devotion-caption">WITH THE BLESSINGS OF MAA DURGA</p><h2 id="manifesto-title"><span className="mf-line mf-left">Not just a drape.</span><span className="mf-line mf-right"><em>A legacy.</em></span></h2><p className="manifesto-copy" data-reveal>For the woman who carries her roots with her.<br/>Who honours the past, and makes the present her own.<br/>Who does not wear a story. She becomes it.</p><TextLink href="#collections">Find your expression</TextLink><div className="manifesto-rule"/></section>
  </main>
  <footer className="footer footer-v2">
   <div className="footer-mandala" data-depth="-24" aria-hidden="true"><Rangoli spin={110}/></div>
   <div className="footer-blessing section-pad"><Lotus className="footer-lotus"/><p>May every thread you wear<br/><em>carry a blessing.</em></p></div>
   <div className="footer-main section-pad">
    <div className="footer-col footer-about"><a href="#home" className="footer-brand">AARADHYA<small>WOVEN IN DIVINITY.</small></a><p>An editorial love letter to the saree, to heritage, and to the quiet strength of the feminine spirit.</p></div>
    <div className="footer-col footer-links-col"><span>EXPLORE</span>{nav.map(([label,href])=><a key={href} href={href}>{label}</a>)}</div>
    <div className="footer-col footer-links-col"><span>THE HOUSE</span><a href="#craft">The art of the saree</a><a href="#manifesto">Our philosophy</a><button onClick={()=>setInfo('Contact the house')}>Contact</button><button onClick={()=>setInfo('Our social journal')}>Instagram ↗</button></div>
    <div className="footer-col footer-back"><a href="#home" className="back-top" aria-label="Back to top" data-magnetic><svg className="back-top-ring" data-spin={18} viewBox="0 0 120 120" aria-hidden="true"><defs><path id="back-top-path" d="M60 60m-46 0a46 46 0 1 1 92 0a46 46 0 1 1-92 0"/></defs><text><textPath href="#back-top-path" textLength="285">BACK TO TOP ✧ JAI MATA DI ✧ </textPath></text></svg><ArrowUp size={21}/></a></div>
   </div>
   <div className="footer-giant" aria-hidden="true">{'AARADHYA'.split('').map((c,i)=><span key={i}><b>{c}</b></span>)}</div>
   <div className="footer-bottom section-pad"><span>© 2026 AARADHYA · A FASHION EDITORIAL CONCEPT</span><div><button onClick={()=>setInfo('About this concept')}>About & credits</button><button onClick={()=>setInfo('Privacy')}>Privacy</button><span>MADE OF STORIES.</span></div></div>
  </footer>
  <Modal open={menuOpen} onClose={()=>setMenuOpen(false)} title="Navigation" className="menu-modal"><Lotus className="menu-lotus"/><span className="eyebrow">THE WORLD OF AARADHYA</span><nav aria-label="Expanded navigation">{[...nav,['The craft','#craft']].map(([label,href],i)=><a key={href} href={href} onClick={()=>setMenuOpen(false)}><span>0{i+1}</span>{label}<ArrowUpRight size={30}/></a>)}</nav><p>Rooted in heritage. Unbound in spirit.</p></Modal>
  <Modal open={selected!==null} onClose={()=>setSelected(null)} title={selected?.name||'Collection'} className="collection-modal">{selected&&<div className="collection-detail"><Photo name={selected.image} alt={selected.name}/><div className="detail-copy"><span className="eyebrow">THE CURATED EDITS / {selected.number}</span><h2>{selected.name}</h2><p className="detail-mood">{selected.mood}</p><p>{selected.description}</p><div className="palette" aria-label="Collection colour palette">{selected.palette.map(c=><span key={c} style={{background:c}}/>)}</div><p className="detail-spec">{selected.detail}</p><button className="solid-button" onClick={()=>toggleSaved(selected.id)}>{saved.includes(selected.id)?'Saved to your inspiration':'Save to my inspiration'}<ArrowRight size={17}/></button><p className="concept-note" aria-live="polite">{saved.includes(selected.id)?'Saved for this visit. Explore another edit below.':'An editorial mood, not a product listing. Shopping is not connected.'}</p><div className="edit-pagination">{collections.map(c=><button key={c.id} aria-label={`View ${c.name}`} aria-pressed={c.id===selected.id} onClick={()=>setSelected(c)}>{c.number}</button>)}</div></div></div>}</Modal>
  <Modal open={galleryIndex!==null} onClose={()=>setGalleryIndex(null)} title="Editorial image gallery" className="gallery-modal">{galleryIndex!==null&&<div className="lightbox"><Photo name={gallery[galleryIndex].image} alt={gallery[galleryIndex].label} priority/><div className="lightbox-footer"><button onClick={()=>goGallery(-1)} aria-label="Previous image"><ChevronLeft/></button><div><h3>{gallery[galleryIndex].label}</h3><p>{gallery[galleryIndex].note} · {galleryIndex+1} / {gallery.length}</p></div><button onClick={()=>goGallery(1)} aria-label="Next image"><ChevronRight/></button></div></div>}</Modal>
  <Modal open={info!==null} onClose={()=>setInfo(null)} title={info||'Information'} className="info-modal"><Lotus/><span className="eyebrow">AARADHYA</span><h2>{info}</h2>{info==='Contact the house'?<><p>Our contact details will be announced here.</p><p className="body-small">This is an independent fashion concept. An official email address, studio address and appointment service have not been supplied.</p><button className="solid-button" onClick={()=>{setInfo(null);document.querySelector('#collections')?.scrollIntoView({behavior:'smooth'});}}>Explore the edits <ArrowUpRight size={18}/></button></>:info==='Our social journal'?<><p>A space for future stories.</p><p className="body-small">An official Instagram profile has not been connected to this concept.</p><a className="text-link" href="#journal" onClick={()=>setInfo(null)}>Visit the visual journal <ArrowUpRight size={17}/></a></>:info==='Privacy'?<p>This concept has no accounts, checkout, analytics or contact submissions. Inspiration selections are held only in the page’s memory and reset on reload. The hosting service may process technical access logs.</p>:<><p>AARADHYA is a proposed creative identity, exploring Indian textiles and feminine strength. Collection names describe editorial moods, not products for sale.</p><p className="body-small">The animated figures, Durga artwork and recreated bridal portraits are AI-generated concept imagery. Additional editorial photography is sourced from Pexels. The photographed people do not endorse this concept; source and licence links are included below.</p><a className="text-link" href="/credits.html" target="_blank" rel="noreferrer">Images & credits <ArrowUpRight size={17}/></a></>}</Modal>
 </div>;
}
