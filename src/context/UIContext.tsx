
import React, { createContext, useContext, useState, useEffect } from 'react';

type UIStyle = 'default' | 'minimal' | 'hacker' | 'futuristic' | 'elegant';

interface UIContextType {
  uiStyle: UIStyle;
  setUIStyle: (style: UIStyle) => void;
}

const UIContext = createContext<UIContextType>({
  uiStyle: 'default',
  setUIStyle: () => {},
});

export const useUI = () => useContext(UIContext);

export const UIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize UI style from localStorage or default
  const [uiStyle, setUIStyle] = useState<UIStyle>(() => {
    const savedStyle = localStorage.getItem('uiStyle');
    // Check if saved style is valid
    if (savedStyle && ['default', 'minimal', 'hacker', 'futuristic', 'elegant'].includes(savedStyle)) {
      return savedStyle as UIStyle;
    }
    return 'default';
  });

  // Update document class and localStorage when style changes
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('ui-default', 'ui-minimal', 'ui-hacker', 'ui-futuristic', 'ui-elegant');
    root.classList.add(`ui-${uiStyle}`);
    localStorage.setItem('uiStyle', uiStyle);
  }, [uiStyle]);

  return (
    <UIContext.Provider value={{ uiStyle, setUIStyle }}>
      {children}
    </UIContext.Provider>
  );
};

export default UIProvider;
