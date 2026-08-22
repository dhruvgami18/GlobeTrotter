import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
  User,
  Compass,
  Wallet,
  Sparkles,
  Share2,
} from 'lucide-react';
import Button from '../../../components/ui/Button';
import { formatCurrency } from '../../../utils/currencyUtils';
import { formatShortDate } from '../../../utils/dateUtils';

export default function CommunityCard({ trip, onCopyTrip }) {
  const navigate = useNavigate();

  if (!trip) return null;

  const {
    id,
    title,
    description,
    startDate,
    endDate,
    budget = 0,
    coverImage,
    shareToken,
    user,
    durationDays = 1,
    cities = [],
    countries = [],
    stopsCount = 0,
    activitiesCount = 0,
  } = trip;

  const creatorName = user
    ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'GlobeTrotter Explorer'
    : 'GlobeTrotter Explorer';

  const avatarSrc =
    user?.avatarUrl ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
      user?.firstName || 'Traveler'
    )}`;

  const citiesFormatted =
    cities.length > 0
      ? cities.join(' → ')
      : countries.join(', ') || 'Global Destination';

  return (
    <div className="group bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between">
      <div>
        {/* Cover Photo */}
        <div className="relative h-48 w-full overflow-hidden bg-slate-100">
          <img
            src={
              coverImage ||
              'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80'
            }
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

          {/* Duration Badge */}
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-white/90 backdrop-blur-md text-slate-900 shadow-sm">
              <Clock className="w-3 h-3 text-brand-600" />
              {durationDays} {durationDays === 1 ? 'Day' : 'Days'}
            </span>
          </div>

          {/* Route Arrow Display in Cover */}
          <div className="absolute bottom-3 left-3 right-3 text-white">
            <p className="text-xs font-extrabold tracking-wide uppercase text-brand-300 drop-shadow-sm flex items-center gap-1 truncate">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{citiesFormatted}</span>
            </p>
          </div>
        </div>

        {/* Card Content Body */}
        <div className="p-5">
          {/* Creator Profile row */}
          <div className="flex items-center gap-2.5 mb-3">
            <img
              src={avatarSrc}
              alt={creatorName}
              className="w-7 h-7 rounded-full border border-slate-200 object-cover shrink-0"
            />
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-800 truncate">{creatorName}</p>
              <p className="text-[10px] text-slate-400">
                {formatShortDate(startDate)} – {formatShortDate(endDate)}
              </p>
            </div>
          </div>

          {/* Trip Title */}
          <h3 className="text-base font-extrabold text-slate-900 tracking-tight line-clamp-1 group-hover:text-brand-600 transition-colors">
            {title}
          </h3>

          {/* Description */}
          {description && (
            <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
              {description}
            </p>
          )}

          {/* Stats Bar */}
          <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Activities
              </span>
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                <Compass className="w-3.5 h-3.5 text-emerald-500" />
                {activitiesCount} Planned
              </span>
            </div>

            <div className="bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-100">
              <span className="text-[10px] uppercase font-bold text-emerald-700 block tracking-wider">
                Trip Budget
              </span>
              <span className="text-xs font-black text-emerald-900 flex items-center gap-1 mt-0.5">
                <Wallet className="w-3.5 h-3.5 text-emerald-600" />
                {budget > 0 ? formatCurrency(budget) : 'Flexible'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="px-5 pb-5 pt-2 flex items-center gap-2">
        <Link
          to={`/public/trips/${shareToken}`}
          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-bold bg-brand-600 text-white hover:bg-brand-700 shadow-xs transition-colors"
        >
          <span>View Trip</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
