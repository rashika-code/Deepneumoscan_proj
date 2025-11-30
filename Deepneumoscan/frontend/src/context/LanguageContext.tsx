import { createContext, useContext, useState, ReactNode } from 'react';
import en from '../i18n/en.json';
import kn from '../i18n/kn.json';

const translations = { en, kn };

type Language = 'en' | 'kn';

interface LanguageContextType {
  language: Language;
  t: (key: string, params?: Record<string, string>) => string;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string, params?: Record<string, string>) => {
    let value = translations[language][key as keyof typeof translations.en] || key;
    if (params) {
      Object.keys(params).forEach(k => {
        value = value.replace(`{{${k}}}`, params[k]);
      });
    }
    return value;
  };

  return (
    <LanguageContext.Provider value={{ language, t, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};