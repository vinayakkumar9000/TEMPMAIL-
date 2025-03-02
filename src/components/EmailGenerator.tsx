
import React, { useState } from 'react';
import { useEmail } from '@/context/EmailContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { Loader2, Copy, RefreshCw, ArrowRight } from 'lucide-react';

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
            : "Create a new temporary email address with a random name & number"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
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
              <div>
                <Label htmlFor="username" className="text-sm font-medium">
                  Username (optional)
                </Label>
                <Input
                  id="username"
                  placeholder="e.g., NameXXXX (uses random if blank)"
                  value={customUsername}
                  onChange={(e) => setCustomUsername(e.target.value)}
                  className="mt-1.5"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Leave blank to generate a random name with 4-digit number
                </p>
              </div>
            )}
            
            {currentProvider === 'mailtm' && (
              <div>
                <Label htmlFor="username" className="text-sm font-medium">
                  Username (optional)
                </Label>
                <Input
                  id="username"
                  placeholder="e.g., NameXXXX (uses random if blank)"
                  value={customUsername}
                  onChange={(e) => setCustomUsername(e.target.value)}
                  className="mt-1.5"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Leave blank to generate a random name with 4-digit number. Domain will be selected automatically.
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
