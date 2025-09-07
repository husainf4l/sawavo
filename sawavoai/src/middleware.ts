import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';
import { NextRequest } from 'next/server';

// Create the base internationalization middleware
const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if this is a product URL with UUID (old format)
  const productIdMatch = pathname.match(/^\/([a-z]{2})\/products\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i);
  
  if (productIdMatch) {
    // For now, let the old URLs continue to work - they'll be handled by the page component
    // In the future, you could fetch the product slug and redirect to SEO-friendly URLs
    console.log('Legacy product URL detected:', pathname);
  }
  
  // Continue with internationalization middleware
  return intlMiddleware(request);
}

export const config = {
  // Match only internationalized pathnames
  matcher: [
    // Match all pathnames except for
    // - files that contain a dot (e.g. favicon.ico)
    // - Next.js internals starting with _next/
    // - API routes
    '/((?!_next|_vercel|.*\\..*).*)',
    // However, match all pathnames within `/api/`, optionally with a locale prefix
    '/([\\w-]+)?/api/(.*)'
  ]
};