import React from 'react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus, Calendar, Clock, DollarSign, Sparkles } from 'lucide-react';
import ActivityItem from './ActivityItem';
import Timeline from './Timeline';
import Button from '../../../components/ui/Button';
import { formatDate, formatShortDate } from '../../../utils/dateUtils';
import { formatCurrency } from '../../../utils/currencyUtils';

export default function DaySection({
  date,
  dayNumber,
  cityName,
  items = [],
  viewMode = 'list', // 'list' or 'timeline'
  onAddActivity,
  onEditActivity,
  onDeleteActivity,
}) {
  const daySubtotal = items.reduce((sum, item) => {
    const cost = item.customCost !== null && item.customCost !== undefined
      ? item.customCost
      : (item.activity?.estimatedCost || 0);
    return sum + cost;
  }, 0);

  const itemIds = items.map((item) => item.id);

  return (
    <div className="bg-slate-50/70 rounded-2xl border border-slate-200/90 p-4 sm:p-5 mb-6 last:mb-0 transition-all">
      {/* Day Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex flex-col items-center justify-center font-black shadow-xs shrink-0">
            <span className="text-[10px] uppercase font-bold tracking-wider leading-none">Day</span>
            <span className="text-base leading-tight">{dayNumber}</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">
                {formatDate(date)}
              </h3>
              {cityName && (
                <span className="text-xs font-semibold text-brand-700 bg-brand-50 border border-brand-200 px-2 py-0.5 rounded-md">
                  {cityName}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 font-medium">
              {items.length} {items.length === 1 ? 'activity' : 'activities'} scheduled • Day cost: {formatCurrency(daySubtotal)}
            </p>
          </div>
        </div>

        {/* Day Add CTA */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          <Button
            variant="subtle"
            size="sm"
            onClick={() => onAddActivity(date)}
            icon={Plus}
            className="text-xs"
          >
            Add Activity
          </Button>
        </div>
      </div>

      {/* Content depending on view mode */}
      {items.length === 0 ? (
        <div className="p-6 text-center border-2 border-dashed border-slate-200 rounded-xl bg-white/60">
          <p className="text-xs font-semibold text-slate-500">
            No activities scheduled for this day yet.
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onAddActivity(date)}
            icon={Plus}
            className="mt-2 text-xs text-brand-600 hover:text-brand-700 font-bold"
          >
            + Add first activity for {formatShortDate(date)}
          </Button>
        </div>
      ) : viewMode === 'timeline' ? (
        <Timeline
          items={items}
          onEdit={onEditActivity}
          onDelete={onDeleteActivity}
        />
      ) : (
        <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {items.map((item) => (
              <ActivityItem
                key={item.id}
                item={item}
                onEdit={onEditActivity}
                onDelete={onDeleteActivity}
              />
            ))}
          </div>
        </SortableContext>
      )}
    </div>
  );
}
