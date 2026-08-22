import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, ArrowRight, Clock, Plus, Sparkles } from 'lucide-react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { formatShortDate, calculateDays } from '../../../utils/dateUtils';
import { formatCurrency } from '../../../utils/currencyUtils';

export default function UpcomingTrips({
  trips = [],
  onPlanTrip,
}) {
  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Your Trips & Journeys
          </h2>
          <p className="text-xs text-slate-500">
            Active and upcoming travel plans with itinerary access.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onPlanTrip}
          icon={Plus}
          className="text-xs font-bold"
        >
          New Trip
        </Button>
      </div>

      {trips.length === 0 ? (
        <Card className="p-8 text-center bg-white border-dashed border-2 border-slate-200">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto mb-3">
            <Calendar className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No trips planned yet</h3>
          <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
            Ready to embark on a journey? Plan your first city stops and customize day-wise activities.
          </p>
          <Button
            variant="primary"
            size="sm"
            onClick={onPlanTrip}
            icon={Plus}
            className="mt-4"
          >
            Create Your First Trip
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {trips.map((trip) => {
            const days = calculateDays(trip.startDate, trip.endDate);
            const stopsCount = trip.tripStops?.length || 0;
            const activitiesCount = trip._count?.itineraryItems || 0;

            return (
              <Card
                key={trip.id}
                className="overflow-hidden flex flex-col group hover:shadow-lg transition-all border-slate-200/90"
              >
                {/* Cover Image & Tags */}
                <div className="relative aspect-video sm:aspect-21/9 w-full overflow-hidden bg-slate-900">
                  <img
                    src={
                      trip.coverImage ||
                      'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80'
                    }
                    alt={trip.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/90 text-slate-900 backdrop-blur-xs shadow-xs">
                      {days} Days
                    </span>
                    {trip.budget > 0 && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500 text-white shadow-xs">
                        {formatCurrency(trip.budget)} Budget
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h3 className="text-lg font-bold tracking-tight drop-shadow-md truncate">
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
                        {stopsCount} {stopsCount === 1 ? 'City' : 'Cities'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {trip.description || 'Custom curated travel itinerary with scheduled daily activities.'}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{activitiesCount} Activities Scheduled</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5">
                      <Link to={`/trips/${trip.id}/itinerary`}>
                        <Button variant="primary" size="sm" className="text-xs px-2.5">
                          Itinerary
                        </Button>
                      </Link>
                      <Link to={`/trips/${trip.id}/budget`}>
                        <Button variant="outline" size="sm" className="text-xs px-2.5 text-emerald-700 bg-emerald-50/60 border-emerald-200 hover:bg-emerald-100/60">
                          Budget
                        </Button>
                      </Link>
                      <Link to={`/trips/${trip.id}/calendar`}>
                        <Button variant="outline" size="sm" className="text-xs px-2.5">
                          Calendar
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
