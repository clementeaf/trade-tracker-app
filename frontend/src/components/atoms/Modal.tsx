import React, { useEffect, useRef } from 'react';
import Button from './Button';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  widthClass?: string;
}

const Modal: React.FC<ModalProps> = ({ open, onClose, children, title, widthClass = 'max-w-md' }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && e.target === modalRef.current) {
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
      ref={modalRef}
      onClick={handleOverlayClick}
    >
      <div className={`bg-white rounded-lg shadow-lg p-8 w-full relative ${widthClass}`}>
        <Button
          variant="ghost"
          className="absolute top-3 right-3 text-gray-400 hover:text-black p-1 text-xl"
          onClick={onClose}
          aria-label="Cerrar"
        >
          ×
        </Button>
        {title && <h3 className="text-xl font-bold mb-6">{title}</h3>}
        {children}
      </div>
    </div>
  );
};

export default Modal; 