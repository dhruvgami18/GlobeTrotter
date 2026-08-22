import React from 'react';

export default function PageHeader({
  title,
  subtitle,
  children,
  badge,
  breadcrumbs,
}) {
  return (
    <div className="mb-8">
      {breadcrumbs && (
        <nav className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-2">
          {breadcrumbs}
        </nav>
      )}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {title}
            </h1>
            {badge}
          </div>
          {subtitle && (
            <p className="mt-1.5 text-sm text-slate-600 max-w-3xl leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
        {children && (
          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
