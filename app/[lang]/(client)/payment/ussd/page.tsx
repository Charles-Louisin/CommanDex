'use client';

import { useState, useEffect } from 'react';
import { useOrderStore } from '@/store/order.store';
import { useRouter } from 'next/navigation';
import { Copy, Check, Loader } from 'lucide-react';
import { toast } from 'sonner';
import { formatPriceWithCurrency } from '@/lib/utils';

export default function USSDPaymentPage() {
  const { currentOrder } = useOrderStore();
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [countdown, setCountdown] = useState(600); // 10 minutes

  // Mock USSD code - in real app this would come from API
  const ussdCode = `*144*4*${currentOrder?.total}#`;

  useEffect(() => {
    if (!currentOrder) {
      router.push('/menu');
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentOrder, router]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(ussdCode);
      setCopied(true);
      toast.success('USSD code copied!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy');
    }
  };

  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-primary">USSD Payment</h1>

      {/* Instructions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-text-primary mb-4">How to Pay</h2>
        <ol className="space-y-3 text-text-primary">
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold">
              1
            </span>
            <span>Dial the USSD code below from your phone</span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold">
              2
            </span>
            <span>Follow the prompts on your phone to complete payment</span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold">
              3
            </span>
            <span>Wait for confirmation (this page will update automatically)</span>
          </li>
        </ol>
      </div>

      {/* USSD Code */}
      <div className="bg-primary-50 rounded-lg shadow-sm p-8 border-2 border-primary">
        <p className="text-center text-text-muted mb-3">Dial this code</p>
        <div className="flex items-center justify-center gap-4">
          <p className="text-4xl font-mono font-bold text-primary">{ussdCode}</p>
          <button
            onClick={handleCopy}
            className="p-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            aria-label="Copy USSD code"
          >
            {copied ? <Check size={24} /> : <Copy size={24} />}
          </button>
        </div>
      </div>

      {/* Timer */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-text-muted">Code expires in</p>
            <p className="text-2xl font-bold text-primary">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </p>
          </div>
          <div className="flex items-center gap-2 text-primary">
            <Loader className="animate-spin" size={24} />
            <span className="font-medium">Waiting for payment...</span>
          </div>
        </div>
      </div>

      {/* Order Details */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="font-semibold text-text-primary mb-3">Order Details</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-text-muted">Order ID</span>
            <span className="font-mono text-text-primary">{currentOrder?.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">Table</span>
            <span className="font-medium text-text-primary">{currentOrder?.tableId}</span>
          </div>
          <div className="flex justify-between pt-3 border-t border-border">
            <span className="font-semibold text-text-primary">Amount</span>
            <span className="text-xl font-bold text-primary">{formatPriceWithCurrency(currentOrder?.total || 0)}</span>
          </div>
        </div>
      </div>

      {/* Alternative */}
      <button
        onClick={() => router.push('/payment')}
        className="w-full py-3 bg-white border-2 border-primary text-primary rounded-lg hover:bg-primary-50 transition-colors font-medium"
      >
        Try Different Payment Method
      </button>
    </div>
  );
}

