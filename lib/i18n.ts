import { i18n, type Locale } from '@/i18n.config';

const dictionaries = {
  en: () => import('@/locales/en.json').then((module) => module.default),
  fr: () => import('@/locales/fr.json').then((module) => module.default),
};

export const getDictionary = async (locale: Locale) => {
  if (!dictionaries[locale]) {
    return dictionaries[i18n.defaultLocale]();
  }
  return dictionaries[locale]();
};

export function getLocaleFromPathname(pathname: string): Locale {
  const segments = pathname.split('/');
  const potentialLocale = segments[1];
  
  if (i18n.locales.includes(potentialLocale as Locale)) {
    return potentialLocale as Locale;
  }
  
  return i18n.defaultLocale;
}

