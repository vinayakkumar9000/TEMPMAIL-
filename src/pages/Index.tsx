
import React from 'react';
import Layout from '@/components/Layout';
import EmailProvider from '@/components/EmailProvider';
import EmailGenerator from '@/components/EmailGenerator';
import Inbox from '@/components/Inbox';
import EmailViewer from '@/components/EmailViewer';
import { EmailProvider as EmailContextProvider } from '@/context/EmailContext';

const Index = () => {
  return (
    <EmailContextProvider>
      <Layout>
        <div className="space-y-6 animate-fade-in">
          <section>
            <h2 className="text-3xl font-medium tracking-tight mb-4">Temporary Email Service</h2>
            <p className="text-muted-foreground max-w-2xl">
              Create disposable email addresses instantly. Protect your privacy and avoid spam by using our temporary email service for sign-ups and verifications.
            </p>
          </section>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 space-y-6">
              <EmailProvider />
              <EmailGenerator />
            </div>
            
            <div className="md:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="lg:col-span-1">
                <Inbox />
              </div>
              <div className="lg:col-span-1">
                <EmailViewer />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </EmailContextProvider>
  );
};

export default Index;
