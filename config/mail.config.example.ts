// Mail settings for order emails. SERVER ONLY: this file holds the SMTP key.
// - `server-only` makes the build fail if any client component imports it, so it never reaches the browser.
// - Copy this file to config/mail.config.ts and fill it in. That copy is git-ignored.
import 'server-only';
import type {MailConfig} from './mail.types';

const config: MailConfig = {
 smtp: {
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false, // STARTTLS on 587
  user: 'your-login@smtp-brevo.com',
  pass: 'xsmtpsib-your-smtp-key',
 },
 // The sender must be a verified sender (or domain) in Brevo: Settings → Senders, domains & dedicated IPs.
 from: {name: 'AARADHYA', email: 'orders@example.com'},
 // Receives a copy of every order, with the Amazon links to place it.
 admin: 'you@example.com',
};
export default config;
