import Dexie, { Table } from 'dexie';
import { Order } from '@/types/order';
import { Product, Category, Restaurant } from '@/types/menu';
import { Payment } from '@/types/payment';

export interface QueuedOrder {
  id?: number;
  orderId: string;
  orderData: Order;
  timestamp: number;
  synced: boolean;
}

export class RestaurantDB extends Dexie {
  orders!: Table<Order, string>;
  products!: Table<Product, string>;
  categories!: Table<Category, string>;
  restaurants!: Table<Restaurant, string>;
  payments!: Table<Payment, string>;
  queuedOrders!: Table<QueuedOrder, number>;

  constructor() {
    super('RestaurantDB');
    
    this.version(1).stores({
      orders: 'id, restaurantId, tableId, status, createdAt',
      products: 'id, categoryId, available',
      categories: 'id, name',
      restaurants: 'id, name',
      payments: 'id, orderId, status',
      queuedOrders: '++id, orderId, timestamp, synced',
    });
  }
}

// Only initialize DB on client side
let db: RestaurantDB | null = null;

export const getDB = (): RestaurantDB => {
  if (typeof window === 'undefined') {
    throw new Error('IndexedDB is only available in the browser');
  }
  if (!db) {
    db = new RestaurantDB();
  }
  return db;
};

// Helper functions for offline data management
export const dbHelpers = {
  // Cache menu data
  async cacheMenu(restaurant: Restaurant, categories: Category[], products: Product[]) {
    if (typeof window === 'undefined') return;
    const db = getDB();
    await db.restaurants.put(restaurant);
    await db.categories.bulkPut(categories);
    await db.products.bulkPut(products);
  },

  // Get cached menu
  async getCachedMenu(restaurantId: string) {
    if (typeof window === 'undefined') {
      return { restaurant: null, categories: [], products: [] };
    }
    const db = getDB();
    const restaurant = await db.restaurants.get(restaurantId);
    const categories = await db.categories.toArray();
    const products = await db.products.toArray();
    
    return { restaurant: restaurant || null, categories, products };
  },

  // Queue order for sync
  async queueOrder(order: Order) {
    if (typeof window === 'undefined') return;
    const db = getDB();
    await db.queuedOrders.add({
      orderId: order.id,
      orderData: order,
      timestamp: Date.now(),
      synced: false,
    });
  },

  // Get unsynced orders
  async getUnsyncedOrders() {
    if (typeof window === 'undefined') return [];
    const db = getDB();
    return await db.queuedOrders.where('synced').equals(0).toArray();
  },

  // Mark order as synced
  async markOrderSynced(id: number) {
    if (typeof window === 'undefined') return;
    const db = getDB();
    await db.queuedOrders.update(id, { synced: true });
  },

  // Cache order
  async cacheOrder(order: Order) {
    if (typeof window === 'undefined') return;
    const db = getDB();
    await db.orders.put(order);
  },

  // Get cached orders
  async getCachedOrders(tableId: string) {
    if (typeof window === 'undefined') return [];
    const db = getDB();
    return await db.orders.where('tableId').equals(tableId).toArray();
  },

  // Clear all data
  async clearAll() {
    if (typeof window === 'undefined') return;
    const db = getDB();
    await db.orders.clear();
    await db.products.clear();
    await db.categories.clear();
    await db.restaurants.clear();
    await db.payments.clear();
    await db.queuedOrders.clear();
  },
};

