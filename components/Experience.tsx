'use client';
import { Fragment, useState } from 'react';
import { ArrowUpRight, ArrowDown, ArrowUp, ArrowRight, ChevronLeft, ChevronRight, Menu } from 'lucide-react';
import Link from 'next/link';
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
import Shop from './Shop';
import {BagButton, useCart} from './Cart';

function Lotus({className=''}:{className?:string}) { return <svg className={className} viewBox="0 0 64 64" fill="none" aria-hidden="true"><path d="M32 8C15 24 23 41 32 49C41 41 49 24 32 8ZM32 49C16 49 7 36 9 23C22 25 31 36 32 49ZM32 49C48 49 57 36 55 23C42 25 33 36 32 49ZM13 51Q32 62 51 51" stroke="currentColor" strokeWidth="1.2"/></svg>; }
function TextLink({href,children}:{href:string;children:React.ReactNode}) { return <a className="text-link" href={href}>{children}<ArrowUpRight size={17}/></a>; }
// Letters are split so each one can respond to the cursor; the heading keeps its full text as the accessible name.
function SplitWord({text}:{text:string}) { return <span aria-hidden="true">{text.split('').map((c,i)=><span key={i} className={c===' '?'char space':'char'}>{c===' '?' ':c}</span>)}</span>; }
const nav=[['Shop','#shop'],['Diwali edits','#collections'],['Maa Lakshmi','#essence'],['Diwali diaries','#journal'],['Her story','#her-story']];
const ribbonOne='DHANTERAS ✧ LAKSHMI PUJA ✧ BHAI DOOJ ✧ ';
const ribbonTwo='LIGHT ✧ GOLD ✧ SILK ✧ BLESSINGS ✧ ';
function Ribbon({text}:{text:string}) { return <p className="ribbon-text">{text.repeat(2).split('✧').map((part,i,all)=><Fragment key={i}>{part}{i<all.length-1&&<span>✧</span>}</Fragment>)}</p>; }

