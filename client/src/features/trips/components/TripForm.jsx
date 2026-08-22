import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Calendar, DollarSign, Image, Plus, Trash2, MapPin, Sparkles } from 'lucide-react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import cityService from '../../../services/cityService';

const tripSchema = z.object({
  title: z.string().min(1, 'Trip title is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  budget: z.preprocess((val) => (val === '' ? 0 : Number(val)), z.number().min(0, 'Budget must be non-negative')),
  description: z.string().optional(),
  coverImage: z.string().optional(),
}).refine((data) => data.startDate <= data.endDate, {
  message: 'End date must be on or after start date',
  path: ['endDate'],
});

const coverPresets = [
  { label: 'Goa / Tropical Beach', url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Jaipur / Royal Palaces', url: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Manali / Himalayas', url: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Varanasi / Ganga Ghats', url: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Kerala / Backwaters', url: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80' },
];

export default function TripForm({
  initialData = null,
  onSubmit,
  isLoading = false,
  submitLabel = 'Create Trip',
}) {
  const [cities, setCities] = useState([]);
  const [stops, setStops] = useState(initialData?.tripStops || initialData?.stops || []);
  const [selectedPreset, setSelectedPreset] = useState(initialData?.coverImage || coverPresets[0].url);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(tripSchema),
    defaultValues: {
      title: initialData?.title || '',
      startDate: initialData?.startDate || '',
      endDate: initialData?.endDate || '',
      budget: initialData?.budget || 0,
      description: initialData?.description || '',
      coverImage: initialData?.coverImage || coverPresets[0].url,
    },
  });

  const startDate = watch('startDate');
  const endDate = watch('endDate');

  useEffect(() => {
    async function loadCities() {
      try {
        const res = await cityService.getCities();
        setCities(res.data || []);
      } catch (err) {
        console.error('Failed to load cities:', err);
      }
    }
    loadCities();
  }, []);

  const handleAddStop = () => {
    if (cities.length === 0) return;
    setStops([
      ...stops,
      {
        cityId: cities[0].id,
        arrivalDate: startDate || '',
        departureDate: endDate || '',
      },
    ]);
  };

  const handleRemoveStop = (idx) => {
    setStops(stops.filter((_, i) => i !== idx));
  };

  const handleStopChange = (idx, field, value) => {
    const updated = [...stops];
    updated[idx] = { ...updated[idx], [field]: value };
    setStops(updated);
  };

  const handleSelectPreset = (url) => {
    setSelectedPreset(url);
    setValue('coverImage', url);
  };

  const onFormSubmit = (data) => {
    onSubmit({
      ...data,
      stops: stops.map((s) => ({
        cityId: Number(s.cityId),
        arrivalDate: s.arrivalDate || data.startDate,
        departureDate: s.departureDate || data.endDate,
      })),
    });
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {/* Trip Basic Information */}
      <div className="space-y-4">
        <Input
          label="Trip Name / Title *"
          placeholder="e.g. 10-Day Japan Autumn Odyssey"
          error={errors.title?.message}
          {...register('title')}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Start Date *"
            type="date"
            error={errors.startDate?.message}
            {...register('startDate')}
          />
          <Input
            label="End Date *"
            type="date"
            error={errors.endDate?.message}
            {...register('endDate')}
          />
        </div>

        <Input
          label="Target Budget (₹ INR)"
          type="number"
          step="1"
          placeholder="45000"
          error={errors.budget?.message}
          {...register('budget')}
        />

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Trip Description & Goals
          </label>
          <textarea
            rows={3}
            placeholder="Share key highlights, travel companions, sights you don't want to miss..."
            className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 resize-none"
            {...register('description')}
          />
        </div>
      </div>

      {/* Cover Image Preset Selector */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
          Choose Cover Photo
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mb-3">
          {coverPresets.map((p) => {
            const isSelected = selectedPreset === p.url;
            return (
              <button
                key={p.label}
                type="button"
                onClick={() => handleSelectPreset(p.url)}
                className={`relative aspect-video rounded-xl overflow-hidden border-2 transition-all group ${
                  isSelected ? 'border-brand-600 ring-2 ring-brand-400 scale-[1.02]' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <img src={p.url} alt={p.label} className="w-full h-full object-cover" />
                <span className="absolute inset-x-0 bottom-0 bg-slate-950/70 text-white text-[10px] font-bold py-0.5 px-1 truncate text-center">
                  {p.label}
                </span>
              </button>
            );
          })}
        </div>
        <Input
          label="Or Custom Cover Photo URL"
          placeholder="https://images.unsplash.com/..."
          icon={Image}
          {...register('coverImage')}
        />
      </div>

      {/* City Stops Builder */}
      <div className="pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-brand-600" />
              City Stops & Destinations
            </h4>
            <p className="text-xs text-slate-500">
              Add cities and assign stay dates for each stop.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddStop}
            icon={Plus}
            className="text-xs font-bold"
          >
            Add City Stop
          </Button>
        </div>

        {stops.length === 0 ? (
          <div className="p-4 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-500 bg-slate-50">
            No city stops added yet. Click "+ Add City Stop" to include Tokyo, Kyoto, Paris, etc.
          </div>
        ) : (
          <div className="space-y-3">
            {stops.map((stop, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-start sm:items-center gap-3"
              >
                <span className="w-6 h-6 rounded-full bg-brand-600 text-white text-xs font-black flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>

                <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <Select
                    value={stop.cityId}
                    onChange={(e) => handleStopChange(idx, 'cityId', e.target.value)}
                  >
                    {cities.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}, {c.country}
                      </option>
                    ))}
                  </Select>

                  <input
                    type="date"
                    value={stop.arrivalDate || startDate}
                    min={startDate}
                    max={endDate}
                    onChange={(e) => handleStopChange(idx, 'arrivalDate', e.target.value)}
                    className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />

                  <input
                    type="date"
                    value={stop.departureDate || endDate}
                    min={stop.arrivalDate || startDate}
                    max={endDate}
                    onChange={(e) => handleStopChange(idx, 'departureDate', e.target.value)}
                    className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveStop(idx)}
                  className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 p-1.5"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          className="font-bold w-full sm:w-auto"
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
