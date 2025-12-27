export interface Restaurant {
  id: string;
  name: string;
  currency: string;
  description?: string;
  imageUrl?: string;
  address?: string;
  phone?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  order?: number;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  available: boolean;
  stock?: number;
  categoryId: string;
  imageUrl?: string | null;
  preparationTime?: number; // in minutes
  rating?: number; // 0-5
  reviewCount?: number;
  reviews?: Review[];
  tags?: string[];
  discount?: number; // percentage discount
}

export interface MenuResponse {
  restaurant: Restaurant;
  categories: Category[];
  products: Product[];
}

