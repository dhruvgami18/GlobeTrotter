import React from 'react';
import { Search, RotateCcw, Globe2, SlidersHorizontal } from 'lucide-react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

export default function CityFilters({
  filters,
  onChange,
  onReset,
  countries = [],
}) {
  return (
    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs mb-6 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        {/* Keyword Search */}
        <div className="md:col-span-6 lg:col-span-7">
          <Input
            placeholder="Search cities, countries, or regions (Tokyo, France, Kyoto...)"
            value={filters.search || ''}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            icon={Search}
          />
        </div>

        {/* Country Filter */}
        <div className="md:col-span-3 lg:col-span-3">
          <Select
            value={filters.country || ''}
            onChange={(e) => onChange({ ...filters, country: e.target.value })}
          >
            <option value="">All Countries</option>
            {countries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </div>

        {/* Reset */}
        <div className="md:col-span-3 lg:col-span-2 flex items-center justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            icon={RotateCcw}
            className="w-full text-xs text-slate-500 hover:text-slate-800"
          >
            Reset Filters
          </Button>
        </div>
      </div>
    </div>
  );
}
