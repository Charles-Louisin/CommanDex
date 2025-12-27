'use client';

export const dynamic = 'force-dynamic';

import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTableStore } from '@/store/table.store';
import { OnlineStatus } from '@/components/shared/OnlineStatus';
import { LanguageSwitcher } from '@/components/shared/LanguageSwitcher';
import { ShoppingCart, Wifi, WifiOff } from 'lucide-react';
import Link from 'next/link';
import { useCartStore } from '@/store/cart.store';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useTranslations } from '@/hooks/useTranslations';
import { InstallPWA } from '@/components/shared/InstallPWA';
import { ServiceWorkerRegistration } from '@/components/shared/ServiceWorkerRegistration';

function TableParamsHandler() {
  const searchParams = useSearchParams();
  const { setTable } = useTableStore();

  useEffect(() => {
    const restaurantIdParam = searchParams.get('restaurantId');
    const tableIdParam = searchParams.get('tableId');

    if (restaurantIdParam && tableIdParam) {
      setTable(restaurantIdParam, tableIdParam);
    }
  }, [searchParams, setTable]);

  return null;
}

// Mobile-only OnlineStatus (icon only)
function OnlineStatusMobile() {
  const { t } = useTranslations();
  const isOnline = useOnlineStatus();

  return (
    <div
      className={`p-1.5 rounded-full ${
        isOnline
          ? 'bg-green-100 text-green-700'
          : 'bg-red-100 text-red-700'
      }`}
      title={isOnline ? t('common.online') : t('common.offline')}
    >
      {isOnline ? <Wifi size={18} /> : <WifiOff size={18} />}
    </div>
  );
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { restaurantId, tableId } = useTableStore();
  const { items } = useCartStore();

  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={null}>
        <TableParamsHandler />
      </Suspense>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 py-2 sm:py-3">
          <div className="flex items-center justify-between gap-2">
            {/* Left side - Logo and Table */}
            <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
              <h1 className="text-lg sm:text-2xl font-bold text-primary font-heading whitespace-nowrap">
                CommanDex
              </h1>
              {tableId && (
                <span className="px-2 sm:px-3 py-1 bg-primary-50 text-primary rounded-full text-xs sm:text-sm font-medium whitespace-nowrap truncate max-w-[100px] sm:max-w-none">
                  <span className="hidden sm:inline">Table </span>
                  <span>{tableId}</span>
                </span>
              )}
            </div>

            {/* Right side - Status, Language, Cart */}
            <div className="flex items-center gap-1 sm:gap-3 flex-shrink-0">
              <div className="hidden sm:block">
                <OnlineStatus />
              </div>
              <div className="sm:hidden">
                <OnlineStatusMobile />
              </div>
              <LanguageSwitcher />
              <Link
                href={`/cart`}
                className="relative p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
              >
                <ShoppingCart size={20} className="sm:w-6 sm:h-6 text-primary" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 bg-red-500 text-white text-[10px] sm:text-xs font-bold rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
                    {cartItemCount > 99 ? '99+' : cartItemCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 min-h-[calc(100vh-80px)]">{children}</main>

      {/* PWA Components */}
      <ServiceWorkerRegistration />
      <InstallPWA />
    </div>
  );
}

