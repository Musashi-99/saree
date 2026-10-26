'use client';
import {useState} from 'react';
import Link from 'next/link';
import {Heart, Star, ShoppingBag} from 'lucide-react';
import Photo from './Photo';
import {useCart} from './Cart';
import {products, categories, money, discount, type Product} from '../lib/shop';

export function ProductCard({p,sizes='(max-width: 700px) 46vw, 23vw'}:{p:Product;sizes?:string}){
 const {add,saved,toggleSaved}=useCart();
 const isSaved=saved.includes(p.id);
 return <article className="product-card">
  <div className="product-photo">
   <Link href={`/products/${p.slug}/`} aria-label={p.name} data-cursor="View"><Photo name={p.images[0].name} alt={`${p.name}, ${p.colour}`} sizes={sizes}/>{p.images[1]&&<Photo name={p.images[1].name} alt="" className="product-photo-alt" sizes={sizes}/>}</Link>
   {p.badge&&<span className="product-badge">{p.badge}</span>}
   <button className={isSaved?'product-save saved':'product-save'} onClick={()=>toggleSaved(p.id)} aria-pressed={isSaved} aria-label={isSaved?`Remove ${p.name} from wishlist`:`Add ${p.name} to wishlist`}><Heart size={16}/></button>
   {p.sizes.length?<Link className="product-quick" href={`/products/${p.slug}/`}><ShoppingBag size={15}/>Choose size</Link>:<button className="product-quick" onClick={()=>add(p.id)} disabled={p.stock===0}><ShoppingBag size={15}/>{p.stock===0?'Sold out':'Add to bag'}</button>}
  </div>
  <div className="product-info">
   <span className="mini-label">{(p.brand||categories.find(c=>c.id===p.category)?.name)?.toUpperCase()}</span>
   <h3><Link href={`/products/${p.slug}/`}>{p.name}</Link></h3>
   <p className="product-rating"><Star size={11} aria-hidden="true"/> {p.rating} <span>({p.reviews})</span></p>
   <p className="product-price"><strong>{money(p.price)}</strong><s>{money(p.mrp)}</s><span>{discount(p)}% off</span></p>
  </div>
 </article>;
}

const sorts={featured:'Featured',low:'Price: low to high',high:'Price: high to low',rating:'Top rated'} as const;
type Sort=keyof typeof sorts;

// The homepage shop: filter by category, sort, and add to the bag without leaving the page.
export default function Shop({filter,setFilter}:{filter:string;setFilter:(id:string)=>void}){
 const [sort,setSort]=useState<Sort>('featured');
 const shown=products.filter(p=>filter==='all'||p.category===filter).sort((a,b)=>sort==='low'?a.price-b.price:sort==='high'?b.price-a.price:sort==='rating'?b.rating-a.rating:Number(b.featured)-Number(a.featured));
 return <section className="shop section-pad" id="shop" aria-labelledby="shop-title">
  <div className="section-topline"><span>05 / SHOP THE DIWALI COLLECTION</span><span>DELIVERED IN TIME FOR DIWALI · FREE SHIPPING</span></div>
  <div className="section-heading-row"><h2 id="shop-title" data-reveal>Dressed for the<br/><em>festival of lights.</em></h2><div data-reveal><p>{products.length} silk sarees, cotton sarees and kurta sets, chosen for Dhanteras to Bhai Dooj.</p><span className="mini-label">FREE SHIPPING ON EVERY ORDER</span></div></div>
  <div className="shop-tools">
   <div className="shop-filters" role="group" aria-label="Filter by category">{[{id:'all',name:'Everything'},...categories].map(c=><button key={c.id} aria-pressed={filter===c.id} onClick={()=>setFilter(c.id)}>{c.name}<span>{c.id==='all'?products.length:products.filter(p=>p.category===c.id).length}</span></button>)}</div>
   <label className="shop-sort"><span>Sort</span><select value={sort} onChange={e=>setSort(e.target.value as Sort)}>{Object.entries(sorts).map(([k,v])=><option key={k} value={k}>{v}</option>)}</select></label>
  </div>
  <div className="product-grid">{shown.map(p=><ProductCard key={p.id} p={p}/>)}</div>
 </section>;
}
