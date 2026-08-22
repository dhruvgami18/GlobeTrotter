import React, { useState, useEffect, useCallback } from 'react';
import {
  Users,
  Compass,
  Globe,
  Sparkles,
  MapPin,
  TrendingUp,
  Search,
} from 'lucide-react';
import CommunityCard from '../components/CommunityCard';
import CommunityFilters from '../components/CommunityFilters';
import Loading from '../../../components/ui/Loading';
import EmptyState from '../../../components/ui/EmptyState';
import communityService from '../../../services/communityService';

export default function CommunityHub() {
  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter & Search states
  const [search, setSearch] = useState('');
  const [country, setCountry] = useState('');
  const [maxBudget, setMaxBudget] = useState('');
  const [maxDays, setMaxDays] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const loadTrips = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await communityService.getCommunityTrips({
        search,
        country,
        maxBudget,
        maxDays,
        sortBy,
      });
      setTrips(res.data || []);
    } catch (err) {
      console.error('Failed to load community trips:', err);
      setError(err.message || 'Failed to discover community itineraries.');
    } finally {
      setIsLoading(false);
    }
  }, [search, country, maxBudget, maxDays, sortBy]);

  useEffect(() => {
    // Debounce search slightly for responsive typing
    const timer = setTimeout(() => {
      loadTrips();
    }, 250);
    return () => clearTimeout(timer);
  }, [loadTrips]);

  const handleResetFilters = () => {
    setSearch('');
    setCountry('');
    setMaxBudget('');
    setMaxDays('');
    setSortBy('newest');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Community Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-brand-900 via-slate-900 to-sky-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-brand-500/20 text-brand-300 border border-brand-400/30 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Community Discovery Hub</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
            Explore & Clone Itineraries From Global Travelers
          </h1>
          <p className="mt-2 text-sm text-slate-300 leading-relaxed">
            Browse real travel schedules, verified budgets, and daily itineraries
            shared by our worldwide explorer community. Duplicate any trip to your
            personal dashboard with a single click.
          </p>
        </div>
      </div>

      {/* Search and Filters Toolbar */}
      <CommunityFilters
        search={search}
        setSearch={setSearch}
        country={country}
        setCountry={setCountry}
        maxBudget={maxBudget}
        setMaxBudget={setMaxBudget}
        maxDays={maxDays}
        setMaxDays={setMaxDays}
        sortBy={sortBy}
        setSortBy={setSortBy}
        onReset={handleResetFilters}
      />

      {/* Main Trips Grid */}
      {isLoading ? (
        <Loading text="Discovering verified itineraries from around the globe..." />
      ) : error ? (
        <EmptyState
          title="Could not load community itineraries"
          description={error}
          actionLabel="Try Again"
          onAction={loadTrips}
        />
      ) : trips.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-3xl border border-dashed border-slate-200">
          <Globe className="w-12 h-12 mx-auto stroke-1 mb-3 text-slate-300" />
          <h3 className="text-base font-bold text-slate-800">
            No public itineraries match your filters
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            Try adjusting your search criteria or reset filters to view all public
            trips shared by the community.
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="mt-4 px-4 py-2 rounded-xl text-xs font-bold bg-brand-50 text-brand-700 hover:bg-brand-100 transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Showing {trips.length} {trips.length === 1 ? 'Trip' : 'Trips'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => (
              <CommunityCard key={trip.id} trip={trip} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
