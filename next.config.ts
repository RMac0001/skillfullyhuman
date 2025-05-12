import path from 'path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com', 'avatars.githubusercontent.com'],
  },
  experimental: {
    externalDir: true,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  webpack: (config, { isServer }) => {
    // Add your path aliases
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@api': path.resolve(__dirname, 'api'),
      '@components': path.resolve(__dirname, 'components'),
      '@lib': path.resolve(__dirname, 'lib'),
      '@utils': path.resolve(__dirname, 'utils'),
      '@ftypes': path.resolve(__dirname, 'types'),
      '@': path.resolve(__dirname),
    };

    // Handle Node.js modules in the browser
    if (!isServer) {
      // Mock Node.js modules for browser environment
      config.resolve.alias['fs'] = path.resolve(__dirname, 'mocks/fs.js');
      config.resolve.alias['path'] = require.resolve('path-browserify');

      // For other Node.js modules, use fallbacks
      config.resolve.fallback = {
        ...config.resolve.fallback,
        os: false,
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        buffer: require.resolve('buffer'),
      };
    }

    return config;
  },
};

export default nextConfig;
