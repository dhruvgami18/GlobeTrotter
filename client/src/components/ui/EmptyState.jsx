import React from 'react';
import { Sparkles, CalendarX2 } from 'lucide-react';
import Button from './Button';

export default function EmptyState({
  title = 'No items found',
  description = 'Get started by adding your first item.',
  icon: Icon = Sparkles,
  actionLabel,
  onAction,
  className = '',
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 ${className}`}
    >
      <div className="w-12 h-12 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600 mb-3.5 shadow-xs">
        <Icon className="w-6 h-6" />
      </div>
      <h4 className="text-base font-bold text-slate-800 tracking-tight">{title}</h4>
      <p className="mt-1 max-w-sm text-xs sm:text-sm text-slate-500">{description}</p>
      {actionLabel && onAction && (
        <div className="mt-4">
          <Button onClick={onAction} size="sm">
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
