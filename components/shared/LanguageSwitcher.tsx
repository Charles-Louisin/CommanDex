'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Check, ChevronDown } from 'lucide-react';
import { useUIStore } from '@/store/ui.store';

const languages = [
  { code: 'en', name: 'EN', flagUrl: 'https://flagcdn.com/w20/gb.png' },
  { code: 'fr', name: 'FR', flagUrl: 'https://flagcdn.com/w20/fr.png' },
];

export function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { locale, setLocale } = useUIStore();

  const currentLocale = pathname.split('/')[1] || 'en';
  const currentLanguage = languages.find((lang) => lang.code === currentLocale) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleLanguageChange = (langCode: string) => {
    if (langCode === currentLocale) {
      setIsOpen(false);
      return;
    }

    // Update store
    setLocale(langCode as 'en' | 'fr');
    
    // Navigate to new locale
    const newPath = pathname.replace(`/${currentLocale}`, `/${langCode}`);
    router.push(newPath);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-gray-100 transition-colors"
        aria-label="Change language"
      >
        <img 
          src={currentLanguage.flagUrl}
          alt={currentLanguage.name}
          className="w-5 h-4 sm:w-6 sm:h-4 object-cover rounded"
        />
        <span className="hidden sm:inline font-medium text-text-primary">{currentLanguage.name}</span>
        <ChevronDown size={14} className="sm:w-4 sm:h-4 text-text-muted hidden sm:block" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-border rounded-lg shadow-lg z-50 overflow-hidden">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <img 
                  src={lang.flagUrl}
                  alt={lang.name}
                  className="w-6 h-4 object-cover rounded"
                />
                <span className="font-medium text-text-primary">{lang.name}</span>
              </div>
              {currentLocale === lang.code && (
                <Check size={18} className="text-primary" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

