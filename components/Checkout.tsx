'use client';
import {useState} from 'react';
import Link from 'next/link';
import {ArrowRight, Check} from 'lucide-react';
import Photo from './Photo';
import {useCart} from './Cart';
import {totals, findCoupon, money, type Coupon} from '../lib/shop';

// Payments are not connected yet, so a placed order is saved in this browser (localStorage) and shown back.
const ORDERS='aaradhya-orders';
type Order={id:string;placed:string;name:string;email:string;total:number;payment:string;items:{name:string;qty:number;price:number}[]};
const fields=[['name','Full name','text','name'],['phone','Mobile number','tel','tel'],['email','Email','email','email'],['address','House, street and area','text','street-address'],['city','City','text','address-level2'],['state','State','text','address-level1'],['pincode','PIN code','text','postal-code']] as const;

export default function Checkout(){
 const {lines,clear}=useCart();
 const [code,setCode]=useState('');
 const [coupon,setCoupon]=useState<Coupon>();
 const [couponNote,setCouponNote]=useState('');
 const [payment,setPayment]=useState('UPI');
 const [order,setOrder]=useState<Order|null>(null);
 const t=totals(lines,coupon);

 function applyCoupon(){
  const c=findCoupon(code);
  if(!c){setCoupon(undefined);setCouponNote('That code is not valid.');return;}
  if(t.subtotal<(c.minimum??0)){setCoupon(undefined);setCouponNote(`${c.code} needs an order of ${money(c.minimum!)} or more.`);return;}
  setCoupon(c);setCouponNote(`${c.code} applied: ${c.label}.`);
 }
 function place(e:React.FormEvent<HTMLFormElement>){
  e.preventDefault();
  const form=new FormData(e.currentTarget);
  const placed:Order={id:`AAR-${Date.now().toString(36).toUpperCase()}`,placed:new Date().toISOString(),name:String(form.get('name')),email:String(form.get('email')),total:t.total,payment,items:t.items.map(l=>({name:l.product.name,qty:l.qty,price:l.product.price}))};
  try{localStorage.setItem(ORDERS,JSON.stringify([placed,...JSON.parse(localStorage.getItem(ORDERS)||'[]')]));}catch{}
  setOrder(placed);clear();window.scrollTo({top:0});
 }

 if(order)return <section className="checkout section-pad checkout-done" aria-labelledby="done-title">
  <span className="done-mark"><Check size={26}/></span>
  <span className="eyebrow">ORDER {order.id}</span>
  <h1 id="done-title">Shubh Deepavali,<br/><em>{order.name.split(' ')[0]}.</em></h1>
  <p>Your order of {order.items.reduce((n,i)=>n+i.qty,0)} {order.items.length===1&&order.items[0].qty===1?'saree':'sarees'} for {money(order.total)} has been placed. It will be folded in tissue, wrapped and dispatched in time for Diwali.</p>
  <p className="body-small">This store is not connected to payments or email yet, so no money was taken and no confirmation was sent. The order is saved in this browser.</p>
  <Link className="solid-button" href="/#shop">Continue shopping <ArrowRight size={17}/></Link>
 </section>;

 if(!t.items.length)return <section className="checkout section-pad checkout-done" aria-labelledby="empty-title">
  <span className="eyebrow">CHECKOUT</span>
  <h1 id="empty-title">Your bag<br/><em>is empty.</em></h1>
  <p>Add a saree or two from the Diwali collection, then come back here to check out.</p>
  <Link className="solid-button" href="/#shop">Shop the Diwali collection <ArrowRight size={17}/></Link>
 </section>;

 return <section className="checkout section-pad" aria-labelledby="checkout-title">
  <div className="section-topline"><span>CHECKOUT</span><span>SECURE · DISPATCHED IN TIME FOR DIWALI</span></div>
  <h1 id="checkout-title" className="checkout-title">Almost <em>yours.</em></h1>
  <div className="checkout-grid">
   <form className="checkout-form" onSubmit={place}>
    <fieldset><legend className="mini-label">DELIVERY ADDRESS</legend>
     <div className="field-grid">{fields.map(([name,label,type,auto])=><label key={name} className={`field field-${name}`}><span>{label}</span><input name={name} type={type} autoComplete={auto} required {...(name==='pincode'?{pattern:'[0-9]{6}',inputMode:'numeric' as const,title:'Six-digit PIN code'}:name==='phone'?{pattern:'[0-9+ ]{10,14}',title:'Ten-digit mobile number'}:{})}/></label>)}</div>
    </fieldset>
    <fieldset><legend className="mini-label">PAYMENT</legend>
     <div className="pay-options">{[['UPI','UPI · Google Pay, PhonePe, Paytm'],['Card','Credit or debit card'],['COD','Cash on delivery']].map(([v,l])=><label key={v} className={payment===v?'pay-option active':'pay-option'}><input type="radio" name="payment" value={v} checked={payment===v} onChange={()=>setPayment(v)}/>{l}</label>)}</div>
     <p className="concept-note">Payments are not connected yet. Placing an order saves it in this browser only.</p>
    </fieldset>
    <button className="solid-button" type="submit">Place order · {money(t.total)}<ArrowRight size={17}/></button>
   </form>
   <aside className="checkout-summary" aria-label="Order summary">
    <span className="mini-label">ORDER SUMMARY · {t.count} {t.count===1?'ITEM':'ITEMS'}</span>
    <ul className="cart-lines">{t.items.map(({product:p,qty})=><li key={p.id}><span className="cart-thumb"><Photo name={p.images[0].name} alt={p.name} sizes="90px"/></span><div><h3>{p.name}</h3><p>Qty {qty} · {money(p.price)} each</p></div><strong>{money(p.price*qty)}</strong></li>)}</ul>
    <div className="coupon"><label htmlFor="coupon" className="mini-label">COUPON CODE</label><div><input id="coupon" value={code} onChange={e=>setCode(e.target.value)} placeholder="DEEPAVALI10" onKeyDown={e=>{if(e.key==='Enter'){e.preventDefault();applyCoupon();}}}/><button type="button" onClick={applyCoupon}>Apply</button></div><p aria-live="polite">{couponNote}</p></div>
    <dl className="cart-sum"><div><dt>Subtotal</dt><dd>{money(t.subtotal)}</dd></div>{t.saving>0&&<div><dt>Coupon {t.coupon?.code}</dt><dd>−{money(t.saving)}</dd></div>}<div><dt>Shipping</dt><dd>{t.shipping?money(t.shipping):'Free'}</dd></div><div className="cart-total"><dt>Total</dt><dd>{money(t.total)}</dd></div></dl>
   </aside>
  </div>
 </section>;
}
