'use client';
import {useState} from 'react';
import Link from 'next/link';
import {ArrowRight, Heart, Star, Truck, RotateCcw, ShieldCheck, ChevronLeft} from 'lucide-react';
import Photo from './Photo';
import {useCart, QtyStepper} from './Cart';
import {ProductCard} from './Shop';
import {getProduct, getCategory, related, money, discount, store} from '../lib/shop';

const dispatch=new Date(store.diwaliDispatchBy).toLocaleDateString('en-IN',{day:'numeric',month:'long'});

export default function ProductView({slug}:{slug:string}){
 const p=getProduct(slug)!;
 const category=getCategory(p.category);
 const {add,saved,toggleSaved}=useCart();
 const [image,setImage]=useState(0);
 const [qty,setQty]=useState(1);
 const isSaved=saved.includes(p.id);
 return <>
  <section className="pdp section-pad" aria-labelledby="pdp-title">
   <nav className="pdp-crumbs" aria-label="Breadcrumb"><Link href="/#shop"><ChevronLeft size={13}/> Diwali collection</Link><span>/</span><span>{category?.name}</span></nav>
   <div className="pdp-grid">
    <div className="pdp-gallery">
     <div className="pdp-main"><Photo name={p.images[image].name} alt={`${p.name}, ${p.colour}`} priority sizes="(max-width: 700px) 100vw, 55vw"/>{p.badge&&<span className="product-badge">{p.badge}</span>}</div>
     {p.images.length>1&&<div className="pdp-thumbs">{p.images.map((img,i)=><button key={img.name} aria-label={`View photo ${i+1} of ${p.images.length}`} aria-pressed={i===image} onClick={()=>setImage(i)}><Photo name={img.name} alt="" sizes="90px"/></button>)}</div>}
    </div>
    <div className="pdp-copy">
     <span className="eyebrow">{category?.name.toUpperCase()} · {category?.origin.toUpperCase()}</span>
     <h1 id="pdp-title">{p.name}</h1>
     <p className="product-rating"><Star size={12} aria-hidden="true"/> {p.rating} <span>· {p.reviews} reviews</span></p>
     <p className="pdp-price"><strong>{money(p.price)}</strong><s>MRP {money(p.mrp)}</s><span>{discount(p)}% off</span></p>
     <p className="body-small">Inclusive of all taxes. SKU {p.id}</p>
     <p className="detail-mood">{p.colour}.</p>
     <p>{p.description}</p>
     <div className="palette" aria-label="Saree colours">{p.palette.map(c=><span key={c} style={{background:c}}/>)}</div>
     <p className="pdp-stock">{p.stock===0?'Sold out':p.stock<=5?`Only ${p.stock} left, woven in small batches`:'In stock, ready to ship'}</p>
     <div className="pdp-buy"><QtyStepper value={qty} onChange={v=>setQty(Math.max(1,Math.min(v,Math.max(1,p.stock))))} label={p.name}/><button className="solid-button" onClick={()=>add(p.id,qty)} disabled={p.stock===0}>{p.stock===0?'Sold out':'Add to bag'}<ArrowRight size={17}/></button><button className={isSaved?'pdp-save saved':'pdp-save'} onClick={()=>toggleSaved(p.id)} aria-pressed={isSaved} aria-label={isSaved?'Remove from wishlist':'Add to wishlist'}><Heart size={18}/></button></div>
     <ul className="pdp-perks"><li><Truck size={16}/>Dispatched by {dispatch}, in time for Diwali</li><li><RotateCcw size={16}/>Easy 7-day returns on unworn sarees</li><li><ShieldCheck size={16}/>Hand-checked for weave and zari before it ships</li></ul>
     <div className="pdp-details"><h2 className="mini-label">THE DETAILS</h2><ul>{p.details.map(d=><li key={d}>{d}</li>)}</ul><h2 className="mini-label">WEAR IT FOR</h2><p>{p.occasion.join(' · ')}</p><h2 className="mini-label">CARE</h2><p>{p.care}</p></div>
    </div>
   </div>
  </section>
  <section className="shop related section-pad" aria-labelledby="related-title">
   <div className="section-topline"><span>YOU MAY ALSO LOVE</span><span>MORE FROM THE DIWALI EDIT</span></div>
   <h2 id="related-title" className="related-title">Complete your <em>festive trunk.</em></h2>
   <div className="product-grid">{related(p).map(r=><ProductCard key={r.id} p={r}/>)}</div>
  </section>
 </>;
}
