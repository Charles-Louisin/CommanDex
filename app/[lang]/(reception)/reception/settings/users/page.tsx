'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Search, Plus, Edit, Trash2, UserPlus, Shield } from 'lucide-react';
import { DeleteConfirmModal } from '@/components/shared/DeleteConfirmModal';
import { toast } from 'sonner';

// Mock users data
const mockUsers = [
  {
    id: 'user_001',
    name: 'John Doe',
    email: 'john@commandex.com',
    role: 'Admin',
    status: 'Active',
  },
  {
    id: 'user_002',
    name: 'Jane Smith',
    email: 'jane@commandex.com',
    role: 'Manager',
    status: 'Active',
  },
  {
    id: 'user_003',
    name: 'Bob Johnson',
    email: 'bob@commandex.com',
    role: 'Staff',
    status: 'Inactive',
  },
];

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', width: 200, flex: 1 },
    { field: 'email', headerName: 'Email', width: 250, flex: 1 },
    {
      field: 'role',
      headerName: 'Role',
      width: 150,
      renderCell: (params) => (
        <span className="px-3 py-1 bg-primary-100 text-primary rounded-full text-xs font-medium flex items-center gap-1">
          <Shield size={12} />
          {params.row.role}
        </span>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            params.row.status === 'Active'
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          {params.row.status}
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
              setSelectedUser(params.row);
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

  const filteredUsers = mockUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary">Users Management</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
          <UserPlus size={20} />
          Add User
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">All Users</h3>
        <div style={{ height: 500, width: '100%' }}>
          <DataGrid
            rows={filteredUsers}
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
          setSelectedUser(null);
        }}
        onConfirm={async () => {
          setIsDeleting(true);
          try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));
            toast.success(`User "${selectedUser?.name}" deleted successfully!`);
            setIsDeleteModalOpen(false);
            setSelectedUser(null);
          } catch (error) {
            toast.error('Failed to delete user');
          } finally {
            setIsDeleting(false);
          }
        }}
        title="Delete User"
        message="Are you sure you want to delete this user?"
        itemName={selectedUser?.name}
        isLoading={isDeleting}
      />
    </div>
  );
}

