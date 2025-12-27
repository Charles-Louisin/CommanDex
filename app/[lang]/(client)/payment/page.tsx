'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { formatPriceWithCurrency } from '@/lib/utils';
import { useOrderStore } from '@/store/order.store';
import { useInitPayment } from '@/hooks/usePayment';
import { useRouter } from 'next/navigation';
import { CreditCard, Smartphone, ArrowLeft } from 'lucide-react';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import type { PaymentMethod } from '@/types/payment';

export default function PaymentPage() {
  const { currentOrder } = useOrderStore();
  const initPayment = useInitPayment();
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);

  if (!currentOrder) {
    router.push('/menu');
    return null;
  }

  const handlePayment = async () => {
    if (!selectedMethod) return;

    try {
      const result = await initPayment.mutateAsync({
        orderId: currentOrder.id,
        method: selectedMethod,
        amount: currentOrder.total,
      });

      if (selectedMethod === 'USSD') {
        router.push('/payment/ussd');
      } else {
        // Redirect to online payment page or external gateway
        router.push('/payment/success');
      }
    } catch (error) {
      console.error('Payment initiation failed:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-primary hover:text-primary-dark transition-colors"
      >
        <ArrowLeft size={20} />
        Back
      </button>

      <h1 className="text-3xl font-bold text-primary">Select Payment Method</h1>

      {/* Order Info */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-text-muted">Order ID</p>
            <p className="font-mono text-text-primary">{currentOrder.id}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-text-muted">Total Amount</p>
            <p className="text-2xl font-bold text-primary">{formatPriceWithCurrency(currentOrder.total)}</p>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="space-y-4">
        <button
          onClick={() => setSelectedMethod('ONLINE')}
          className={`w-full p-6 rounded-lg border-2 transition-all ${
            selectedMethod === 'ONLINE'
              ? 'border-primary bg-primary-50'
              : 'border-border hover:border-primary'
          }`}
        >
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-lg ${
              selectedMethod === 'ONLINE' ? 'bg-primary text-white' : 'bg-gray-100 text-primary'
            }`}>
              <CreditCard size={32} />
            </div>
            <div className="flex-1 text-left">
              <h3 className="text-lg font-semibold text-text-primary">Online Payment</h3>
              <p className="text-sm text-text-muted">Pay with card or mobile money</p>
            </div>
            {selectedMethod === 'ONLINE' && (
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
        </button>

        <button
          onClick={() => setSelectedMethod('USSD')}
          className={`w-full p-6 rounded-lg border-2 transition-all ${
            selectedMethod === 'USSD'
              ? 'border-primary bg-primary-50'
              : 'border-border hover:border-primary'
          }`}
        >
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-lg ${
              selectedMethod === 'USSD' ? 'bg-primary text-white' : 'bg-gray-100 text-primary'
            }`}>
              <Smartphone size={32} />
            </div>
            <div className="flex-1 text-left">
              <h3 className="text-lg font-semibold text-text-primary">USSD Payment</h3>
              <p className="text-sm text-text-muted">Pay using USSD code</p>
            </div>
            {selectedMethod === 'USSD' && (
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
        </button>
      </div>

      {/* Continue Button */}
      <button
        onClick={handlePayment}
        disabled={!selectedMethod || initPayment.isPending}
        className="w-full py-4 bg-primary text-white text-lg font-semibold rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {initPayment.isPending ? (
          <>
            <LoadingSpinner size="sm" />
            Processing...
          </>
        ) : (
          'Continue to Payment'
        )}
      </button>
    </div>
  );
}

