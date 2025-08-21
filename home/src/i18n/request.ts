import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';

// Can be imported from a shared config
const locales = ['en', 'tr'];

export default getRequestConfig(async ({ locale }) => {
  // Get locale from cookie first, then fallback to parameter
  const cookieStore = await cookies();
  const localeCookie = cookieStore?.get('NEXT_LOCALE')?.value;
  
  let validLocale = 'en';
  
  if (localeCookie && locales.includes(localeCookie)) {
    validLocale = localeCookie;
  } else if (locale && locales.includes(locale as any)) {
    validLocale = locale as string;
  }

  return {
    locale: validLocale,
    messages: (await import(`./locales/${validLocale}.json`)).default
  };
});
