// POST /api/orders: places a cash-on-delivery order and notifies the admin on Telegram.
// The browser sends only the customer details and {id, qty, size} per item; every name, price, Amazon link
// and the commission are taken from the catalogue here, so a tampered request cannot change them.
// The Telegram message to the admin group is required: if it fails, the order is refused, so no order goes
// unrecorded. The customer confirmation and admin emails are extras: their failure never blocks an order.
import {NextResponse} from 'next/server';
import {getProductById, totals, lineKey, MAX_QTY, MAX_ITEMS, type CartLine} from '../../../lib/shop';
import {sendAdminMail, sendCustomerMail} from '../../../lib/order-mail';
import {sendTelegramOrder} from '../../../lib/order-telegram';
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

 if (!Array.isArray(body.items) || body.items.length === 0) return bad('Your bag is empty.');
 if (body.items.length > MAX_ITEMS) return bad(`An order can have up to ${MAX_ITEMS} different items. Please remove ${body.items.length - MAX_ITEMS} and try again.`);
 const lines:CartLine[] = [];
 for (const raw of body.items as {id?:unknown;qty?:unknown;size?:unknown}[]) {
  const product = getProductById(String(raw?.id));
  const qty = Number(raw?.qty);
  const size = raw?.size == null ? undefined : String(raw.size);
  if (!product || !Number.isInteger(qty) || qty < 1) return bad('An item in your bag is no longer available.');
  if (qty > MAX_QTY) return bad(`You can order up to ${MAX_QTY} of ${product.name}.`);
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

 try { await sendTelegramOrder(order); }
 catch (e) { console.error('Telegram order notification failed', order.id, e); return bad('We could not place your order just now. Please try again in a minute.', 502); }
 const [toCustomer, toAdmin] = await Promise.allSettled([sendCustomerMail(order), sendAdminMail(order)]);
 if (toCustomer.status === 'rejected') console.error('Order email to customer failed', order.id, toCustomer.reason);
 if (toAdmin.status === 'rejected') console.error('Order email to admin failed', order.id, toAdmin.reason);
 return NextResponse.json({order, customerEmailed:toCustomer.status === 'fulfilled'});
}
