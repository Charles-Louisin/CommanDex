'use client';

export const dynamic = 'force-dynamic';

import dynamicImport from 'next/dynamic';
import { useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Search, Filter, CheckCircle, XCircle } from 'lucide-react';
import { GiMoneyStack, GiReceiveMoney } from 'react-icons/gi';
import { GrMoney } from 'react-icons/gr';
import { MdAccessTime } from 'react-icons/md';
import { formatPriceWithCurrency } from '@/lib/utils';
import { useTranslations } from '@/hooks/useTranslations';

// Dynamically import Recharts to avoid webpack chunk issues
const BarChart = dynamicImport(
  () => import('recharts').then((mod) => mod.BarChart),
  { ssr: false }
);
const Bar = dynamicImport(() => import('recharts').then((mod) => mod.Bar), { ssr: false });
const XAxis = dynamicImport(() => import('recharts').then((mod) => mod.XAxis), { ssr: false });
const YAxis = dynamicImport(() => import('recharts').then((mod) => mod.YAxis), { ssr: false });
const CartesianGrid = dynamicImport(
  () => import('recharts').then((mod) => mod.CartesianGrid),
  { ssr: false }
);
const Tooltip = dynamicImport(() => import('recharts').then((mod) => mod.Tooltip), { ssr: false });
const Legend = dynamicImport(() => import('recharts').then((mod) => mod.Legend), { ssr: false });
const ResponsiveContainer = dynamicImport(
  () => import('recharts').then((mod) => mod.ResponsiveContainer),
  { ssr: false }
);

// Mock payment data
const mockPayments = [
  {
    id: 'pay_001',
    orderId: 'order_001',
    method: 'ONLINE',
    amount: 8500,
    status: 'PAID',
    createdAt: new Date('2024-01-15T10:30:00').toISOString(),
  },
  {
    id: 'pay_002',
    orderId: 'order_002',
    method: 'USSD',
    amount: 3500,
    status: 'PAID',
    createdAt: new Date('2024-01-15T11:15:00').toISOString(),
  },
  {
    id: 'pay_003',
    orderId: 'order_003',
    method: 'ONLINE',
    amount: 12000,
    status: 'PENDING',
    createdAt: new Date('2024-01-15T12:00:00').toISOString(),
  },
  {
    id: 'pay_004',
    orderId: 'order_004',
    method: 'USSD',
    amount: 4000,
    status: 'FAILED',
    createdAt: new Date('2024-01-15T12:30:00').toISOString(),
  },
  {
    id: 'pay_005',
    orderId: 'order_005',
    method: 'ONLINE',
    amount: 5000,
    status: 'PAID',
    createdAt: new Date('2024-01-15T13:00:00').toISOString(),
  },
];

const paymentChartData = [
  { name: 'Mon', online: 45000, ussd: 25000 },
  { name: 'Tue', online: 52000, ussd: 30000 },
  { name: 'Wed', online: 48000, ussd: 28000 },
  { name: 'Thu', online: 61000, ussd: 35000 },
  { name: 'Fri', online: 75000, ussd: 40000 },
  { name: 'Sat', online: 89000, ussd: 45000 },
  { name: 'Sun', online: 67000, ussd: 38000 },
];

export default function PaymentsPage() {
  const { t, locale } = useTranslations();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const columns: GridColDef[] = [
    { field: 'id', headerName: t('paymentsPage.paymentId'), width: 150 },
    { field: 'orderId', headerName: t('paymentsPage.orderId'), width: 150 },
    {
      field: 'method',
      headerName: t('paymentsPage.method'),
      width: 120,
      renderCell: (params) => (
        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
          {params.row.method === 'ONLINE' ? t('paymentsPage.online') : t('paymentsPage.ussd')}
        </span>
      ),
    },
    {
      field: 'amount',
      headerName: t('paymentsPage.amount'),
      width: 120,
      valueFormatter: (value) => formatPriceWithCurrency(value),
    },
    {
      field: 'status',
      headerName: t('common.status'),
      width: 130,
      renderCell: (params) => {
        const statusColors = {
          PENDING: 'bg-yellow-100 text-yellow-700',
          PAID: 'bg-green-100 text-green-700',
          FAILED: 'bg-red-100 text-red-700',
        };
        const statusLabels = {
          PENDING: t('paymentsPage.pending'),
          PAID: t('paymentsPage.paid'),
          FAILED: t('payment.failed'),
        };
        const status = params.row.status as keyof typeof statusColors;
        return (
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}
          >
            {statusLabels[status]}
          </span>
        );
      },
    },
    {
      field: 'createdAt',
      headerName: t('paymentsPage.date'),
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
      headerName: t('paymentsPage.actions'),
      width: 150,
      renderCell: (params) => (
        <div className="flex items-center gap-2">
          {params.row.status === 'PENDING' && (
            <button className="p-1 text-green-500 hover:bg-green-50 rounded">
              <CheckCircle size={16} />
            </button>
          )}
          {params.row.status === 'FAILED' && (
            <button className="p-1 text-red-500 hover:bg-red-50 rounded">
              <XCircle size={16} />
            </button>
          )}
        </div>
      ),
    },
  ];

  const filteredPayments = mockPayments.filter((payment) => {
    const matchesSearch =
      payment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.orderId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = mockPayments
    .filter((p) => p.status === 'PAID')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary">{t('paymentsPage.title')}</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-sm text-text-muted mb-1">{t('paymentsPage.totalRevenue')}</p>
              <p className="text-xl font-bold text-primary break-words leading-tight">{formatPriceWithCurrency(totalRevenue)}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg flex-shrink-0 ml-2">
              <GiMoneyStack size={32} className="text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-sm text-text-muted mb-1">{t('paymentsPage.totalPayments')}</p>
              <p className="text-xl font-bold text-primary break-words">{mockPayments.length}</p>
            </div>
            <div className="p-3 bg-primary-50 rounded-lg flex-shrink-0 ml-2">
              <GrMoney size={32} className="text-primary" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-sm text-text-muted mb-1">{t('paymentsPage.paid')}</p>
              <p className="text-xl font-bold text-green-600 break-words">
                {mockPayments.filter((p) => p.status === 'PAID').length}
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg flex-shrink-0 ml-2">
              <GiReceiveMoney size={32} className="text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-sm text-text-muted mb-1">{t('paymentsPage.pending')}</p>
              <p className="text-xl font-bold text-yellow-600 break-words">
                {mockPayments.filter((p) => p.status === 'PENDING').length}
              </p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg flex-shrink-0 ml-2">
              <MdAccessTime size={32} className="text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">{t('paymentsPage.paymentMethods')} (Weekly)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={paymentChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="online" fill="#0F766E" name={`${t('paymentsPage.online')} (FCFA)`} />
            <Bar dataKey="ussd" fill="#14B8A6" name={`${t('paymentsPage.ussd')} (FCFA)`} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
            <input
              type="text"
              placeholder={t('paymentsPage.searchPayments')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-text-muted" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="ALL">{t('paymentsPage.allStatus')}</option>
              <option value="PENDING">{t('paymentsPage.pending')}</option>
              <option value="PAID">{t('paymentsPage.paid')}</option>
              <option value="FAILED">{t('payment.failed')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">{t('common.all')} {t('common.payments')}</h3>
        <div style={{ height: 500, width: '100%' }}>
          <DataGrid
            rows={filteredPayments}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10 },
              },
            }}
            pageSizeOptions={[5, 10, 25]}
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

