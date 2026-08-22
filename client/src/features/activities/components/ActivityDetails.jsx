import React from 'react';
import { Clock, DollarSign, Star, MapPin, Tag, Plus, Check } from 'lucide-react';
import Modal from '../../../components/ui/Modal';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import { formatCurrency } from '../../../utils/currencyUtils';

export default function ActivityDetails({
  activity,
  isOpen,
  onClose,
  onAddToItinerary,
  isAdded = false,
}) {
  if (!activity) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="space-y-6">
        {/* Banner Image */}
        <div className="relative aspect-video w-full -mt-6 -mx-6 rounded-t-2xl overflow-hidden bg-slate-900">
          <img
            src={activity.imageUrl || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80'}
            alt={activity.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />

          <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <Badge category={activity.category} />
                {activity.city && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-white bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full">
                    <MapPin className="w-3 h-3 text-sky-400" />
                    {activity.city.name}, {activity.city.country}
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight drop-shadow-md">
                {activity.name}
              </h2>
            </div>
            <div className="flex items-center gap-1 bg-amber-400 text-slate-950 font-black px-2.5 py-1 rounded-xl shadow-lg text-sm">
              <Star className="w-4 h-4 fill-slate-950" />
              <span>{activity.rating ? activity.rating.toFixed(1) : '4.8'}</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Estimated Duration</span>
            <div className="mt-1 flex items-center gap-1.5 text-base font-bold text-slate-800">
              <Clock className="w-4 h-4 text-brand-600" />
              <span>{activity.durationHours} Hours</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Estimated Cost</span>
            <div className="mt-1 flex items-center gap-1.5 text-base font-bold text-emerald-700">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <span>{formatCurrency(activity.estimatedCost)}</span>
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1 p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Category</span>
            <div className="mt-1 text-sm font-bold text-slate-800 capitalize">
              {activity.category ? activity.category.toLowerCase() : 'Sightseeing'}
            </div>
          </div>
        </div>

        {/* Full Description */}
        <div>
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">About this experience</h4>
          <p className="text-sm text-slate-700 leading-relaxed bg-white rounded-xl">
            {activity.description}
          </p>
        </div>

        {/* Action Footer */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {onAddToItinerary && (
            <Button
              variant="primary"
              onClick={() => {
                onAddToItinerary(activity);
                onClose();
              }}
              icon={isAdded ? Check : Plus}
            >
              {isAdded ? 'Add Another Instance' : 'Add to Day Itinerary'}
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}
