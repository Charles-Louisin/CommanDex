'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TableState {
  restaurantId: string | null;
  tableId: string | null;
  setTable: (restaurantId: string, tableId: string) => void;
  clearTable: () => void;
}

export const useTableStore = create<TableState>()(
  persist(
    (set) => ({
      restaurantId: null,
      tableId: null,
      setTable: (restaurantId, tableId) => set({ restaurantId, tableId }),
      clearTable: () => set({ restaurantId: null, tableId: null }),
    }),
    {
      name: 'table-storage',
    }
  )
);

