'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { type Locale } from '@/i18n.config';

type TranslationKey = string;
type Translations = Record<string, any>;

export function useTranslations() {
  const params = useParams();
  const locale = (params?.lang as Locale) || 'en';
  const [translations, setTranslations] = useState<Translations>({});

  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const dict = await import(`@/locales/${locale}.json`);
        setTranslations(dict.default);
      } catch (error) {
        console.error('Failed to load translations:', error);
        // Fallback to English
        const dict = await import('@/locales/en.json');
        setTranslations(dict.default);
      }
    };

    loadTranslations();
  }, [locale]);

  const t = (
    key: TranslationKey,
    options?: Record<string, string | number>
  ): string => {
    const keys = key.split('.');
    let value: any = translations;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key; // Return key if translation not found
      }
    }

    if (typeof value === 'string' && options) {
      Object.entries(options).forEach(([optKey, optValue]) => {
        value = value.replace(`{{${optKey}}}`, String(optValue));
      });
    }

    return typeof value === 'string' ? value : key;
  };

  return { t, locale: locale as Locale };
}

