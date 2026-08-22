import React from 'react';
import { Clock, DollarSign, Star, Plus, MapPin, Eye } from 'lucide-react';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import { formatCurrency } from '../../../utils/currencyUtils';

export default function ActivityCard({
  activity,
  onSelect,
  onViewDetails,
  selectLabel = 'Add to Day',
  showAddButton = true,
  showDetailsButton = true,
  compact = false,
}) {
  if (!activity) return null;

  return (
    <Card className="overflow-hidden flex flex-col h-full group hover:shadow-lg transition-all duration-200 border-slate-200/90">
      {/* Image & Header tags */}
      <div className="relative aspect-video sm:aspect-16/10 w-full overflow-hidden bg-slate-100">
        <img
          src={activity.imageUrl || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80'}
          alt={activity.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Category Badge top left */}
        <div className="absolute top-2.5 left-2.5">
          <Badge category={activity.category} />
        </div>

        {/* Rating top right */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-slate-900/80 backdrop-blur-xs text-amber-300 px-2 py-0.5 rounded-full text-xs font-bold shadow-xs">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{activity.rating ? activity.rating.toFixed(1) : '4.8'}</span>
        </div>

        {/* City tag bottom left if present */}
        {activity.city && (
          <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 text-white text-xs font-semibold drop-shadow-md">
            <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span>{activity.city.name}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-brand-600 transition-colors line-clamp-1">
            {activity.name}
          </h3>
          <p className="mt-1.5 text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {activity.description}
          </p>
        </div>

        {/* Meta info & Action CTA */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-3 font-medium">
            <div className="flex items-center gap-1 text-slate-700 font-semibold">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{activity.durationHours} hrs</span>
            </div>
            <div className="flex items-center gap-0.5 text-emerald-700 font-bold text-sm bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
              <span>{formatCurrency(activity.estimatedCost)}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {showDetailsButton && onViewDetails && (
              <Button
                variant="secondary"
                size="sm"
                className="flex-1 text-xs"
                onClick={() => onViewDetails(activity)}
                icon={Eye}
              >
                Details
              </Button>
            )}
            {showAddButton && onSelect && (
              <Button
                variant="primary"
                size="sm"
                className="flex-1 text-xs"
                onClick={() => onSelect(activity)}
                icon={Plus}
              >
                {selectLabel}
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
