
export type Provider = 'guerrilla' | 'mailtm';

export interface EmailAddress {
  address: string;
  domain: string;
  username: string;
  provider: Provider;
  createdAt: Date;
}

export interface Domain {
  domain: string;
  isActive: boolean;
}

export interface EmailAttachment {
  filename: string;
  contentType: string;
  size: number;
  downloadUrl?: string;
  id: string;
}

export interface Email {
  id: string;
  from: {
    address: string;
    name: string;
  };
  to: {
    address: string;
    name: string;
  }[];
  subject: string;
  intro?: string;
  text: string;
  html: string;
  hasAttachments: boolean;
  attachments: EmailAttachment[];
  createdAt: Date;
  isRead: boolean;
  provider: Provider;
}

export interface ProviderSession {
  token?: string;
  accountId?: string;
  emailAddress?: EmailAddress;
  isAuthenticated: boolean;
}

export interface ApiErrorResponse {
  status: number;
  message: string;
  code?: string;
}

export interface ApiSuccessResponse<T> {
  data: T;
  status: number;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export interface EmailContextType {
  currentProvider: Provider;
  setCurrentProvider: (provider: Provider) => void;
  emailAddress: EmailAddress | null;
  generateEmail: (username?: string) => Promise<EmailAddress>;
  emails: Email[];
  fetchEmails: () => Promise<void>;
  loading: boolean;
  error: string | null;
  selectedEmail: Email | null;
  setSelectedEmail: (email: Email | null) => void;
  refreshInterval: number;
  setRefreshInterval: (interval: number) => void;
  deleteEmail: (id: string) => Promise<void>;
  deleteAllEmails: () => Promise<void>;
  isRefreshing: boolean;
  fetchEmailContent: (id: string) => Promise<Email>;
  availableDomains: Domain[];
  selectedDomain: string;
  setSelectedDomain: (domain: string) => void;
  fetchDomains: () => Promise<void>;
  customUsername: string;
  setCustomUsername: (username: string) => void;
  sessions: Record<Provider, ProviderSession>;
  guerrillaDomains: string[];
  fetchGuerrillaDomains: () => Promise<void>;
  setGuerrillaSelectedDomain: (domain: string) => void;
}
