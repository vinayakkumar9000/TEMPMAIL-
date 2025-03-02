
import { Provider, EmailAddress, Email, Domain, ApiResponse, ApiErrorResponse } from './types';

// Helper function to generate random username
const generateRandomUsername = (): string => {
  const adjectives = ['swift', 'quick', 'silent', 'bright', 'calm', 'daring', 'eager', 'fair'];
  const nouns = ['lion', 'eagle', 'river', 'moon', 'star', 'ocean', 'forest', 'mountain'];
  
  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  const randomNumber = Math.floor(Math.random() * 100);
  
  return `${randomAdjective}${randomNoun}${randomNumber}`.substring(0, 7);
};

// Handle API errors consistently
const handleApiError = (error: any, defaultMessage: string): ApiErrorResponse => {
  console.error('API Error:', error);
  
  if (error.response) {
    return {
      status: error.response.status,
      message: error.response.data?.message || defaultMessage,
      code: error.response.data?.code,
    };
  }
  
  return {
    status: 500,
    message: error.message || defaultMessage,
  };
};

// Base URL for Mail.tm
const MAILTM_API_URL = 'https://api.mail.tm';

// Guerrilla Mail API
const GUERRILLA_API_URL = 'https://api.guerrillamail.com/ajax.php';

// Mail.tm Authentication
export const authenticateMailtm = async (domain: string, username?: string): Promise<ApiResponse<{ token: string, id: string, address: string }>> => {
  try {
    // Generate a random email if username is not provided
    const emailUsername = username || generateRandomUsername();
    const password = 'P@ssw0rd' + Math.floor(Math.random() * 10000); // Simple random password
    
    // Register a new account
    const registerResponse = await fetch(`${MAILTM_API_URL}/accounts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address: `${emailUsername}@${domain}`,
        password,
      }),
    });
    
    if (!registerResponse.ok) {
      throw new Error('Failed to create Mail.tm account');
    }
    
    const accountData = await registerResponse.json();
    
    // Get auth token
    const tokenResponse = await fetch(`${MAILTM_API_URL}/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address: `${emailUsername}@${domain}`,
        password,
      }),
    });
    
    if (!tokenResponse.ok) {
      throw new Error('Failed to authenticate with Mail.tm');
    }
    
    const tokenData = await tokenResponse.json();
    
    return {
      status: 200,
      data: {
        token: tokenData.token,
        id: accountData.id,
        address: accountData.address,
      }
    };
  } catch (error: any) {
    return handleApiError(error, 'Failed to authenticate with Mail.tm');
  }
};

// Get Mail.tm domains
export const getMailtmDomains = async (): Promise<ApiResponse<Domain[]>> => {
  try {
    const response = await fetch(`${MAILTM_API_URL}/domains`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch Mail.tm domains');
    }
    
    const domains = await response.json();
    
    // Format domains to match our interface
    const formattedDomains: Domain[] = domains.map((domain: any) => ({
      domain: domain.domain,
      isActive: domain.isActive,
    }));
    
    return {
      status: 200,
      data: formattedDomains,
    };
  } catch (error: any) {
    return handleApiError(error, 'Failed to fetch Mail.tm domains');
  }
};

// Get Mail.tm messages
export const getMailtmMessages = async (token: string): Promise<ApiResponse<Email[]>> => {
  try {
    const response = await fetch(`${MAILTM_API_URL}/messages`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch Mail.tm messages');
    }
    
    const messagesData = await response.json();
    
    // Format messages to match our interface
    const emails: Email[] = messagesData.map((message: any) => ({
      id: message.id,
      from: {
        address: message.from.address,
        name: message.from.name || '',
      },
      to: message.to.map((recipient: any) => ({
        address: recipient.address,
        name: recipient.name || '',
      })),
      subject: message.subject || '(No Subject)',
      intro: message.intro,
      text: '', // Will be populated when fetching the full message
      html: '', // Will be populated when fetching the full message
      hasAttachments: message.hasAttachments,
      attachments: [],
      createdAt: new Date(message.createdAt),
      isRead: message.seen,
      provider: 'mailtm' as Provider,
    }));
    
    return {
      status: 200,
      data: emails,
    };
  } catch (error: any) {
    return handleApiError(error, 'Failed to fetch Mail.tm messages');
  }
};

