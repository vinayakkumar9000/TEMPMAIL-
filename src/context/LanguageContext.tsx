
import React, { createContext, useContext, useState, useEffect } from 'react';

type LanguageContextType = {
  language: string;
  setLanguage: (code: string) => void;
  t: (key: string) => string;
};

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
    'footer.terms': 'Terms'
  },
  // Add other languages as needed
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key,
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<string>('en');
  
  // Load language from localStorage on initial load
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage) {
      setLanguageState(savedLanguage);
    }
  }, []);
  
  const setLanguage = (code: string) => {
    setLanguageState(code);
    localStorage.setItem('preferredLanguage', code);
  };
  
  // Translation function
  const t = (key: string) => {
    const currentTranslations = translations[language] || translations.en;
    return currentTranslations[key] || translations.en[key] || key;
  };
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageProvider;
