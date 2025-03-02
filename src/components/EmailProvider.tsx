
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useEmail } from '@/context/EmailContext';
import { cn } from '@/lib/utils';

const EmailProvider = () => {
  const { currentProvider, setCurrentProvider, sessions } = useEmail();
  
  const handleProviderChange = (value: string) => {
    setCurrentProvider(value as 'mailtm' | 'guerrilla');
  };
  
  return (
    <Card className="glass hover:shadow-md transition-all duration-300">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-medium">Email Provider</CardTitle>
        <CardDescription>
          Choose your preferred temporary email provider
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup 
          value={currentProvider} 
          onValueChange={handleProviderChange} 
          className="flex flex-col gap-4 sm:flex-row"
        >
          <div className={cn(
            "flex-1 p-4 border rounded-md cursor-pointer transition-all duration-300",
            currentProvider === 'mailtm' 
              ? "border-primary bg-primary/5" 
              : "border-border hover:border-primary/50"
          )}>
            <RadioGroupItem 
              value="mailtm" 
              id="mailtm" 
              className="sr-only" 
            />
            <Label 
              htmlFor="mailtm" 
              className="flex flex-col items-center gap-2 cursor-pointer"
            >
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 text-primary" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </span>
              <span className="font-medium">Mail.tm</span>
              <span className="text-xs text-muted-foreground text-center">
                {sessions.mailtm.isAuthenticated 
                  ? "Connected" 
                  : "Disposable email with API access"}
              </span>
            </Label>
          </div>
          
          <div className={cn(
            "flex-1 p-4 border rounded-md cursor-pointer transition-all duration-300",
            currentProvider === 'guerrilla' 
              ? "border-primary bg-primary/5" 
              : "border-border hover:border-primary/50"
          )}>
            <RadioGroupItem 
              value="guerrilla" 
              id="guerrilla" 
              className="sr-only" 
            />
            <Label 
              htmlFor="guerrilla" 
              className="flex flex-col items-center gap-2 cursor-pointer"
            >
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 text-primary" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M5 7.2A2.2 2.2 0 0 1 7.2 5h9.6A2.2 2.2 0 0 1 19 7.2v9.6a2.2 2.2 0 0 1-2.2 2.2H7.2A2.2 2.2 0 0 1 5 16.8z" />
                  <path d="m5 9 7 5 7-5" />
                </svg>
              </span>
              <span className="font-medium">Guerrilla Mail</span>
              <span className="text-xs text-muted-foreground text-center">
                {sessions.guerrilla.isAuthenticated 
                  ? "Connected" 
                  : "Fast and reliable temporary email"}
              </span>
            </Label>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

export default EmailProvider;
