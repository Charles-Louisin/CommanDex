'use client';

import { SlideableModal } from './SlideableModal';
import { AlertTriangle, X } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  itemName?: string;
  isLoading?: boolean;
}

export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  itemName,
  isLoading = false,
}: DeleteConfirmModalProps) {
  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <SlideableModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      from="right"
    >
      <div className="space-y-6">
        {/* Warning Icon */}
        <div className="flex justify-center">
          <div className="p-4 bg-red-50 rounded-full">
            <AlertTriangle size={48} className="text-red-500" />
          </div>
        </div>

        {/* Message */}
        <div className="text-center">
          <p className="text-text-primary font-medium mb-2">{message}</p>
          {itemName && (
            <p className="text-primary font-semibold text-lg">{itemName}</p>
          )}
          <p className="text-sm text-text-muted mt-2">
            This action cannot be undone.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-2 border-2 border-border text-text-primary rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isLoading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </SlideableModal>
  );
}

