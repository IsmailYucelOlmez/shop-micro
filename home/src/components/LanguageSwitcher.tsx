"use client";

import { useLocale as useNextIntlLocale } from 'next-intl';
import { useState } from 'react';

export default function LanguageSwitcher() {
  const currentLocale = useNextIntlLocale();
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = (newLocale: string) => {
    if (['en', 'tr'].includes(newLocale)) {
      // Set cookie for server-side detection
      document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
      // Store in localStorage as backup
      localStorage.setItem('preferred-locale', newLocale);
      // Force reload to apply new locale
      window.location.reload();
    }
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <span>{currentLocale === 'tr' ? '🇹🇷 TR' : '🇺🇸 EN'}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-300 rounded-md shadow-lg z-50">
          <div className="py-1">
            <button
              onClick={() => handleLanguageChange('en')}
              className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                currentLocale === 'en' ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
              }`}
            >
              🇺🇸 English
            </button>
            <button
              onClick={() => handleLanguageChange('tr')}
              className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                currentLocale === 'tr' ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
              }`}
            >
              🇹🇷 Türkçe
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
