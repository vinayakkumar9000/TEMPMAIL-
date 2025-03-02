import React, { createContext, useContext, useState, useEffect } from 'react';

// Define language types
type LanguageContextType = {
  language: string;
  setLanguage: (code: string) => void;
  t: (key: string) => string;
  isRTL: boolean;
  availableLanguages: Language[];
};

export type Language = {
  code: string;
  name: string;
  nativeName: string;
  isRTL?: boolean;
};

// Language configuration
export const availableLanguages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'ko', name: 'Korean', nativeName: '한국어' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', isRTL: true },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', isRTL: true },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia' },
  { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska' },
  { code: 'no', name: 'Norwegian', nativeName: 'Norsk' },
  { code: 'da', name: 'Danish', nativeName: 'Dansk' },
  { code: 'fi', name: 'Finnish', nativeName: 'Suomi' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski' },
  { code: 'ro', name: 'Romanian', nativeName: 'Română' },
  { code: 'cs', name: 'Czech', nativeName: 'Čeština' },
  { code: 'sk', name: 'Slovak', nativeName: 'Slovenčina' },
  { code: 'hu', name: 'Hungarian', nativeName: 'Magyar' },
  { code: 'bg', name: 'Bulgarian', nativeName: 'Български' },
  { code: 'hr', name: 'Croatian', nativeName: 'Hrvatski' },
  { code: 'sr', name: 'Serbian', nativeName: 'Српски' },
  { code: 'uk', name: 'Ukrainian', nativeName: 'Українська' },
  { code: 'el', name: 'Greek', nativeName: 'Ελληνικά' },
  { code: 'he', name: 'Hebrew', nativeName: 'עברית', isRTL: true },
  { code: 'fa', name: 'Persian', nativeName: 'فارسی', isRTL: true },
  { code: 'az', name: 'Azerbaijani', nativeName: 'Azərbaycan' },
  { code: 'ka', name: 'Georgian', nativeName: 'ქართული' },
  { code: 'hy', name: 'Armenian', nativeName: 'Հայերեն' },
  { code: 'am', name: 'Amharic', nativeName: 'አማርኛ' },
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili' },
  { code: 'zu', name: 'Zulu', nativeName: 'isiZulu' },
  { code: 'xh', name: 'Xhosa', nativeName: 'isiXhosa' },
  { code: 'af', name: 'Afrikaans', nativeName: 'Afrikaans' },
];

// Default translations (English)
const translations: Record<string, Record<string, string>> = {
  en: {
    'app.title': 'TempMail',
    'app.description': 'Your temporary email solution',
    'email.generate': 'Generate Email Address',
    'email.ready': 'Your temporary email is ready to use',
    'email.create': 'Create a new temporary email address with a random name & number',
    'email.temporary': 'Your temporary email address',
    'email.expire': 'This address will expire after session end. Keep this tab open to maintain your session.',
    'email.copy': 'Copied to clipboard',
    'email.username': 'Username (optional)',
    'email.username.placeholder': 'e.g., NameXXXX (uses random if blank)',
    'email.username.help': 'Leave blank to generate a random name with 4-digit number',
    'email.domain.help': 'Domain will be selected automatically.',
    'email.regenerating': 'Regenerating...',
    'email.generate.new': 'Generate New Address',
    'email.generating': 'Generating...',
    'email.create.temporary': 'Create Temporary Email',
    'inbox.title': 'Inbox',
    'inbox.empty': 'Your inbox is empty',
    'inbox.messages': 'message',
    'inbox.messages.plural': 'messages',
    'inbox.search': 'Search emails...',
    'inbox.no.messages': 'No messages found',
    'inbox.filter.all': 'All',
    'inbox.filter.read': 'Read',
    'inbox.filter.unread': 'Unread',
    'inbox.filter.attachments': 'Attachments',
    'footer.powered': 'Powered by Mail.tm and Guerrilla Mail',
    'footer.privacy': 'Privacy',
    'footer.terms': 'Terms',
    'language.select': 'Select Language',
    'refresh.5sec': '5 sec',
    'refresh.15sec': '15 sec',
    'refresh.30sec': '30 sec',
    'refresh.1min': '1 min',
    'refresh.5min': '5 min',
    'share.email': 'Share Email',
    'share.copy.link': 'Copy Link',
    'share.copied': 'Link copied to clipboard',
    'ui.loading': 'Loading...',
    'ui.dark.mode': 'Dark Mode',
    'ui.light.mode': 'Light Mode',
  },
  // Translations for other languages will be added by the translation service
};

// Import language packs dynamically
const importLanguagePack = async (languageCode: string) => {
  try {
    const response = await fetch(`/languages/${languageCode}.json`);
    if (response.ok) {
      const data = await response.json();
      translations[languageCode] = data;
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Failed to load language pack for ${languageCode}:`, error);
    return false;
  }
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key,
  isRTL: false,
  availableLanguages: [],
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<string>('en');
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  
  // Detect browser language on initial load
  useEffect(() => {
    const detectBrowserLanguage = async () => {
      // First try to load from localStorage
      const savedLanguage = localStorage.getItem('preferredLanguage');
      
      if (savedLanguage) {
        setLanguageState(savedLanguage);
        setIsLoaded(true);
        return;
      }
      
      // Otherwise detect from browser
      const browserLanguages = navigator.languages || [navigator.language];
      
      // Try to find a match from our available languages
      for (const browserLang of browserLanguages) {
        const langCode = browserLang.split('-')[0]; // Get base language code (e.g., 'en' from 'en-US')
        const isAvailable = availableLanguages.some(lang => lang.code === langCode);
        
        if (isAvailable) {
          setLanguageState(langCode);
          localStorage.setItem('preferredLanguage', langCode);
          setIsLoaded(true);
          return;
        }
      }
      
      // Default to English if no match found
      setLanguageState('en');
      setIsLoaded(true);
    };
    
    detectBrowserLanguage();
  }, []);
  
  // Set RTL direction based on language
  useEffect(() => {
    const langObj = availableLanguages.find(l => l.code === language);
    if (langObj?.isRTL) {
      document.documentElement.dir = 'rtl';
      document.documentElement.classList.add('rtl');
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.classList.remove('rtl');
    }
  }, [language]);
  
  const setLanguage = (code: string) => {
    setLanguageState(code);
    localStorage.setItem('preferredLanguage', code);
  };
  
  // Check if current language is RTL
  const isRTL = availableLanguages.find(l => l.code === language)?.isRTL || false;
  
  // Translation function
  const t = (key: string) => {
    if (!isLoaded) return key;
    
    const currentTranslations = translations[language] || translations.en;
    return currentTranslations[key] || translations.en[key] || key;
  };
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL, availableLanguages }}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageProvider;
