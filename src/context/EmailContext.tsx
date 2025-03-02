import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  Provider, 
  EmailAddress, 
  Email, 
  Domain, 
  ProviderSession, 
  EmailContextType 
} from '../lib/types';
import { 
  authenticateMailtm, 
  getMailtmDomains, 
  getMailtmMessages, 
  getMailtmMessageContent, 
  deleteMailtmMessage,
  initGuerrillaSession,
  getGuerrillaMessages,
  getGuerrillaMessageContent,
  deleteGuerrillaMessage,
  formatEmailAddress
} from '../lib/api';
import { toast } from '@/components/ui/use-toast';

// Default context value
const defaultContext: EmailContextType = {
  currentProvider: 'mailtm',
  setCurrentProvider: () => {},
  emailAddress: null,
  generateEmail: async () => ({} as EmailAddress),
  emails: [],
  fetchEmails: async () => {},
  loading: false,
  error: null,
  selectedEmail: null,
  setSelectedEmail: () => {},
  refreshInterval: 10000,
  setRefreshInterval: () => {},
  deleteEmail: async () => {},
  deleteAllEmails: async () => {},
  isRefreshing: false,
  fetchEmailContent: async () => ({} as Email),
  availableDomains: [],
  selectedDomain: '',
  setSelectedDomain: () => {},
  fetchDomains: async () => {},
  customUsername: '',
  setCustomUsername: () => {},
  sessions: {
    mailtm: { isAuthenticated: false },
    guerrilla: { isAuthenticated: false }
  }
};

// Create context
const EmailContext = createContext<EmailContextType>(defaultContext);

// Custom hook to use the email context
export const useEmail = () => useContext(EmailContext);

