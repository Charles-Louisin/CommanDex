/**
 * SlideableModal Usage Examples
 * 
 * This file shows how to use the SlideableModal component in your pages.
 */

'use client';

import { useState } from 'react';
import { SlideableModal } from './SlideableModal';
import { Plus, Edit } from 'lucide-react';

// Example 1: Basic Usage
export function BasicModalExample() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open Modal</button>
      
      <SlideableModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Basic Modal"
        size="md"
        from="right"
      >
        <p>This is the modal content</p>
      </SlideableModal>
    </>
  );
}

// Example 2: Form Modal
export function FormModalExample() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Add Item</button>
      
      <SlideableModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Add New Item"
        size="lg"
        from="right"
      >
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Enter name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              className="w-full px-4 py-2 border rounded-lg"
              rows={4}
              placeholder="Enter description"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex-1 px-4 py-2 border rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg"
            >
              Save
            </button>
          </div>
        </form>
      </SlideableModal>
    </>
  );
}

// Example 3: Different Sizes
export function SizeExamples() {
  const [smOpen, setSmOpen] = useState(false);
  const [mdOpen, setMdOpen] = useState(false);
  const [lgOpen, setLgOpen] = useState(false);
  const [xlOpen, setXlOpen] = useState(false);

  return (
    <>
      <div className="flex gap-2">
        <button onClick={() => setSmOpen(true)}>Small</button>
        <button onClick={() => setMdOpen(true)}>Medium</button>
        <button onClick={() => setLgOpen(true)}>Large</button>
        <button onClick={() => setXlOpen(true)}>Extra Large</button>
      </div>

      <SlideableModal
        isOpen={smOpen}
        onClose={() => setSmOpen(false)}
        title="Small Modal"
        size="sm"
        from="right"
      >
        <p>Small modal (400px)</p>
      </SlideableModal>

      <SlideableModal
        isOpen={mdOpen}
        onClose={() => setMdOpen(false)}
        title="Medium Modal"
        size="md"
        from="right"
      >
        <p>Medium modal (600px)</p>
      </SlideableModal>

      <SlideableModal
        isOpen={lgOpen}
        onClose={() => setLgOpen(false)}
        title="Large Modal"
        size="lg"
        from="right"
      >
        <p>Large modal (800px)</p>
      </SlideableModal>

      <SlideableModal
        isOpen={xlOpen}
        onClose={() => setXlOpen(false)}
        title="Extra Large Modal"
        size="xl"
        from="right"
      >
        <p>Extra large modal (1000px)</p>
      </SlideableModal>
    </>
  );
}

// Example 4: Different Directions
export function DirectionExamples() {
  const [leftOpen, setLeftOpen] = useState(false);
  const [rightOpen, setRightOpen] = useState(false);
  const [bottomOpen, setBottomOpen] = useState(false);

  return (
    <>
      <div className="flex gap-2">
        <button onClick={() => setLeftOpen(true)}>From Left</button>
        <button onClick={() => setRightOpen(true)}>From Right</button>
        <button onClick={() => setBottomOpen(true)}>From Bottom</button>
      </div>

      <SlideableModal
        isOpen={leftOpen}
        onClose={() => setLeftOpen(false)}
        title="Left Modal"
        size="md"
        from="left"
      >
        <p>Slides in from the left</p>
      </SlideableModal>

      <SlideableModal
        isOpen={rightOpen}
        onClose={() => setRightOpen(false)}
        title="Right Modal"
        size="md"
        from="right"
      >
        <p>Slides in from the right</p>
      </SlideableModal>

      <SlideableModal
        isOpen={bottomOpen}
        onClose={() => setBottomOpen(false)}
        title="Bottom Modal"
        size="md"
        from="bottom"
      >
        <p>Slides in from the bottom</p>
      </SlideableModal>
    </>
  );
}

/**
 * Props:
 * - isOpen: boolean - Controls modal visibility
 * - onClose: () => void - Function to close the modal
 * - title: string - Modal title displayed in header
 * - children: ReactNode - Modal content
 * - size?: 'sm' | 'md' | 'lg' | 'xl' | 'full' - Modal width (default: 'md')
 * - from?: 'left' | 'right' | 'bottom' - Slide direction (default: 'right')
 * - className?: string - Additional CSS classes
 */

