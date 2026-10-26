'use client';
import {useEffect, useState} from 'react';
import Link from 'next/link';
import {ArrowUpRight} from 'lucide-react';
import {money} from '../lib/shop';
import {readOrders, type Order} from '../lib/orders';

// The store owner's view: every order placed in this browser, with the Amazon listing to buy each item from.
// Not linked from the site. Orders live in localStorage until a backend is connected, so another browser
// or device will not see them.
export default function Orders(){
 const [orders,setOrders]=useState<Order[]|null>(null);
 useEffect(()=>{setOrders(readOrders());},[]);
 if(!orders)return null;
 const earned=orders.reduce((n,o)=>n+(o.commission??0),0);
 return <section className="checkout orders section-pad" aria-labelledby="orders-title">
  <div className="section-topline"><span>ORDERS · STORE OWNER</span><span>{orders.length} {orders.length===1?'ORDER':'ORDERS'} · COMMISSION {money(earned)}</span></div>
  <h1 id="orders-title" className="checkout-title">Orders to <em>place.</em></h1>
  <p className="body-small orders-note">Orders placed in this browser. For each item, open its Amazon listing, choose the same colour and size, and order it to the customer&apos;s address.</p>
  {orders.length===0?<p className="orders-empty">No orders yet. <Link className="text-link" href="/#shop">Go to the shop</Link></p>:
  <ol className="order-list">{orders.map(o=><li key={o.id} className="order-card">
   <header><div><span className="mini-label">ORDER</span><h2>{o.id}</h2><p>{new Date(o.placed).toLocaleString('en-IN',{dateStyle:'medium',timeStyle:'short'})} · {o.payment}</p></div><div className="order-money"><strong>{money(o.total)}</strong><span>Your commission {money(o.commission??0)}</span></div></header>
   {o.customer&&<address><strong>{o.customer.name}</strong><br/>{o.customer.address}, {o.customer.city}, {o.customer.state} {o.customer.pincode}<br/>{o.customer.phone} · {o.customer.email}</address>}
   <table><thead><tr><th>Item</th><th>Size</th><th>Qty</th><th>Customer paid</th><th>Amazon price</th><th>Place on Amazon</th></tr></thead>
    <tbody>{o.items.map((i,k)=><tr key={k}><td>{i.name}<span>{i.sku} · ASIN {i.asin}</span></td><td>{i.size||'—'}</td><td>{i.qty}</td><td>{money(i.price*i.qty)}</td><td>{i.amazonPrice!=null?money(i.amazonPrice*i.qty):'—'}</td><td>{i.amazonLink?<a className="text-link" href={i.amazonLink} target="_blank" rel="noreferrer">Open listing <ArrowUpRight size={14}/></a>:'—'}</td></tr>)}</tbody>
   </table>
  </li>)}</ol>}
 </section>;
}
