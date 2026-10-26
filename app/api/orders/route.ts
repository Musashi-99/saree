// POST /api/orders: places a cash-on-delivery order and emails it.
// The browser sends only the customer details and {id, qty, size} per item; every name, price, Amazon link
// and the commission are taken from the catalogue here, so a tampered request cannot change them.
// The admin email is sent first: if it fails, the order is refused, so no order goes unrecorded.
import {NextResponse} from 'next/server';
import {getProductById, totals, lineKey, type CartLine} from '../../../lib/shop';
import {sendAdminMail, sendCustomerMail} from '../../../lib/order-mail';
import type {Order} from '../../../lib/orders';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const FIELDS = {
 name: /^.{2,80}$/,
 phone: /^[0-9+ ]{10,14}$/,
 email: /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,}$/,
 address: /^.{5,200}$/,
 city: /^.{2,60}$/,
 state: /^.{2,60}$/,
 pincode: /^[0-9]{6}$/,
} as const;
type Field = keyof typeof FIELDS;
const bad = (message:string, status=400) => NextResponse.json({error:message}, {status});

export async function POST(request:Request) {
 let body:{customer?:Record<string,unknown>;items?:unknown};
 try { body = await request.json(); } catch { return bad('Invalid request.'); }

 const customer = {} as Order['customer'];
 for (const key of Object.keys(FIELDS) as Field[]) {
  const value = String(body.customer?.[key] ?? '').replace(/\s+/g, ' ').trim();
  if (!FIELDS[key].test(value)) return bad(`Please check the ${key === 'pincode' ? 'PIN code' : key}.`);
  customer[key] = value;
 }

 if (!Array.isArray(body.items) || body.items.length === 0 || body.items.length > 20) return bad('Your bag is empty.');
 const lines:CartLine[] = [];
 for (const raw of body.items as {id?:unknown;qty?:unknown;size?:unknown}[]) {
  const product = getProductById(String(raw?.id));
  const qty = Number(raw?.qty);
  const size = raw?.size == null ? undefined : String(raw.size);
  if (!product || !Number.isInteger(qty) || qty < 1 || qty > 10) return bad('An item in your bag is no longer available.');
  if (product.sizes.length ? !size || !product.sizes.includes(size) : size) return bad(`Please choose a size for ${product.name}.`);
  const line = {id:product.id, qty, ...(size ? {size} : {})};
  if (lines.some(l => lineKey(l) === lineKey(line))) return bad('Your bag has a duplicate item.');
  lines.push(line);
 }

 const t = totals(lines);
 const order:Order = {
  id:`AAR-${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).slice(2, 5).toUpperCase()}`,
  placed:new Date().toISOString(), payment:'COD', total:t.total, commission:t.commission, customer,
  items:t.items.map(({product:p, qty, size}) => ({sku:p.id, name:p.name, size, qty, price:p.price, asin:p.source.asin, amazonLink:p.source.link, amazonPrice:p.source.amazonPrice, commission:(p.price - p.source.amazonPrice) * qty})),
 };

 try { await sendAdminMail(order); }
 catch (e) { console.error('Order email to admin failed', order.id, e); return bad('We could not place your order just now. Please try again in a minute.', 502); }
 let customerEmailed = true;
 try { await sendCustomerMail(order); }
 catch (e) { customerEmailed = false; console.error('Order email to customer failed', order.id, e); }
 return NextResponse.json({order, customerEmailed});
}
