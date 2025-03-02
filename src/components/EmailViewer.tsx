
import React from 'react';
import { useEmail } from '@/context/EmailContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Download, Trash2, ExternalLink, Mail } from 'lucide-react';
import { formatRelative } from 'date-fns';

const EmailViewer = () => {
  const { 
    selectedEmail, 
    setSelectedEmail, 
    deleteEmail,
    loading 
  } = useEmail();
  
  const handleBack = () => {
    setSelectedEmail(null);
  };
  
  const handleDelete = () => {
    if (selectedEmail) {
      deleteEmail(selectedEmail.id);
    }
  };
  
  const downloadAttachment = (attachment: any) => {
    window.open(attachment.downloadUrl, '_blank');
  };
  
  if (!selectedEmail) {
    return (
      <Card className="glass h-full">
        <CardContent className="p-6 flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
          <Mail className="w-12 h-12 text-muted-foreground/50" />
          <h3 className="font-medium text-lg">No Email Selected</h3>
          <p className="text-muted-foreground text-sm max-w-md">
            Select an email from your inbox to view its contents here.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="glass h-full hover:shadow-md transition-all duration-300">
      <CardHeader className="pb-3 flex flex-row items-start justify-between">
        <div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleBack}
            className="pl-0 text-muted-foreground hover:text-foreground mb-2"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Inbox
          </Button>
          <CardTitle className="text-lg font-medium">{selectedEmail.subject}</CardTitle>
          <CardDescription>
            From: {selectedEmail.from.name ? `${selectedEmail.from.name} <${selectedEmail.from.address}>` : selectedEmail.from.address}
          </CardDescription>
          <CardDescription>
            {selectedEmail.createdAt && formatRelative(selectedEmail.createdAt, new Date())}
          </CardDescription>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={handleDelete}
          disabled={loading}
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardHeader>
      
      <Separator />
      
      {selectedEmail.hasAttachments && selectedEmail.attachments.length > 0 && (
        <div className="px-6 py-3 border-b border-border/50">
          <h4 className="text-sm font-medium mb-2">Attachments ({selectedEmail.attachments.length})</h4>
          <div className="flex flex-wrap gap-2">
            {selectedEmail.attachments.map((attachment) => (
              <Button
                key={attachment.id}
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => downloadAttachment(attachment)}
              >
                <Download className="h-3 w-3 mr-1" />
                {attachment.filename.length > 20 
                  ? `${attachment.filename.substring(0, 17)}...` 
                  : attachment.filename} 
                <span className="text-muted-foreground ml-1">
                  ({Math.round(attachment.size / 1024)}KB)
                </span>
              </Button>
            ))}
          </div>
        </div>
      )}
      
      <CardContent className="pt-4 overflow-hidden">
        <div className="max-h-[500px] overflow-y-auto">
          {selectedEmail.html ? (
            <div 
              className="email-content prose prose-sm max-w-none" 
              dangerouslySetInnerHTML={{ __html: selectedEmail.html }} 
            />
          ) : (
            <pre className="whitespace-pre-wrap text-sm">{selectedEmail.text}</pre>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EmailViewer;
