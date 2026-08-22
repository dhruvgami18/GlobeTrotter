import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import Button from './Button';

export default function ErrorState({
  title = 'Something went wrong',
  description = 'We encountered an issue processing your request. Please try again.',
  actionLabel = 'Try Again',
  onAction,
  className = '',
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 border border-rose-200 rounded-2xl bg-rose-50/50 ${className}`}
    >
      <div className="w-12 h-12 rounded-2xl bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-600 mb-3.5 shadow-xs">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <h4 className="text-base font-bold text-slate-900 tracking-tight">{title}</h4>
      <p className="mt-1 max-w-sm text-xs sm:text-sm text-slate-600 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <div className="mt-4">
          <Button onClick={onAction} size="sm" variant="outline" icon={RotateCcw}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
