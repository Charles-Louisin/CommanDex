'use client';

import { useCartStore } from '@/store/cart.store';
import { useTableStore } from '@/store/table.store';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { formatPriceWithCurrency } from '@/lib/utils';

export default function CartPage() {
  const { items, total, updateQuantity, removeItem } = useCartStore();
  const { restaurantId, tableId } = useTableStore();
  const router = useRouter();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <ShoppingBag size={48} className="sm:w-16 sm:h-16 text-text-muted mb-4" />
        <h2 className="text-xl sm:text-2xl font-semibold text-text-primary mb-2 text-center">Your cart is empty</h2>
        <p className="text-sm sm:text-base text-text-muted mb-6 text-center">Add some items from the menu</p>
        <Link
          href="/menu"
          className="px-4 sm:px-6 py-2 sm:py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm sm:text-base font-medium"
        >
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6 px-2 sm:px-4">
      <h1 className="text-2xl sm:text-3xl font-bold text-primary font-heading">Your Cart</h1>

      {/* Cart Items */}
      <div className="bg-white rounded-lg shadow-sm divide-y divide-border">
        {items.map((item, index) => (
          <div key={`${item.productId}-${index}`} className="p-3 sm:p-4">
            {/* Mobile Layout */}
            <div className="flex sm:hidden flex-col gap-3">
              <div className="flex items-start gap-3">
                {/* Product Image */}
                {item.imageUrl && (
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-text-primary text-sm">{item.name}</h3>
                  <p className="text-xs text-text-muted mt-1">
                    {formatPriceWithCurrency(item.price)} × {item.quantity}
                  </p>
                </div>
                <button
                  onClick={() => removeItem(item.productId)}
                  className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors flex-shrink-0"
                  aria-label="Remove item"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    className="p-1.5 rounded bg-gray-100 hover:bg-gray-200 transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-8 text-center font-medium text-sm">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    className="p-1.5 rounded bg-gray-100 hover:bg-gray-200 transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-primary text-sm">{formatPriceWithCurrency(item.price * item.quantity)}</p>
                </div>
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden sm:flex items-center gap-4">
              {/* Product Image */}
              {item.imageUrl && (
                <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-text-primary">{item.name}</h3>
                <p className="text-sm text-text-muted">
                  {formatPriceWithCurrency(item.price)} × {item.quantity}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                  className="p-1 rounded bg-gray-100 hover:bg-gray-200 transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus size={16} />
                </button>
                <span className="w-8 text-center font-medium">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                  className="p-1 rounded bg-gray-100 hover:bg-gray-200 transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus size={16} />
                </button>
              </div>

              <div className="text-right min-w-[100px]">
                <p className="font-semibold text-primary">{formatPriceWithCurrency(item.price * item.quantity)}</p>
              </div>

              <button
                onClick={() => removeItem(item.productId)}
                className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors"
                aria-label="Remove item"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <span className="text-base sm:text-lg font-medium text-text-primary">Subtotal</span>
          <span className="text-base sm:text-lg font-semibold text-text-primary">{formatPriceWithCurrency(total)}</span>
        </div>
        <div className="flex items-center justify-between mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-border">
          <span className="text-xl sm:text-2xl font-bold text-text-primary font-heading">Total</span>
          <span className="text-xl sm:text-2xl font-bold text-primary font-heading">{formatPriceWithCurrency(total)}</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Link
            href="/menu"
            className="w-full sm:flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-white border-2 border-primary text-primary rounded-lg hover:bg-primary-50 transition-colors text-center font-medium text-sm sm:text-base"
          >
            Continue Shopping
          </Link>
          <button
            onClick={() => router.push('/checkout')}
            disabled={!restaurantId || !tableId}
            className="w-full sm:flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm sm:text-base"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}

