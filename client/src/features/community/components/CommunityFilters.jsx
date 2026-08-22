import React from 'react';
import {
  Search,
  SlidersHorizontal,
  Globe,
  DollarSign,
  Calendar,
  X,
} from 'lucide-react';

export default function CommunityFilters({
  search,
  setSearch,
  country,
  setCountry,
  maxBudget,
  setMaxBudget,
  maxDays,
  setMaxDays,
  sortBy,
  setSortBy,
  onReset,
}) {
  const hasActiveFilters = Boolean(
    search || country || maxBudget || maxDays || sortBy !== 'newest'
  );

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4 mb-8">
      {/* Top Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search by trip name, destination city (e.g. Tokyo, Paris), or country..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-2xl text-xs sm:text-sm bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 transition-all"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-lg text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filter Controls Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Country filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-none"
            >
              <option value="">All Countries</option>
              <option value="Japan">Japan</option>
              <option value="France">France</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Italy">Italy</option>
            </select>
          </div>

          {/* Max Budget filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
            <DollarSign className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={maxBudget}
              onChange={(e) => setMaxBudget(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-none"
            >
              <option value="">Any Budget</option>
              <option value="1500">Under $1,500</option>
              <option value="3000">Under $3,000</option>
              <option value="5000">Under $5,000</option>
              <option value="10000">Under $10,000</option>
            </select>
          </div>

          {/* Max Days filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={maxDays}
              onChange={(e) => setMaxDays(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-none"
            >
              <option value="">Any Duration</option>
              <option value="5">Up to 5 Days</option>
              <option value="7">Up to 7 Days</option>
              <option value="10">Up to 10 Days</option>
              <option value="14">Up to 14 Days</option>
            </select>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onReset}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none"
          >
            <option value="newest">Newest First</option>
            <option value="popular">Most Popular</option>
            <option value="lowest_budget">Lowest Budget</option>
            <option value="highest_budget">Highest Budget</option>
          </select>
        </div>
      </div>
    </div>
  );
}
