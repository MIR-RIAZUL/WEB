const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.cloudinary.com'
      },
      {
        protocol: 'https',
        hostname: 'maps.googleapis.com'
      }
    ]
  }
}

export default nextConfig
