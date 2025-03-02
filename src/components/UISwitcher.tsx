
import React from 'react';
import { Paintbrush } from 'lucide-react';
import { useUI } from '@/context/UIContext';
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

const UISwitcher = () => {
  const { uiStyle, setUIStyle } = useUI();
  const { t } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Paintbrush className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">{t('ui.switch')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{t('ui.select')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={() => setUIStyle('default')}
          className={uiStyle === 'default' ? 'bg-accent' : ''}
        >
          {t('ui.default')}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setUIStyle('minimal')}
          className={uiStyle === 'minimal' ? 'bg-accent' : ''}
        >
          {t('ui.minimal')}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setUIStyle('hacker')}
          className={uiStyle === 'hacker' ? 'bg-accent' : ''}
        >
          {t('ui.hacker')}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setUIStyle('futuristic')}
          className={uiStyle === 'futuristic' ? 'bg-accent' : ''}
        >
          {t('ui.futuristic')}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setUIStyle('elegant')}
          className={uiStyle === 'elegant' ? 'bg-accent' : ''}
        >
          {t('ui.elegant')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UISwitcher;