// Get Mail.tm message content
export const getMailtmMessageContent = async (token: string, messageId: string): Promise<ApiResponse<Email>> => {
  try {
    const response = await fetch(`${MAILTM_API_URL}/messages/${messageId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch Mail.tm message content');
    }
    
    const message = await response.json();
    
    // Mark message as read
    await fetch(`${MAILTM_API_URL}/messages/${messageId}/seen`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ seen: true }),
    });
    
    // Format attachments
    const attachments = message.attachments ? message.attachments.map((attachment: any) => ({
      id: attachment.id,
      filename: attachment.filename,
      contentType: attachment.contentType,
      size: attachment.size,
      downloadUrl: `${MAILTM_API_URL}/messages/${messageId}/attachment/${attachment.id}`,
    })) : [];
    
    // Format message to match our interface
    const email: Email = {
      id: message.id,
      from: {
        address: message.from.address,
        name: message.from.name || '',
      },
      to: message.to.map((recipient: any) => ({
        address: recipient.address,
        name: recipient.name || '',
      })),
      subject: message.subject || '(No Subject)',
      intro: message.intro,
      text: message.text || '',
      html: message.html || message.text || '',
      hasAttachments: message.hasAttachments,
      attachments,
      createdAt: new Date(message.createdAt),
      isRead: true,
      provider: 'mailtm' as Provider,
    };
    
    return {
      status: 200,
      data: email,
    };
  } catch (error: any) {
    return handleApiError(error, 'Failed to fetch Mail.tm message content');
  }
};

// Delete Mail.tm message
export const deleteMailtmMessage = async (token: string, messageId: string): Promise<ApiResponse<void>> => {
  try {
    const response = await fetch(`${MAILTM_API_URL}/messages/${messageId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete Mail.tm message');
    }
    
    return {
      status: 204,
      data: undefined,
    };
  } catch (error: any) {
    return handleApiError(error, 'Failed to delete Mail.tm message');
  }
};

// Initialize Guerrilla Mail session
export const initGuerrillaSession = async (customUsername?: string): Promise<ApiResponse<{ emailAddress: string, sessionId: string }>> => {
  try {
    // Generate a random email if username is not provided
    const emailUsername = customUsername || generateRandomUsername();
    
    const params = new URLSearchParams({
      f: 'get_email_address',
      ip: '127.0.0.1',
      agent: 'desktop',
    });
    
    // Initialize session
    const response = await fetch(`${GUERRILLA_API_URL}?${params}`);
    
    if (!response.ok) {
      throw new Error('Failed to initialize Guerrilla Mail session');
    }
    
    const data = await response.json();
    
    // Set custom email address if provided
    if (emailUsername) {
      const setEmailParams = new URLSearchParams({
        f: 'set_email_user',
        email_user: emailUsername,
        sid_token: data.sid_token,
      });
      
      const setEmailResponse = await fetch(`${GUERRILLA_API_URL}?${setEmailParams}`);
      
      if (!setEmailResponse.ok) {
        throw new Error('Failed to set custom email address');
      }
      
      const setEmailData = await setEmailResponse.json();
      
      return {
        status: 200,
        data: {
          emailAddress: setEmailData.email_addr,
          sessionId: data.sid_token,
        }
      };
    }
    
    return {
      status: 200,
      data: {
        emailAddress: data.email_addr,
        sessionId: data.sid_token,
      }
    };
  } catch (error: any) {
    return handleApiError(error, 'Failed to initialize Guerrilla Mail session');
  }
};

// Get Guerrilla Mail messages
export const getGuerrillaMessages = async (sessionId: string): Promise<ApiResponse<Email[]>> => {
  try {
    const params = new URLSearchParams({
      f: 'get_email_list',
      sid_token: sessionId,
      offset: '0',
    });
    
    const response = await fetch(`${GUERRILLA_API_URL}?${params}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch Guerrilla Mail messages');
    }
    
    const data = await response.json();
    
    // Format messages to match our interface
    const emails: Email[] = data.list.map((message: any) => ({
      id: message.mail_id,
      from: {
        address: message.mail_from,
        name: message.mail_from.split('@')[0] || '',
      },
      to: [{
        address: message.mail_recipient,
        name: '',
      }],
      subject: message.mail_subject || '(No Subject)',
      intro: message.mail_excerpt,
      text: '', // Will be populated when fetching the full message
      html: '', // Will be populated when fetching the full message
      hasAttachments: message.att_count > 0,
      attachments: [],
      createdAt: new Date(message.mail_timestamp * 1000),
      isRead: message.mail_read === 1,
      provider: 'guerrilla' as Provider,
    }));
    
    return {
      status: 200,
      data: emails,
    };
  } catch (error: any) {
    return handleApiError(error, 'Failed to fetch Guerrilla Mail messages');
  }
};

// Get Guerrilla Mail message content
export const getGuerrillaMessageContent = async (sessionId: string, messageId: string): Promise<ApiResponse<Email>> => {
  try {
    const params = new URLSearchParams({
      f: 'fetch_email',
      sid_token: sessionId,
      email_id: messageId,
    });
    
    const response = await fetch(`${GUERRILLA_API_URL}?${params}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch Guerrilla Mail message content');
    }
    
    const message = await response.json();
    
    // Format attachments
    const attachments = message.attachments ? message.attachments.map((attachment: any) => ({
      id: attachment.attachment_id,
      filename: attachment.name,
      contentType: attachment.content_type,
      size: parseInt(attachment.size),
      downloadUrl: attachment.download_url,
    })) : [];
    
    // Format message to match our interface
    const email: Email = {
      id: message.mail_id,
      from: {
        address: message.mail_from,
        name: message.mail_from.split('@')[0] || '',
      },
      to: [{
        address: message.mail_recipient,
        name: '',
      }],
      subject: message.mail_subject || '(No Subject)',
      intro: message.mail_excerpt,
      text: message.mail_body || '',
      html: message.mail_body || '',
      hasAttachments: attachments.length > 0,
      attachments,
      createdAt: new Date(message.mail_timestamp * 1000),
      isRead: true,
      provider: 'guerrilla' as Provider,
    };
    
    return {
      status: 200,
      data: email,
    };
  } catch (error: any) {
    return handleApiError(error, 'Failed to fetch Guerrilla Mail message content');
  }
};

// Delete Guerrilla Mail message
export const deleteGuerrillaMessage = async (sessionId: string, messageId: string): Promise<ApiResponse<void>> => {
  try {
    const params = new URLSearchParams({
      f: 'del_email',
      sid_token: sessionId,
      email_ids: `[${messageId}]`,
    });
    
    const response = await fetch(`${GUERRILLA_API_URL}?${params}`);
    
    if (!response.ok) {
      throw new Error('Failed to delete Guerrilla Mail message');
    }
    
    return {
      status: 204,
      data: undefined,
    };
  } catch (error: any) {
    return handleApiError(error, 'Failed to delete Guerrilla Mail message');
  }
};

// Format an email address based on provider
export const formatEmailAddress = (email: string, provider: Provider): EmailAddress => {
  const parts = email.split('@');
  return {
    address: email,
    username: parts[0],
    domain: parts[1],
    provider,
    createdAt: new Date(),
  };
};
