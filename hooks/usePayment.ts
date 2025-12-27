'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { paymentService } from '@/services/payment.service';
import {
  InitPaymentRequest,
  USSDPaymentRequest,
  ConfirmPaymentRequest,
} from '@/types/payment';
import { toast } from 'sonner';

export function useInitPayment() {
  return useMutation({
    mutationFn: (data: InitPaymentRequest) => paymentService.initPayment(data),
    onSuccess: () => {
      toast.success('Payment initiated!');
    },
    onError: () => {
      toast.error('Failed to initiate payment');
    },
  });
}

export function useInitUSSDPayment() {
  return useMutation({
    mutationFn: (data: USSDPaymentRequest) => paymentService.initUSSDPayment(data),
    onSuccess: () => {
      toast.success('USSD code generated!');
    },
    onError: () => {
      toast.error('Failed to generate USSD code');
    },
  });
}

export function useConfirmPayment() {
  return useMutation({
    mutationFn: (data: ConfirmPaymentRequest) => paymentService.confirmPayment(data),
    onSuccess: () => {
      toast.success('Payment confirmed!');
    },
    onError: () => {
      toast.error('Failed to confirm payment');
    },
  });
}

export function usePaymentStatus(orderId: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ['payment', 'status', orderId],
    queryFn: () => paymentService.getPaymentStatus(orderId),
    enabled: enabled && !!orderId,
    refetchInterval: 5000, // Poll every 5 seconds
  });
}

