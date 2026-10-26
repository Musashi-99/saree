import type { NextConfig } from 'next';
// A server build (not a static export): /api/orders sends the order emails. Pages are still prerendered.
const config: NextConfig = { trailingSlash: true, images: { unoptimized: true }, poweredByHeader: false };
export default config;
