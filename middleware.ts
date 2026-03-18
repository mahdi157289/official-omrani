import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
});

export default function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  // Keep API routes fresh
  if (request.nextUrl.pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // Allow static files
  if (request.nextUrl.pathname.startsWith('/media') ||
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.match(/\.(ico|png|jpg|jpeg|svg|gif|webp)$/)) {
    return NextResponse.next();
  }

  // Pass current path so server components can determine the route (e.g. for login page check)
  request.headers.set('x-pathname', pathname);

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};



