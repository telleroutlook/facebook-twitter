import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  removeToast: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, removeToast }) => {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={() => removeToast(toast.id)} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; onRemove: () => void }> = ({ toast, onRemove }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onRemove]);

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-400" />,
    error: <AlertCircle className="w-5 h-5 text-red-400" />,
    info: <Info className="w-5 h-5 text-blue-400" />
  };

  const bgs = {
    success: 'bg-slate-900 border-green-500/20',
    error: 'bg-slate-900 border-red-500/20',
    info: 'bg-slate-900 border-blue-500/20'
  };

  return (
    <div className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border shadow-xl shadow-black/50 backdrop-blur-md transition-all animate-in slide-in-from-bottom-5 fade-in ${bgs[toast.type]} min-w-[300px]`}>
      {icons[toast.type]}
      <p className="text-sm font-medium text-slate-200 flex-1">{toast.message}</p>
      <button onClick={onRemove} className="text-slate-500 hover:text-slate-300">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};