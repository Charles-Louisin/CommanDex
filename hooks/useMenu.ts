'use client';

import { useQuery } from '@tanstack/react-query';
import { menuService } from '@/services/menu.service';
import { dbHelpers } from '@/lib/db';
import { useOnlineStatus } from './useOnlineStatus';

export function useMenu(restaurantId: string) {
  const isOnline = useOnlineStatus();

  return useQuery({
    queryKey: ['menu', restaurantId],
    queryFn: async () => {
      // Always try to get from service first (it has mock data fallback)
      try {
        const data = await menuService.getMenu(restaurantId);
        // Cache the data if we're in browser
        if (typeof window !== 'undefined') {
          await dbHelpers.cacheMenu(data.restaurant, data.categories, data.products);
        }
        return data;
      } catch (error) {
        // Fallback to cached data
        console.warn('Falling back to cached menu data');
        const cached = await dbHelpers.getCachedMenu(restaurantId);
        // If no cached data, return mock data structure
        if (!cached.restaurant) {
          // Return empty structure that won't break the UI
          return {
            restaurant: {
              id: restaurantId,
              name: 'Restaurant',
              currency: 'FCFA',
            },
            categories: [],
            products: [],
          };
        }
        return cached;
      }
    },
    enabled: !!restaurantId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

