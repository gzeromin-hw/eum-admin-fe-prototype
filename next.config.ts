import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const nextConfig: NextConfig = {
  output: 'standalone',
  basePath: process.env.NEXT_PUBLIC_PREFIX,
  trailingSlash: true,
  async rewrites() {
    if (!process.env.NEXT_PUBLIC_GATEWAY_URL) return []
    return [
      {
        source: `/api/:path*`,
        destination: `${process.env.NEXT_PUBLIC_GATEWAY_URL}/admin/:path*`,
      },
    ]
  },
}

const withNextIntl = createNextIntlPlugin()
export default withNextIntl(nextConfig)
