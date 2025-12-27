'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { QRScanner } from '@/components/shared/QRScanner';
import { useTableStore } from '@/store/table.store';
import { QrCode, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from '@/hooks/useTranslations';

export default function ScanPage() {
  const router = useRouter();
  const { setTable } = useTableStore();
  const { t, locale } = useTranslations();
  const [showScanner, setShowScanner] = useState(false);

  const handleScanSuccess = ({ restaurantId, tableId }: { restaurantId: string; tableId: string }) => {
    setTable(restaurantId, tableId);
    router.push(`/${locale}/menu`);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="mb-8">
          <div className="w-24 h-24 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <QrCode size={48} className="text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-primary mb-2 font-heading">
            {t('scanPage.title') || 'Scan QR Code'}
          </h1>
          <p className="text-text-muted">
            {t('scanPage.description') || 'Scan the QR code on your table to start ordering'}
          </p>
        </div>

        <button
          onClick={() => setShowScanner(true)}
          className="w-full px-6 py-4 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors font-semibold text-lg shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 flex items-center justify-center gap-3"
        >
          <QrCode size={24} />
          {t('scanPage.startScanning') || 'Start Scanning'}
        </button>

        <div className="pt-6 border-t border-border">
          <p className="text-sm text-text-muted mb-4">
            {t('scanPage.noQR') || "Don't have a QR code?"}
          </p>
          <Link
            href={`/${locale}/qr-generator`}
            className="text-primary hover:text-primary-dark font-medium text-sm"
          >
            {t('scanPage.generateQR') || 'Generate Test QR Code'}
          </Link>
        </div>

        <Link
          href={`/${locale}/menu`}
          className="flex items-center justify-center gap-2 text-text-muted hover:text-text-primary transition-colors text-sm"
        >
          <ArrowLeft size={16} />
          {t('scanPage.skip') || 'Skip - Browse Menu'}
        </Link>
      </div>

      {showScanner && (
        <QRScanner
          onScanSuccess={handleScanSuccess}
          onClose={() => setShowScanner(false)}
        />
      )}
    </div>
  );
}

