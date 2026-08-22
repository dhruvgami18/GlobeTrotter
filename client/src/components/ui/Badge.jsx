import React from 'react';
import {
  Compass,
  Utensils,
  Landmark,
  Zap,
  ShoppingBag,
  Moon,
  Trees,
  Tag,
} from 'lucide-react';

const categoryConfig = {
  SIGHTSEEING: {
    label: 'Sightseeing',
    bg: 'bg-purple-50 text-purple-700 border-purple-200/60',
    icon: Compass,
  },
  FOOD: {
    label: 'Food & Dining',
    bg: 'bg-rose-50 text-rose-700 border-rose-200/60',
    icon: Utensils,
  },
  CULTURE: {
    label: 'Culture & Heritage',
    bg: 'bg-amber-50 text-amber-700 border-amber-200/60',
    icon: Landmark,
  },
  ADVENTURE: {
    label: 'Adventure & Fun',
    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
    icon: Zap,
  },
  SHOPPING: {
    label: 'Shopping',
    bg: 'bg-blue-50 text-blue-700 border-blue-200/60',
    icon: ShoppingBag,
  },
  NIGHTLIFE: {
    label: 'Nightlife',
    bg: 'bg-indigo-50 text-indigo-700 border-indigo-200/60',
    icon: Moon,
  },
  NATURE: {
    label: 'Nature & Parks',
    bg: 'bg-teal-50 text-teal-700 border-teal-200/60',
    icon: Trees,
  },
};

export default function Badge({
  category,
  variant = 'default',
  children,
  className = '',
  size = 'sm',
}) {
  if (category) {
    const config = categoryConfig[category.toUpperCase()] || {
      label: category,
      bg: 'bg-slate-100 text-slate-700 border-slate-200',
      icon: Tag,
    };
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1 font-semibold rounded-full border px-2 py-0.5 text-xs ${config.bg} ${className}`}
      >
        <Icon className="w-3 h-3" />
        {children || config.label}
      </span>
    );
  }

  const defaultClasses = {
    default: 'bg-slate-100 text-slate-700 border-slate-200',
    brand: 'bg-brand-50 text-brand-700 border-brand-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border px-2.5 py-0.5 text-xs ${defaultClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
