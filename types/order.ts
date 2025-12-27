export type OrderStatus = "PENDING" | "IN_PROGRESS" | "SERVED" | "PAID";

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string | null;
  notes?: string;
}

export interface Order {
  id: string;
  restaurantId: string;
  tableId: string;
  status: OrderStatus;
  total: number;
  items: OrderItem[];
  createdAt: string;
  updatedAt?: string;
  notes?: string;
}

export interface CreateOrderRequest {
  restaurantId: string;
  tableId: string;
  items: OrderItem[];
  notes?: string;
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus;
}

