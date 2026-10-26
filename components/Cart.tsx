'use client';
import {createContext, useContext, useEffect, useState} from 'react';
import Link from 'next/link';
import {Minus, Plus, ShoppingBag, X, ArrowRight} from 'lucide-react';
import Modal from './Modal';
import Photo from './Photo';
import {store, totals, money, lineKey, MAX_QTY, MAX_ITEMS, type CartLine} from '../lib/shop';

// The bag and wishlist live in the browser (localStorage) until accounts and a database are connected.
const KEY='aaradhya-bag', SAVED_KEY='aaradhya-saved';
// Bag lines are addressed by lineKey (product id, plus the size for sized products such as kurtis).
type Cart={lines:CartLine[];saved:string[];open:boolean;notice:string;setOpen:(v:boolean)=>void;add:(id:string,qty?:number,size?:string)=>void;setQty:(key:string,qty:number)=>void;remove:(key:string)=>void;clear:()=>void;toggleSaved:(id:string)=>void;count:number};
const CartContext=createContext<Cart|null>(null);
export function useCart(){const c=useContext(CartContext);if(!c)throw new Error('useCart needs <CartProvider>');return c;}

function read<T>(key:string,fallback:T):T{try{const v=localStorage.getItem(key);return v?JSON.parse(v):fallback;}catch{return fallback;}}
function write(key:string,value:unknown){try{localStorage.setItem(key,JSON.stringify(value));}catch{}}
// A bag saved before the order limits existed is trimmed to fit them.
const withinLimits=(ls:CartLine[])=>ls.slice(0,MAX_ITEMS).map(l=>({...l,qty:Math.min(Math.max(1,l.qty),MAX_QTY)}));
const LIMIT_ITEMS=`An order can have up to ${MAX_ITEMS} different items. Place this order first, or remove an item to add another.`;
const LIMIT_QTY=`You can order up to ${MAX_QTY} of each item.`;

export function CartProvider({children}:{children:React.ReactNode}){
 const [lines,setLines]=useState<CartLine[]>([]);
 const [saved,setSaved]=useState<string[]>([]);
 const [open,setOpen]=useState(false);
 const [ready,setReady]=useState(false);
 const [notice,setNotice]=useState('');
 useEffect(()=>{setLines(withinLimits(read(KEY,[])));setSaved(read(SAVED_KEY,[]));setReady(true);},[]);
 useEffect(()=>{if(ready)write(KEY,lines);},[lines,ready]);
 useEffect(()=>{if(ready)write(SAVED_KEY,saved);},[saved,ready]);
 const setQty=(key:string,qty:number)=>{setNotice(qty>MAX_QTY?LIMIT_QTY:'');setLines(ls=>qty<=0?ls.filter(l=>lineKey(l)!==key):ls.map(l=>lineKey(l)===key?{...l,qty:Math.min(qty,MAX_QTY)}:l));};
 // Adding never goes past the limits: the bag opens with a note explaining why instead.
 function add(id:string,qty=1,size?:string){
  const key=lineKey({id,size}), existing=lines.find(l=>lineKey(l)===key);
  if(!existing&&lines.length>=MAX_ITEMS){setNotice(LIMIT_ITEMS);setOpen(true);return;}
  const total=(existing?.qty??0)+qty;
  setNotice(total>MAX_QTY?LIMIT_QTY:'');
  setLines(ls=>existing?ls.map(l=>lineKey(l)===key?{...l,qty:Math.min(total,MAX_QTY)}:l):[...ls,{id,qty:Math.min(qty,MAX_QTY),...(size?{size}:{})}]);
  setOpen(true);
 }
 const value:Cart={lines,saved,open,notice,setOpen,add,
  setQty,remove:id=>setQty(id,0),clear:()=>{setLines([]);setNotice('');},
  toggleSaved:id=>setSaved(s=>s.includes(id)?s.filter(x=>x!==id):[...s,id]),
  count:lines.reduce((n,l)=>n+l.qty,0)};
 return <CartContext.Provider value={value}>{children}<CartDrawer/></CartContext.Provider>;
}

export function BagButton({className='menu-toggle bag-toggle'}:{className?:string}){
 const {count,setOpen}=useCart();
 return <button className={className} onClick={()=>setOpen(true)} aria-label={`Open shopping bag, ${count} ${count===1?'item':'items'}`} aria-haspopup="dialog" data-magnetic><span>Bag</span><ShoppingBag size={18}/><b className="bag-count" aria-hidden="true">{count}</b></button>;
}

export function QtyStepper({value,onChange,label,max=MAX_QTY}:{value:number;onChange:(v:number)=>void;label:string;max?:number}){
 return <div className="qty" role="group" aria-label={`Quantity of ${label}`}><button onClick={()=>onChange(value-1)} aria-label="Decrease quantity"><Minus size={13}/></button><span aria-live="polite">{value}</span><button onClick={()=>onChange(value+1)} aria-label={value>=max?`Maximum ${max} per item`:'Increase quantity'} disabled={value>=max}><Plus size={13}/></button></div>;
}

function CartDrawer(){
 const {lines,open,notice,setOpen,setQty,remove}=useCart();
 const t=totals(lines);
 const toFree=store.freeShippingAbove-t.subtotal;
 return <Modal open={open} onClose={()=>setOpen(false)} title="Your shopping bag" className="cart-modal">
  <div className="cart-panel">
   <span className="eyebrow">YOUR DIWALI BAG · {t.items.length} OF {MAX_ITEMS} ITEMS · {t.count} {t.count===1?'PIECE':'PIECES'}</span>
   <h2>Your bag</h2>
   {t.items.length===0?<div className="cart-empty"><p>Your bag is empty. The diyas are lit and the sarees are waiting.</p><Link className="solid-button" href="/#shop" onClick={()=>setOpen(false)}>Shop the Diwali collection <ArrowRight size={17}/></Link></div>:<>
    {notice&&<p className="cart-notice" role="alert">{notice}</p>}
    <p className="cart-ship">{toFree>0?<>Add {money(toFree)} more for free shipping.</>:<>Your order ships free, in time for Diwali.</>} Up to {MAX_ITEMS} items per order, {MAX_QTY} of each.</p>
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
