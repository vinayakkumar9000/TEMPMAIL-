
import React, { useState, useEffect } from 'react';
import { useEmail } from '@/context/EmailContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { Loader2, Copy, RefreshCw, ArrowRight } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Provider } from '@/lib/types';

const EmailGenerator = () => {
  const { 
    generateEmail, 
    emailAddress, 
    loading, 
    currentProvider, 
    setCurrentProvider,
    availableDomains,
    selectedDomain,
    setSelectedDomain,
    customUsername,
    setCustomUsername,
    sessions,
    guerrillaDomains,
    setGuerrillaSelectedDomain
  } = useEmail();
  
  const [isCopied, setIsCopied] = useState(false);
  
  // Set a random provider when component first loads
  useEffect(() => {
    if (!sessions.mailtm.isAuthenticated && !sessions.guerrilla.isAuthenticated) {
      const providers: Provider[] = ['mailtm', 'guerrilla'];
      const randomProvider = providers[Math.floor(Math.random() * providers.length)];
      setCurrentProvider(randomProvider);
    }
  }, [sessions, setCurrentProvider]);
  
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
        title: 'Copied to clipboard',
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
        <CardTitle className="text-xl font-medium">Generate Email Address</CardTitle>
        <CardDescription>
          {emailAddress 
            ? "Your temporary email is ready to use" 
            : "Create a new temporary email address"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Provider selection */}
        {!emailAddress && (
          <div className="animate-fade-in">
            <Label htmlFor="provider" className="text-sm font-medium">
              Email Provider
            </Label>
            <Select
              value={currentProvider}
              onValueChange={(value) => setCurrentProvider(value as Provider)}
            >
              <SelectTrigger className="mt-1.5">
                <SelectValue placeholder="Select a provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mailtm">Mail.tm</SelectItem>
                <SelectItem value="guerrilla">Guerrilla Mail</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-2">
              Select your preferred temporary email provider
            </p>
          </div>
        )}
        
        {emailAddress ? (
          <div className="animate-fade-in">
            <Label htmlFor="email-address" className="text-sm font-medium">
              Your temporary email address
            </Label>
            <div className="mt-1.5 flex items-center gap-2">
              <div className="bg-secondary/80 text-secondary-foreground rounded-md px-3 py-2 text-sm font-mono flex-1 overflow-hidden overflow-ellipsis whitespace-nowrap border border-border">
                {emailAddress.address}
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopy}
                className="hover:bg-secondary/80 transition-colors"
                aria-label="Copy email address"
              >
                <Copy size={16} className={isCopied ? "text-primary" : ""} />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              This address will expire after session end. Keep this tab open to maintain your session.
            </p>
          </div>
        ) : (
          <div className="space-y-4 animate-fade-in">
            {currentProvider === 'guerrilla' && (
              <>
                <div>
                  <Label htmlFor="username" className="text-sm font-medium">
                    Username (optional)
                  </Label>
                  <Input
                    id="username"
                    placeholder="e.g., johndoe123"
                    value={customUsername}
                    onChange={(e) => setCustomUsername(e.target.value)}
                    className="mt-1.5"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Leave blank to generate a random username
                  </p>
                </div>
                
                {/* Domain selection for Guerrilla Mail */}
                {guerrillaDomains && guerrillaDomains.length > 0 && (
                  <div>
                    <Label htmlFor="domain" className="text-sm font-medium">
                      Domain
                    </Label>
                    <Select
                      value={selectedDomain}
                      onValueChange={setGuerrillaSelectedDomain}
                    >
                      <SelectTrigger className="mt-1.5">
                        <SelectValue placeholder="Select a domain" />
                      </SelectTrigger>
                      <SelectContent>
                        {guerrillaDomains.map((domain) => (
                          <SelectItem key={domain} value={domain}>
                            {domain}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </>
            )}
            
            {currentProvider === 'mailtm' && (
              <div>
                <Label htmlFor="username" className="text-sm font-medium">
                  Username (optional)
                </Label>
                <Input
                  id="username"
                  placeholder="e.g., johndoe123"
                  value={customUsername}
                  onChange={(e) => setCustomUsername(e.target.value)}
                  className="mt-1.5"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Leave blank to generate a random username. Domain will be selected automatically.
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
                Regenerating...
              </>
            ) : (
              <>
                <RefreshCw size={16} className="mr-2" />
                Generate New Address
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
                Generating...
              </>
            ) : (
              <>
                Create Temporary Email
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
