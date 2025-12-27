'use client';

import { WifiOff, RefreshCw } from 'lucide-react';
import { useTranslations } from '@/hooks/useTranslations';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function OfflinePage() {
  const { t } = useTranslations();
  const router = useRouter();
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    const checkOnline = () => {
      setIsOnline(navigator.onLine);
      if (navigator.onLine) {
        // Redirect to home after a short delay
        setTimeout(() => {
          router.push('/');
        }, 2000);
      }
    };

    checkOnline();
    window.addEventListener('online', checkOnline);
    window.addEventListener('offline', checkOnline);

    return () => {
      window.removeEventListener('online', checkOnline);
      window.removeEventListener('offline', checkOnline);
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-6 flex justify-center">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
            <WifiOff size={48} className="text-red-600" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-text-primary mb-4 font-heading">
          {t('pwa.offlineTitle')}
        </h1>
        
        <p className="text-text-muted mb-8">
          {t('pwa.offlineMessage')}
        </p>

        {isOnline && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <RefreshCw size={20} className="text-green-600 animate-spin" />
            <span className="text-green-700 font-medium">{t('pwa.onlineAgain')}</span>
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={() => router.back()}
            className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
          >
            {t('common.back')}
          </button>
          
          <button
            onClick={() => window.location.reload()}
            className="w-full px-6 py-3 bg-white border-2 border-primary text-primary rounded-lg hover:bg-primary-50 transition-colors font-medium"
          >
            {t('common.refresh')}
          </button>
        </div>
      </div>
    </div>
  );
}

