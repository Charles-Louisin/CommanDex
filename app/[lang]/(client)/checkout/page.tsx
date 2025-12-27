'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { formatPriceWithCurrency } from '@/lib/utils';
import { useCartStore } from '@/store/cart.store';
import { useTableStore } from '@/store/table.store';
import { useOrderStore } from '@/store/order.store';
import { useCreateOrder } from '@/hooks/useOrders';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { CreditCard, Smartphone } from 'lucide-react';

export default function CheckoutPage() {
  const { items, total, clearCart } = useCartStore();
  const { restaurantId, tableId } = useTableStore();
  const { setOrder } = useOrderStore();
  const createOrder = useCreateOrder();
  const router = useRouter();
  const [notes, setNotes] = useState('');

  // Redirect to cart if empty - must be in useEffect, not during render
  useEffect(() => {
    if (items.length === 0) {
      router.push('/cart');
    }
  }, [items.length, router]);

  const handlePlaceOrder = async () => {
    if (!restaurantId || !tableId) {
      return;
    }

    try {
      const order = await createOrder.mutateAsync({
        restaurantId,
        tableId,
        items,
        notes,
      });

      setOrder(order);
      clearCart();
      router.push('/payment');
    } catch (error) {
      console.error('Failed to create order:', error);
    }
  };

  // Show nothing while redirecting
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-primary">Checkout</h1>

      {/* Order Summary */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-text-primary mb-4">Order Summary</h2>
        
        {/* Table Info */}
        <div className="bg-primary-50 rounded-lg p-4 mb-4">
          <p className="text-sm text-text-muted">Table Number</p>
          <p className="text-lg font-semibold text-primary">{tableId}</p>
        </div>

        {/* Items */}
        <div className="space-y-2 mb-4">
          {items.map((item) => (
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

        <div className="border-t border-border pt-4">
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold text-text-primary">Total</span>
            <span className="text-2xl font-bold text-primary">{formatPriceWithCurrency(total)}</span>
          </div>
        </div>
      </div>

      {/* Special Instructions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-text-primary mb-4">Special Instructions</h2>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any special requests? (optional)"
          className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          rows={3}
        />
      </div>

      {/* Payment Method Preview */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-text-primary mb-4">Payment Method</h2>
        <p className="text-text-muted text-sm mb-4">
          You&apos;ll be able to choose your payment method on the next step
        </p>
        <div className="flex gap-4">
          <div className="flex-1 flex items-center gap-3 p-4 border-2 border-border rounded-lg">
            <CreditCard className="text-primary" size={24} />
            <span className="font-medium text-text-primary">Online Payment</span>
          </div>
          <div className="flex-1 flex items-center gap-3 p-4 border-2 border-border rounded-lg">
            <Smartphone className="text-primary" size={24} />
            <span className="font-medium text-text-primary">USSD Payment</span>
          </div>
        </div>
      </div>

      {/* Place Order Button */}
      <button
        onClick={handlePlaceOrder}
        disabled={createOrder.isPending}
        className="w-full py-4 bg-primary text-white text-lg font-semibold rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {createOrder.isPending ? (
          <>
            <LoadingSpinner size="sm" />
            Processing...
          </>
        ) : (
          'Place Order'
        )}
      </button>
    </div>
  );
}

