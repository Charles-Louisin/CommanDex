'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useAllOrders } from '@/hooks/useOrders';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Search, Filter, Eye, CheckCircle, XCircle, Clock } from 'lucide-react';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { OrderStatus } from '@/types/order';
import { formatPriceWithCurrency } from '@/lib/utils';
import { GrDeliver } from 'react-icons/gr';
import { MdAccessTime } from 'react-icons/md';
import { HiArrowPath } from 'react-icons/hi2';
import { useTranslations } from '@/hooks/useTranslations';

export default function OrdersPage() {
  const { t, locale } = useTranslations();
  const { data: orders = [], isLoading } = useAllOrders('rest_001');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'ALL'>('ALL');

  const columns: GridColDef[] = [
    { field: 'id', headerName: t('ordersPage.orderId'), width: 150 },
    { field: 'tableId', headerName: t('ordersPage.table'), width: 100 },
    {
      field: 'items',
      headerName: t('ordersPage.items'),
      width: 80,
      valueGetter: (value: any) => (Array.isArray(value) ? value.length : 0),
    },
    {
      field: 'total',
      headerName: t('common.total'),
      width: 120,
      valueFormatter: (value) => formatPriceWithCurrency(value),
    },
    {
      field: 'status',
      headerName: t('common.status'),
      width: 150,
      renderCell: (params) => {
        const statusColors = {
          PENDING: 'bg-amber-100 text-amber-800 border border-amber-300',
          IN_PROGRESS: 'bg-cyan-100 text-cyan-800 border border-cyan-300',
          SERVED: 'bg-violet-100 text-violet-800 border border-violet-300',
          PAID: 'bg-emerald-100 text-emerald-800 border border-emerald-300',
        };
        const statusLabels = {
          PENDING: t('orders.pending'),
          IN_PROGRESS: t('orders.inProgress'),
          SERVED: t('orders.served'),
          PAID: t('orders.paid'),
        };
        const status = params.row.status as keyof typeof statusColors;
        return (
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[status]}`}
          >
            {statusLabels[status]}
          </span>
        );
      },
    },
    {
      field: 'createdAt',
      headerName: t('ordersPage.time'),
      width: 180,
      valueFormatter: (value) =>
        new Date(value).toLocaleString(locale === 'fr' ? 'fr-FR' : 'en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
    },
    {
      field: 'actions',
      headerName: t('ordersPage.actions'),
      width: 150,
      renderCell: () => (
        <div className="flex items-center gap-2">
          <button className="p-1 text-primary hover:bg-primary-50 rounded">
            <Eye size={16} />
          </button>
          <button className="p-1 text-green-500 hover:bg-green-50 rounded">
            <CheckCircle size={16} />
          </button>
        </div>
      ),
    },
  ];

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.tableId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary">{t('ordersPage.title')}</h1>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
            <input
              type="text"
              placeholder={t('ordersPage.searchOrders')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-text-muted" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'ALL')}
              className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="ALL">{t('ordersPage.allStatus')}</option>
              <option value="PENDING">{t('orders.pending')}</option>
              <option value="IN_PROGRESS">{t('orders.inProgress')}</option>
              <option value="SERVED">{t('orders.served')}</option>
              <option value="PAID">{t('orders.paid')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-sm text-text-muted mb-1">{t('ordersPage.totalOrders')}</p>
              <p className="text-xl font-bold text-primary break-words">{orders.length}</p>
            </div>
            <div className="p-3 bg-primary-50 rounded-lg flex-shrink-0 ml-2">
              <GrDeliver size={32} className="text-primary" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-sm text-text-muted mb-1">{t('ordersPage.pending')}</p>
              <p className="text-xl font-bold text-yellow-600 break-words">
                {orders.filter((o) => o.status === 'PENDING').length}
              </p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg flex-shrink-0 ml-2">
              <MdAccessTime size={32} className="text-yellow-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-sm text-text-muted mb-1">{t('ordersPage.inProgress')}</p>
              <p className="text-xl font-bold text-blue-600 break-words">
                {orders.filter((o) => o.status === 'IN_PROGRESS').length}
              </p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg flex-shrink-0 ml-2">
              <HiArrowPath size={32} className="text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-sm text-text-muted mb-1">{t('ordersPage.completed')}</p>
              <p className="text-xl font-bold text-green-600 break-words">
                {orders.filter((o) => o.status === 'PAID').length}
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg flex-shrink-0 ml-2">
              <CheckCircle size={32} className="text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">All Orders</h3>
        <div style={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={filteredOrders}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10 },
              },
            }}
            pageSizeOptions={[5, 10, 25, 50]}
            checkboxSelection
            disableRowSelectionOnClick
            sx={{
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#E6F7F6',
                color: '#0F766E',
                fontWeight: 'bold',
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}

