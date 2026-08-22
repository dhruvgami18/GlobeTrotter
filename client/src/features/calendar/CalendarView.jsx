import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import {
  Calendar as CalendarIcon,
  Clock,
  DollarSign,
  MapPin,
  List,
  Compass,
  CheckCircle2,
  AlertCircle,
  Pencil,
  Info,
} from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader';
import ActivityModal from '../itinerary/components/ActivityModal';
import Loading from '../../components/ui/Loading';
import EmptyState from '../../components/ui/EmptyState';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import itineraryService from '../../services/itineraryService';
import { formatCurrency } from '../../utils/currencyUtils';
import { formatShortDate } from '../../utils/dateUtils';

const categoryColorMap = {
  SIGHTSEEING: { bg: '#8b5cf6', border: '#7c3aed' }, // purple
  FOOD: { bg: '#f43f5e', border: '#e11d48' },        // rose
  CULTURE: { bg: '#d97706', border: '#b45309' },     // amber
  ADVENTURE: { bg: '#10b981', border: '#059669' },   // emerald
  SHOPPING: { bg: '#0284c7', border: '#0369a1' },    // sky
  NIGHTLIFE: { bg: '#6366f1', border: '#4f46e5' },   // indigo
  NATURE: { bg: '#059669', border: '#047857' },      // green
};

