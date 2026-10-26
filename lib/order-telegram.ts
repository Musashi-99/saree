// Sends each new order to the admin Telegram group: the COD amount, commission, customer and address, and every
// item with its size, prices, ASIN and original Amazon link, plus one button per item that opens the listing. Server only.
// Settings come from environment variables: TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID (the group's id, e.g. -5585954862).
// On Vercel, set them in Project → Settings → Environment Variables; locally, in .env.local (git-ignored).
import 'server-only';
import {money} from './shop';
import type {Order} from './orders';

const esc = (s:string) => s.replace(/[&<>]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]!));

export function telegramMessage(o:Order) {
 const when = new Date(o.placed).toLocaleString('en-IN', {dateStyle:'medium', timeStyle:'short', timeZone:'Asia/Kolkata'});
 const c = o.customer;
 const items = o.items.map((i, n) => [
  `<b>${n + 1}. ${esc(i.name)}</b>`,
  `   ${i.size ? `Size <b>${esc(i.size)}</b> · ` : ''}Qty <b>${i.qty}</b>`,
  `   Customer pays ${money(i.price * i.qty)} · Amazon ${money(i.amazonPrice * i.qty)}`,
  `   ASIN <code>${esc(i.asin)}</code>`,
  `   ${esc(i.amazonLink)}`,
 ].join('\n')).join('\n\n');
 const text = [
  `🪔 <b>New COD order ${esc(o.id)}</b>`,
  `${esc(when)}`,
  '',
  `💰 Collect on delivery: <b>${money(o.total)}</b>`,
  `Amazon cost: ${money(o.total - o.commission)} · Commission: <b>${money(o.commission)}</b>`,
  '',
  `👤 <b>${esc(c.name)}</b>`,
  `📞 ${esc(c.phone)}`,
  `✉️ ${esc(c.email)}`,
  `📍 ${esc(c.address)}, ${esc(c.city)}, ${esc(c.state)} ${esc(c.pincode)}`,
  '',
  `🛍 <b>Items</b>`,
  items,
 ].join('\n');
 const buttons = o.items.map((i, n) => [{text:`Open item ${n + 1} on Amazon${i.size ? ` (size ${i.size})` : ''}`, url:i.amazonLink}]);
 return {text:text.slice(0, 4000), reply_markup:{inline_keyboard:buttons}};
}

export async function sendTelegramOrder(o:Order) {
 const token = process.env.TELEGRAM_BOT_TOKEN, chatId = process.env.TELEGRAM_CHAT_ID;
 if (!token || !chatId) throw new Error('TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID must be set');
 const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
  method:'POST', headers:{'Content-Type':'application/json'}, signal:AbortSignal.timeout(15000),
  body:JSON.stringify({chat_id:chatId, parse_mode:'HTML', link_preview_options:{is_disabled:true}, ...telegramMessage(o)}),
 });
 const data = await res.json() as {ok:boolean;description?:string};
 if (!data.ok) throw new Error(`Telegram: ${data.description}`);
}
