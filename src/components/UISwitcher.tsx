
import React from 'react';
import { Palette } from 'lucide-react';
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
import { useToast } from '@/components/ui/use-toast';

const UISwitcher = () => {
  const { uiStyle, setUIStyle } = useUI();
  const { t } = useLanguage();
  const { toast } = useToast();

  const handleUIChange = (style: 'default' | 'minimal' | 'hacker' | 'futuristic' | 'elegant') => {
    setUIStyle(style);
    toast({
      title: t('ui.changed'),
      description: t('ui.changedTo') + ' ' + t(`ui.${style}`),
      duration: 2000,
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2 bg-primary/10 hover:bg-primary/20">
          <Palette className="h-4 w-4" />
          <span className="hidden sm:inline">{t('ui.interface')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>{t('ui.select')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={() => handleUIChange('default')}
          className={uiStyle === 'default' ? 'bg-accent font-medium' : ''}
        >
          <span className="w-4 h-4 mr-2 rounded-full bg-primary/20"></span>
          {t('ui.default')}
          {uiStyle === 'default' && <span className="ml-auto">✓</span>}
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => handleUIChange('minimal')}
          className={uiStyle === 'minimal' ? 'bg-accent font-medium' : ''}
        >
          <span className="w-4 h-4 mr-2 rounded-full bg-secondary/50"></span>
          {t('ui.minimal')}
          {uiStyle === 'minimal' && <span className="ml-auto">✓</span>}
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => handleUIChange('hacker')}
          className={uiStyle === 'hacker' ? 'bg-accent font-medium' : ''}
        >
          <span className="w-4 h-4 mr-2 rounded-full bg-green-500"></span>
          {t('ui.hacker')}
          {uiStyle === 'hacker' && <span className="ml-auto">✓</span>}
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => handleUIChange('futuristic')}
          className={uiStyle === 'futuristic' ? 'bg-accent font-medium' : ''}
        >
          <span className="w-4 h-4 mr-2 rounded-full bg-blue-400"></span>
          {t('ui.futuristic')}
          {uiStyle === 'futuristic' && <span className="ml-auto">✓</span>}
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => handleUIChange('elegant')}
          className={uiStyle === 'elegant' ? 'bg-accent font-medium' : ''}
        >
          <span className="w-4 h-4 mr-2 rounded-full bg-neutral-300"></span>
          {t('ui.elegant')}
          {uiStyle === 'elegant' && <span className="ml-auto">✓</span>}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UISwitcher;
