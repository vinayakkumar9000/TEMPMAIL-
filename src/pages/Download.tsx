
import React, { useEffect } from 'react';
import Layout from '@/components/Layout';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Download, Check } from 'lucide-react';

const DownloadPage = () => {
  const { t } = useLanguage();
  const [isPwaInstalled, setIsPwaInstalled] = React.useState(false);
  const [installPrompt, setInstallPrompt] = React.useState<any>(null);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsPwaInstalled(true);
    }

    // Listen for the beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later
      setInstallPrompt(e);
    });

    // Listen for successful install
    window.addEventListener('appinstalled', () => {
      setIsPwaInstalled(true);
      setInstallPrompt(null);
      console.log('PWA was installed');
    });
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    
    // Show the install prompt
    installPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await installPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    
    // We've used the prompt, and can't use it again, throw it away
    setInstallPrompt(null);
  };

  return (
    <Layout>
      <div className="space-y-8 animate-fade-in">
        <section className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tight mb-4">{t('download.title')}</h1>
          <p className="text-muted-foreground text-lg mb-8">
            {t('download.description')}
          </p>

          {isPwaInstalled ? (
            <Button disabled className="mx-auto flex items-center gap-2">
              <Check className="h-4 w-4" />
              {t('download.already.installed')}
            </Button>
          ) : installPrompt ? (
            <Button onClick={handleInstall} className="mx-auto flex items-center gap-2">
              <Download className="h-4 w-4" />
              {t('download.install.app')}
            </Button>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {t('download.instructions')}
              </p>
              <ul className="text-sm text-muted-foreground list-disc list-inside text-left max-w-md mx-auto space-y-2">
                <li>{t('download.step.chrome')}</li>
                <li>{t('download.step.safari')}</li>
                <li>{t('download.step.edge')}</li>
              </ul>
            </div>
          )}
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-card rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-medium mb-2">{t('download.feature.offline')}</h3>
            <p className="text-muted-foreground">{t('download.feature.offline.description')}</p>
          </div>
          <div className="bg-card rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-medium mb-2">{t('download.feature.fast')}</h3>
            <p className="text-muted-foreground">{t('download.feature.fast.description')}</p>
          </div>
          <div className="bg-card rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-medium mb-2">{t('download.feature.secure')}</h3>
            <p className="text-muted-foreground">{t('download.feature.secure.description')}</p>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default DownloadPage;
