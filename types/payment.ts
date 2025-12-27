export type PaymentMethod = "ONLINE" | "USSD";
export type PaymentStatus = "PENDING" | "PAID" | "FAILED";

export interface Payment {
  id: string;
  orderId: string;
  method: PaymentMethod;
  amount: number;
  status: PaymentStatus;
  transactionId?: string;
  ussdCode?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface InitPaymentRequest {
  orderId: string;
  method: PaymentMethod;
  amount: number;
}

export interface InitPaymentResponse {
  paymentId: string;
  status: PaymentStatus;
  redirectUrl?: string;
  ussdCode?: string;
}

export interface USSDPaymentRequest {
  orderId: string;
  amount: number;
}

export interface USSDPaymentResponse {
  paymentId: string;
  ussdCode: string;
  expiresAt: string;
}

export interface ConfirmPaymentRequest {
  paymentId: string;
  transactionId: string;
}

export interface PaymentStatusResponse {
  status: PaymentStatus;
  payment: Payment;
}

