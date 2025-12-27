'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Order } from '@/types/order';

interface OrderState {
  currentOrder: Order | null;
  orderHistory: Order[];
  setOrder: (order: Order) => void;
  clearOrder: () => void;
  addToHistory: (order: Order) => void;
  clearHistory: () => void;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set) => ({
      currentOrder: null,
      orderHistory: [],
      
      setOrder: (order) => set({ currentOrder: order }),
      
      clearOrder: () => set({ currentOrder: null }),
      
      addToHistory: (order) => set((state) => ({
        orderHistory: [order, ...state.orderHistory],
      })),
      
      clearHistory: () => set({ orderHistory: [] }),
    }),
    {
      name: 'order-storage',
    }
  )
);

