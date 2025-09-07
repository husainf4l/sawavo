import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  // Enable source maps in production for debugging (can be controlled via env var)
  productionBrowserSourceMaps: process.env.NEXT_PUBLIC_ENABLE_SOURCE_MAPS === 'true',

  // Allow cross-origin requests from your domain during development
  allowedDevOrigins: ['Sawavo.com', 'www.Sawavo.com'],

  // Fix cross-origin warnings for better development experience
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
        ],
      },
    ];
  },

  // Compiler optimizations for performance
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
    reactRemoveProperties: process.env.NODE_ENV === 'production',
  },

  // PoweredByHeader for security
  poweredByHeader: false,

  // Experimental features for better performance  
  experimental: {
    optimizePackageImports: ['@heroicons/react', '@floating-ui/react'],
    scrollRestoration: true,
  },


  // Bundle analyzer and webpack optimizations
  webpack: (config, { dev, isServer }) => {
    // Enable source maps in production
    if (!dev) {
      config.devtool = 'source-map';
    }

    // Optimize CSS loading to prevent unused preloads - simplified approach
    if (!dev && !isServer) {
      // Configure CSS loading strategy to prevent preload warnings
      if (config.optimization.splitChunks && typeof config.optimization.splitChunks === 'object') {
        config.optimization.splitChunks.cacheGroups = {
          ...config.optimization.splitChunks.cacheGroups,
          // Critical CSS should be inlined
          critical: {
            name: 'critical',
            test: /globals\.css$/,
            chunks: 'initial',
            enforce: true,
            priority: 100,
          },
          // Vendor styles separate from app styles
          vendorStyles: {
            name: 'vendor-styles',
            test: /[\\/]node_modules[\\/].*\.(css|scss|sass)$/,
            chunks: 'all',
            enforce: true,
            priority: 60,
          },
        };
      }
    }

    // Exclude unnecessary polyfills for modern browsers
    if (!dev && !isServer) {
      // Replace Next.js default polyfills with a minimal set
      config.resolve.alias = {
        ...config.resolve.alias,
        'next/dist/build/polyfills/polyfill-module': require.resolve('./polyfills.js'),
      };
    }

    // Simple bundle splitting - don't over-optimize
    if (!dev && !isServer) {
      // Better tree shaking for large libraries
      config.optimization.providedExports = true;
      config.optimization.usedExports = true;
      config.optimization.sideEffects = false;
      
      // Improve module concatenation
      config.optimization.concatenateModules = true;
      
      // Better chunk loading strategy
      config.optimization.runtimeChunk = {
        name: (entrypoint: { name: string }) => `runtime-${entrypoint.name}`
      };

      // Keep original simple splitting with better granularity
      config.optimization.splitChunks = {
        chunks: 'all',
        minSize: 10000, // Smaller min size for better splitting
        maxSize: 100000, // Smaller max size to prevent large chunks
        cacheGroups: {
          default: false,
          vendors: false,
          // React core (most critical)
          react: {
            name: 'react',
            chunks: 'all',
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            priority: 50,
            enforce: true,
          },
          // Next.js framework (separate from React)
          nextjs: {
            name: 'nextjs',
            chunks: 'all',
            test: /[\\/]node_modules[\\/]next[\\/]/,
            priority: 45,
            enforce: true,
          },
          // UI libraries (icons, floating UI)
          ui: {
            name: 'ui',
            chunks: 'all',
            test: /[\\/]node_modules[\\/](@heroicons|@floating-ui)[\\/]/,
            priority: 40,
            enforce: true,
          },
          // Internationalization
          intl: {
            name: 'intl',
            chunks: 'all',
            test: /[\\/]node_modules[\\/](next-intl)[\\/]/,
            priority: 35,
            enforce: true,
          },
          // Separate LiveKit into its own chunk since it's large and not used everywhere
          livekit: {
            name: 'livekit',
            chunks: 'async', // Only load when needed
            test: /[\\/]node_modules[\\/](@livekit|livekit-client)[\\/]/,
            priority: 30,
            enforce: true,
            maxAsyncRequests: 1, // Limit concurrent loading
            maxInitialRequests: 1, // Don't load in initial bundle
          },
          // DOMPurify separate chunk
          dompurify: {
            name: 'dompurify',
            chunks: 'async',
            test: /[\\/]node_modules[\\/](isomorphic-)?dompurify/,
            priority: 25,
            enforce: true,
          },
          // State management
          state: {
            name: 'state',
            chunks: 'all',
            test: /[\\/]node_modules[\\/](zustand)[\\/]/,
            priority: 20,
            enforce: true,
          },
          // Other vendor dependencies
          vendor: {
            name: 'vendors',
            chunks: 'all',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            reuseExistingChunk: true,
          },
          // Common chunk for shared components (smaller threshold)
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 5,
            reuseExistingChunk: true,
          },
        },
      };
    }
    return config;
  },

  // Advanced image optimization configuration
  images: {
    // Modern formats for better compression
    formats: ['image/avif', 'image/webp'],

    // Responsive breakpoints optimized for e-commerce
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 512],

    // Allow all external image hostnames (both http and https)
    // WARNING: allowing all hosts may have security and performance implications.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],

    // Caching strategy
    minimumCacheTTL: 31536000, // 1 year cache for product images

    // Allow SVG images from external sources
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default withNextIntl(nextConfig);
