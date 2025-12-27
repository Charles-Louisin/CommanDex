'use client';

export const dynamic = 'force-dynamic';

import dynamicImport from 'next/dynamic';
import { useAllOrders } from '@/hooks/useOrders';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import {
  Clock,
  CheckCircle,
  TrendingUp,
} from 'lucide-react';
import { GrDeliver } from 'react-icons/gr';
import { GiMoneyStack } from 'react-icons/gi';
import { formatPriceWithCurrency } from '@/lib/utils';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
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
const PieChart = dynamicImport(() => import('recharts').then((mod) => mod.PieChart), { ssr: false });
const Pie = dynamicImport(() => import('recharts').then((mod) => mod.Pie), { ssr: false });
const Cell = dynamicImport(() => import('recharts').then((mod) => mod.Cell), { ssr: false });

// Colors matching the status badge colors for consistency
// Using vibrant colors: Amber (yellow), Cyan (blue), Violet (purple), Emerald (green)
const STATUS_COLORS: Record<string, string> = {
  'Pending': '#F59E0B',      // Amber-500 (yellow/orange) - matches badge theme
  'In Progress': '#06B6D4',  // Cyan-500 (blue) - matches badge theme
  'Served': '#8B5CF6',       // Violet-500 (purple) - matches badge theme
  'Paid': '#10B981',         // Emerald-500 (green) - matches badge theme
};

export default function DashboardPage() {
  const { t, locale } = useTranslations();
  const { data: orders = [], isLoading } = useAllOrders('rest_001');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Calculate statistics
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const pendingOrders = orders.filter((o) => o.status === 'PENDING').length;
  const completedOrders = orders.filter((o) => o.status === 'PAID').length;

  // Chart data - using translated names for display
  const statusData = [
    { name: t('orders.pending'), value: orders.filter((o) => o.status === 'PENDING').length, key: 'Pending' },
    { name: t('orders.inProgress'), value: orders.filter((o) => o.status === 'IN_PROGRESS').length, key: 'In Progress' },
    { name: t('orders.served'), value: orders.filter((o) => o.status === 'SERVED').length, key: 'Served' },
    { name: t('orders.paid'), value: orders.filter((o) => o.status === 'PAID').length, key: 'Paid' },
  ];

  const revenueData = [
    { name: 'Mon', revenue: 45000 },
    { name: 'Tue', revenue: 52000 },
    { name: 'Wed', revenue: 48000 },
    { name: 'Thu', revenue: 61000 },
    { name: 'Fri', revenue: 75000 },
    { name: 'Sat', revenue: 89000 },
    { name: 'Sun', revenue: 67000 },
  ];

  // Table columns
  const columns: GridColDef[] = [
    { field: 'id', headerName: t('dashboard.orderId'), width: 150 },
    { field: 'tableId', headerName: t('dashboard.table'), width: 100 },
    {
      field: 'items',
      headerName: t('dashboard.items'),
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
      width: 130,
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
      headerName: t('dashboard.time'),
      width: 180,
      valueFormatter: (value) =>
        new Date(value).toLocaleString(locale === 'fr' ? 'fr-FR' : 'en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-primary">{t('dashboard.title')}</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-sm text-text-muted mb-1">{t('dashboard.totalOrders')}</p>
              <p className="text-xl font-bold text-primary break-words">{totalOrders}</p>
            </div>
            <div className="p-3 bg-primary-50 rounded-lg flex-shrink-0 ml-2">
              <GrDeliver size={32} className="text-primary" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-4 text-sm text-green-600">
            <TrendingUp size={16} />
            <span>+12% {t('dashboard.fromLastWeek')}</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-sm text-text-muted mb-1">{t('dashboard.revenue')}</p>
              <p className="text-xl font-bold text-primary break-words leading-tight">{formatPriceWithCurrency(totalRevenue)}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg flex-shrink-0 ml-2">
              <GiMoneyStack size={32} className="text-green-600" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-4 text-sm text-green-600">
            <TrendingUp size={16} />
            <span>+18% {t('dashboard.fromLastWeek')}</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-sm text-text-muted mb-1">{t('dashboard.pending')}</p>
              <p className="text-xl font-bold text-yellow-600 break-words">{pendingOrders}</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg flex-shrink-0 ml-2">
              <Clock size={32} className="text-yellow-600" />
            </div>
          </div>
          <p className="text-sm text-text-muted mt-4">{t('dashboard.awaitingPreparation')}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-sm text-text-muted mb-1">{t('dashboard.completed')}</p>
              <p className="text-xl font-bold text-green-600 break-words">{completedOrders}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg flex-shrink-0 ml-2">
              <CheckCircle size={32} className="text-green-600" />
            </div>
          </div>
          <p className="text-sm text-text-muted mt-4">{t('dashboard.successfullyServed')}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">{t('dashboard.weeklyRevenue')}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#0F766E" name={`${t('dashboard.revenue')} (FCFA)`} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Order Status Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">{t('dashboard.orderStatus')}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: ${entry.value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={STATUS_COLORS[entry.key] || '#94A3B8'} 
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">{t('dashboard.recentOrders')}</h3>
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={orders}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 5 },
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

