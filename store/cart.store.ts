'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { OrderItem } from '@/types/order';

interface CartState {
  items: OrderItem[];
  addItem: (item: OrderItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
}

const calculateTotal = (items: OrderItem[]): number => {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,
      
      addItem: (item) => set((state) => {
        const existingItem = state.items.find((i) => i.productId === item.productId);
        
        let newItems: OrderItem[];
        if (existingItem) {
          newItems = state.items.map((i) =>
            i.productId === item.productId
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          );
        } else {
          newItems = [...state.items, item];
        }
        
        return {
          items: newItems,
          total: calculateTotal(newItems),
        };
      }),
      
      removeItem: (productId) => set((state) => {
        const newItems = state.items.filter((i) => i.productId !== productId);
        return {
          items: newItems,
          total: calculateTotal(newItems),
        };
      }),
      
      updateQuantity: (productId, quantity) => set((state) => {
        if (quantity <= 0) {
          const newItems = state.items.filter((i) => i.productId !== productId);
          return {
            items: newItems,
            total: calculateTotal(newItems),
          };
        }
        
        const newItems = state.items.map((i) =>
          i.productId === productId ? { ...i, quantity } : i
        );
        
        return {
          items: newItems,
          total: calculateTotal(newItems),
        };
      }),
      
      clearCart: () => set({ items: [], total: 0 }),
    }),
    {
      name: 'cart-storage',
    }
  )
);

