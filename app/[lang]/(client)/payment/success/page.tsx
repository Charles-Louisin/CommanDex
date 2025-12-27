'use client';

import { useEffect } from 'react';
import { useOrderStore } from '@/store/order.store';
import { useRouter } from 'next/navigation';
import { CheckCircle, FileText, Home } from 'lucide-react';
import Link from 'next/link';
import Confetti from 'react-confetti';
import { useState } from 'react';
import { formatPriceWithCurrency } from '@/lib/utils';

export default function PaymentSuccessPage() {
  const { currentOrder, clearOrder } = useOrderStore();
  const router = useRouter();
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    if (!currentOrder) {
      router.push('/menu');
      return;
    }

    // Stop confetti after 5 seconds
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, [currentOrder, router]);

  if (!currentOrder) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={500}
        />
      )}

      {/* Success Icon */}
      <div className="flex flex-col items-center justify-center py-12">
        <div className="bg-green-100 rounded-full p-6 mb-6">
          <CheckCircle size={80} className="text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-primary mb-2">Payment Successful!</h1>
        <p className="text-text-muted text-center">
          Your order has been confirmed and sent to the kitchen
        </p>
      </div>

      {/* Order Summary */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-text-primary mb-4">Order Summary</h2>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-text-muted">Order ID</span>
            <span className="font-mono font-medium text-text-primary">{currentOrder.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">Table</span>
            <span className="font-medium text-text-primary">{currentOrder.tableId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">Items</span>
            <span className="font-medium text-text-primary">{currentOrder.items.length}</span>
          </div>
          <div className="flex justify-between pt-3 border-t border-border">
            <span className="font-semibold text-text-primary">Total Paid</span>
            <span className="text-2xl font-bold text-primary">{formatPriceWithCurrency(currentOrder.total)}</span>
          </div>
        </div>
      </div>

      {/* Items List */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="font-semibold text-text-primary mb-4">Order Items</h3>
        <div className="space-y-2">
          {currentOrder.items.map((item) => (
            <div key={item.productId} className="flex justify-between text-sm">
              <span className="text-text-primary">
                {item.name} × {item.quantity}
              </span>
              <span className="font-medium text-text-primary">
                {formatPriceWithCurrency(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Link
          href={`/invoice/${currentOrder.id}`}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-primary text-primary rounded-lg hover:bg-primary-50 transition-colors font-medium"
        >
          <FileText size={20} />
          View Invoice
        </Link>
        <button
          onClick={() => {
            clearOrder();
            router.push('/menu');
          }}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
        >
          <Home size={20} />
          Back to Menu
        </button>
      </div>

      {/* Estimated Time */}
      <div className="bg-primary-50 rounded-lg p-4 border border-primary">
        <p className="text-center text-text-primary">
          <span className="font-semibold">Estimated preparation time:</span> 15-20 minutes
        </p>
        <p className="text-center text-text-muted text-sm mt-1">
          Your food will be served shortly!
        </p>
      </div>
    </div>
  );
}

