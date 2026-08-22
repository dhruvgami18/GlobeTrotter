import React from 'react';

export default function AdminStatCard({
  title,
  value,
  subtext,
  icon: Icon,
  colorScheme = 'brand',
}) {
  const SCHEMES = {
    brand: {
      bg: 'bg-brand-50',
      text: 'text-brand-600',
      border: 'border-slate-200',
    },
    sky: {
      bg: 'bg-sky-50',
      text: 'text-sky-600',
      border: 'border-slate-200',
    },
    emerald: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-600',
      border: 'border-slate-200',
    },
    amber: {
      bg: 'bg-amber-50',
      text: 'text-amber-600',
      border: 'border-slate-200',
    },
    purple: {
      bg: 'bg-purple-50',
      text: 'text-purple-600',
      border: 'border-slate-200',
    },
  };

  const scheme = SCHEMES[colorScheme] || SCHEMES.brand;

  return (
    <div
      className={`bg-white rounded-3xl border ${scheme.border} p-6 shadow-xs transition-all hover:shadow-md flex flex-col justify-between`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
          {title}
        </span>
        <div
          className={`w-10 h-10 rounded-2xl ${scheme.bg} ${scheme.text} flex items-center justify-center`}
        >
          {Icon && <Icon className="w-5 h-5" />}
        </div>
      </div>

      <div className="mt-4">
        <span className="text-3xl font-black text-slate-900 tracking-tight block">
          {value !== undefined ? value : '—'}
        </span>
        {subtext && (
          <span className="text-xs text-slate-400 mt-1 block font-medium">
            {subtext}
          </span>
        )}
      </div>
    </div>
  );
}
