import React from 'react';
import { Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AuthForm({
  title,
  subtitle,
  children,
  footer,
}) {
  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-8 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2 mb-4 group">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-sky-400 flex items-center justify-center text-white shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform">
            <Globe className="w-6 h-6 animate-pulse" />
          </div>
          <span className="text-2xl font-black tracking-tight text-slate-900">
            GlobeTrotter
          </span>
        </Link>
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1.5 text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
            {subtitle}
          </p>
        )}
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xl border border-slate-200/90 rounded-3xl">
          {children}
        </div>
        {footer && <div className="mt-6 text-center text-xs text-slate-500">{footer}</div>}
      </div>
    </div>
  );
}
