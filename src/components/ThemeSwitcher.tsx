
import React from 'react';
import { Palette } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();
  const { t } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Palette className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">{t('theme.switch')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{t('theme.select')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={() => setTheme('light')}
          className={theme === 'light' ? 'bg-accent' : ''}
        >
          {t('theme.light')}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme('dark')}
          className={theme === 'dark' ? 'bg-accent' : ''}
        >
          {t('theme.dark')}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme('forest')}
          className={theme === 'forest' ? 'bg-accent' : ''}
        >
          {t('theme.forest')}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme('sunset')}
          className={theme === 'sunset' ? 'bg-accent' : ''}
        >
          {t('theme.sunset')}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme('ocean')}
          className={theme === 'ocean' ? 'bg-accent' : ''}
        >
          {t('theme.ocean')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeSwitcher;
