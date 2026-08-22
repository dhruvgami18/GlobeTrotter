import React, { useState, useEffect } from 'react';
import { Compass, Sparkles, MapPin } from 'lucide-react';
import ActivityCard from '../components/ActivityCard';
import ActivityFilters from '../components/ActivityFilters';
import ActivityDetails from '../components/ActivityDetails';
import PageHeader from '../../../components/layout/PageHeader';
import Loading from '../../../components/ui/Loading';
import EmptyState from '../../../components/ui/EmptyState';
import activityService from '../../../services/activityService';
import cityService from '../../../services/cityService';

export default function ActivitySearch() {
  const [activities, setActivities] = useState([]);
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedActivity, setSelectedActivity] = useState(null);

  const [filters, setFilters] = useState({
    search: '',
    cityId: '',
    category: 'ALL',
    maxCost: 200,
    sortBy: 'rating_desc',
  });

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

  useEffect(() => {
    async function loadActivities() {
      setIsLoading(true);
      try {
        const params = {
          cityId: filters.cityId || undefined,
          search: filters.search || undefined,
          category: filters.category !== 'ALL' ? filters.category : undefined,
          maxCost: filters.maxCost !== 200 ? filters.maxCost : undefined,
          sortBy: filters.sortBy,
        };
        const res = await activityService.getActivities(params);
        setActivities(res.data || []);
      } catch (err) {
        console.error('Failed to load activities:', err);
      } finally {
        setIsLoading(false);
      }
    }

    const timer = setTimeout(loadActivities, 200);
    return () => clearTimeout(timer);
  }, [filters]);

  const handleResetFilters = () => {
    setFilters({
      search: '',
      cityId: '',
      category: 'ALL',
      maxCost: 200,
      sortBy: 'rating_desc',
    });
  };

  return (
    <div>
      <PageHeader
        title="Activity Catalog & Explorer"
        subtitle="Discover world-class landmarks, hidden local culinary gems, cultural tours, and exciting adventures across global cities."
        badge={
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
            {activities.length} Experiences
          </span>
        }
      />

      <ActivityFilters
        filters={filters}
        onChange={setFilters}
        onReset={handleResetFilters}
        cities={cities}
      />

      {isLoading ? (
        <Loading text="Finding top activities for you..." />
      ) : activities.length === 0 ? (
        <EmptyState
          title="No activities found"
          description="Try selecting another city, category, or expanding your budget range."
          actionLabel="Reset All Filters"
          onAction={handleResetFilters}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {activities.map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              showAddButton={false}
              showDetailsButton={true}
              onViewDetails={(act) => setSelectedActivity(act)}
            />
          ))}
        </div>
      )}

      {selectedActivity && (
        <ActivityDetails
          activity={selectedActivity}
          isOpen={Boolean(selectedActivity)}
          onClose={() => setSelectedActivity(null)}
        />
      )}
    </div>
  );
}
