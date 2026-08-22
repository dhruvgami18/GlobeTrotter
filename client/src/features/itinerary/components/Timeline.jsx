import React from 'react';
import { Clock, MapPin, DollarSign, FileText, Pencil, Trash2, Calendar } from 'lucide-react';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import { formatTimeRange, formatTime } from '../../../utils/dateUtils';
import { formatCurrency } from '../../../utils/currencyUtils';

export default function Timeline({
  items = [],
  onEdit,
  onDelete,
}) {
  if (items.length === 0) {
    return (
      <div className="py-8 text-center text-xs text-slate-400 font-medium">
        No timeline events for this date.
      </div>
    );
  }

  // Sort chronologically by start time
  const sortedItems = [...items].sort((a, b) => a.startTime.localeCompare(b.startTime));

  return (
    <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-2.5 sm:before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-brand-500 before:via-sky-300 before:to-slate-200">
      {sortedItems.map((item, idx) => {
        const activity = item.activity;
        const cost = item.customCost !== null && item.customCost !== undefined
          ? item.customCost
          : (activity?.estimatedCost || 0);

        return (
          <div key={item.id} className="relative group">
            {/* Timeline Node Icon/Dot */}
            <div className="absolute -left-6 sm:-left-8 top-1.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white border-2 border-brand-600 flex items-center justify-center shadow-xs group-hover:scale-110 group-hover:bg-brand-50 transition-all z-10">
              <div className="w-2 h-2 rounded-full bg-brand-600" />
            </div>

            {/* Timeline Card */}
            <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="text-xs font-bold text-brand-700 bg-brand-50 border border-brand-200/60 px-2 py-0.5 rounded-md">
                      {formatTime(item.startTime)} – {formatTime(item.endTime)}
                    </span>
                    {activity?.category && (
                      <Badge category={activity.category} />
                    )}
                    {activity?.city && (
                      <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {activity.city.name}
                      </span>
                    )}
                  </div>
                  <h4 className="text-base font-bold text-slate-900">
                    {activity?.name || 'Activity'}
                  </h4>
                  {activity?.description && (
                    <p className="mt-1 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {activity.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center sm:flex-col items-end justify-between sm:justify-start gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <span className="text-sm font-bold text-slate-900 bg-slate-50 px-2.5 py-0.5 rounded-lg border border-slate-200">
                    {formatCurrency(cost)}
                  </span>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(item)}
                      className="p-1 text-slate-400 hover:text-brand-600"
                      title="Edit"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(item)}
                      className="p-1 text-slate-400 hover:text-rose-600"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {item.notes && (
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-start gap-1.5 text-xs text-slate-600 bg-amber-50/50 p-2 rounded-lg border border-amber-200/40">
                  <FileText className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <span className="italic">{item.notes}</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
