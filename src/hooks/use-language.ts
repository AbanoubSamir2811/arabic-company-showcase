import { createContext, createElement, useContext, useEffect, useMemo, useState } from 'react';
import type { Dispatch, ReactNode, SetStateAction } from 'react';

export type AppLanguage = 'ar' | 'en';

const LANGUAGE_STORAGE_KEY = 'app-language';

type LanguageContextValue = {
  language: AppLanguage;
  setLanguage: Dispatch<SetStateAction<AppLanguage>>;
  toggleLanguage: () => void;
  isArabic: boolean;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<AppLanguage>(() => {
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return saved === 'en' ? 'en' : 'ar';
  });

  useEffect(() => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      toggleLanguage,
      isArabic: language === 'ar',
    }),
    [language],
  );

  return createElement(LanguageContext.Provider, { value }, children);
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }

  return {
    language: context.language,
    setLanguage: context.setLanguage,
    toggleLanguage: context.toggleLanguage,
    isArabic: context.isArabic,
  };
}
