import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';

function getLocaleFromRequest(request: NextRequest): string {
  // Check for NEXT_LOCALE cookie first
  const localeCookie = request.cookies.get('NEXT_LOCALE');
  if (localeCookie && ['en', 'tr'].includes(localeCookie.value)) {
    return localeCookie.value;
  }

  // Check Accept-Language header as fallback
  const acceptLanguage = request.headers.get('Accept-Language');
  if (acceptLanguage) {
    const preferredLang = acceptLanguage.split(',')[0].split('-')[0];
    if (['en', 'tr'].includes(preferredLang)) {
      return preferredLang;
    }
  }

  return 'en';
}

export default createMiddleware({
  // A list of all locales that are supported
  locales: ['en', 'tr'],

  // Used when no locale matches
  defaultLocale: 'en',

  // Don't add locale prefix to URLs
  localePrefix: 'never',

  // Custom locale detection
  localeDetection: false
});

export const config = {
  // Match all pathnames except for
  // - /api (API routes)
  // - /_next (Next.js internals)
  // - /_vercel (Vercel internals)
  // - /static (inside /public)
  matcher: ['/((?!api|_next|_vercel|static).*)']
};
