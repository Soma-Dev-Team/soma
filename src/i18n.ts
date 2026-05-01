import { getRequestConfig } from 'next-intl/server';

export const SUPPORTED_LOCALES = ['en'] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';

export default getRequestConfig(async () => {
  const locale = DEFAULT_LOCALE;
  const messages = (await import(`../messages/${locale}.json`)).default;
  return { locale, messages };
});
