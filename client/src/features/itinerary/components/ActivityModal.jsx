import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Clock, Calendar, DollarSign, FileText, AlertCircle } from 'lucide-react';
import Modal from '../../../components/ui/Modal';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import { itineraryItemSchema } from '../../../utils/validation';
import { formatShortDate } from '../../../utils/dateUtils';

export default function ActivityModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null, // if editing
  activity = null, // selected activity when adding
  stops = [],
  defaultStopId = null,
  defaultDate = null,
  isLoading = false,
}) {
  const isEditing = Boolean(initialData);
  const activeActivity = initialData?.activity || activity;

  // Selected stop from stops list
  const [selectedStopId, setSelectedStopId] = useState(
    initialData?.tripStopId || defaultStopId || (stops[0]?.id ?? '')
  );

  const selectedStop = stops.find((s) => s.id === Number(selectedStopId)) || stops[0];

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(itineraryItemSchema),
    defaultValues: {
      tripStopId: initialData?.tripStopId || defaultStopId || (stops[0]?.id ?? 0),
      activityId: activeActivity?.id || 0,
      date: initialData?.date || defaultDate || selectedStop?.arrivalDate || '',
      startTime: initialData?.startTime || '09:00',
      endTime: initialData?.endTime || '11:00',
      customCost: initialData?.customCost ?? activeActivity?.estimatedCost ?? 0,
      notes: initialData?.notes || '',
    },
  });

  const selectedDate = watch('date');
  const startTimeVal = watch('startTime');
  const endTimeVal = watch('endTime');

  useEffect(() => {
    if (isOpen) {
      const stop = stops.find((s) => s.id === Number(defaultStopId)) || stops[0];
      const effStopId = initialData?.tripStopId || defaultStopId || stop?.id || 0;
      setSelectedStopId(effStopId);

      // Default end time roughly duration hours after start time
      let computedEnd = '11:00';
      if (activeActivity?.durationHours && !initialData) {
        const startH = 9;
        const dur = Math.round(activeActivity.durationHours);
        const endH = Math.min(23, startH + dur);
        computedEnd = `${String(endH).padStart(2, '0')}:00`;
      }

      reset({
        tripStopId: Number(effStopId),
        activityId: activeActivity?.id || 0,
        date: initialData?.date || defaultDate || stop?.arrivalDate || '',
        startTime: initialData?.startTime || '09:00',
        endTime: initialData?.endTime || computedEnd,
        customCost: initialData?.customCost !== undefined ? initialData.customCost : (activeActivity?.estimatedCost ?? 0),
        notes: initialData?.notes || '',
      });
    }
  }, [isOpen, initialData, activity, defaultStopId, defaultDate, reset, stops]);

  const handleStopChange = (e) => {
    const newStopId = Number(e.target.value);
    setSelectedStopId(newStopId);
    setValue('tripStopId', newStopId);
    const newStop = stops.find((s) => s.id === newStopId);
    if (newStop) {
      // Ensure date stays within stop range
      setValue('date', newStop.arrivalDate);
    }
  };

  const onFormSubmit = (data) => {
    onSubmit({
      ...data,
      tripStopId: Number(data.tripStopId),
      activityId: Number(data.activityId),
    });
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      title={isEditing ? 'Edit Activity Schedule' : 'Schedule Activity in Itinerary'}
      subtitle={activeActivity ? `${activeActivity.name}` : 'Assign date, time slot, and estimated cost'}
    >
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        {/* Activity Summary Pill */}
        {activeActivity && (
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
            <img
              src={activeActivity.imageUrl}
              alt={activeActivity.name}
              className="w-12 h-12 rounded-lg object-cover shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <Badge category={activeActivity.category} />
                <span className="text-xs text-slate-500 font-medium">
                  {activeActivity.durationHours}h estimated
                </span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 truncate">
                {activeActivity.name}
              </h4>
            </div>
          </div>
        )}

        <input type="hidden" {...register('activityId', { valueAsNumber: true })} />

        {/* Stop Selector (if multiple stops exist) */}
        {stops.length > 1 && (
          <div>
            <Select
              label="City Stop"
              value={selectedStopId}
              onChange={handleStopChange}
              error={errors.tripStopId?.message}
            >
              {stops.map((stop) => (
                <option key={stop.id} value={stop.id}>
                  {stop.city?.name} ({formatShortDate(stop.arrivalDate)} – {formatShortDate(stop.departureDate)})
                </option>
              ))}
            </Select>
          </div>
        )}

        {/* Date Input with bounds */}
        <div>
          <Input
            label="Date"
            type="date"
            min={selectedStop?.arrivalDate}
            max={selectedStop?.departureDate}
            error={errors.date?.message}
            helperText={
              selectedStop
                ? `Valid stop dates: ${formatShortDate(selectedStop.arrivalDate)} to ${formatShortDate(selectedStop.departureDate)}`
                : ''
            }
            {...register('date')}
          />
        </div>

        {/* Time Inputs */}
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Start Time"
            type="time"
            error={errors.startTime?.message}
            {...register('startTime')}
          />
          <Input
            label="End Time"
            type="time"
            error={errors.endTime?.message}
            {...register('endTime')}
          />
        </div>

        {/* Custom Cost */}
        <div>
          <Input
            label="Cost ($ USD)"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            icon={DollarSign}
            error={errors.customCost?.message}
            helperText={`Default estimated cost: $${activeActivity?.estimatedCost ?? 0}`}
            {...register('customCost')}
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Planning Notes & Tips
          </label>
          <textarea
            rows={3}
            placeholder="e.g. Pre-booked tickets, remember to bring camera, wear walking shoes..."
            className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 resize-none"
            {...register('notes')}
          />
          {errors.notes && (
            <p className="text-xs text-rose-600 font-medium mt-1">{errors.notes.message}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            {isEditing ? 'Save Changes' : 'Add to Itinerary'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
