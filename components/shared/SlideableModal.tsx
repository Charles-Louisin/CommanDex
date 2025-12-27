'use client';

import { ReactNode } from 'react';
import SlidingPane from 'react-sliding-pane';
import 'react-sliding-pane/dist/react-sliding-pane.css';
import { X } from 'lucide-react';

interface SlideableModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  from?: 'left' | 'right' | 'bottom';
  className?: string;
}

const sizeMap = {
  sm: '400px',
  md: '600px',
  lg: '800px',
  xl: '1000px',
  full: '100%',
};

export function SlideableModal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  from = 'right',
  className = '',
}: SlideableModalProps) {
  return (
    <SlidingPane
      isOpen={isOpen}
      title={
        <div className="flex items-center justify-between pr-4">
          <h2 className="text-xl font-bold text-primary">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close"
          >
            <X size={24} className="text-text-muted" />
          </button>
        </div>
      }
      width={sizeMap[size]}
      onRequestClose={onClose}
      from={from}
      className={`slideable-modal ${className}`}
      overlayClassName="slideable-modal-overlay"
    >
      <div className="slideable-modal-content">{children}</div>
    </SlidingPane>
  );
}

