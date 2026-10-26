// Finds the Telegram group the order bot is in and saves its chat id to config/telegram.config.ts.
//   1. Add the bot to the group (or keep it there) and send any message in the group, e.g. "hi".
//   2. node scripts/telegram-chat-id.mjs            lists the chats, saves it if there is exactly one group
//      node scripts/telegram-chat-id.mjs <chatId>   saves that chat id
// Telegram only keeps a bot's updates for 24 hours, so send the message shortly before running this.
import {readFile, writeFile} from 'node:fs/promises';

const FILE = 'config/telegram.config.ts';
const source = await readFile(FILE, 'utf8');
const token = source.match(/botToken:\s*'([^']+)'/)?.[1];
if (!token) throw new Error(`No botToken in ${FILE}`);

const api = async (method, params = {}) => {
  const res = await fetch(`https://api.telegram.org/bot${token}/${method}`, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(params)});
  const data = await res.json();
  if (!data.ok) throw new Error(`${method}: ${data.description}`);
  return data.result;
};

const save = async (chatId, title) => {
  await writeFile(FILE, source.replace(/chatId:\s*'[^']*'/, `chatId: '${chatId}'`));
  console.log(`Saved chat id ${chatId}${title ? ` (${title})` : ''} to ${FILE}`);
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
