import React from 'react';
import { X, AlertCircle, HelpCircle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface WindowsDialogProps {
  isOpen: boolean;
  type: 'confirm' | 'error' | 'info';
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

export default function WindowsDialog({
  isOpen,
  type,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'OK',
  cancelText = 'Cancelar'
}: WindowsDialogProps) {
  const getIcon = () => {
    switch (type) {
      case 'confirm':
        return <HelpCircle size={32} className="text-blue-500" />;
      case 'error':
        return <AlertCircle size={32} className="text-red-500" />;
      case 'info':
        return <Info size={32} className="text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-[400px] bg-[#f3f3f3] rounded-lg shadow-2xl border border-gray-300 flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Title Bar */}
            <div className="flex items-center justify-between px-3 py-2 bg-white border-b border-gray-200">
              <span className="text-xs text-gray-700 font-medium select-none">{title}</span>
              <button 
                onClick={onCancel}
                className="p-1 hover:bg-red-500 hover:text-white rounded transition-colors"
                aria-label="Fecar"
              >
                <X size={14} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 flex gap-4 bg-[#f3f3f3]">
              <div className="shrink-0">
                {getIcon()}
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-sm text-gray-800 leading-tight select-none">
                  {message}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-4 bg-[#e5e5e5] flex justify-end gap-2 border-t border-gray-200">
              <button
                onClick={onConfirm}
                className="min-w-[80px] px-4 py-1.5 bg-[#0067c0] hover:bg-[#005ba1] text-white text-xs rounded transition-colors font-medium border border-transparent shadow-sm active:scale-95"
              >
                {confirmText}
              </button>
              
              {type === 'confirm' && (
                <button
                  onClick={onCancel}
                  className="min-w-[80px] px-4 py-1.5 bg-white hover:bg-gray-100 text-gray-800 text-xs rounded transition-colors font-medium border border-gray-300 shadow-sm active:scale-95"
                >
                  {cancelText}
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
