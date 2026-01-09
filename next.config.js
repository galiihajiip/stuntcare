/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['lh3.googleusercontent.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
  // Disable static page generation for all pages
  // This prevents the useState error during build
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
}

module.exports = nextConfig
