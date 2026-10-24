'use client';
import Link from 'next/link';
import {BagButton} from './Cart';

function Lotus({className=''}:{className?:string}) { return <svg className={className} viewBox="0 0 64 64" fill="none" aria-hidden="true"><path d="M32 8C15 24 23 41 32 49C41 41 49 24 32 8ZM32 49C16 49 7 36 9 23C22 25 31 36 32 49ZM32 49C48 49 57 36 55 23C42 25 33 36 32 49ZM13 51Q32 62 51 51" stroke="currentColor" strokeWidth="1.2"/></svg>; }

// Header and footer for the product and checkout pages, matching the homepage.
export default function ShopShell({children}:{children:React.ReactNode}){
 return <div className="site shop-page">
  <a href="#main" className="skip-link">Skip to content</a>
  <header className="header">
   <Link className="wordmark" href="/" aria-label="Aaradhya home"><Lotus/><span>AARADHYA<small>DIWALI 2026</small></span></Link>
   <nav className="desktop-nav" aria-label="Main navigation"><Link href="/#shop">Shop</Link><Link href="/#collections">Diwali edits</Link><Link href="/#essence">Maa Lakshmi</Link></nav>
   <BagButton/>
  </header>
  <main id="main">{children}</main>
  <footer className="shop-footer section-pad">
   <Lotus className="footer-lotus"/>
   <p>May every thread you wear<br/><em>carry Lakshmi&apos;s blessing.</em></p>
   <div><span>© 2026 AARADHYA · DIWALI COLLECTION</span><span>Free shipping above ₹9,999 · Easy 7-day returns</span><Link href="/#shop">Continue shopping</Link></div>
  </footer>
 </div>;
}
