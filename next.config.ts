/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    cacheComponents: true,
    cacheLife: {
        // 5 minute caching duration to pick up new payment methods quickly
        paymentMethods: {
            stale: 300,
            revalidate: 300,
            expire: 3600,
        },
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'mollie.com',
                port: '',
                pathname: '/external/icons/payment-methods/**',
                search: '',
            },
        ],
    },
};

export default nextConfig;
