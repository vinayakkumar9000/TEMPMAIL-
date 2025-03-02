
import React, { useState } from 'react';
import { useEmail } from '@/context/EmailContext';
import { useLanguage } from '@/context/LanguageContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { Loader2, Copy, RefreshCw, ArrowRight, Check } from 'lucide-react';

const EmailGenerator = () => {
  const { 
    generateEmail, 
    emailAddress, 
    loading, 
    currentProvider, 
    availableDomains,
    selectedDomain,
    setSelectedDomain,
    customUsername,
    setCustomUsername,
    sessions
  } = useEmail();
  
  const { t } = useLanguage();
  const [isCopied, setIsCopied] = useState(false);
  
  const handleGenerate = async () => {
    try {
      await generateEmail(customUsername || undefined);
    } catch (error) {
      // Error is handled in context
    }
  };
  
  const handleCopy = () => {
    if (emailAddress) {
      navigator.clipboard.writeText(emailAddress.address);
      setIsCopied(true);
      
      toast({
        title: t('email.copy'),
        description: `${emailAddress.address} has been copied to your clipboard`,
      });
      
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    }
  };
  
  return (
    <Card className="glass hover:shadow-md transition-all duration-300">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-medium">{t('email.generate')}</CardTitle>
        <CardDescription>
          {emailAddress 
            ? t('email.ready')
            : t('email.create')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {emailAddress ? (
          <div className="animate-fade-in">
            <Label htmlFor="email-address" className="text-sm font-medium">
              {t('email.temporary')}
            </Label>
            <div className="mt-1.5 flex items-center gap-2">
              <div 
                className="bg-secondary/80 text-secondary-foreground rounded-md px-3 py-2 text-sm font-mono flex-1 overflow-hidden overflow-ellipsis whitespace-nowrap border border-border cursor-pointer hover:bg-secondary transition-colors"
                onClick={handleCopy}
                title="Click to copy"
              >
                {emailAddress.address}
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopy}
                className="hover:bg-secondary/80 transition-colors"
                aria-label="Copy email address"
              >
                {isCopied ? <Check size={16} className="text-primary" /> : <Copy size={16} />}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {t('email.expire')}
            </p>
          </div>
        ) : (
          <div className="space-y-4 animate-fade-in">
            {currentProvider === 'guerrilla' && (
              <div>
                <Label htmlFor="username" className="text-sm font-medium">
                  {t('email.username')}
                </Label>
                <Input
                  id="username"
                  placeholder={t('email.username.placeholder')}
                  value={customUsername}
                  onChange={(e) => setCustomUsername(e.target.value)}
                  className="mt-1.5"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  {t('email.username.help')}
                </p>
              </div>
            )}
            
            {currentProvider === 'mailtm' && (
              <div>
                <Label htmlFor="username" className="text-sm font-medium">
                  {t('email.username')}
                </Label>
                <Input
                  id="username"
                  placeholder={t('email.username.placeholder')}
                  value={customUsername}
                  onChange={(e) => setCustomUsername(e.target.value)}
                  className="mt-1.5"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  {t('email.username.help')} {t('email.domain.help')}
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-2">
        {emailAddress ? (
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin mr-2" />
                {t('email.regenerating')}
              </>
            ) : (
              <>
                <RefreshCw size={16} className="mr-2" />
                {t('email.generate.new')}
              </>
            )}
          </Button>
        ) : (
          <Button 
            className="w-full" 
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin mr-2" />
                {t('email.generating')}
              </>
            ) : (
              <>
                {t('email.create.temporary')}
                <ArrowRight size={16} className="ml-2" />
              </>
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default EmailGenerator;
