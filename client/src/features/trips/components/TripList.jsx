import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Calendar, Compass, AlertCircle } from 'lucide-react';
import TripCard from './TripCard';
import ShareTripModal from '../../community/components/ShareTripModal';
import ConfirmDialog from '../../../components/ui/ConfirmDialog';
import PageHeader from '../../../components/layout/PageHeader';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Loading from '../../../components/ui/Loading';
import EmptyState from '../../../components/ui/EmptyState';
import tripService from '../../../services/tripService';
import api from '../../../services/api';

export default function TripList() {
  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sharingTrip, setSharingTrip] = useState(null);
  const [deletingTrip, setDeletingTrip] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadTrips = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await tripService.getTrips();
      setTrips(res.data || []);
    } catch (err) {
      console.error('Failed to load trips:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTrips();
  }, [loadTrips]);

  const filteredTrips = trips.filter((t) => {
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    const titleMatch = t.title?.toLowerCase().includes(term);
    const descMatch = t.description?.toLowerCase().includes(term);
    const stopMatch = t.tripStops?.some((s) => s.city?.name?.toLowerCase().includes(term));
    return titleMatch || descMatch || stopMatch;
  });

  const handleDeleteTrip = async () => {
    if (!deletingTrip) return;
    setIsDeleting(true);
    try {
      await api.delete(`/trips/${deletingTrip.id}`);
      setTrips((prev) => prev.filter((t) => t.id !== deletingTrip.id));
      setDeletingTrip(null);
    } catch (err) {
      console.error('Failed to delete trip:', err);
      alert(err.message || 'Failed to delete trip.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="My Trips & Journeys"
        subtitle="Manage all your personalized travel itineraries, multi-city schedules, and shared community journeys."
        badge={
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-50 text-brand-700 border border-brand-200">
            {trips.length} Trips
          </span>
        }
      >
        <Link to="/trips/create">
          <Button variant="primary" icon={Plus} className="font-bold">
            Plan New Trip
          </Button>
        </Link>
      </PageHeader>

      {/* Search Filter Bar */}
      <div className="mb-6 max-w-md">
        <Input
          placeholder="Search by trip name, destination, city..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          icon={Search}
        />
      </div>

      {isLoading ? (
        <Loading text="Loading your travel journeys..." />
      ) : filteredTrips.length === 0 ? (
        <EmptyState
          title={search ? 'No matching trips found' : 'No trips created yet'}
          description={
            search
              ? 'Try changing your search keywords or clear the filter.'
              : 'Begin your adventure by planning your first multi-city itinerary.'
          }
          icon={Calendar}
          actionLabel={search ? 'Clear Search' : '+ Plan Your First Trip'}
          onAction={() => (search ? setSearch('') : (window.location.href = '/trips/create'))}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTrips.map((trip) => (
            <TripCard
              key={trip.id}
              trip={trip}
              onDelete={(t) => setDeletingTrip(t)}
              onShare={(t) => setSharingTrip(t)}
            />
          ))}
        </div>
      )}

      {/* Share Trip Modal */}
      {sharingTrip && (
        <ShareTripModal
          trip={sharingTrip}
          isOpen={Boolean(sharingTrip)}
          onClose={() => setSharingTrip(null)}
          onPublished={() => loadTrips()}
        />
      )}

      {/* Confirm Delete Modal */}
      {deletingTrip && (
        <ConfirmDialog
          isOpen={Boolean(deletingTrip)}
          onClose={() => setDeletingTrip(null)}
          onConfirm={handleDeleteTrip}
          title="Delete Entire Trip?"
          message={`Are you sure you want to delete '${deletingTrip.title}' and all of its itinerary items, stops, and expenses? This cannot be undone.`}
          confirmText="Yes, Delete Trip"
          isLoading={isDeleting}
        />
      )}
    </div>
  );
}
