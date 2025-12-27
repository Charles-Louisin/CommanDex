'use client';

import { create } from 'zustand';

interface UIState {
  sidebarOpen: boolean;
  locale: 'en' | 'fr';
  isOnline: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setLocale: (locale: 'en' | 'fr') => void;
  setOnlineStatus: (status: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  locale: 'en',
  isOnline: true,
  
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  
  setLocale: (locale) => set({ locale }),
  
  setOnlineStatus: (status) => set({ isOnline: status }),
}));

