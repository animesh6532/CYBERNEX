import React from 'react';
import { CheckCircle2, X } from 'lucide-react';

interface ToastProps {
  message: string;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl glass-panel border border-sky-300 text-sky-950 shadow-xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 duration-300 max-w-md">
      <div className="p-1.5 rounded-full bg-emerald-100 text-emerald-700 shrink-0">
        <CheckCircle2 className="w-4 h-4" />
      </div>
      <div className="flex flex-col text-xs font-sans">
        <span className="font-bold text-[#0C4A6E]">Notification</span>
        <span className="text-sky-900 font-medium mt-0.5">{message}</span>
      </div>
      <button
        onClick={onClose}
        className="ml-auto p-1 rounded-lg hover:bg-sky-100 text-sky-600 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
