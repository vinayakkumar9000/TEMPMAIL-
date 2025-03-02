
import React, { useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';

interface LanguageContainerProps {
  children: React.ReactNode;
}

const LanguageContainer: React.FC<LanguageContainerProps> = ({ children }) => {
  const { isRTL } = useLanguage();

  // Apply RTL-specific styles when needed
  useEffect(() => {
    // Add RTL-specific styles to body when in RTL mode
    if (isRTL) {
      document.body.classList.add('rtl-layout');
    } else {
      document.body.classList.remove('rtl-layout');
    }
    
    return () => {
      document.body.classList.remove('rtl-layout');
    };
  }, [isRTL]);
  
  return (
    <div className={`language-container ${isRTL ? 'rtl' : 'ltr'}`}>
      {children}
    </div>
  );
};

export default LanguageContainer;
