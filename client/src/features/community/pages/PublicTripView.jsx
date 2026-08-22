import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  Clock,
  Copy,
  Check,
  Share2,
  DollarSign,
  Compass,
  ArrowLeft,
  Sparkles,
  Plane,
  Hotel,
  UtensilsCrossed,
  Receipt,
  CheckCircle2,
  AlertCircle,
  Users,
} from 'lucide-react';
import Button from '../../../components/ui/Button';
import Loading from '../../../components/ui/Loading';
import EmptyState from '../../../components/ui/EmptyState';
import TripMap from '../../map/components/TripMap';
import { useAuth } from '../../../context/AuthContext';
import communityService from '../../../services/communityService';
import { formatShortDate } from '../../../utils/dateUtils';
import { formatCurrency } from '../../../utils/currencyUtils';

export default function PublicTripView() {
  const { shareToken } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [trip, setTrip] = useState(null);
  const [viewMode, setViewMode] = useState('itinerary'); // 'itinerary' | 'map'
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isCopying, setIsCopying] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const loadPublicTrip = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await communityService.getPublicTrip(shareToken);
      setTrip(res.data);
    } catch (err) {
      console.error('Failed to load public trip:', err);
      setError(err.message || 'Public trip not found or is set to private.');
    } finally {
      setIsLoading(false);
    }
  }, [shareToken]);

  useEffect(() => {
    loadPublicTrip();
  }, [loadPublicTrip]);

  // Handle Copy Trip (Deep clone to current user)
  const handleCloneTrip = async () => {
    if (!isAuthenticated) {
      // Prompt user to log in
      if (
        confirm(
          'You need to be logged in to copy this itinerary into your account. Would you like to log in now?'
        )
      ) {
        navigate('/login');
      }
      return;
    }

    setIsCopying(true);
    try {
      const res = await communityService.copyPublicTrip(shareToken);
      showNotification(`"${trip.title}" cloned into your trips! Redirecting...`);
      setTimeout(() => {
        if (res.data?.id) {
          navigate(`/trips/${res.data.id}/itinerary`);
        } else {
          navigate('/dashboard');
        }
      }, 1200);
    } catch (err) {
      console.error('Failed to copy trip:', err);
      alert(err.message || 'Failed to copy trip.');
    } finally {
      setIsCopying(false);
    }
  };

  // Handle Share / Copy Link
  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${trip.title} — GlobeTrotter`,
          text: `Check out this travel itinerary: ${trip.title}`,
          url,
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          handleCopyLink();
        }
      }
    } else {
      handleCopyLink();
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch (err) {
      prompt('Copy public trip URL:', window.location.href);
    }
  };

  if (isLoading) {
    return <Loading text="Loading public itinerary..." />;
  }

  if (error || !trip) {
    return (
      <EmptyState
        title="Public Trip Not Found"
        description={error || 'This trip is private or does not exist.'}
        actionLabel="Explore Community Hub"
        onAction={() => navigate('/community')}
      />
    );
  }

  const {
    title,
    description,
    startDate,
    endDate,
    budget = 0,
    coverImage,
    tripStops = [],
    itineraryItems = [],
    expenses = [],
    summary = {},
    user: creator,
  } = trip;

  const creatorName = creator
    ? `${creator.firstName || ''} ${creator.lastName || ''}`.trim() || 'Explorer'
    : 'GlobeTrotter Explorer';

  const avatarSrc =
    creator?.avatarUrl ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
      creator?.firstName || 'Traveler'
    )}`;

  // Group itinerary items by date
  const itemsByDate = {};
  itineraryItems.forEach((item) => {
    if (!itemsByDate[item.date]) {
      itemsByDate[item.date] = [];
    }
    itemsByDate[item.date].push(item);
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300 pb-12">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl text-xs font-semibold animate-bounce">
          {notification.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Back to Community Hub */}
      <div className="flex items-center justify-between">
        <Link
          to="/community"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-brand-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Community Hub</span>
        </Link>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleShare}
            className="flex items-center gap-1.5 text-xs font-bold"
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Link Copied</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Itinerary</span>
              </>
            )}
          </Button>

          <Button
            variant="primary"
            onClick={handleCloneTrip}
            isLoading={isCopying}
            className="flex items-center gap-1.5 text-xs font-bold"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copy Trip</span>
          </Button>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden shadow-xl bg-slate-900 text-white">
        <div className="h-72 sm:h-96 w-full relative">
          <img
            src={
              coverImage ||
              'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80'
            }
            alt={title}
            className="w-full h-full object-cover opacity-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          {/* Read-Only Badge */}
          <div className="absolute top-4 left-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-black/60 backdrop-blur-md text-emerald-400 border border-emerald-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              Verified Public Itinerary
            </span>
          </div>

          {/* Hero Content */}
          <div className="absolute bottom-6 left-6 right-6">
            {/* Creator row */}
            <div className="flex items-center gap-3 mb-3">
              <img
                src={avatarSrc}
                alt={creatorName}
                className="w-10 h-10 rounded-full border-2 border-white object-cover"
              />
              <div>
                <p className="text-xs font-bold text-white">
                  Created by {creatorName}
                </p>
                <p className="text-[11px] text-slate-300">
                  {creator?.country || 'Global Traveler'}
                </p>
              </div>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              {title}
            </h1>

            {description && (
              <p className="mt-2 text-xs sm:text-sm text-slate-200 max-w-3xl leading-relaxed">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
            Duration
          </span>
          <span className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-1.5 mt-1">
            <Clock className="w-4 h-4 text-brand-600" />
            {summary.durationDays || 1} Days
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
            Dates
          </span>
          <span className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-1.5 mt-1 truncate">
            <Calendar className="w-4 h-4 text-sky-500" />
            {formatShortDate(startDate)} – {formatShortDate(endDate)}
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
            Cities / Stops
          </span>
          <span className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-1.5 mt-1">
            <MapPin className="w-4 h-4 text-amber-500" />
            {tripStops.length} Stops
          </span>
        </div>

        <div className="bg-emerald-50/70 rounded-2xl border border-emerald-200 p-4 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-emerald-700 block tracking-wider">
            Est. Total Cost
          </span>
          <span className="text-sm sm:text-base font-black text-emerald-800 flex items-center gap-1.5 mt-1">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            {formatCurrency(summary.totalEstimatedCost || budget)}
          </span>
        </div>
      </div>

      {/* View Mode Switcher */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border border-slate-200 shadow-xs">
          <button
            type="button"
            onClick={() => setViewMode('itinerary')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              viewMode === 'itinerary'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Itinerary Schedule
          </button>
          <button
            type="button"
            onClick={() => setViewMode('map')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              viewMode === 'map'
                ? 'bg-brand-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            Interactive Route Map
          </button>
        </div>
      </div>

      {viewMode === 'map' ? (
        <TripMap stops={tripStops} itineraryItems={itineraryItems} />
      ) : (
        <>
          {/* Cities Route Breakdown */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brand-600" />
              <span>Route & City Stops</span>
            </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {tripStops.map((stop, index) => (
            <div
              key={stop.id}
              className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50 flex flex-col"
            >
              {stop.city?.imageUrl && (
                <div className="h-28 w-full overflow-hidden">
                  <img
                    src={stop.city.imageUrl}
                    alt={stop.city.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-black tracking-wider text-brand-600">
                      Stop {index + 1}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold">
                      {formatShortDate(stop.arrivalDate)} – {formatShortDate(stop.departureDate)}
                    </span>
                  </div>
                  <h4 className="text-sm font-black text-slate-900 mt-1">
                    {stop.city?.name}, {stop.city?.country}
                  </h4>
                  {stop.city?.description && (
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                      {stop.city.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Daily Scheduled Activities */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-brand-600" />
            <h3 className="text-lg font-bold text-slate-900">
              Daily Scheduled Activities ({itineraryItems.length})
            </h3>
          </div>
          <span className="text-xs font-semibold text-slate-500">Read-Only View</span>
        </div>

        {itineraryItems.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">
            No scheduled activities in this itinerary.
          </p>
        ) : (
          <div className="space-y-6">
            {Object.keys(itemsByDate).sort().map((dateStr) => {
              const dayItems = itemsByDate[dateStr];
              return (
                <div key={dateStr} className="space-y-3">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                    <Calendar className="w-4 h-4 text-brand-600" />
                    <span className="text-xs font-black uppercase tracking-wider text-slate-800">
                      {formatShortDate(dateStr)}
                    </span>
                    <span className="text-xs text-slate-400">
                      ({dayItems.length} {dayItems.length === 1 ? 'activity' : 'activities'})
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {dayItems.map((item) => {
                      const cost =
                        item.customCost !== null && item.customCost !== undefined
                          ? item.customCost
                          : item.activity?.estimatedCost || 0;

                      return (
                        <div
                          key={item.id}
                          className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200"
                        >
                          {item.activity?.imageUrl && (
                            <img
                              src={item.activity.imageUrl}
                              alt={item.activity.name}
                              className="w-16 h-16 rounded-xl object-cover shrink-0"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[10px] font-bold text-slate-500">
                                {item.startTime} – {item.endTime}
                              </span>
                              <span className="text-xs font-black text-slate-900">
                                {formatCurrency(cost)}
                              </span>
                            </div>
                            <h5 className="text-xs font-bold text-slate-900 truncate mt-0.5">
                              {item.activity?.name}
                            </h5>
                            {item.notes && (
                              <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                                {item.notes}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      </>
      )}

      {/* Bottom Sticky Action Banner */}
      <div className="sticky bottom-6 bg-slate-900/95 backdrop-blur-md text-white p-4 sm:p-5 rounded-3xl shadow-2xl border border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-white leading-tight">
            Inspired by this travel itinerary?
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Duplicate this trip to your account and customize activities, dates, and budget.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button
            variant="outline"
            onClick={handleShare}
            className="text-xs bg-slate-800 text-white border-slate-700 hover:bg-slate-700"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </Button>

          <Button
            variant="primary"
            onClick={handleCloneTrip}
            isLoading={isCopying}
            className="text-xs font-bold shadow-md"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copy This Trip</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
