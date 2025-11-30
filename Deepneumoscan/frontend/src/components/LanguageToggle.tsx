import { Languages } from 'lucide-react';
import { useState, createContext, useContext, ReactNode } from 'react';
import enTranslations from '../i18n/en.json';
import knTranslations from '../i18n/kn.json';

type Language = 'en' | 'kn';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  const translations = {
    en: enTranslations,
    kn: knTranslations,
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'kn' : 'en');
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];

    for (const k of keys) {
      value = value?.[k];
    }

    return value || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const LanguageToggle = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-colors"
      aria-label="Toggle Language"
    >
      <Languages size={20} />
      <span className="font-medium">{language === 'en' ? 'EN' : 'ಕನ್ನಡ'}</span>
    </button>
  );
};
