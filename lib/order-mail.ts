// Builds and sends the two order emails: a confirmation to the customer, and the full order to the admin
// with each item's original Amazon listing so it can be placed there. Server only.
import 'server-only';
import nodemailer from 'nodemailer';
import config from '../config/mail.config';
import {money} from './shop';
import type {Order} from './orders';

const esc = (s:string) => s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
const transport = nodemailer.createTransport({host:config.smtp.host, port:config.smtp.port, secure:config.smtp.secure, auth:{user:config.smtp.user, pass:config.smtp.pass}});
const from = {name:config.from.name, address:config.from.email};
const when = (o:Order) => new Date(o.placed).toLocaleString('en-IN', {dateStyle:'medium', timeStyle:'short', timeZone:'Asia/Kolkata'});
const addressLines = (o:Order) => [o.customer.name, o.customer.address, `${o.customer.city}, ${o.customer.state} ${o.customer.pincode}`, `Phone: ${o.customer.phone}`, `Email: ${o.customer.email}`];

// A plain, email-client-safe layout: one table, inline styles, the site's wine and ivory.
function page(title:string, body:string) {
 return `<!doctype html><html><body style="margin:0;background:#f7f1e7;font-family:Arial,sans-serif;color:#291713">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#fff">
<tr><td style="background:#570d19;color:#f7f1e7;padding:22px 28px;font-family:Georgia,serif;font-size:24px;letter-spacing:3px">AARADHYA</td></tr>
<tr><td style="padding:28px">
<h1 style="font-family:Georgia,serif;font-weight:normal;color:#570d19;font-size:26px;margin:0 0 16px">${title}</h1>
${body}
</td></tr></table></td></tr></table></body></html>`;
}
const cell = 'padding:8px 6px;border-bottom:1px solid #eee5d8;font-size:13px;vertical-align:top';
const head = 'padding:8px 6px;border-bottom:1px solid #b89a62;font-size:11px;text-align:left;color:#77675e';

function customerMail(o:Order) {
 const rows = o.items.map(i => `<tr><td style="${cell}">${esc(i.name)}${i.size ? `<br><span style="color:#77675e">Size ${esc(i.size)}</span>` : ''}</td><td style="${cell}">${i.qty}</td><td style="${cell};text-align:right">${money(i.price * i.qty)}</td></tr>`).join('');
 const html = page(`Shubh Deepavali, ${esc(o.customer.name.split(' ')[0])}.`, `
<p style="font-size:14px;line-height:1.6">Thank you for your order. It will be packed and dispatched in time for Diwali.</p>
<p style="font-size:13px;margin:18px 0 6px"><strong>Order ${esc(o.id)}</strong> · ${esc(when(o))}</p>
<table width="100%" cellpadding="0" cellspacing="0"><tr><th style="${head}">Item</th><th style="${head}">Qty</th><th style="${head};text-align:right">Price</th></tr>${rows}
<tr><td style="${cell}" colspan="2">Shipping</td><td style="${cell};text-align:right">Free</td></tr>
<tr><td style="${cell};font-weight:bold" colspan="2">Total</td><td style="${cell};text-align:right;font-weight:bold">${money(o.total)}</td></tr></table>
<p style="font-size:14px;margin:20px 0 6px"><strong>Payment: Cash on delivery.</strong> Please keep ${money(o.total)} ready when your order arrives.</p>
<p style="font-size:13px;margin:18px 0 4px"><strong>Delivering to</strong></p>
<p style="font-size:13px;line-height:1.6;margin:0">${addressLines(o).map(esc).join('<br>')}</p>
<p style="font-size:12px;color:#77675e;margin-top:24px">Questions about your order? Reply to this email.</p>`);
 const text = [`Shubh Deepavali, ${o.customer.name}.`, `Thank you for your order ${o.id} (${when(o)}).`, '', ...o.items.map(i => `- ${i.name}${i.size ? ` (size ${i.size})` : ''} × ${i.qty}: ${money(i.price * i.qty)}`), '', `Shipping: Free`, `Total: ${money(o.total)}`, '', `Payment: Cash on delivery. Please keep ${money(o.total)} ready when your order arrives.`, '', 'Delivering to:', ...addressLines(o)].join('\n');
 return {to:{name:o.customer.name, address:o.customer.email}, replyTo:config.admin, subject:`Your AARADHYA order ${o.id} is confirmed`, html, text};
}

function adminMail(o:Order) {
 const rows = o.items.map(i => `<tr><td style="${cell}">${esc(i.name)}<br><span style="color:#77675e">${esc(i.sku)} · ASIN ${esc(i.asin)}</span></td><td style="${cell}">${esc(i.size || '—')}</td><td style="${cell}">${i.qty}</td><td style="${cell};text-align:right">${money(i.price * i.qty)}</td><td style="${cell};text-align:right">${money(i.amazonPrice * i.qty)}</td><td style="${cell}"><a href="${esc(i.amazonLink)}" style="color:#570d19">Open on Amazon</a></td></tr>`).join('');
 const html = page(`New COD order ${esc(o.id)}`, `
<p style="font-size:13px;margin:0 0 4px">${esc(when(o))} · <strong>Cash on delivery: collect ${money(o.total)}</strong></p>
<p style="font-size:13px;margin:0 0 18px">Your commission: <strong>${money(o.commission)}</strong></p>
<p style="font-size:13px;margin:0 0 4px"><strong>Customer and delivery address</strong></p>
<p style="font-size:13px;line-height:1.6;margin:0 0 18px">${addressLines(o).map(esc).join('<br>')}</p>
<table width="100%" cellpadding="0" cellspacing="0"><tr><th style="${head}">Item</th><th style="${head}">Size</th><th style="${head}">Qty</th><th style="${head};text-align:right">Customer pays</th><th style="${head};text-align:right">Amazon price</th><th style="${head}">Amazon link</th></tr>${rows}
<tr><td style="${cell};font-weight:bold" colspan="3">Total (COD)</td><td style="${cell};text-align:right;font-weight:bold">${money(o.total)}</td><td style="${cell};text-align:right">${money(o.total - o.commission)}</td><td style="${cell}"></td></tr></table>
<p style="font-size:12px;color:#77675e;margin-top:22px">To fulfil: open each Amazon link, choose the same colour and size, and order it to the address above.</p>`);
 const text = [`New COD order ${o.id} (${when(o)})`, `Collect on delivery: ${money(o.total)}`, `Commission: ${money(o.commission)}`, '', 'Customer:', ...addressLines(o), '', 'Items:', ...o.items.flatMap(i => [`- ${i.name}${i.size ? ` (size ${i.size})` : ''} × ${i.qty}`, `  Customer pays ${money(i.price * i.qty)} · Amazon ${money(i.amazonPrice * i.qty)} · ASIN ${i.asin}`, `  ${i.amazonLink}`])].join('\n');
 return {to:config.admin, replyTo:{name:o.customer.name, address:o.customer.email}, subject:`New COD order ${o.id} · ${money(o.total)} · ${o.customer.name}`, html, text};
}

export async function sendAdminMail(o:Order) { await transport.sendMail({from, ...adminMail(o)}); }
export async function sendCustomerMail(o:Order) { await transport.sendMail({from, ...customerMail(o)}); }
