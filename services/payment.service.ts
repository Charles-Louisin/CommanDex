import apiClient from '@/lib/axios';
import {
  InitPaymentRequest,
  InitPaymentResponse,
  USSDPaymentRequest,
  USSDPaymentResponse,
  ConfirmPaymentRequest,
  PaymentStatusResponse,
} from '@/types/payment';

export const paymentService = {
  async initPayment(data: InitPaymentRequest): Promise<InitPaymentResponse> {
    try {
      const response = await apiClient.post<InitPaymentResponse>(
        '/api/payments/init',
        data
      );
      return response.data;
    } catch (error) {
      // Mock response for offline development
      const mockResponse: InitPaymentResponse = {
        paymentId: `pay_${Date.now()}`,
        status: 'PENDING',
        ussdCode: data.method === 'USSD' ? '*144*1*1234#' : undefined,
      };
      console.warn('Using mock payment init data');
      return mockResponse;
    }
  },

  async initUSSDPayment(data: USSDPaymentRequest): Promise<USSDPaymentResponse> {
    try {
      const response = await apiClient.post<USSDPaymentResponse>(
        '/api/payments/ussd',
        data
      );
      return response.data;
    } catch (error) {
      // Mock response
      const mockResponse: USSDPaymentResponse = {
        paymentId: `pay_${Date.now()}`,
        ussdCode: `*144*4*${data.amount}#`,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 minutes
      };
      console.warn('Using mock USSD payment data');
      return mockResponse;
    }
  },

  async confirmPayment(data: ConfirmPaymentRequest): Promise<PaymentStatusResponse> {
    try {
      const response = await apiClient.post<PaymentStatusResponse>(
        '/api/payments/confirm',
        data
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getPaymentStatus(orderId: string): Promise<PaymentStatusResponse> {
    try {
      const response = await apiClient.get<PaymentStatusResponse>(
        `/api/payments/${orderId}/status`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

