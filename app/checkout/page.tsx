import type {Metadata} from 'next';
import ShopShell from '../../components/ShopShell';
import Checkout from '../../components/Checkout';

export const metadata: Metadata = {title: 'Checkout — AARADHYA Diwali'};
export default function CheckoutPage() { return <ShopShell><Checkout/></ShopShell>; }
