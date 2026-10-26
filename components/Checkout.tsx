'use client';
import {useState} from 'react';
import Link from 'next/link';
import {ArrowRight, Check} from 'lucide-react';
import Photo from './Photo';
import {useCart} from './Cart';
import {totals, money, lineKey} from '../lib/shop';
import {saveOrder, type Order} from '../lib/orders';

// Orders are cash on delivery. Placing one posts the details to /api/orders, which prices it from the catalogue
// and emails the customer and the admin. The order that comes back is also kept in this browser for /orders/.
const fields=[['name','Full name','text','name'],['phone','Mobile number','tel','tel'],['email','Email','email','email'],['address','House, street and area','text','street-address'],['city','City','text','address-level2'],['state','State','text','address-level1'],['pincode','PIN code','text','postal-code']] as const;

export default function Checkout(){
 const {lines,clear}=useCart();
 const [order,setOrder]=useState<Order|null>(null);
 const [emailed,setEmailed]=useState(true);
 const [sending,setSending]=useState(false);
 const [error,setError]=useState('');
 const t=totals(lines);

 async function place(e:React.FormEvent<HTMLFormElement>){
  e.preventDefault();
  if(sending)return;
  const form=new FormData(e.currentTarget);
  const customer=Object.fromEntries(fields.map(([name])=>[name,String(form.get(name)||'').trim()]));
  setSending(true);setError('');
  try{
   const res=await fetch('/api/orders/',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({customer,items:t.items.map(({id,qty,size})=>({id,qty,size}))})});
   const data=await res.json().catch(()=>({error:'We could not place your order just now. Please try again.'}));
   if(!res.ok){setError(data.error||'We could not place your order just now. Please try again.');return;}
   saveOrder(data.order);setEmailed(data.customerEmailed);setOrder(data.order);clear();window.scrollTo({top:0});
  }catch{setError('No connection. Check your internet and try again.');}
  finally{setSending(false);}
 }

 if(order)return <section className="checkout section-pad checkout-done" aria-labelledby="done-title">
  <span className="done-mark"><Check size={26}/></span>
  <span className="eyebrow">ORDER {order.id}</span>
  <h1 id="done-title">Shubh Deepavali,<br/><em>{order.customer.name.split(' ')[0]}.</em></h1>
  <p>Your order of {order.items.reduce((n,i)=>n+i.qty,0)} {order.items.reduce((n,i)=>n+i.qty,0)===1?'piece':'pieces'} has been placed. It will be packed and dispatched in time for Diwali. Please keep <strong>{money(order.total)}</strong> ready to pay in cash on delivery.</p>
  <p className="body-small">{emailed?<>A confirmation has been sent to {order.customer.email}.</>:<>We could not email your confirmation to {order.customer.email}, but your order is placed. Please note your order number.</>}</p>
  <Link className="solid-button" href="/#shop">Continue shopping <ArrowRight size={17}/></Link>
 </section>;

 if(!t.items.length)return <section className="checkout section-pad checkout-done" aria-labelledby="empty-title">
  <span className="eyebrow">CHECKOUT</span>
  <h1 id="empty-title">Your bag<br/><em>is empty.</em></h1>
  <p>Add a saree or a kurta set from the Diwali collection, then come back here to check out.</p>
  <Link className="solid-button" href="/#shop">Shop the Diwali collection <ArrowRight size={17}/></Link>
 </section>;

 return <section className="checkout section-pad" aria-labelledby="checkout-title">
  <div className="section-topline"><span>CHECKOUT</span><span>CASH ON DELIVERY · DISPATCHED IN TIME FOR DIWALI</span></div>
  <h1 id="checkout-title" className="checkout-title">Almost <em>yours.</em></h1>
  <div className="checkout-grid">
   <form className="checkout-form" onSubmit={place}>
    <fieldset><legend className="mini-label">DELIVERY ADDRESS</legend>
     <div className="field-grid">{fields.map(([name,label,type,auto])=><label key={name} className={`field field-${name}`}><span>{label}</span><input name={name} type={type} autoComplete={auto} required {...(name==='pincode'?{pattern:'[0-9]{6}',inputMode:'numeric' as const,title:'Six-digit PIN code'}:name==='phone'?{pattern:'[0-9+ ]{10,14}',title:'Ten-digit mobile number'}:{})}/></label>)}</div>
    </fieldset>
    <fieldset><legend className="mini-label">PAYMENT</legend>
     <div className="pay-options"><label className="pay-option active"><input type="radio" name="payment" value="COD" checked readOnly/>Cash on delivery · pay {money(t.total)} when your order arrives</label></div>
     <p className="concept-note">You will get an order confirmation by email.</p>
    </fieldset>
    {error&&<p className="checkout-error" role="alert">{error}</p>}
    <button className="solid-button" type="submit" disabled={sending} aria-busy={sending}>{sending?'Placing your order…':<>Place order · {money(t.total)}</>}<ArrowRight size={17}/></button>
   </form>
   <aside className="checkout-summary" aria-label="Order summary">
    <span className="mini-label">ORDER SUMMARY · {t.count} {t.count===1?'ITEM':'ITEMS'}</span>
    <ul className="cart-lines">{t.items.map(({product:p,qty,size})=><li key={lineKey({id:p.id,size})}><span className="cart-thumb"><Photo name={p.images[0].name} alt={p.name} sizes="90px"/></span><div><h3>{p.name}</h3><p>{size&&`Size ${size} · `}Qty {qty} · {money(p.price)} each</p></div><strong>{money(p.price*qty)}</strong></li>)}</ul>
    <dl className="cart-sum"><div><dt>Subtotal</dt><dd>{money(t.subtotal)}</dd></div><div><dt>Shipping</dt><dd>{t.shipping?money(t.shipping):'Free'}</dd></div><div className="cart-total"><dt>Total</dt><dd>{money(t.total)}</dd></div></dl>
   </aside>
  </div>
 </section>;
}
