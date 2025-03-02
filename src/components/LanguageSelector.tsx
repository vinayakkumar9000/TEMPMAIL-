
import React, { useState } from 'react';
import { Check, Globe, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/context/LanguageContext';

const LanguageSelector = () => {
  const { language, setLanguage, t, availableLanguages } = useLanguage();
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleLanguageChange = (code: string) => {
    setLanguage(code);
    setOpen(false);
    setSearchTerm('');
  };

  const selectedLanguage = availableLanguages.find(option => option.code === language) || availableLanguages[0];

  // Filter languages based on search term
  const filteredLanguages = availableLanguages.filter(option => 
    option.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    option.nativeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    option.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1 h-8">
          <Globe className="h-4 w-4" />
          <span className="hidden md:inline">{selectedLanguage.nativeName}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64">
        <DropdownMenuLabel>{t('language.select')}</DropdownMenuLabel>
        <div className="px-2 py-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search languages..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <DropdownMenuSeparator />
        <div className="max-h-[300px] overflow-y-auto">
          <DropdownMenuGroup>
            {filteredLanguages.map((option) => (
              <DropdownMenuItem
                key={option.code}
                className="cursor-pointer"
                onClick={() => handleLanguageChange(option.code)}
              >
                <div className="flex items-center justify-between w-full">
                  <div>
                    <span>{option.name}</span>
                    <span className="text-muted-foreground text-xs block">
                      {option.nativeName}
                    </span>
                  </div>
                  {option.code === language && (
                    <Check className="h-4 w-4 text-primary ml-2 shrink-0" />
                  )}
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
