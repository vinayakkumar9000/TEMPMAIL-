import React, { useEffect } from 'react';
import { useEmail } from '@/context/EmailContext';
import { useLanguage } from '@/context/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, RefreshCw, Search, Trash2, Mail, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const Inbox = () => {
  const { 
    emails, 
    fetchEmails, 
    loading, 
    isRefreshing, 
    emailAddress, 
    sessions, 
    currentProvider,
    selectedEmail,
    setSelectedEmail,
    refreshInterval,
    setRefreshInterval,
    deleteAllEmails,
    fetchEmailContent
  } = useEmail();
  
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterType, setFilterType] = React.useState('all');
  
  // Filter emails based on search term and filter type
  const filteredEmails = emails.filter(email => {
    const matchesSearch = searchTerm 
      ? email.subject.toLowerCase().includes(searchTerm.toLowerCase()) || 
        email.from.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (email.intro ? email.intro.toLowerCase().includes(searchTerm.toLowerCase()) : false)
      : true;
    
    if (filterType === 'all') {
      return matchesSearch;
    } else if (filterType === 'read') {
      return matchesSearch && email.isRead;
    } else if (filterType === 'unread') {
      return matchesSearch && !email.isRead;
    } else if (filterType === 'attachments') {
      return matchesSearch && email.hasAttachments;
    }
    
    return matchesSearch;
  });
  
  const handleRefresh = () => {
    fetchEmails();
  };
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleFilterChange = (value: string) => {
    setFilterType(value);
  };
  
  const handleEmailClick = async (emailId: string) => {
    try {
      const email = await fetchEmailContent(emailId);
      setSelectedEmail(email);
    } catch (error) {
      // Error is handled in context
    }
  };
  
  const handleIntervalChange = (value: string) => {
    setRefreshInterval(parseInt(value));
  };
  
  // Fetch emails on initial load
  useEffect(() => {
    if (sessions[currentProvider].isAuthenticated) {
      fetchEmails();
    }
  }, [sessions, currentProvider, fetchEmails]);
  
  if (!emailAddress) {
    return (
      <Card className="glass h-full">
        <CardContent className="p-6 flex flex-col items-center justify-center min-h-[300px] text-center space-y-4">
          <Mail className="w-12 h-12 text-muted-foreground/50" />
          <h3 className="font-medium text-lg">No Email Address</h3>
          <p className="text-muted-foreground text-sm max-w-md">
            Generate a temporary email address to start receiving messages.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="glass h-full hover:shadow-md transition-all duration-300">
      <CardHeader className="pb-3 flex flex-row items-start justify-between">
        <div>
          <CardTitle className="text-xl font-medium">{t('inbox.title')}</CardTitle>
          <CardDescription>
            {filteredEmails.length === 0 
              ? t('inbox.empty')
              : `${filteredEmails.length} ${filteredEmails.length === 1 ? t('inbox.messages') : t('inbox.messages.plural')}`}
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={refreshInterval.toString()}
            onValueChange={handleIntervalChange}
          >
            <SelectTrigger className="w-[120px]">
              <Clock className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Refresh" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5000">5 sec</SelectItem>
              <SelectItem value="15000">15 sec</SelectItem>
              <SelectItem value="30000">30 sec</SelectItem>
              <SelectItem value="60000">1 min</SelectItem>
              <SelectItem value="300000">5 min</SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            disabled={isRefreshing || !emailAddress}
          >
            {isRefreshing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            onClick={deleteAllEmails}
            disabled={loading || filteredEmails.length === 0}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="p-3 border-b border-border/50">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('inbox.search')}
                className="pl-8"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            <Select value={filterType} onValueChange={handleFilterChange}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('inbox.filter.all')}</SelectItem>
                <SelectItem value="read">{t('inbox.filter.read')}</SelectItem>
                <SelectItem value="unread">{t('inbox.filter.unread')}</SelectItem>
                <SelectItem value="attachments">{t('inbox.filter.attachments')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="divide-y divide-border/50 max-h-[400px] overflow-y-auto">
          {filteredEmails.length === 0 ? (
            <div className="py-8 text-center">
              <Mail className="w-10 h-10 text-muted-foreground/50 mx-auto mb-3" />
              <p className="text-muted-foreground">{t('inbox.no.messages')}</p>
            </div>
          ) : (
            filteredEmails.map((email) => (
              <button
                key={email.id}
                className={`w-full text-left p-4 hover:bg-secondary/50 transition-colors ${
                  selectedEmail?.id === email.id ? 'bg-secondary/70' : ''
                } ${!email.isRead ? 'font-medium' : ''}`}
                onClick={() => handleEmailClick(email.id)}
              >
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm truncate flex-1">{email.from.name || email.from.address}</span>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatDistanceToNow(email.createdAt, { addSuffix: true })}
                      </span>
                    </div>
                    <h4 className={`text-sm mt-1 truncate ${!email.isRead ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {email.subject}
                    </h4>
                    {email.intro && (
                      <p className="text-xs text-muted-foreground mt-1 truncate">{email.intro}</p>
                    )}
                  </div>
                  <div className="flex items-center">
                    {!email.isRead && (
                      <span className="w-2 h-2 rounded-full bg-primary" />
                    )}
                    {email.hasAttachments && (
                      <span className="ml-2 text-muted-foreground">
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          width="14" 
                          height="14" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        >
                          <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                        </svg>
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Inbox;
