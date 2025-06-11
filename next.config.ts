/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',         // Required for static HTML export (next export)
  basePath: '/aran',        // Base path for GitHub Pages subdirectory
  trailingSlash: true,      // Optional but recommended for static hosting

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',      // Allow external image sources if needed
      },
    ],
  },

  typescript: {
    ignoreBuildErrors: true,  // Optional: Ignore TS errors during build
  },

  eslint: {
    ignoreDuringBuilds: true, // Optional: Ignore ESLint errors during build
  },
};

export default nextConfig;
