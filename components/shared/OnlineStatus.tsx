'use client';

import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { Wifi, WifiOff } from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { useTranslations } from '@/hooks/useTranslations';

export function OnlineStatus() {
  const { t } = useTranslations();
  const isOnline = useOnlineStatus();

  useEffect(() => {
    if (!isOnline) {
      toast.warning(t('messages.offline'), {
        duration: Infinity,
        id: 'offline-status',
      });
    } else {
      toast.dismiss('offline-status');
      toast.success(t('messages.online'));
    }
  }, [isOnline, t]);

  return (
    <div
      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
        isOnline
          ? 'bg-green-100 text-green-700'
          : 'bg-red-100 text-red-700'
      }`}
    >
      {isOnline ? <Wifi size={16} /> : <WifiOff size={16} />}
      <span>{isOnline ? t('common.online') : t('common.offline')}</span>
    </div>
  );
}

