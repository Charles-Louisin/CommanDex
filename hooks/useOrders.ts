'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { orderService } from '@/services/order.service';
import { CreateOrderRequest, UpdateOrderStatusRequest } from '@/types/order';
import { dbHelpers } from '@/lib/db';
import { useOnlineStatus } from './useOnlineStatus';
import { toast } from 'sonner';

export function useTableOrders(tableId: string) {
  const isOnline = useOnlineStatus();

  return useQuery({
    queryKey: ['orders', 'table', tableId],
    queryFn: async () => {
      if (isOnline) {
        try {
          const orders = await orderService.getTableOrders(tableId);
          // Cache orders
          for (const order of orders) {
            await dbHelpers.cacheOrder(order);
          }
          return orders;
        } catch (error) {
          return await dbHelpers.getCachedOrders(tableId);
        }
      } else {
        return await dbHelpers.getCachedOrders(tableId);
      }
    },
    enabled: !!tableId,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  const isOnline = useOnlineStatus();

  return useMutation({
    mutationFn: async (data: CreateOrderRequest) => {
      if (isOnline) {
        const order = await orderService.createOrder(data);
        await dbHelpers.cacheOrder(order);
        return order;
      } else {
        // Queue for later sync
        const mockOrder = await orderService.createOrder(data);
        await dbHelpers.queueOrder(mockOrder);
        await dbHelpers.cacheOrder(mockOrder);
        toast.info('Order will be synced when online');
        return mockOrder;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Order created successfully!');
    },
    onError: () => {
      toast.error('Failed to create order');
    },
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, data }: { orderId: string; data: UpdateOrderStatusRequest }) =>
      orderService.updateOrderStatus(orderId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Order status updated!');
    },
    onError: () => {
      toast.error('Failed to update order status');
    },
  });
}

export function useAllOrders(restaurantId: string, status?: string) {
  return useQuery({
    queryKey: ['orders', 'all', restaurantId, status],
    queryFn: () => orderService.getAllOrders(restaurantId, status),
    enabled: !!restaurantId,
  });
}

