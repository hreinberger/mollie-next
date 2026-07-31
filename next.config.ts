/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
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
    experimental: {
        useTypeScriptCli: true, // needed for Typescript 7 support
    },
};

export default nextConfig;
