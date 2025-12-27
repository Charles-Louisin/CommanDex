'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Search, Plus, Edit, Trash2, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { DeleteConfirmModal } from '@/components/shared/DeleteConfirmModal';
import { toast } from 'sonner';
import { formatPriceWithCurrency } from '@/lib/utils';

// Mock products data
const mockProducts = [
  {
    id: 'prod_001',
    name: 'Caesar Salad',
    categoryId: 'cat_001',
    price: 3500,
    available: true,
    stock: 15,
    imageUrl: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop',
  },
  {
    id: 'prod_002',
    name: 'Grilled Chicken',
    categoryId: 'cat_002',
    price: 8500,
    available: true,
    stock: 8,
    imageUrl: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=400&h=300&fit=crop',
  },
  {
    id: 'prod_003',
    name: 'Chocolate Cake',
    categoryId: 'cat_003',
    price: 4000,
    available: true,
    stock: 12,
    imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop',
  },
];

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const columns: GridColDef[] = [
    {
      field: 'image',
      headerName: 'Image',
      width: 100,
      renderCell: (params) => (
        <div className="flex items-center h-full py-2">
          <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
            {params.row.imageUrl ? (
              <Image
                src={params.row.imageUrl}
                alt={params.row.name}
                fill
                sizes="64px"
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ImageIcon size={24} className="text-gray-400" />
              </div>
            )}
          </div>
        </div>
      ),
    },
    { field: 'name', headerName: 'Product Name', width: 200, flex: 1 },
    { field: 'categoryId', headerName: 'Category', width: 150 },
    {
      field: 'price',
      headerName: 'Price',
      width: 120,
      valueFormatter: (value) => formatPriceWithCurrency(value),
    },
    {
      field: 'stock',
      headerName: 'Stock',
      width: 100,
    },
    {
      field: 'available',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            params.row.available
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {params.row.available ? 'Available' : 'Unavailable'}
        </span>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <div className="flex items-center gap-2">
          <button className="p-1 text-primary hover:bg-primary-50 rounded">
            <Edit size={16} />
          </button>
          <button
            onClick={() => {
              setSelectedProduct(params.row);
              setIsDeleteModalOpen(true);
            }}
            className="p-1 text-red-500 hover:bg-red-50 rounded"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  const filteredProducts = mockProducts.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary">Products Management</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
          <Plus size={20} />
          Add Product
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">All Products</h3>
        <div style={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={filteredProducts}
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
              '& .MuiDataGrid-cell': {
                paddingTop: '12px',
                paddingBottom: '12px',
              },
            }}
          />
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedProduct(null);
        }}
        onConfirm={async () => {
          setIsDeleting(true);
          try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));
            toast.success(`Product "${selectedProduct?.name}" deleted successfully!`);
            setIsDeleteModalOpen(false);
            setSelectedProduct(null);
          } catch (error) {
            toast.error('Failed to delete product');
          } finally {
            setIsDeleting(false);
          }
        }}
        title="Delete Product"
        message="Are you sure you want to delete this product?"
        itemName={selectedProduct?.name}
        isLoading={isDeleting}
      />
    </div>
  );
}

