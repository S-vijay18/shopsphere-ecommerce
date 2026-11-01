import React from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success', onClose }) => {
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-xl text-white transition-all transform animate-bounce-in ${
      type === 'success' ? 'bg-[#2e7d32]' : 'bg-[#d32f2f]'
    }`}>
      {type === 'success' ? <CheckCircle2 className="w-5 h-5 text-white flex-shrink-0" /> : <AlertCircle className="w-5 h-5 text-white flex-shrink-0" />}
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="p-1 hover:bg-black/20 rounded">
        <X className="w-4 h-4 text-white" />
      </button>
    </div>
  );
};

