import apiClient from '@/lib/axios';
import { InvoiceResponse } from '@/types/invoice';

export const invoiceService = {
  async getInvoice(orderId: string): Promise<InvoiceResponse> {
    try {
      const response = await apiClient.get<InvoiceResponse>(
        `/api/invoices/${orderId}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async downloadInvoicePDF(orderId: string): Promise<Blob> {
    try {
      const response = await apiClient.get(`/api/invoices/${orderId}/pdf`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

