'use client';

import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Copy, Check, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { useTranslations } from '@/hooks/useTranslations';

// Dummy restaurant and table data for testing
const DUMMY_RESTAURANTS = [
  { id: 'rest_001', name: 'Restaurant CommanDex' },
  { id: 'rest_002', name: 'Green Bistro' },
  { id: 'rest_003', name: 'The Food Court' },
];

const DUMMY_TABLES = [
  'Table-1', 'Table-2', 'Table-3', 'Table-4', 'Table-5',
  'Table-6', 'Table-7', 'Table-8', 'Table-9', 'Table-10',
];

export default function QRGeneratorPage() {
  const { t, locale } = useTranslations();
  const [selectedRestaurant, setSelectedRestaurant] = useState(DUMMY_RESTAURANTS[0].id);
  const [selectedTable, setSelectedTable] = useState(DUMMY_TABLES[0]);
  const [copied, setCopied] = useState(false);

  // Generate QR code URL
  const qrUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/${locale}/menu?restaurantId=${selectedRestaurant}&tableId=${selectedTable}`
    : '';

  const qrData = JSON.stringify({
    restaurantId: selectedRestaurant,
    tableId: selectedTable,
  });

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(qrUrl);
      setCopied(true);
      toast.success(t('qrGenerator.copied') || 'URL copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error(t('qrGenerator.copyFailed') || 'Failed to copy');
    }
  };

  const handleDownload = () => {
    const svg = document.getElementById('qr-code-svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `qrcode-${selectedRestaurant}-${selectedTable}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Link
          href={`/${locale}/scan`}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-3xl font-bold text-primary font-heading">
          {t('qrGenerator.title') || 'Generate QR Code'}
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Settings */}
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
          <h2 className="text-xl font-semibold text-text-primary mb-4 font-heading">
            {t('qrGenerator.settings') || 'QR Code Settings'}
          </h2>

          {/* Restaurant Selection */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              {t('qrGenerator.restaurant') || 'Restaurant'}
            </label>
            <select
              value={selectedRestaurant}
              onChange={(e) => setSelectedRestaurant(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {DUMMY_RESTAURANTS.map((restaurant) => (
                <option key={restaurant.id} value={restaurant.id}>
                  {restaurant.name}
                </option>
              ))}
            </select>
          </div>

          {/* Table Selection */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              {t('qrGenerator.table') || 'Table Number'}
            </label>
            <select
              value={selectedTable}
              onChange={(e) => setSelectedTable(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {DUMMY_TABLES.map((table) => (
                <option key={table} value={table}>
                  {table}
                </option>
              ))}
            </select>
          </div>

          {/* URL Display */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              {t('qrGenerator.url') || 'QR Code URL'}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={qrUrl}
                readOnly
                className="flex-1 px-4 py-2 border border-border rounded-lg bg-gray-50 text-sm"
              />
              <button
                onClick={handleCopy}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2"
              >
                {copied ? <Check size={18} /> : <Copy size={18} />}
              </button>
            </div>
          </div>
        </div>

        {/* QR Code Preview */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-text-primary mb-4 font-heading">
            {t('qrGenerator.preview') || 'QR Code Preview'}
          </h2>
          
          <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <QRCodeSVG
                id="qr-code-svg"
                value={qrData}
                size={256}
                level="H"
                includeMargin={true}
              />
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-text-muted mb-2">
                {DUMMY_RESTAURANTS.find(r => r.id === selectedRestaurant)?.name}
              </p>
              <p className="text-sm font-medium text-text-primary">
                {selectedTable}
              </p>
            </div>

            <button
              onClick={handleDownload}
              className="mt-6 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium flex items-center gap-2"
            >
              <Download size={18} />
              {t('qrGenerator.download') || 'Download QR Code'}
            </button>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-primary-50 rounded-lg p-6">
        <h3 className="font-semibold text-text-primary mb-2 font-heading">
          {t('qrGenerator.howToUse') || 'How to Use:'}
        </h3>
        <ol className="list-decimal list-inside space-y-2 text-sm text-text-muted">
          <li>{t('qrGenerator.step1') || 'Select a restaurant and table number'}</li>
          <li>{t('qrGenerator.step2') || 'Download or copy the QR code'}</li>
          <li>{t('qrGenerator.step3') || 'Open the scan page on your phone'}</li>
          <li>{t('qrGenerator.step4') || 'Scan the QR code to start ordering'}</li>
        </ol>
      </div>
    </div>
  );
}

