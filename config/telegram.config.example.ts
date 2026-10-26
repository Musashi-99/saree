// Telegram bot for admin order notifications. SERVER ONLY: this file holds the bot token.
// - `server-only` makes the build fail if any client component imports it, so it never reaches the browser.
// - Copy this file to config/telegram.config.ts and fill it in. That copy is git-ignored.
import 'server-only';
import type {TelegramConfig} from './telegram.types';

const config: TelegramConfig = {
 botToken: '123456789:your-bot-token', // from @BotFather
 chatId: '', // filled in by: node scripts/telegram-chat-id.mjs
};
export default config;
