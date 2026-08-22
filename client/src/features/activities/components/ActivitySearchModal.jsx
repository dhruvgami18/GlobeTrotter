import React, { useState, useEffect, useMemo } from 'react';
import { Search, SlidersHorizontal, MapPin, Sparkles, AlertCircle } from 'lucide-react';
import Modal from '../../../components/ui/Modal';
import ActivityCard from './ActivityCard';
import ActivityFilters from './ActivityFilters';
import ActivityDetails from './ActivityDetails';
import Loading from '../../../components/ui/Loading';
import EmptyState from '../../../components/ui/EmptyState';
import activityService from '../../../services/activityService';

export default function ActivitySearchModal({
  isOpen,
  onClose,
  cityId,
  cityName,
  onSelectActivity,
}) {
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDetailsActivity, setSelectedDetailsActivity] = useState(null);

  const [filters, setFilters] = useState({
    search: '',
    category: 'ALL',
    maxCost: 200,
    sortBy: 'rating_desc',
  });

  // Fetch activities whenever modal opens or cityId changes
  useEffect(() => {
    if (!isOpen) return;

    async function loadActivities() {
      setIsLoading(true);
      setError(null);
      try {
        const params = {
          cityId: cityId || undefined,
          search: filters.search || undefined,
          category: filters.category !== 'ALL' ? filters.category : undefined,
          maxCost: filters.maxCost !== 200 ? filters.maxCost : undefined,
          sortBy: filters.sortBy,
        };
        const res = await activityService.getActivities(params);
        setActivities(res.data || []);
      } catch (err) {
        console.error('Failed to load activities:', err);
        setError('Failed to fetch activities. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }

    const timer = setTimeout(loadActivities, 200);
    return () => clearTimeout(timer);
  }, [isOpen, cityId, filters]);

  const handleResetFilters = () => {
    setFilters({
      search: '',
      category: 'ALL',
      maxCost: 200,
      sortBy: 'rating_desc',
    });
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="full"
        title={cityName ? `Explore Activities in ${cityName}` : 'Browse Travel Activities'}
        subtitle="Search and select from handpicked sights, culinary experiences, culture tours, and attractions."
      >
        <div className="space-y-4 max-h-[75vh] flex flex-col">
          {/* Filter Bar */}
          <ActivityFilters
            filters={filters}
            onChange={setFilters}
            onReset={handleResetFilters}
            lockCity={Boolean(cityId)}
          />

          {/* Activity Grid / States */}
          <div className="flex-1 overflow-y-auto pr-1">
            {isLoading ? (
              <Loading text={`Searching activities${cityName ? ` in ${cityName}` : ''}...`} />
            ) : error ? (
              <div className="p-6 text-center text-rose-600 bg-rose-50 rounded-xl border border-rose-200">
                <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                <p className="font-semibold">{error}</p>
              </div>
            ) : activities.length === 0 ? (
              <EmptyState
                title="No matching activities found"
                description="Try relaxing your search terms, cost filter, or category selection."
                actionLabel="Reset Filters"
                onAction={handleResetFilters}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {activities.map((activity) => (
                  <ActivityCard
                    key={activity.id}
                    activity={activity}
                    selectLabel="Select & Schedule"
                    onSelect={(act) => {
                      onSelectActivity(act);
                      onClose();
                    }}
                    onViewDetails={(act) => setSelectedDetailsActivity(act)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </Modal>

      {/* Nested Details Preview Modal */}
      {selectedDetailsActivity && (
        <ActivityDetails
          activity={selectedDetailsActivity}
          isOpen={Boolean(selectedDetailsActivity)}
          onClose={() => setSelectedDetailsActivity(null)}
          onAddToItinerary={(act) => {
            onSelectActivity(act);
            onClose();
          }}
        />
      )}
    </>
  );
}
