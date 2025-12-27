import apiClient from '@/lib/axios';
import { Order, CreateOrderRequest, UpdateOrderStatusRequest } from '@/types/order';

export const orderService = {
  async createOrder(data: CreateOrderRequest): Promise<Order> {
    try {
      const response = await apiClient.post<Order>('/api/orders', data);
      return response.data;
    } catch (error) {
      // Mock response for offline development
      const mockOrder: Order = {
        id: `order_${Date.now()}`,
        restaurantId: data.restaurantId,
        tableId: data.tableId,
        status: 'PENDING',
        total: data.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
        items: data.items,
        createdAt: new Date().toISOString(),
      };
      console.warn('Using mock order data');
      return mockOrder;
    }
  },

  async getTableOrders(tableId: string): Promise<Order[]> {
    try {
      const response = await apiClient.get<Order[]>(`/api/tables/${tableId}/orders`);
      return response.data;
    } catch (error) {
      console.warn('Using mock orders data');
      return [];
    }
  },

  async updateOrderStatus(orderId: string, data: UpdateOrderStatusRequest): Promise<Order> {
    try {
      const response = await apiClient.patch<Order>(
        `/api/orders/${orderId}/status`,
        data
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getOrderById(orderId: string): Promise<Order> {
    try {
      const response = await apiClient.get<Order>(`/api/orders/${orderId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getAllOrders(restaurantId: string, status?: string): Promise<Order[]> {
    try {
      const params = new URLSearchParams();
      params.append('restaurantId', restaurantId);
      if (status) params.append('status', status);
      
      const response = await apiClient.get<Order[]>(`/api/orders?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.warn('Using mock orders data');
      
      // Mock orders data
      const mockOrders: Order[] = [
        {
          id: 'order_001',
          restaurantId: restaurantId,
          tableId: 'Table-1',
          status: 'PENDING',
          total: 12500,
          items: [
            { productId: 'prod_001', name: 'Caesar Salad', price: 3500, quantity: 2, imageUrl: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop' },
            { productId: 'prod_002', name: 'Grilled Chicken', price: 5500, quantity: 1, imageUrl: 'https://images.unsplash.com/photo-1532550907401-a78c3e9e9e9e?w=400&h=300&fit=crop' },
          ],
          createdAt: new Date(Date.now() - 5 * 60000).toISOString(), // 5 minutes ago
        },
        {
          id: 'order_002',
          restaurantId: restaurantId,
          tableId: 'Table-3',
          status: 'IN_PROGRESS',
          total: 18500,
          items: [
            { productId: 'prod_003', name: 'Beef Burger', price: 4500, quantity: 2, imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop' },
            { productId: 'prod_004', name: 'French Fries', price: 2500, quantity: 2, imageUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop' },
            { productId: 'prod_005', name: 'Coca Cola', price: 1500, quantity: 2, imageUrl: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&h=300&fit=crop' },
          ],
          createdAt: new Date(Date.now() - 15 * 60000).toISOString(), // 15 minutes ago
        },
        {
          id: 'order_003',
          restaurantId: restaurantId,
          tableId: 'Table-5',
          status: 'SERVED',
          total: 22000,
          items: [
            { productId: 'prod_006', name: 'Pasta Carbonara', price: 5500, quantity: 2, imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=300&fit=crop' },
            { productId: 'prod_007', name: 'Garlic Bread', price: 3000, quantity: 2, imageUrl: 'https://images.unsplash.com/photo-1572442384236-1d8eb463262a?w=400&h=300&fit=crop' },
            { productId: 'prod_008', name: 'Tiramisu', price: 5000, quantity: 1, imageUrl: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop' },
          ],
          createdAt: new Date(Date.now() - 45 * 60000).toISOString(), // 45 minutes ago
        },
        {
          id: 'order_004',
          restaurantId: restaurantId,
          tableId: 'Table-2',
          status: 'PAID',
          total: 15000,
          items: [
            { productId: 'prod_009', name: 'Margherita Pizza', price: 6000, quantity: 1, imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop' },
            { productId: 'prod_010', name: 'Caesar Salad', price: 3500, quantity: 1, imageUrl: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop' },
            { productId: 'prod_011', name: 'Red Wine', price: 5500, quantity: 1, imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop' },
          ],
          createdAt: new Date(Date.now() - 2 * 3600000).toISOString(), // 2 hours ago
        },
        {
          id: 'order_005',
          restaurantId: restaurantId,
          tableId: 'Table-7',
          status: 'PENDING',
          total: 9500,
          items: [
            { productId: 'prod_012', name: 'Chicken Wings', price: 4500, quantity: 1, imageUrl: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400&h=300&fit=crop' },
            { productId: 'prod_013', name: 'Onion Rings', price: 2500, quantity: 1, imageUrl: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=300&fit=crop' },
            { productId: 'prod_005', name: 'Coca Cola', price: 1500, quantity: 1, imageUrl: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&h=300&fit=crop' },
            { productId: 'prod_014', name: 'Ice Cream', price: 2000, quantity: 1, imageUrl: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop' },
          ],
          createdAt: new Date(Date.now() - 10 * 60000).toISOString(), // 10 minutes ago
        },
        {
          id: 'order_006',
          restaurantId: restaurantId,
          tableId: 'Table-4',
          status: 'IN_PROGRESS',
          total: 32000,
          items: [
            { productId: 'prod_015', name: 'Ribeye Steak', price: 12000, quantity: 2, imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop' },
            { productId: 'prod_016', name: 'Mashed Potatoes', price: 3000, quantity: 2, imageUrl: 'https://images.unsplash.com/photo-1518977822534-7049a61ee0c2?w=400&h=300&fit=crop' },
            { productId: 'prod_017', name: 'Grilled Vegetables', price: 4000, quantity: 1, imageUrl: 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=400&h=300&fit=crop' },
          ],
          createdAt: new Date(Date.now() - 25 * 60000).toISOString(), // 25 minutes ago
        },
        {
          id: 'order_007',
          restaurantId: restaurantId,
          tableId: 'Table-6',
          status: 'PAID',
          total: 28000,
          items: [
            { productId: 'prod_018', name: 'Seafood Platter', price: 15000, quantity: 1, imageUrl: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&h=300&fit=crop' },
            { productId: 'prod_019', name: 'Lobster Bisque', price: 8000, quantity: 1, imageUrl: 'https://images.unsplash.com/photo-1547573854-74d2a71d0826?w=400&h=300&fit=crop' },
            { productId: 'prod_020', name: 'Champagne', price: 5000, quantity: 1, imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop' },
          ],
          createdAt: new Date(Date.now() - 3 * 3600000).toISOString(), // 3 hours ago
        },
        {
          id: 'order_008',
          restaurantId: restaurantId,
          tableId: 'Table-8',
          status: 'SERVED',
          total: 13500,
          items: [
            { productId: 'prod_021', name: 'Fish & Chips', price: 5500, quantity: 1, imageUrl: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&h=300&fit=crop' },
            { productId: 'prod_022', name: 'Coleslaw', price: 2500, quantity: 1, imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=300&fit=crop' },
            { productId: 'prod_023', name: 'Lemonade', price: 2000, quantity: 1, imageUrl: 'https://images.unsplash.com/photo-1523677011783-c91d1bbe2fdc?w=400&h=300&fit=crop' },
            { productId: 'prod_024', name: 'Apple Pie', price: 3500, quantity: 1, imageUrl: 'https://images.unsplash.com/photo-1621293954908-907159247fc8?w=400&h=300&fit=crop' },
          ],
          createdAt: new Date(Date.now() - 60 * 60000).toISOString(), // 1 hour ago
        },
        {
          id: 'order_009',
          restaurantId: restaurantId,
          tableId: 'Table-1',
          status: 'PENDING',
          total: 17500,
          items: [
            { productId: 'prod_025', name: 'BBQ Ribs', price: 8500, quantity: 1, imageUrl: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400&h=300&fit=crop' },
            { productId: 'prod_026', name: 'Corn on the Cob', price: 2000, quantity: 2, imageUrl: 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=400&h=300&fit=crop' },
            { productId: 'prod_027', name: 'Baked Beans', price: 2500, quantity: 1, imageUrl: 'https://images.unsplash.com/photo-1518977822534-7049a61ee0c2?w=400&h=300&fit=crop' },
            { productId: 'prod_028', name: 'Iced Tea', price: 1500, quantity: 2, imageUrl: 'https://images.unsplash.com/photo-1523677011783-c91d1bbe2fdc?w=400&h=300&fit=crop' },
          ],
          createdAt: new Date(Date.now() - 3 * 60000).toISOString(), // 3 minutes ago
        },
        {
          id: 'order_010',
          restaurantId: restaurantId,
          tableId: 'Table-9',
          status: 'IN_PROGRESS',
          total: 19500,
          items: [
            { productId: 'prod_029', name: 'Sushi Platter', price: 12000, quantity: 1, imageUrl: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop' },
            { productId: 'prod_030', name: 'Miso Soup', price: 3000, quantity: 1, imageUrl: 'https://images.unsplash.com/photo-1547573854-74d2a71d0826?w=400&h=300&fit=crop' },
            { productId: 'prod_031', name: 'Green Tea', price: 2000, quantity: 1, imageUrl: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&h=300&fit=crop' },
            { productId: 'prod_032', name: 'Mochi Ice Cream', price: 2500, quantity: 1, imageUrl: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop' },
          ],
          createdAt: new Date(Date.now() - 20 * 60000).toISOString(), // 20 minutes ago
        },
      ];

      // Filter by status if provided
      if (status) {
        return mockOrders.filter(order => order.status === status);
      }

      return mockOrders;
    }
  },
};