// Provider component
export const EmailProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State
  const [currentProvider, setCurrentProvider] = useState<Provider>('mailtm');
  const [emailAddress, setEmailAddress] = useState<EmailAddress | null>(null);
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [refreshInterval, setRefreshInterval] = useState<number>(10000);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [availableDomains, setAvailableDomains] = useState<Domain[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<string>('');
  const [customUsername, setCustomUsername] = useState<string>('');
  const [sessions, setSessions] = useState<Record<Provider, ProviderSession>>({
    mailtm: { isAuthenticated: false },
    guerrilla: { isAuthenticated: false }
  });
  const [refreshTimer, setRefreshTimer] = useState<NodeJS.Timeout | null>(null);

  // Fetch domains
  const fetchDomains = useCallback(async () => {
    try {
      setLoading(true);
      
      const response = await getMailtmDomains();
      
      if ('data' in response) {
        setAvailableDomains(response.data);
        
        if (response.data.length > 0 && !selectedDomain) {
          setSelectedDomain(response.data[0].domain);
        }
      } else {
        setError(response.message);
        toast({
          title: 'Error',
          description: response.message,
          variant: 'destructive',
        });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch domains');
      toast({
        title: 'Error',
        description: err.message || 'Failed to fetch domains',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [selectedDomain]);

  // Generate email address
  const generateEmail = useCallback(async (username?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      if (currentProvider === 'mailtm') {
        // If no domain is selected but we have available domains, select the first one
        let domainToUse = selectedDomain;
        
        if (!domainToUse && availableDomains.length > 0) {
          domainToUse = availableDomains[0].domain;
          setSelectedDomain(domainToUse);
        }
        
        if (!domainToUse) {
          // Try to fetch domains if we don't have any
          await fetchDomains();
          
          if (availableDomains.length > 0) {
            domainToUse = availableDomains[0].domain;
            setSelectedDomain(domainToUse);
          } else {
            throw new Error('No domains available. Please try again later.');
          }
        }
        
        const auth = await authenticateMailtm(domainToUse, username || customUsername);
        
        if ('data' in auth) {
          const formattedAddress = formatEmailAddress(auth.data.address, 'mailtm');
          setEmailAddress(formattedAddress);
          
          // Update session
          setSessions(prev => ({
            ...prev,
            mailtm: {
              token: auth.data.token,
              accountId: auth.data.id,
              emailAddress: formattedAddress,
              isAuthenticated: true
            }
          }));
          
          toast({
            title: 'Email Generated',
            description: `Your temporary email is ${auth.data.address}`,
          });
          
          return formattedAddress;
        } else {
          throw new Error(auth.message);
        }
      } else {
        // Guerrilla Mail
        const session = await initGuerrillaSession(username || customUsername);
        
        if ('data' in session) {
          const formattedAddress = formatEmailAddress(session.data.emailAddress, 'guerrilla');
          setEmailAddress(formattedAddress);
          
          // Update session
          setSessions(prev => ({
            ...prev,
            guerrilla: {
              token: session.data.sessionId,
              emailAddress: formattedAddress,
              isAuthenticated: true
            }
          }));
          
          toast({
            title: 'Email Generated',
            description: `Your temporary email is ${session.data.emailAddress}`,
          });
          
          return formattedAddress;
        } else {
          throw new Error(session.message);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to generate email');
      toast({
        title: 'Error',
        description: err.message || 'Failed to generate email',
        variant: 'destructive',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentProvider, selectedDomain, customUsername, availableDomains, fetchDomains]);

  // Fetch emails
  const fetchEmails = useCallback(async () => {
    try {
      setIsRefreshing(true);
      
      const currentSession = sessions[currentProvider];
      
      if (!currentSession.isAuthenticated || !currentSession.token) {
        return;
      }
      
      if (currentProvider === 'mailtm') {
        const response = await getMailtmMessages(currentSession.token);
        
        if ('data' in response) {
          setEmails(response.data);
        } else {
          toast({
            title: 'Warning',
            description: response.message,
          });
        }
      } else {
        // Guerrilla Mail
        const response = await getGuerrillaMessages(currentSession.token);
        
        if ('data' in response) {
          setEmails(response.data);
        } else {
          toast({
            title: 'Warning',
            description: response.message,
          });
        }
      }
    } catch (err: any) {
      toast({
        title: 'Warning',
        description: err.message || 'Failed to fetch emails',
      });
    } finally {
      setIsRefreshing(false);
    }
  }, [currentProvider, sessions]);

  // Fetch email content
  const fetchEmailContent = useCallback(async (id: string) => {
    try {
      setLoading(true);
      
      const currentSession = sessions[currentProvider];
      
      if (!currentSession.isAuthenticated || !currentSession.token) {
        throw new Error('Not authenticated');
      }
      
      if (currentProvider === 'mailtm') {
        const response = await getMailtmMessageContent(currentSession.token, id);
        
        if ('data' in response) {
          // Update the email in the list
          setEmails(prev => 
            prev.map(email => 
              email.id === id ? response.data : email
            )
          );
          
          return response.data;
        } else {
          throw new Error(response.message);
        }
      } else {
        // Guerrilla Mail
        const response = await getGuerrillaMessageContent(currentSession.token, id);
        
        if ('data' in response) {
          // Update the email in the list
          setEmails(prev => 
            prev.map(email => 
              email.id === id ? response.data : email
            )
          );
          
          return response.data;
        } else {
          throw new Error(response.message);
        }
      }
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to fetch email content',
        variant: 'destructive',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentProvider, sessions]);

  // Delete email
  const deleteEmail = useCallback(async (id: string) => {
    try {
      setLoading(true);
      
      const currentSession = sessions[currentProvider];
      
      if (!currentSession.isAuthenticated || !currentSession.token) {
        throw new Error('Not authenticated');
      }
      
      if (currentProvider === 'mailtm') {
        const response = await deleteMailtmMessage(currentSession.token, id);
        
        if ('data' in response) {
          // Remove the email from the list
          setEmails(prev => prev.filter(email => email.id !== id));
          
          if (selectedEmail?.id === id) {
            setSelectedEmail(null);
          }
          
          toast({
            title: 'Email Deleted',
            description: 'The email has been deleted successfully',
          });
        } else {
          throw new Error(response.message);
        }
      } else {
        // Guerrilla Mail
        const response = await deleteGuerrillaMessage(currentSession.token, id);
        
        if ('data' in response) {
          // Remove the email from the list
          setEmails(prev => prev.filter(email => email.id !== id));
          
          if (selectedEmail?.id === id) {
            setSelectedEmail(null);
          }
          
          toast({
            title: 'Email Deleted',
            description: 'The email has been deleted successfully',
          });
        } else {
          throw new Error(response.message);
        }
      }
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to delete email',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [currentProvider, sessions, selectedEmail]);

  // Delete all emails
  const deleteAllEmails = useCallback(async () => {
    try {
      setLoading(true);
      
      // For simplicity, we'll delete emails one by one
      for (const email of emails) {
        await deleteEmail(email.id);
      }
      
      toast({
        title: 'All Emails Deleted',
        description: 'All emails have been deleted successfully',
      });
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to delete all emails',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [emails, deleteEmail]);

  // Handle provider change
  useEffect(() => {
    // Reset selected email when changing provider
    setSelectedEmail(null);
    
    // Fetch emails if the current provider is authenticated
    if (sessions[currentProvider].isAuthenticated) {
      fetchEmails();
    }
  }, [currentProvider, sessions, fetchEmails]);

  // Set up auto-refresh
  useEffect(() => {
    // Clear existing timer
    if (refreshTimer) {
      clearInterval(refreshTimer);
    }
    
    // Only set up auto-refresh if we have an email address
    if (sessions[currentProvider].isAuthenticated) {
      const timer = setInterval(() => {
        fetchEmails();
      }, refreshInterval);
      
      setRefreshTimer(timer);
      
      return () => clearInterval(timer);
    }
  }, [refreshInterval, fetchEmails, currentProvider, sessions]);

  // Fetch domains on initial load
  useEffect(() => {
    fetchDomains();
  }, [fetchDomains]);

  // Context value
  const value: EmailContextType = {
    currentProvider,
    setCurrentProvider,
    emailAddress,
    generateEmail,
    emails,
    fetchEmails,
    loading,
    error,
    selectedEmail,
    setSelectedEmail,
    refreshInterval,
    setRefreshInterval,
    deleteEmail,
    deleteAllEmails,
    isRefreshing,
    fetchEmailContent,
    availableDomains,
    selectedDomain,
    setSelectedDomain,
    fetchDomains,
    customUsername,
    setCustomUsername,
    sessions
  };

  return (
    <EmailContext.Provider value={value}>
      {children}
    </EmailContext.Provider>
  );
};

export default EmailProvider;
