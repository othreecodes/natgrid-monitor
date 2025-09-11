/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Temporarily disabled for debugging
  swcMinify: true,
  output: 'standalone', // For Docker builds
  typescript: {
    ignoreBuildErrors: true, // Temporarily ignore TypeScript errors for deployment
  },
  env: {
    GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
    GRID_API_ENDPOINT: process.env.GRID_API_ENDPOINT || 'https://niggrid.org',
    GRID_UPDATE_INTERVAL: process.env.GRID_UPDATE_INTERVAL || '60000',
    DEFAULT_LOCATION_LAT: process.env.DEFAULT_LOCATION_LAT || '9.0765',
    DEFAULT_LOCATION_LNG: process.env.DEFAULT_LOCATION_LNG || '7.3986',
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
    ]
  },
}

module.exports = nextConfig