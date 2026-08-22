import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  GripVertical,
  Clock,
  MapPin,
  FileText,
  Pencil,
  Trash2,
  DollarSign,
  Tag,
} from 'lucide-react';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import { formatTimeRange } from '../../../utils/dateUtils';
import { formatCurrency } from '../../../utils/currencyUtils';

export default function ActivityItem({
  item,
  onEdit,
  onDelete,
  isDragDisabled = false,
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: item.id,
    disabled: isDragDisabled,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 30 : 'auto',
    opacity: isDragging ? 0.6 : 1,
  };

  const activity = item.activity;
  const cost = item.customCost !== null && item.customCost !== undefined
    ? item.customCost
    : (activity?.estimatedCost || 0);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border transition-all bg-white ${
        isDragging
          ? 'border-brand-500 shadow-xl ring-2 ring-brand-400 bg-brand-50/20'
          : 'border-slate-200/90 hover:border-slate-300 hover:shadow-md'
      }`}
    >
      {/* Left side: Drag Handle, Image, & Main Info */}
      <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
        {/* Drag handle */}
        {!isDragDisabled && (
          <button
            type="button"
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 -ml-1 text-slate-300 hover:text-slate-600 rounded hover:bg-slate-100 touch-none shrink-0"
            title="Drag to reorder"
          >
            <GripVertical className="w-5 h-5" />
          </button>
        )}

        {/* Activity Thumbnail Image */}
        {activity?.imageUrl && (
          <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-lg overflow-hidden shrink-0 bg-slate-100 border border-slate-200">
            <img
              src={activity.imageUrl}
              alt={activity.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        )}

        {/* Content details */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            {/* Time Slot */}
            <span className="inline-flex items-center gap-1 font-bold text-xs text-brand-700 bg-brand-50 border border-brand-200/60 px-2 py-0.5 rounded-md">
              <Clock className="w-3 h-3" />
              {formatTimeRange(item.startTime, item.endTime)}
            </span>

            {/* Category badge */}
            {activity?.category && (
              <Badge category={activity.category} />
            )}

            {/* City */}
            {activity?.city && (
              <span className="inline-flex items-center gap-1 text-xs text-slate-500 font-medium">
                <MapPin className="w-3 h-3 text-slate-400" />
                {activity.city.name}
              </span>
            )}
          </div>

          <h4 className="text-sm font-bold text-slate-900 truncate">
            {activity?.name || 'Scheduled Activity'}
          </h4>

          {/* Notes if present */}
          {item.notes && (
            <p className="mt-1 flex items-center gap-1 text-xs text-slate-500 italic line-clamp-1">
              <FileText className="w-3 h-3 text-slate-400 shrink-0" />
              <span>{item.notes}</span>
            </p>
          )}
        </div>
      </div>

      {/* Right side: Cost & Actions */}
      <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
        {/* Cost */}
        <div className="text-right">
          <span className="text-[11px] uppercase font-bold text-slate-400 block">Cost</span>
          <span className="text-sm font-bold text-slate-900 bg-slate-50 px-2.5 py-0.5 rounded-lg border border-slate-200/80">
            {formatCurrency(cost)}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(item)}
            className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50"
            title="Edit activity schedule"
          >
            <Pencil className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(item)}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50"
            title="Remove from itinerary"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
