// The store's data layer. data/products.json stands in for a database until one is connected;
// every page reads products, categories and coupons through these helpers so that swap stays local.
// The catalogue is built from real Amazon.in listings by scripts/scrape-amazon.py and scripts/build-catalogue.py:
// each product's `source` holds its ASIN, Amazon link and Amazon price, and `price` adds the store's commission.
import db from '../data/products.json';

export type Product = typeof db.products[number];
export type Category = typeof db.categories[number];
export type Coupon = {code:string;label:string;percent?:number;flat?:number;minimum?:number};
export type CartLine = {id:string;qty:number;size?:string};
// A product in two sizes is two lines in the bag.
export const lineKey = (l:{id:string;size?:string}) => l.size?`${l.id}|${l.size}`:l.id;

export const store = db.store;
export const categories: Category[] = db.categories;
export const products: Product[] = db.products;

export const getProduct = (slug:string) => products.find(p=>p.slug===slug);
export const getProductById = (id:string) => products.find(p=>p.id===id);
export const getCategory = (id:string) => categories.find(c=>c.id===id);
export const featured = () => products.filter(p=>p.featured);
export const related = (p:Product, count=4) => [...products.filter(o=>o.category===p.category&&o.id!==p.id), ...products.filter(o=>o.category!==p.category)].slice(0,count);

const inr = new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0});
export const money = (n:number) => inr.format(n);
export const discount = (p:Product) => Math.round((1-p.price/p.mrp)*100);

export function findCoupon(code:string): Coupon|undefined {
 return (store.coupons as Coupon[]).find(c=>c.code===code.trim().toUpperCase());
}

// Totals for a cart: subtotal, coupon saving, shipping (free above the threshold) and the amount payable,
// plus the commission it earns over the Amazon prices.
export function totals(lines:CartLine[], coupon?:Coupon) {
 const items = lines.map(l=>({...l, product:getProductById(l.id)})).filter((l):l is CartLine&{product:Product}=>!!l.product);
 const subtotal = items.reduce((sum,l)=>sum+l.product.price*l.qty,0);
 const mrp = items.reduce((sum,l)=>sum+l.product.mrp*l.qty,0);
 const valid = coupon&&subtotal>=(coupon.minimum??0)?coupon:undefined;
 const saving = valid?Math.round(valid.percent?subtotal*valid.percent/100:valid.flat??0):0;
 const shipping = subtotal===0||subtotal>=store.freeShippingAbove?0:store.shippingFee;
 const commission = items.reduce((sum,l)=>sum+(l.product.price-l.product.source.amazonPrice)*l.qty,0);
 return {items, subtotal, mrp, coupon:valid, saving, shipping, commission, total:subtotal-saving+shipping, count:items.reduce((n,l)=>n+l.qty,0)};
}
