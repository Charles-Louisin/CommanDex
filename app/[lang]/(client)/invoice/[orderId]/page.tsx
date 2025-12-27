'use client';

import { useOrderStore } from '@/store/order.store';
import { Download, Printer, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { formatPriceWithCurrency } from '@/lib/utils';

export default function InvoicePage({ params }: { params: Promise<{ orderId: string }> }) {
  const { currentOrder } = useOrderStore();
  const router = useRouter();

  // In a real app, fetch invoice data using orderId
  // const { orderId } = await params; // Use this when needed
  const order = currentOrder;

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <p className="text-text-muted">Invoice not found</p>
        <button
          onClick={() => router.push('/menu')}
          className="mt-4 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          Back to Menu
        </button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // In a real app, download PDF from API
    alert('PDF download would be triggered here');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Actions Bar */}
      <div className="flex items-center justify-between print:hidden">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-primary hover:text-primary-dark transition-colors"
        >
          <ArrowLeft size={20} />
          Back
        </button>
        <div className="flex gap-3">
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-primary text-primary rounded-lg hover:bg-primary-50 transition-colors"
          >
            <Download size={18} />
            Download PDF
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            <Printer size={18} />
            Print
          </button>
        </div>
      </div>

      {/* Invoice */}
      <div className="bg-white rounded-lg shadow-sm p-8 md:p-12">
        {/* Header */}
        <div className="flex justify-between items-start mb-8 pb-8 border-b-2 border-border">
          <div>
            <h1 className="text-4xl font-bold text-primary mb-2">INVOICE</h1>
            <p className="text-text-muted">CommanDex Restaurant</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-text-muted">Invoice Number</p>
            <p className="font-mono font-semibold text-text-primary">
              INV-{order.id.slice(-8).toUpperCase()}
            </p>
            <p className="text-sm text-text-muted mt-2">Date</p>
            <p className="font-medium text-text-primary">
              {new Date(order.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>

        {/* Customer Info */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-text-muted uppercase mb-2">Billed To</h3>
          <p className="text-lg font-semibold text-text-primary">Table {order.tableId}</p>
          <p className="text-text-muted">Restaurant ID: {order.restaurantId}</p>
        </div>

        {/* Items Table */}
        <table className="w-full mb-8">
          <thead>
            <tr className="border-b-2 border-border">
              <th className="text-left py-3 text-sm font-semibold text-text-muted uppercase">
                Item
              </th>
              <th className="text-center py-3 text-sm font-semibold text-text-muted uppercase">
                Quantity
              </th>
              <th className="text-right py-3 text-sm font-semibold text-text-muted uppercase">
                Price
              </th>
              <th className="text-right py-3 text-sm font-semibold text-text-muted uppercase">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, index) => (
              <tr key={item.productId} className="border-b border-border">
                <td className="py-4 text-text-primary">{item.name}</td>
                <td className="py-4 text-center text-text-primary">{item.quantity}</td>
                <td className="py-4 text-right text-text-primary">{formatPriceWithCurrency(item.price)}</td>
                <td className="py-4 text-right font-medium text-text-primary">
                  {formatPriceWithCurrency(item.price * item.quantity)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-end mb-8">
          <div className="w-64">
            <div className="flex justify-between py-2">
              <span className="text-text-muted">Subtotal</span>
              <span className="font-medium text-text-primary">{formatPriceWithCurrency(order.total)}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-text-muted">Tax</span>
              <span className="font-medium text-text-primary">{formatPriceWithCurrency(0)}</span>
            </div>
            <div className="flex justify-between py-3 border-t-2 border-border">
              <span className="text-xl font-bold text-text-primary">Total</span>
              <span className="text-2xl font-bold text-primary">{formatPriceWithCurrency(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="bg-green-50 border-2 border-green-500 rounded-lg p-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="font-semibold text-green-700">PAID</span>
          </div>
          <p className="text-sm text-green-600 mt-1">
            Payment received on {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Footer */}
        <div className="text-center pt-8 border-t border-border">
          <p className="text-text-primary font-semibold mb-2">Thank you for your business!</p>
          <p className="text-sm text-text-muted">
            For any inquiries, please contact us at support@commandex.com
          </p>
        </div>
      </div>
    </div>
  );
}

