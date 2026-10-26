'use client';
import {createContext, useContext, useEffect, useState} from 'react';
import Link from 'next/link';
import {Minus, Plus, ShoppingBag, X, ArrowRight} from 'lucide-react';
import Modal from './Modal';
import Photo from './Photo';
import {store, totals, money, lineKey, type CartLine} from '../lib/shop';

// The bag and wishlist live in the browser (localStorage) until accounts and a database are connected.
const KEY='aaradhya-bag', SAVED_KEY='aaradhya-saved';
// Bag lines are addressed by lineKey (product id, plus the size for sized products such as kurtis).
type Cart={lines:CartLine[];saved:string[];open:boolean;setOpen:(v:boolean)=>void;add:(id:string,qty?:number,size?:string)=>void;setQty:(key:string,qty:number)=>void;remove:(key:string)=>void;clear:()=>void;toggleSaved:(id:string)=>void;count:number};
const CartContext=createContext<Cart|null>(null);
export function useCart(){const c=useContext(CartContext);if(!c)throw new Error('useCart needs <CartProvider>');return c;}

function read<T>(key:string,fallback:T):T{try{const v=localStorage.getItem(key);return v?JSON.parse(v):fallback;}catch{return fallback;}}
function write(key:string,value:unknown){try{localStorage.setItem(key,JSON.stringify(value));}catch{}}

export function CartProvider({children}:{children:React.ReactNode}){
 const [lines,setLines]=useState<CartLine[]>([]);
 const [saved,setSaved]=useState<string[]>([]);
 const [open,setOpen]=useState(false);
 const [ready,setReady]=useState(false);
 useEffect(()=>{setLines(read(KEY,[]));setSaved(read(SAVED_KEY,[]));setReady(true);},[]);
 useEffect(()=>{if(ready)write(KEY,lines);},[lines,ready]);
 useEffect(()=>{if(ready)write(SAVED_KEY,saved);},[saved,ready]);
 const setQty=(key:string,qty:number)=>setLines(ls=>qty<=0?ls.filter(l=>lineKey(l)!==key):ls.map(l=>lineKey(l)===key?{...l,qty:Math.min(qty,10)}:l));
 const value:Cart={lines,saved,open,setOpen,
  add:(id,qty=1,size)=>{const key=lineKey({id,size});setLines(ls=>ls.some(l=>lineKey(l)===key)?ls.map(l=>lineKey(l)===key?{...l,qty:Math.min(l.qty+qty,10)}:l):[...ls,{id,qty,...(size?{size}:{})}]);setOpen(true);},
  setQty,remove:id=>setQty(id,0),clear:()=>setLines([]),
  toggleSaved:id=>setSaved(s=>s.includes(id)?s.filter(x=>x!==id):[...s,id]),
  count:lines.reduce((n,l)=>n+l.qty,0)};
 return <CartContext.Provider value={value}>{children}<CartDrawer/></CartContext.Provider>;
}

export function BagButton({className='menu-toggle bag-toggle'}:{className?:string}){
 const {count,setOpen}=useCart();
 return <button className={className} onClick={()=>setOpen(true)} aria-label={`Open shopping bag, ${count} ${count===1?'item':'items'}`} aria-haspopup="dialog" data-magnetic><span>Bag</span><ShoppingBag size={18}/><b className="bag-count" aria-hidden="true">{count}</b></button>;
}

export function QtyStepper({value,onChange,label}:{value:number;onChange:(v:number)=>void;label:string}){
 return <div className="qty" role="group" aria-label={`Quantity of ${label}`}><button onClick={()=>onChange(value-1)} aria-label="Decrease quantity"><Minus size={13}/></button><span aria-live="polite">{value}</span><button onClick={()=>onChange(value+1)} aria-label="Increase quantity" disabled={value>=10}><Plus size={13}/></button></div>;
}

function CartDrawer(){
 const {lines,open,setOpen,setQty,remove}=useCart();
 const t=totals(lines);
 const toFree=store.freeShippingAbove-t.subtotal;
 return <Modal open={open} onClose={()=>setOpen(false)} title="Your shopping bag" className="cart-modal">
  <div className="cart-panel">
   <span className="eyebrow">YOUR DIWALI BAG · {t.count} {t.count===1?'ITEM':'ITEMS'}</span>
   <h2>Your bag</h2>
   {t.items.length===0?<div className="cart-empty"><p>Your bag is empty. The diyas are lit and the sarees are waiting.</p><Link className="solid-button" href="/#shop" onClick={()=>setOpen(false)}>Shop the Diwali collection <ArrowRight size={17}/></Link></div>:<>
    <p className="cart-ship">{toFree>0?<>Add {money(toFree)} more for free shipping.</>:<>Your order ships free, in time for Diwali.</>}</p>
    <ul className="cart-lines">{t.items.map(({product:p,qty,size})=><li key={lineKey({id:p.id,size})}>
     <Link href={`/products/${p.slug}/`} onClick={()=>setOpen(false)} className="cart-thumb"><Photo name={p.images[0].name} alt={p.name} sizes="90px"/></Link>
     <div><Link href={`/products/${p.slug}/`} onClick={()=>setOpen(false)}><h3>{p.name}</h3></Link><p>{p.colour}{size&&` · Size ${size}`}</p><div className="cart-line-foot"><QtyStepper value={qty} onChange={v=>setQty(lineKey({id:p.id,size}),v)} label={p.name}/><strong>{money(p.price*qty)}</strong></div></div>
     <button className="cart-remove" onClick={()=>remove(lineKey({id:p.id,size}))} aria-label={`Remove ${p.name}${size?`, size ${size}`:''}`}><X size={15}/></button>
    </li>)}</ul>
    <dl className="cart-sum"><div><dt>Subtotal</dt><dd>{money(t.subtotal)}</dd></div><div><dt>You save on MRP</dt><dd>{money(t.mrp-t.subtotal)}</dd></div><div><dt>Shipping</dt><dd>{t.shipping?money(t.shipping):'Free'}</dd></div></dl>
    <Link className="solid-button" href="/checkout/" onClick={()=>setOpen(false)}>Checkout · {money(t.total)}<ArrowRight size={17}/></Link>
    <p className="concept-note">Delivered in time for Diwali. Taxes included.</p>
   </>}
  </div>
 </Modal>;
}
