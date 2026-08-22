import React from 'react';
import { MapPin, Calendar, Plus, Sparkles, Navigation } from 'lucide-react';
import DaySection from './DaySection';
import Button from '../../../components/ui/Button';
import EmptyState from '../../../components/ui/EmptyState';
import { formatShortDate, getDatesInRange, calculateDays } from '../../../utils/dateUtils';

export default function StopSection({
  stop,
  stopIndex,
  items = [],
  tripStartDate,
  viewMode = 'list',
  onAddActivity,
  onEditActivity,
  onDeleteActivity,
}) {
  const city = stop.city;
  const dates = getDatesInRange(stop.arrivalDate, stop.departureDate);
  const stopDays = calculateDays(stop.arrivalDate, stop.departureDate);

  // Group items by date for this stop
  const itemsByDate = dates.reduce((acc, date) => {
    acc[date] = items.filter((item) => item.date === date);
    return acc;
  }, {});

  const totalStopActivities = items.length;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xs mb-8 overflow-hidden">
      {/* City Stop Banner / Header */}
      <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-brand-950 p-6 text-white">
        {city?.imageUrl && (
          <img
            src={city.imageUrl}
            alt={city.name}
            className="absolute inset-0 w-full h-full object-cover opacity-25 mix-blend-overlay"
          />
        )}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-500/20 backdrop-blur-md border border-brand-400/40 flex items-center justify-center text-brand-300 font-black text-lg shrink-0 shadow-inner">
              {stopIndex + 1}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-brand-300 bg-brand-950/60 px-2 py-0.5 rounded border border-brand-500/30">
                  Stop {stopIndex + 1}
                </span>
                <span className="text-xs text-slate-300 font-medium">
                  {stopDays} {stopDays === 1 ? 'Day' : 'Days'}
                </span>
              </div>
              <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
                <span>{city?.name || 'Destination'}</span>
                {city?.country && (
                  <span className="text-sm font-semibold text-slate-300">
                    • {city.country}
                  </span>
                )}
              </h2>
              <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-300 font-medium">
                <Calendar className="w-3.5 h-3.5 text-sky-400" />
                <span>
                  {formatShortDate(stop.arrivalDate)} – {formatShortDate(stop.departureDate)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-center">
            <Button
              variant="primary"
              size="sm"
              onClick={() => onAddActivity(null, stop.id)}
              icon={Plus}
              className="shadow-lg shadow-brand-500/20"
            >
              Add Activity
            </Button>
          </div>
        </div>
      </div>

      {/* Stop Body: Day Sections */}
      <div className="p-6">
        {totalStopActivities === 0 ? (
          <EmptyState
            title={`No activities added yet for ${city?.name || 'this stop'}.`}
            description={`Start exploring top sights and cultural experiences in ${city?.name || 'the city'} to build your stop itinerary.`}
            icon={Sparkles}
            actionLabel={`+ Add Activity to ${city?.name || 'Stop'}`}
            onAction={() => onAddActivity(null, stop.id)}
          />
        ) : (
          <div>
            {dates.map((date) => {
              // Calculate global trip day number
              const dayNum = calculateDays(tripStartDate, date);
              const dayItems = itemsByDate[date] || [];

              return (
                <DaySection
                  key={date}
                  date={date}
                  dayNumber={dayNum}
                  cityName={city?.name}
                  items={dayItems}
                  viewMode={viewMode}
                  onAddActivity={(targetDate) => onAddActivity(targetDate, stop.id)}
                  onEditActivity={onEditActivity}
                  onDeleteActivity={onDeleteActivity}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
