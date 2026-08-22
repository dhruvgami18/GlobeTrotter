import React from 'react';
import { Search, Filter, RotateCcw, SlidersHorizontal } from 'lucide-react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

const categories = [
  { value: 'ALL', label: 'All Categories' },
  { value: 'SIGHTSEEING', label: 'Sightseeing' },
  { value: 'FOOD', label: 'Food & Dining' },
  { value: 'CULTURE', label: 'Culture & Heritage' },
  { value: 'ADVENTURE', label: 'Adventure & Fun' },
  { value: 'SHOPPING', label: 'Shopping' },
  { value: 'NIGHTLIFE', label: 'Nightlife' },
  { value: 'NATURE', label: 'Nature & Parks' },
];

const sortOptions = [
  { value: 'rating_desc', label: 'Highest Rated' },
  { value: 'cost_asc', label: 'Cost: Low to High' },
  { value: 'cost_desc', label: 'Cost: High to Low' },
  { value: 'duration_asc', label: 'Shortest Duration' },
  { value: 'duration_desc', label: 'Longest Duration' },
  { value: 'name_asc', label: 'Alphabetical (A-Z)' },
];

export default function ActivityFilters({
  filters,
  onChange,
  onReset,
  cities = [],
  lockCity = false,
}) {
  return (
    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs mb-6 space-y-4">
      {/* Top Search Bar & Sort */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        {/* Search keyword input */}
        <div className="md:col-span-6 lg:col-span-7">
          <Input
            placeholder="Search activities, temples, food tours..."
            value={filters.search || ''}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            icon={Search}
          />
        </div>

        {/* City Filter (if not locked to a specific city) */}
        {!lockCity && (
          <div className="md:col-span-3 lg:col-span-3">
            <Select
              value={filters.cityId || ''}
              onChange={(e) => onChange({ ...filters, cityId: e.target.value })}
            >
              <option value="">All Cities</option>
              {cities.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}, {c.country}
                </option>
              ))}
            </Select>
          </div>
        )}

        {/* Sort Order */}
        <div className={`md:col-span-3 ${lockCity ? 'lg:col-span-5' : 'lg:col-span-2'}`}>
          <Select
            value={filters.sortBy || 'rating_desc'}
            onChange={(e) => onChange({ ...filters, sortBy: e.target.value })}
            options={sortOptions}
          />
        </div>
      </div>

      {/* Category Pills & Sliders */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-3 border-t border-slate-100">
        {/* Category Pills scrollable */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 lg:pb-0 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = (filters.category || 'ALL') === cat.value;
            return (
              <button
                key={cat.value}
                type="button"
                onClick={() => onChange({ ...filters, category: cat.value })}
                className={`whitespace-nowrap px-3 py-1 rounded-full text-xs font-semibold transition-colors border ${
                  isSelected
                    ? 'bg-brand-600 border-brand-600 text-white shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Sliders & Reset */}
        <div className="flex items-center gap-3 shrink-0 flex-wrap sm:flex-nowrap">
          {/* Max Cost Input */}
          <div className="flex items-center gap-2 text-xs font-medium text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
            <span>Max Cost:</span>
            <input
              type="range"
              min="0"
              max="200"
              step="5"
              value={filters.maxCost || 200}
              onChange={(e) => onChange({ ...filters, maxCost: Number(e.target.value) })}
              className="w-20 sm:w-24 accent-brand-600 cursor-pointer"
            />
            <span className="font-bold text-slate-800 min-w-8 text-right">
              ${filters.maxCost || 200}
            </span>
          </div>

          {/* Reset Filters */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            icon={RotateCcw}
            className="text-xs text-slate-500 hover:text-slate-800"
          >
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}
