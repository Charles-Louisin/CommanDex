'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import { DeleteConfirmModal } from '@/components/shared/DeleteConfirmModal';
import { toast } from 'sonner';

// Mock categories data
const mockCategories = [
  { id: 'cat_001', name: 'Appetizers', description: 'Starters and appetizers', order: 1 },
  { id: 'cat_002', name: 'Main Courses', description: 'Main dishes', order: 2 },
  { id: 'cat_003', name: 'Desserts', description: 'Sweet treats', order: 3 },
  { id: 'cat_004', name: 'Beverages', description: 'Drinks and beverages', order: 4 },
];

export default function CategoriesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Category Name', width: 200, flex: 1 },
    { field: 'description', headerName: 'Description', width: 300, flex: 1 },
    { field: 'order', headerName: 'Order', width: 100 },
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
              setSelectedCategory(params.row);
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

  const filteredCategories = mockCategories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary">Categories Management</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
          <Plus size={20} />
          Add Category
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">All Categories</h3>
        <div style={{ height: 500, width: '100%' }}>
          <DataGrid
            rows={filteredCategories}
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

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedCategory(null);
        }}
        onConfirm={async () => {
          setIsDeleting(true);
          try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));
            toast.success(`Category "${selectedCategory?.name}" deleted successfully!`);
            setIsDeleteModalOpen(false);
            setSelectedCategory(null);
          } catch (error) {
            toast.error('Failed to delete category');
          } finally {
            setIsDeleting(false);
          }
        }}
        title="Delete Category"
        message="Are you sure you want to delete this category?"
        itemName={selectedCategory?.name}
        isLoading={isDeleting}
      />
    </div>
  );
}

