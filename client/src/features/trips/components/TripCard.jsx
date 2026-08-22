import React from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  Clock,
  DollarSign,
  Pencil,
  Trash2,
  Share2,
  Compass,
  ArrowRight,
} from 'lucide-react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { formatShortDate, calculateDays } from '../../../utils/dateUtils';
import { formatCurrency } from '../../../utils/currencyUtils';

export default function TripCard({
  trip,
  onDelete,
  onShare,
}) {
  if (!trip) return null;

  const days = calculateDays(trip.startDate, trip.endDate);
  const stopsCount = trip.tripStops?.length || trip.stops?.length || 0;
  const activitiesCount = trip._count?.itineraryItems || trip.itineraryItems?.length || 0;

  return (
    <Card className="overflow-hidden flex flex-col group hover:shadow-xl transition-all duration-300 border-slate-200/90 bg-white">
      {/* Cover Image & Header Tags */}
      <div className="relative aspect-video sm:aspect-21/9 w-full overflow-hidden bg-slate-900">
        <img
          src={
            trip.coverImage ||
            'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80'
          }
          alt={trip.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-2 flex-wrap">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-white/95 text-slate-900 backdrop-blur-xs shadow-xs">
            {days} Days
          </span>
          {trip.budget > 0 && (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-500 text-white shadow-xs">
              {formatCurrency(trip.budget)} Budget
            </span>
          )}
          {trip.isPublic && (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-sky-500 text-white shadow-xs">
              Public
            </span>
          )}
        </div>

        {/* Action icons top right */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
          {onShare && (
            <button
              type="button"
              onClick={() => onShare(trip)}
              className="p-1.5 rounded-lg bg-slate-900/70 hover:bg-slate-900 text-white backdrop-blur-xs shadow-xs transition-colors"
              title="Share Trip"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
          )}
          <Link
            to={`/trips/${trip.id}/edit`}
            className="p-1.5 rounded-lg bg-slate-900/70 hover:bg-slate-900 text-white backdrop-blur-xs shadow-xs transition-colors"
            title="Edit Trip Details"
          >
            <Pencil className="w-3.5 h-3.5" />
          </Link>
          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(trip)}
              className="p-1.5 rounded-lg bg-rose-600/80 hover:bg-rose-600 text-white backdrop-blur-xs shadow-xs transition-colors"
              title="Delete Trip"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Title & Dates overlay */}
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <h3 className="text-xl font-black tracking-tight drop-shadow-md truncate">
            {trip.title}
          </h3>
          <div className="flex items-center gap-2 text-xs text-slate-200 font-medium mt-0.5">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-sky-400" />
              {formatShortDate(trip.startDate)} – {formatShortDate(trip.endDate)}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-sky-400" />
              {stopsCount} {stopsCount === 1 ? 'City Stop' : 'City Stops'}
            </span>
          </div>
        </div>
      </div>

      {/* Body description */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
          {trip.description || 'Custom multi-city travel itinerary with scheduled daily activities and budget tracking.'}
        </p>

        {/* Action Shortcuts */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-brand-600" />
            {activitiesCount} Activities
          </span>

          <div className="flex items-center gap-1.5 flex-wrap">
            <Link to={`/trips/${trip.id}/itinerary`}>
              <Button variant="primary" size="sm" className="text-xs font-bold">
                Itinerary
              </Button>
            </Link>
            <Link to={`/trips/${trip.id}/calendar`}>
              <Button variant="outline" size="sm" className="text-xs font-bold">
                Calendar
              </Button>
            </Link>
            <Link to={`/trips/${trip.id}/budget`}>
              <Button variant="subtle" size="sm" className="text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200">
                Budget
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
}
