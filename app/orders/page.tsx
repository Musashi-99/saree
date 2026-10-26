import type {Metadata} from 'next';
import ShopShell from '../../components/ShopShell';
import Orders from '../../components/Orders';

export const metadata: Metadata = {title: 'Orders — AARADHYA', robots: {index: false, follow: false}};
export default function OrdersPage() { return <ShopShell><Orders/></ShopShell>; }
