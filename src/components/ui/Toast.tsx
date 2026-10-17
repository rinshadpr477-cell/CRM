'use client';

import React from 'react';
import { useProspects } from '@/context/ProspectContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export function ToastContainer() {
  const { toasts, removeToast } = useProspects();

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full px-4 sm:px-0"
    >
      {toasts.map((toast) => {
        let icon = <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />;
        let borderColor = 'border-emerald-200 bg-emerald-50/95 text-emerald-900';

        if (toast.type === 'error') {
          icon = <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />;
          borderColor = 'border-red-200 bg-red-50/95 text-red-900';
        } else if (toast.type === 'info') {
          icon = <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />;
          borderColor = 'border-blue-200 bg-blue-50/95 text-blue-900';
        }

        return (
          <div
            key={toast.id}
            role="alert"
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg shadow-slate-900/5 backdrop-blur-sm transition-all duration-200 animate-in fade-in slide-in-from-bottom-2 ${borderColor}`}
          >
            {icon}
            <div className="flex-1 text-sm font-medium leading-snug">{toast.message}</div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 p-1 -mr-1 -mt-1 rounded-lg transition-colors"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
