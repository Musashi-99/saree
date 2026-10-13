import type { Metadata, Viewport } from 'next';
import './globals.css';
import './live.css';
import './devotion.css';
export const metadata: Metadata = { title: 'AARADHYA — Woven in Divinity', description: 'A journey through Indian sarees, heritage and the quiet power of the feminine spirit. An independent fashion editorial concept.', robots: { index: false, follow: false }, icons: { icon: '/favicon.svg' } };
export const viewport: Viewport = { themeColor: '#570d19' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
