'use client';

import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { useTranslations } from '@/hooks/useTranslations';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const { t } = useTranslations();

  useEffect(() => {
    // Check if app is already installed
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches;
    if (isInstalled) {
      return;
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if user has dismissed the prompt before (stored in localStorage)
    const hasDismissed = localStorage.getItem('pwa-install-dismissed');
    if (hasDismissed) {
      const dismissedTime = parseInt(hasDismissed, 10);
      const daysSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);
      // Show again after 7 days
      if (daysSinceDismissed < 7) {
        setShowInstallPrompt(false);
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    await deferredPrompt.prompt();

    // Wait for the user to respond
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
      // Store dismissal time
      localStorage.setItem('pwa-install-dismissed', Date.now().toString());
    }

    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  if (!showInstallPrompt || !deferredPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 z-50 animate-slide-up">
      <div className="bg-white rounded-lg shadow-2xl border-2 border-primary p-4 flex items-start gap-3">
        <div className="flex-shrink-0 w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center">
          <Download className="text-primary" size={24} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-text-primary mb-1 font-heading">
            {t('pwa.installTitle')}
          </h3>
          <p className="text-sm text-text-muted mb-3">
            {t('pwa.installDescription')}
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleInstallClick}
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-medium"
            >
              {t('pwa.install')}
            </button>
            <button
              onClick={handleDismiss}
              className="px-3 py-2 text-text-muted hover:bg-gray-100 rounded-lg transition-colors"
              aria-label={t('common.close')}
            >
              <X size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

