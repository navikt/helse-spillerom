/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    reactStrictMode: true,
    assetPrefix: process.env.NEXT_PUBLIC_ASSET_PREFIX,
    eslint: {
        dirs: ['src'],
        ignoreDuringBuilds: true,
    },
}

module.exports = nextConfig
