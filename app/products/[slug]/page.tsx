import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import ShopShell from '../../../components/ShopShell';
import ProductView from '../../../components/ProductView';
import {products, getProduct} from '../../../lib/shop';

export const dynamicParams = false;
export function generateStaticParams() { return products.map(p => ({slug: p.slug})); }
export async function generateMetadata({params}: {params: Promise<{slug: string}>}): Promise<Metadata> {
 const p = getProduct((await params).slug);
 return p ? {title: `${p.name} — AARADHYA Diwali`, description: p.description} : {};
}
export default async function ProductPage({params}: {params: Promise<{slug: string}>}) {
 const p = getProduct((await params).slug);
 if (!p) notFound();
 return <ShopShell><ProductView slug={p.slug}/></ShopShell>;
}
