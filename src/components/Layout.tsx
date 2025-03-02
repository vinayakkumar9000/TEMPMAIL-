
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { cn } from '@/lib/utils';
import ThemeToggle from '@/components/ThemeToggle';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import UISwitcher from '@/components/UISwitcher';
import LanguageSelector from '@/components/LanguageSelector';
import UserIpDisplay from '@/components/UserIpDisplay';
import SiteMenu from '@/components/SiteMenu';
import { useLanguage } from '@/context/LanguageContext';
import { useUI } from '@/context/UIContext';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, className }) => {
  const { t, isRTL } = useLanguage();
  const { uiStyle } = useUI();
  
  return (
    <div className={cn(
      "min-h-screen bg-background flex flex-col",
      isRTL && "text-right rtl",
      `ui-${uiStyle}`
    )}>
      <header className="w-full glass sticky top-0 z-50 border-b border-b-border/20 shadow-sm">
        <div className="container h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 text-primary" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-xl font-medium tracking-tight">{t('app.title')}</h1>
          </div>
          <nav className="flex items-center space-x-4">
            <LanguageSelector />
            <UISwitcher />
            <ThemeToggle />
            <ThemeSwitcher />
            <SiteMenu />
            <a
              href="https://github.com/vinayakkumar9000"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors text-sm flex items-center gap-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </svg>
              GitHub
            </a>
          </nav>
        </div>
      </header>
      <main className={cn("flex-1 container py-6", className)}>
        {children}
      </main>
      <footer className="w-full border-t border-t-border/20 py-4">
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col items-center sm:items-start gap-1">
            <p className="text-sm text-muted-foreground">
              {t('app.description')}
            </p>
            <div className="text-xs text-muted-foreground">
              {t('footer.powered')}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>© {new Date().getFullYear()} TempMail</span>
              <a href="#" className="hover:text-foreground transition-colors">{t('footer.privacy')}</a>
              <a href="#" className="hover:text-foreground transition-colors">{t('footer.terms')}</a>
            </div>
            <UserIpDisplay />
          </div>
        </div>
      </footer>
      <Toaster />
    </div>
  );
};

export default Layout;
