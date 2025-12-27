import { Order } from './order';
import { Payment } from './payment';
import { Restaurant } from './menu';

export interface Invoice {
  id: string;
  orderId: string;
  invoiceNumber: string;
  order: Order;
  payment: Payment;
  restaurant: Restaurant;
  issuedAt: string;
  pdfUrl?: string;
}

export interface InvoiceResponse {
  invoice: Invoice;
}

