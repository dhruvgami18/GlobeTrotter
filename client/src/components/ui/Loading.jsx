import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Loading({
  text = 'Loading details...',
  fullScreen = false,
}) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-3 p-8">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-brand-100 border-t-brand-600 animate-spin" />
        <Loader2 className="w-5 h-5 text-brand-600 absolute inset-0 m-auto animate-pulse" />
      </div>
      {text && <p className="text-sm font-medium text-slate-500 animate-pulse">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 backdrop-blur-xs">
        <div className="rounded-2xl bg-white p-6 shadow-xl border border-slate-100">
          {content}
        </div>
      </div>
    );
  }

  return content;
}
