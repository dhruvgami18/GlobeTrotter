import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import {
  Calendar,
  Clock,
  DollarSign,
  MapPin,
  List,
  GitCommit,
  Plus,
  Compass,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  LayoutGrid,
} from 'lucide-react';
import StopSection from '../components/StopSection';
import ActivitySearchModal from '../../activities/components/ActivitySearchModal';
import ActivityModal from '../components/ActivityModal';
import ConfirmDialog from '../../../components/ui/ConfirmDialog';
import Button from '../../../components/ui/Button';
import PageHeader from '../../../components/layout/PageHeader';
import Loading from '../../../components/ui/Loading';
import EmptyState from '../../../components/ui/EmptyState';
import itineraryService from '../../../services/itineraryService';
import { formatShortDate, calculateDays } from '../../../utils/dateUtils';
import { formatCurrency } from '../../../utils/currencyUtils';

export default function ItineraryBuilder() {
  const { tripId = '1' } = useParams();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);

  // View mode: 'list' (reorderable cards) or 'timeline' (visual timeline)
  const [viewMode, setViewMode] = useState('list');

  // Modals state
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchTargetStopId, setSearchTargetStopId] = useState(null);
  const [searchTargetDate, setSearchTargetDate] = useState(null);

  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedActivityForAdd, setSelectedActivityForAdd] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  const [deletingItem, setDeletingItem] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // dnd-kit sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const loadItinerary = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await itineraryService.getTripItinerary(tripId);
      setData(res.data);
    } catch (err) {
      console.error('Error fetching itinerary:', err);
      setError(err.message || 'Failed to load trip itinerary.');
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

  // Step 1: Open Activity Search for a stop/date
  const handleOpenAddActivity = (targetDate = null, stopId = null) => {
    setSearchTargetDate(targetDate);
    setSearchTargetStopId(stopId || data?.stops[0]?.id || null);
    setIsSearchModalOpen(true);
  };

  // Step 2: Activity chosen from search -> Open schedule configuration modal
  const handleActivitySelectedFromSearch = (activity) => {
    setSelectedActivityForAdd(activity);
    setEditingItem(null);
    setIsSearchModalOpen(false);
    setIsScheduleModalOpen(true);
  };

  // Step 3: Save activity (Add or Edit)
  const handleSaveActivity = async (formData) => {
    setIsFormSubmitting(true);
    try {
      if (editingItem) {
        // Edit existing item
        await itineraryService.updateItineraryItem(editingItem.id, {
          date: formData.date,
          startTime: formData.startTime,
          endTime: formData.endTime,
          notes: formData.notes,
          customCost: formData.customCost,
        });
        showNotification('Activity schedule updated successfully.');
      } else {
        // Add new item
        await itineraryService.addItineraryItem(tripId, {
          tripStopId: formData.tripStopId,
          activityId: formData.activityId,
          date: formData.date,
          startTime: formData.startTime,
          endTime: formData.endTime,
          notes: formData.notes,
          customCost: formData.customCost,
        });
        showNotification('Activity added to your itinerary!');
      }

      setIsScheduleModalOpen(false);
      setEditingItem(null);
      setSelectedActivityForAdd(null);
      await loadItinerary();
    } catch (err) {
      console.error('Failed to save activity:', err);
      alert(err.message || 'Failed to save activity. Please check constraints.');
    } finally {
      setIsFormSubmitting(false);
    }
  };

  // Step 4: Open Edit
  const handleEditActivity = (item) => {
    setEditingItem(item);
    setSelectedActivityForAdd(null);
    setIsScheduleModalOpen(true);
  };

  // Step 5: Delete item
  const handleDeleteActivity = (item) => {
    setDeletingItem(item);
  };

  const handleConfirmDelete = async () => {
    if (!deletingItem) return;
    setIsDeleting(true);
    try {
      await itineraryService.deleteItineraryItem(deletingItem.id);
      showNotification('Activity removed from itinerary.');
      setDeletingItem(null);
      await loadItinerary();
    } catch (err) {
      console.error('Failed to delete activity:', err);
      alert(err.message || 'Failed to remove activity.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Step 6: Drag and Drop reordering using dnd-kit
  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id || !data?.items) return;

    const oldIndex = data.items.findIndex((item) => item.id === active.id);
    const newIndex = data.items.findIndex((item) => item.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const activeItem = data.items[oldIndex];
    const targetItem = data.items[newIndex];

    // Optimistic state update
    const reorderedItems = arrayMove(data.items, oldIndex, newIndex);

    // If dragged to a different day, update the date
    const updatedTargetDate = targetItem.date;
    const finalItems = reorderedItems.map((item, idx) => {
      if (item.id === activeItem.id) {
        return { ...item, date: updatedTargetDate, sortOrder: idx + 1 };
      }
      return { ...item, sortOrder: idx + 1 };
    });

    setData({
      ...data,
      items: finalItems,
    });

    // Persist to server
    try {
      const payload = finalItems.map((item, idx) => ({
        id: item.id,
        sortOrder: idx + 1,
        date: item.date,
      }));
      await itineraryService.reorderItinerary(tripId, payload);
      showNotification('Itinerary order updated.');
    } catch (err) {
      console.error('Failed to persist reordering:', err);
      showNotification('Failed to save new order. Reloading...', 'error');
      loadItinerary();
    }
  };

  if (isLoading) {
    return <Loading text="Loading itinerary planner..." />;
  }

  if (error || !data) {
    return (
      <EmptyState
        title="Failed to load itinerary"
        description={error || 'Could not find trip details.'}
        actionLabel="Try Again"
        onAction={loadItinerary}
      />
    );
  }

  const { trip, stops = [], items = [], summary = {} } = data;
  const targetStop = stops.find((s) => s.id === searchTargetStopId) || stops[0];

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

      {/* Trip Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold uppercase tracking-wider bg-brand-50 text-brand-700 border border-brand-200">
                Itinerary Builder
              </span>
              <span className="text-xs text-slate-500 font-semibold">
                {calculateDays(trip.startDate, trip.endDate)} Days Trip
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {trip.title}
            </h1>
            {trip.description && (
              <p className="mt-1 text-sm text-slate-600 max-w-3xl">
                {trip.description}
              </p>
            )}
          </div>

          {/* Budget & Stats summary placeholder */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 min-w-[130px]">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Trip Dates
              </span>
              <span className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                <Calendar className="w-3.5 h-3.5 text-brand-600" />
                {formatShortDate(trip.startDate)} – {formatShortDate(trip.endDate)}
              </span>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 min-w-[110px]">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Stops / Cities
              </span>
              <span className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-sky-500" />
                {stops.length} Cities
              </span>
            </div>

            <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-3.5 min-w-[130px]">
              <span className="text-[10px] uppercase font-bold text-emerald-700 block tracking-wider">
                Total Est. Cost
              </span>
              <span className="text-xs sm:text-sm font-extrabold text-emerald-800 flex items-center gap-1 mt-0.5">
                <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                {formatCurrency(summary.totalEstimatedCost)}
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation (PART 9) */}
        <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Link
              to={`/trips/${tripId}/itinerary`}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-brand-600 text-white shadow-xs"
            >
              Itinerary
            </Link>
            <Link
              to={`/trips/${tripId}/calendar`}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              Calendar Schedule
            </Link>
            <button
              type="button"
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors"
              title="Overview (Member 2)"
            >
              Overview
            </button>
            <button
              type="button"
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors"
              title="Budget (Member 4)"
            >
              Budget
            </button>
          </div>

          {/* List vs Timeline View Toggle */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 self-start sm:self-center">
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'list'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              List View
            </button>
            <button
              type="button"
              onClick={() => setViewMode('timeline')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'timeline'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GitCommit className="w-3.5 h-3.5" />
              Timeline View
            </button>
          </div>
        </div>
      </div>

      {/* Main Itinerary Content */}
      {stops.length === 0 ? (
        <EmptyState
          title="Start building your itinerary"
          description="Add your first city stop to begin planning activities, tours, and day schedules."
          icon={Compass}
        />
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <div>
            {stops.map((stop, idx) => {
              const stopItems = items.filter((item) => item.tripStopId === stop.id);
              return (
                <StopSection
                  key={stop.id}
                  stop={stop}
                  stopIndex={idx}
                  items={stopItems}
                  tripStartDate={trip.startDate}
                  viewMode={viewMode}
                  onAddActivity={handleOpenAddActivity}
                  onEditActivity={handleEditActivity}
                  onDeleteActivity={handleDeleteActivity}
                />
              );
            })}
          </div>
        </DndContext>
      )}

      {/* Activity Search Modal */}
      {isSearchModalOpen && (
        <ActivitySearchModal
          isOpen={isSearchModalOpen}
          onClose={() => setIsSearchModalOpen(false)}
          cityId={targetStop?.cityId}
          cityName={targetStop?.city?.name}
          onSelectActivity={handleActivitySelectedFromSearch}
        />
      )}

      {/* Schedule / Edit Activity Modal */}
      {isScheduleModalOpen && (
        <ActivityModal
          isOpen={isScheduleModalOpen}
          onClose={() => {
            setIsScheduleModalOpen(false);
            setEditingItem(null);
            setSelectedActivityForAdd(null);
          }}
          onSubmit={handleSaveActivity}
          initialData={editingItem}
          activity={selectedActivityForAdd}
          stops={stops}
          defaultStopId={searchTargetStopId}
          defaultDate={searchTargetDate}
          isLoading={isFormSubmitting}
        />
      )}

      {/* Confirm Delete Dialog */}
      {deletingItem && (
        <ConfirmDialog
          isOpen={Boolean(deletingItem)}
          onClose={() => setDeletingItem(null)}
          onConfirm={handleConfirmDelete}
          title="Remove Activity?"
          message={`Are you sure you want to remove '${deletingItem.activity?.name}' from this day's itinerary?`}
          isLoading={isDeleting}
        />
      )}
    </div>
  );
}