export default function CalendarView() {
  const { tripId = '1' } = useParams();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);

  // Quick edit modal state
  const [editingItem, setEditingItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadItinerary = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await itineraryService.getTripItinerary(tripId);
      setData(res.data);
    } catch (err) {
      console.error('Failed to load itinerary for calendar:', err);
      setError(err.message || 'Failed to load calendar data');
    } finally {
      setIsLoading(false);
    }
  }, [tripId]);

  useEffect(() => {
    loadItinerary();
  }, [loadItinerary]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  // Convert ItineraryItems to FullCalendar events
  const events = useMemo(() => {
    if (!data?.items) return [];

    return data.items.map((item) => {
      const cat = item.activity?.category?.toUpperCase() || 'SIGHTSEEING';
      const colors = categoryColorMap[cat] || { bg: '#0284c7', border: '#0369a1' };

      const cost = item.customCost !== null && item.customCost !== undefined
        ? item.customCost
        : (item.activity?.estimatedCost || 0);

      return {
        id: String(item.id),
        title: item.activity?.name || 'Activity',
        start: `${item.date}T${item.startTime}:00`,
        end: `${item.date}T${item.endTime}:00`,
        backgroundColor: colors.bg,
        borderColor: colors.border,
        textColor: '#ffffff',
        extendedProps: {
          rawItem: item,
          cost,
          city: item.activity?.city?.name || item.tripStop?.city?.name,
          category: item.activity?.category,
          notes: item.notes,
        },
      };
    });
  }, [data]);

  // Click event on calendar -> Open Quick Edit
  const handleEventClick = (info) => {
    const rawItem = info.event.extendedProps.rawItem;
    if (rawItem) {
      setEditingItem(rawItem);
      setIsModalOpen(true);
    }
  };

  // Drag & drop event to a different date / time
  const handleEventDrop = async (info) => {
    const rawItem = info.event.extendedProps.rawItem;
    if (!rawItem) return;

    const newStart = info.event.start;
    const newEnd = info.event.end || new Date(newStart.getTime() + 2 * 60 * 60 * 1000);

    const year = newStart.getFullYear();
    const month = String(newStart.getMonth() + 1).padStart(2, '0');
    const day = String(newStart.getDate()).padStart(2, '0');
    const newDate = `${year}-${month}-${day}`;

    const startHours = String(newStart.getHours()).padStart(2, '0');
    const startMins = String(newStart.getMinutes()).padStart(2, '0');
    const newStartTime = `${startHours}:${startMins}`;

    const endHours = String(newEnd.getHours()).padStart(2, '0');
    const endMins = String(newEnd.getMinutes()).padStart(2, '0');
    const newEndTime = `${endHours}:${endMins}`;

    // Validate if newDate is within the stop date range
    if (rawItem.tripStop) {
      if (newDate < rawItem.tripStop.arrivalDate || newDate > rawItem.tripStop.departureDate) {
        alert(
          `Cannot move activity outside stop dates (${rawItem.tripStop.arrivalDate} to ${rawItem.tripStop.departureDate}).`
        );
        info.revert();
        return;
      }
    }

    try {
      await itineraryService.updateItineraryItem(rawItem.id, {
        date: newDate,
        startTime: newStartTime,
        endTime: newEndTime,
      });
      showNotification(`Rescheduled '${rawItem.activity?.name}' to ${newDate} at ${newStartTime}`);
      await loadItinerary();
    } catch (err) {
      console.error('Failed to reschedule activity:', err);
      showNotification(err.message || 'Failed to move activity.', 'error');
      info.revert();
    }
  };

  // Handle Quick Edit Save
  const handleSaveEdit = async (formData) => {
    if (!editingItem) return;
    setIsSubmitting(true);
    try {
      await itineraryService.updateItineraryItem(editingItem.id, {
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        notes: formData.notes,
        customCost: formData.customCost,
      });
      showNotification('Activity schedule updated successfully.');
      setIsModalOpen(false);
      setEditingItem(null);
      await loadItinerary();
    } catch (err) {
      console.error('Failed to save quick edit:', err);
      alert(err.message || 'Failed to update activity schedule.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <Loading text="Loading calendar schedule..." />;
  }

  if (error || !data) {
    return (
      <EmptyState
        title="Failed to load calendar"
        description={error || 'Could not fetch trip data.'}
        actionLabel="Try Again"
        onAction={loadItinerary}
      />
    );
  }

  const { trip, stops = [], items = [] } = data;

  return (
    <div>
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl text-xs font-semibold animate-bounce">
          {notification.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold uppercase tracking-wider bg-brand-50 text-brand-700 border border-brand-200">
                Interactive Schedule
              </span>
              <span className="text-xs text-slate-500 font-semibold">
                {items.length} Activities Scheduled
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {trip.title} — Calendar
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Drag and drop events to reschedule or click any activity to edit times, costs, and notes.
            </p>
          </div>

          {/* Quick Tab Switcher */}
          <div className="flex items-center gap-2 self-start lg:self-center">
            <Link
              to={`/trips/${tripId}/itinerary`}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              Itinerary Builder
            </Link>
            <Link
              to={`/trips/${tripId}/calendar`}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-brand-600 text-white shadow-xs"
            >
              Calendar Schedule
            </Link>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-600">
          <span className="text-slate-400 uppercase tracking-wider text-[10px] font-bold">Categories:</span>
          {Object.entries(categoryColorMap).map(([cat, colors]) => (
            <div key={cat} className="flex items-center gap-1.5">
              <span
                className="w-3 h-3 rounded-full shrink-0 shadow-2xs"
                style={{ backgroundColor: colors.bg }}
              />
              <span className="capitalize">{cat.toLowerCase()}</span>
            </div>
          ))}
        </div>
      </div>

      {/* FullCalendar Container */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          initialDate={trip.startDate || new Date()}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
          }}
          editable={true}
          droppable={true}
          selectable={true}
          events={events}
          eventClick={handleEventClick}
          eventDrop={handleEventDrop}
          height="auto"
          dayMaxEvents={3}
          eventTimeFormat={{
            hour: 'numeric',
            minute: '2-digit',
            meridiem: 'short',
          }}
          slotMinTime="07:00:00"
          slotMaxTime="23:00:00"
        />
      </div>

      {/* Quick Edit Modal */}
      {isModalOpen && (
        <ActivityModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingItem(null);
          }}
          onSubmit={handleSaveEdit}
          initialData={editingItem}
          stops={stops}
          isLoading={isSubmitting}
        />
      )}
    </div>
  );
}
