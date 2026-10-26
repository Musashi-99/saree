// Finds the Telegram group the order bot is in and saves its chat id as TELEGRAM_CHAT_ID in .env.local.
//   1. Put TELEGRAM_BOT_TOKEN in .env.local (see .env.example), and add the bot to the group.
//   2. Send any message in the group, e.g. "hi".
//   3. node scripts/telegram-chat-id.mjs            lists the chats, saves it if there is exactly one group
//      node scripts/telegram-chat-id.mjs <chatId>   saves that chat id
// Telegram only keeps a bot's updates for 24 hours, so send the message shortly before running this.
// For Vercel, copy the printed id into Project → Settings → Environment Variables as TELEGRAM_CHAT_ID.
import {readFile, writeFile} from 'node:fs/promises';

const FILE = '.env.local';
const env = await readFile(FILE, 'utf8').catch(() => '');
const token = process.env.TELEGRAM_BOT_TOKEN || env.match(/^TELEGRAM_BOT_TOKEN=(.+)$/m)?.[1]?.trim();
if (!token) throw new Error(`Set TELEGRAM_BOT_TOKEN in ${FILE} first (see .env.example)`);

const api = async (method, params = {}) => {
  const res = await fetch(`https://api.telegram.org/bot${token}/${method}`, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(params)});
  const data = await res.json();
  if (!data.ok) throw new Error(`${method}: ${data.description}`);
  return data.result;
};

const save = async (chatId, title) => {
  const line = `TELEGRAM_CHAT_ID=${chatId}`;
  await writeFile(FILE, /^TELEGRAM_CHAT_ID=.*$/m.test(env) ? env.replace(/^TELEGRAM_CHAT_ID=.*$/m, line) : `${env.trimEnd()}\n${line}\n`);
  console.log(`Saved ${line}${title ? ` (${title})` : ''} to ${FILE}. Set the same value on Vercel.`);
};

if (process.argv[2]) {
  await save(process.argv[2]);
} else {
  const me = await api('getMe');
  const updates = await api('getUpdates', {allowed_updates: ['message', 'my_chat_member', 'channel_post']});
  const chats = new Map();
  for (const u of updates) {
    const chat = (u.message ?? u.my_chat_member ?? u.channel_post)?.chat;
    if (chat) chats.set(chat.id, chat);
  }
  console.log(`Bot @${me.username}: ${chats.size} chat(s) in recent updates`);
  for (const c of chats.values()) console.log(`  ${c.id}  ${c.type}  ${c.title ?? c.username ?? c.first_name}`);
  const groups = [...chats.values()].filter(c => c.type === 'group' || c.type === 'supergroup');
  if (groups.length === 1) await save(groups[0].id, groups[0].title);
  else if (!groups.length) console.log('No group found. Send a message in the group (the bot must be a member), then run this again.');
  else console.log('Several groups found. Run again with the one you want: node scripts/telegram-chat-id.mjs <chatId>');
}
