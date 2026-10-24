import type { Metadata, Viewport } from 'next';
import './globals.css';
import './live.css';
import './devotion.css';
import './shop.css';
import { CartProvider } from '../components/Cart';
export const metadata: Metadata = { title: 'AARADHYA — Diwali Silk Sarees', description: 'Hand-woven Kanjivaram, Banarasi, tissue and handloom sarees for Diwali 2026. Shop the festival of lights collection, dispatched in time for Lakshmi Puja.', robots: { index: false, follow: false }, icons: { icon: '/favicon.svg' } };
export const viewport: Viewport = { themeColor: '#570d19' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body><CartProvider>{children}</CartProvider></body></html>; }