export default function Experience() {
 const [menuOpen,setMenuOpen]=useState(false);
 const [selected,setSelected]=useState<Collection|null>(null);
 const [galleryIndex,setGalleryIndex]=useState<number|null>(null);
 const [info,setInfo]=useState<string|null>(null);
 const [filter,setFilter]=useState('all');
 const {saved}=useCart();
 const [motionPaused,setMotionPaused]=useState(false);
 const [replay,setReplay]=useState(0);
 // An edit's "Shop" button filters the shop to that weave and scrolls to it.
 function shopEdit(category:string){setSelected(null);setFilter(category);requestAnimationFrame(()=>document.querySelector('#shop')?.scrollIntoView({behavior:'smooth'}));}
 function goGallery(delta:number){setGalleryIndex(i=>i===null?null:(i+delta+gallery.length)%gallery.length);}
 return <div className={motionPaused?'site motion-paused':'site'}>
  <OpeningRite replay={replay}/>
  <Motion replay={replay}/>
  <Interactive paused={motionPaused}/>
  <SilkVeil paused={motionPaused}/>
  <a href="#shop" className="skip-link">Skip to the shop</a>
  <header className="header">
   <a className="wordmark" href="#home" aria-label="Aaradhya home"><Lotus/><span>AARADHYA<small>DIWALI 2026</small></span></a>
   <nav className="desktop-nav" aria-label="Main navigation">{nav.slice(0,3).map(([text,link])=><a key={link} href={link}>{text}</a>)}</nav>
   <div className="header-actions"><button className="menu-toggle" onClick={()=>setMenuOpen(true)} aria-label="Open navigation menu" aria-haspopup="dialog" data-magnetic><span>Explore</span><Menu size={19}/></button><BagButton/></div>
  </header>
  <main>
   <DevotionalIntro onReplay={()=>{window.scrollTo({top:0,behavior:'instant'});setReplay(v=>v+1);}} paused={motionPaused} onToggleMotion={()=>setMotionPaused(v=>!v)}/>
   <SareeVeil fabric="gold" verse="तमसो मा ज्योतिर्गमय" translit="Tamaso Ma Jyotirgamaya" meaning="Lead me from darkness to light."/>
   <section className="editorial editorial-v2 section-pad" data-rise-chapter data-rise-start="top 45%" data-rise-end="top -25%" id="story" aria-labelledby="editorial-title">
    <div className="cursor-light bride-light" data-light aria-hidden="true"/>
    <div className="section-topline"><span>01 / DIWALI AT AARADHYA</span><span>DRESSED IN LIGHT. MADE FOR CELEBRATION.</span></div>
    <div className="editorial-heading"><p className="script" data-reveal>Where every thread catches the light</p><h2 className="editorial-title" id="editorial-title" aria-label="Woven in light."><SplitWord text="WOVEN IN"/><SplitWord text="LIGHT."/></h2></div>
    <div className="editorial-composition">
     <div className="editorial-aside" data-reveal><span className="mini-label">FOR THE NIGHT OF A THOUSAND LAMPS.</span><p>The silk she<br/>lights them in.</p><Lotus className="aside-lotus"/></div>
     <figure className="editorial-portrait"><div className="bride-halo" data-depth="-14"><div className="bride-halo-glow"/><Halo spin={80}/></div><RisingFigure name="editorial-bride" priority/><figcaption>THE LAKSHMI PUJA EDIT — A PORTRAIT IN GOLD</figcaption></figure>
     <div className="editorial-note" data-reveal><p>Gold for Dhanteras.<br/>Silk for the puja.</p><p className="body-small">Kanjivaram, Banarasi, tissue and handloom sarees, chosen for all five days of Diwali, from Dhanteras to Bhai Dooj.</p><TextLink href="#shop">Shop the Diwali collection</TextLink></div>
    </div>
   </section>
   <section className="monochrome" id="her-story" aria-labelledby="monochrome-title" data-rise-chapter>
    <div className="monochrome-frame"><img className="monochrome-photo" data-rise-panel src="/assets/generated/diya-monochrome.webp" alt="Black-and-white portrait of a woman in a silk saree, surrounded by lit diyas" width="1672" height="941" loading="lazy"/><div className="cursor-light mono-light" data-light aria-hidden="true"/><p className="portrait-caption caption-left">SHE DOES NOT<br/>SIMPLY LIGHT A LAMP.</p><p className="portrait-caption caption-right">SHE CARRIES<br/>EVERY DIWALI<br/>THAT CAME<br/>BEFORE HER.</p><Lotus className="portrait-lotus"/></div>
    <div className="monochrome-story section-pad"><div className="monochrome-story-title"><h2 id="monochrome-title" data-reveal>SHE CARRIES<br/><em>THE LIGHT.</em></h2><span>[ A DIWALI STORY ]</span></div><div className="monochrome-story-grid"><span className="eyebrow">A SAREE FROM EVERY DIWALI</span><Photo name="detail" alt="Red and gold zari border of a festive saree" sizes="(max-width: 700px) 43vw, 23vw"/><div><p>Her mother's Kanjivaram, folded away after Lakshmi Puja. The first silk she bought herself. Every Diwali leaves a saree in the trunk, and a story in its folds.</p><p>Hand-woven. Hand-picked. Yours to pass on.</p><TextLink href="#shop">Shop heirloom silks</TextLink></div></div></div>
    <div className="emotion-strip"><div className="emotion-strip-heading"><span>FIVE DAYS OF DIWALI</span><span>A SAREE FOR EACH</span></div><div className="emotion-cards">{[{name:'DHANTERAS',image:'gold',note:'Gold, for a new beginning.',edit:0},{name:'CHHOTI DIWALI',image:'diya-plate',note:'The first lamps are lit.',edit:2},{name:'LAKSHMI PUJA',image:'celebration',note:'Silk, to welcome her home.',edit:1},{name:'PADWA',image:'portrait',note:'A new year, a new drape.',edit:3},{name:'BHAI DOOJ',image:'sparkler-dusk',note:'For sisters, and their stories.',edit:3}].map((m,i)=><button className={`emotion-card emotion-${i}`} key={m.name} onClick={()=>setSelected(collections[m.edit])} data-tilt data-cursor="Discover"><span>0{i+1}</span><h3>{m.name}</h3><Photo name={m.image} alt={`What to wear for ${m.name.toLowerCase()}`} sizes="(max-width: 700px) 38vw, 15vw"/><p>{m.note}</p><ArrowUpRight size={15}/></button>)}</div></div>
   </section>
   <section className="craft craft-v2 section-pad" data-rise-chapter id="craft" aria-labelledby="craft-title">
    <canvas className="thread-canvas" data-thread aria-hidden="true"/>
    <div className="section-topline"><span>02 / THE ART OF THE SAREE</span><span>REAL ZARI. HAND-WOVEN.</span></div>
    <div className="craft-grid">
     <div className="craft-visual"><RisingFigure name="woman-emerald" className="craft-rising-woman" depth={12}/><figure className="craft-fabric"><Photo name="detail" alt="Close-up of a red saree's zari border catching the light" className="parallax-photo" parallax/><figcaption>01 — ZARI THAT CATCHES THE DIYA LIGHT</figcaption></figure><figure className="craft-inset" data-reveal><Photo name="loom" alt="A weaver at work on a silk handloom" sizes="(max-width: 700px) 45vw, 22vw"/><figcaption>HAND-WOVEN, THREAD BY THREAD</figcaption></figure></div>
     <div className="craft-copy"><p className="eyebrow" data-reveal>EVERY THREAD, A LITTLE LIGHT.</p><h2 id="craft-title" data-reveal>Not every light<br/>needs a flame.<br/><em>Some are woven.</em></h2><div className="craft-copy-bottom" data-reveal><span className="index">✦</span><div><p>Zari, silver thread gilded in gold, is what makes a festive silk glow under diya light. Every saree in our Diwali edit is hand-woven, from the looms of Kanchipuram, Varanasi, Chanderi and Kerala.</p><p className="body-small">Each piece is checked by hand for weave and zari, then folded in tissue and sent to you in time for Diwali.</p><TextLink href="#shop">Shop hand-woven silks</TextLink></div></div></div>
    </div>
   </section>
   <SareeVeil fabric="red" verse="ॐ श्री महालक्ष्म्यै नमः" translit="Om Shri Mahalakshmyai Namah" meaning="Salutations to Maa Lakshmi, the great goddess of fortune."/>
   <section className="divine" id="essence" aria-labelledby="divine-title">
    <div className="divine-stage"><div className="divine-top"><span>03 / THE GODDESS OF FORTUNE</span><Lotus/><span>WEALTH. WELLBEING. LIGHT.</span></div>
     <h2 className="divine-title divine-title-long" id="divine-title"><span className="divine-word-one">JAI MAA</span><span className="divine-word-two">LAKSHMI</span></h2><div className="divine-colour-wipe" aria-hidden="true"/>
     <div className="divine-aura" aria-hidden="true"><Rangoli spin={-90}/></div>
     <div className="divine-image" data-depth="10"><RisingFigure name="lakshmi" className="durga-figure"/></div>
     <div className="divine-statement"><span className="eyebrow">IN REVERENCE TO MAA LAKSHMI.</span><p>On the new-moon night of Diwali, every home lights a lamp to welcome Maa Lakshmi, goddess of wealth, fortune and grace. The doors open, rangoli is drawn, and the finest silk is worn for her puja.</p><a href="#collections" aria-label="Continue to the Diwali edits" data-magnetic><ArrowDown size={20}/></a></div>
    </div>
   </section>
   <section className="collections section-pad" id="collections" aria-labelledby="collections-title">
    <div className="section-topline"><span>04 / THE DIWALI EDITS</span><span>FOUR WEAVES. FIVE DAYS OF LIGHT.</span></div>
    <ChapterScene word="CELEBRATE" caption="THE FESTIVAL OF LIGHTS" figures={['woman-vermilion','woman-emerald']} wordFrom="right"/><div className="section-heading-row"><h2 id="collections-title" data-reveal>A drape for<br/><em>every diya.</em></h2><div data-reveal><p>Find the silk for every day of Diwali.</p><span className="mini-label">SHOP BY WEAVE</span></div></div>
    <div className="collection-grid">{collections.map((c,i)=><article className={`collection collection-${i}`} key={c.id}><button className="collection-photo" onClick={()=>setSelected(c)} aria-label={`Explore ${c.name}`} data-tilt data-cursor="Explore"><Photo name={c.image} alt={`${c.name}: ${c.mood}`} sizes="(max-width: 700px) 90vw, 45vw"/><span className="collection-tag">{c.tag}</span><span className="image-action"><ArrowUpRight size={24}/></span></button><div className="collection-caption"><div><span className="mini-label">{c.number} / DIWALI 2026</span><h3><button onClick={()=>setSelected(c)}>{c.name}</button></h3><p>{c.mood}</p></div><button className="collection-arrow" onClick={()=>setSelected(c)} aria-label={`Open ${c.name}`} data-magnetic><ArrowUpRight size={24}/></button></div></article>)}</div>
   </section>
   <Shop filter={filter} setFilter={setFilter}/>
   <div className="text-ribbon" aria-hidden="true">
    <div className="marquee-row" data-marquee="1"><div className="marquee-track"><Ribbon text={ribbonOne}/><Ribbon text={ribbonOne}/></div></div>
    <div className="marquee-row marquee-outline" data-marquee="-1"><div className="marquee-track"><Ribbon text={ribbonTwo}/><Ribbon text={ribbonTwo}/></div></div>
   </div>
   <section className="journal section-pad" id="journal" aria-labelledby="journal-title"><div className="section-topline"><span>06 / DIWALI DIARIES</span><span>LAMPS, SWEETS AND SILK.</span></div><ChapterScene word="DEEPAVALI" caption="A ROW OF LAMPS. ONE LIGHT." tone="sage" figures={['woman-emerald','woman-vermilion']} wordFrom="left" wipe="depth"/><div className="journal-heading"><p className="script" data-reveal>Little lamps, infinite light</p><h2 id="journal-title" data-reveal>IN HER LIGHT.</h2></div><div className="gallery-grid">{gallery.map((g,i)=><figure key={g.image} className={`gallery-item gallery-${i}`}><button onClick={()=>setGalleryIndex(i)} aria-label={`Enlarge ${g.label}`} data-tilt data-cursor="View"><Photo name={g.image} alt={g.label} sizes="(max-width: 700px) 85vw, 42vw"/><span className="gallery-open">VIEW IMAGE <ArrowUpRight size={15}/></span></button><figcaption><span>{g.label}</span><span>0{i+1}</span></figcaption></figure>)}</div></section>
   <SareeVeil fabric="tissue" verse="शुभं करोति कल्याणमारोग्यं धनसम्पदा" translit="Shubham Karoti Kalyanam Arogyam Dhanasampada" meaning="The lamp's light brings goodness, health and prosperity."/>
   <section className="manifesto manifesto-v2 section-pad" data-rise-chapter data-rise-start="top 35%" data-rise-end="top -30%" id="manifesto" aria-labelledby="manifesto-title"><span className="eyebrow" data-reveal>07 / OUR DIWALI WISH</span><div className="manifesto-devotion"><div className="manifesto-mandala" data-depth="-16" aria-hidden="true"><Rangoli spin={50}/></div><div className="manifesto-window"><RisingFigure name="lakshmi" decorative/></div></div><p className="devotion-caption">WITH THE BLESSINGS OF MAA LAKSHMI</p><h2 id="manifesto-title"><span className="mf-line mf-left">Not just a saree.</span><span className="mf-line mf-right"><em>A blessing.</em></span></h2><p className="manifesto-copy" data-reveal>For the woman who lights the first diya.<br/>Who keeps the old rituals, and makes them her own.<br/>Who does not just celebrate Diwali. She is its glow.</p><TextLink href="#shop">Find your Diwali saree</TextLink><div className="manifesto-rule"/></section>
  </main>
  <footer className="footer footer-v2">
   <div className="footer-mandala" data-depth="-24" aria-hidden="true"><Rangoli spin={110}/></div>
   <div className="footer-blessing section-pad"><Lotus className="footer-lotus"/><p>May every thread you wear<br/><em>carry Lakshmi&apos;s blessing.</em></p></div>
   <div className="footer-main section-pad">
    <div className="footer-col footer-about"><a href="#home" className="footer-brand">AARADHYA<small>WOVEN IN LIGHT.</small></a><p>Hand-woven Kanjivaram, Banarasi, tissue and handloom sarees, chosen for Diwali and every celebration after it.</p></div>
    <div className="footer-col footer-links-col"><span>EXPLORE</span>{nav.map(([label,href])=><a key={href} href={href}>{label}</a>)}</div>
    <div className="footer-col footer-links-col"><span>CUSTOMER CARE</span><button onClick={()=>setInfo('Shipping & returns')}>Shipping & returns</button><Link href="/checkout/">Checkout</Link><button onClick={()=>setInfo('Contact the house')}>Contact</button><button onClick={()=>setInfo('Our social journal')}>Instagram ↗</button></div>
    <div className="footer-col footer-back"><a href="#home" className="back-top" aria-label="Back to top" data-magnetic><svg className="back-top-ring" data-spin={18} viewBox="0 0 120 120" aria-hidden="true"><defs><path id="back-top-path" d="M60 60m-46 0a46 46 0 1 1 92 0a46 46 0 1 1-92 0"/></defs><text><textPath href="#back-top-path" textLength="285">BACK TO TOP ✧ SHUBH DIWALI ✧ </textPath></text></svg><ArrowUp size={21}/></a></div>
   </div>
   <div className="footer-giant" aria-hidden="true">{'AARADHYA'.split('').map((c,i)=><span key={i}><b>{c}</b></span>)}</div>
   <div className="footer-bottom section-pad"><span>© 2026 AARADHYA · THE DIWALI COLLECTION</span><div><button onClick={()=>setInfo('About this concept')}>About & credits</button><button onClick={()=>setInfo('Privacy')}>Privacy</button><span>WOVEN WITH LIGHT.</span></div></div>
  </footer>
  <Modal open={menuOpen} onClose={()=>setMenuOpen(false)} title="Navigation" className="menu-modal"><Lotus className="menu-lotus"/><span className="eyebrow">DIWALI AT AARADHYA</span><nav aria-label="Expanded navigation">{[...nav,['The craft','#craft']].map(([label,href],i)=><a key={href} href={href} onClick={()=>setMenuOpen(false)}><span>0{i+1}</span>{label}<ArrowUpRight size={30}/></a>)}</nav><p>Dispatched in time for Diwali. Free shipping above ₹9,999.</p></Modal>
  <Modal open={selected!==null} onClose={()=>setSelected(null)} title={selected?.name||'Collection'} className="collection-modal">{selected&&<div className="collection-detail"><Photo name={selected.image} alt={selected.name}/><div className="detail-copy"><span className="eyebrow">THE DIWALI EDITS / {selected.number}</span><h2>{selected.name}</h2><p className="detail-mood">{selected.mood}</p><p>{selected.description}</p><div className="palette" aria-label="Collection colour palette">{selected.palette.map(c=><span key={c} style={{background:c}}/>)}</div><p className="detail-spec">{selected.detail}</p><button className="solid-button" onClick={()=>shopEdit(selected.id)}>Shop {selected.name}<ArrowRight size={17}/></button><p className="concept-note">{saved.length?`${saved.length} ${saved.length===1?'saree':'sarees'} in your wishlist. `:''}Dispatched in time for Diwali. Free shipping above ₹9,999.</p><div className="edit-pagination">{collections.map(c=><button key={c.id} aria-label={`View ${c.name}`} aria-pressed={c.id===selected.id} onClick={()=>setSelected(c)}>{c.number}</button>)}</div></div></div>}</Modal>
  <Modal open={galleryIndex!==null} onClose={()=>setGalleryIndex(null)} title="Diwali diaries gallery" className="gallery-modal">{galleryIndex!==null&&<div className="lightbox"><Photo name={gallery[galleryIndex].image} alt={gallery[galleryIndex].label} priority/><div className="lightbox-footer"><button onClick={()=>goGallery(-1)} aria-label="Previous image"><ChevronLeft/></button><div><h3>{gallery[galleryIndex].label}</h3><p>{gallery[galleryIndex].note} · {galleryIndex+1} / {gallery.length}</p></div><button onClick={()=>goGallery(1)} aria-label="Next image"><ChevronRight/></button></div></div>}</Modal>
  <Modal open={info!==null} onClose={()=>setInfo(null)} title={info||'Information'} className="info-modal"><Lotus/><span className="eyebrow">AARADHYA · DIWALI 2026</span><h2>{info}</h2>{info==='Contact the house'?<><p>Our Diwali helpline details will be announced here.</p><p className="body-small">This store is a demonstration. A customer-care number, email address and studio address have not been supplied yet.</p><button className="solid-button" onClick={()=>{setInfo(null);document.querySelector('#shop')?.scrollIntoView({behavior:'smooth'});}}>Shop the Diwali collection <ArrowUpRight size={18}/></button></>:info==='Shipping & returns'?<><p>Orders placed before 2 November are dispatched by 5 November, in time for Lakshmi Puja. Shipping is free above ₹9,999; below that it is ₹249.</p><p className="body-small">Unworn sarees with their tags can be returned within 7 days of delivery. Every saree is folded in tissue and packed in a reusable cotton pouch.</p></>:info==='Our social journal'?<><p>Diwali diaries, coming soon.</p><p className="body-small">An official Instagram profile has not been connected to this store yet.</p><a className="text-link" href="#journal" onClick={()=>setInfo(null)}>Visit the Diwali diaries <ArrowUpRight size={17}/></a></>:info==='Privacy'?<p>There are no accounts, analytics or payment processing. Your bag, wishlist and any orders you place are stored only in this browser&apos;s local storage. The hosting service may process technical access logs.</p>:<><p>AARADHYA is a demonstration storefront for a Diwali saree collection. Products, prices and stock come from a JSON catalogue in place of a database; checkout saves orders in your browser and takes no payment.</p><p className="body-small">Product and lifestyle photography is from Pexels; the people pictured do not endorse this store. Maa Lakshmi is from Raja Ravi Varma&apos;s 1896 painting, which is in the public domain. Source and licence links are on the credits page.</p><a className="text-link" href="/credits.html" target="_blank" rel="noreferrer">Images & credits <ArrowUpRight size={17}/></a></>}</Modal>
 </div>;
}
