import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import WelcomeCard from '../components/WelcomeCard';
import BudgetHighlight from '../components/BudgetHighlight';
import UpcomingTrips from '../components/UpcomingTrips';
import RecommendedCities from '../components/RecommendedCities';
import Modal from '../../../components/ui/Modal';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Loading from '../../../components/ui/Loading';
import { useAuth } from '../../../context/AuthContext';
import tripService from '../../../services/tripService';
import cityService from '../../../services/cityService';
import authService from '../../../services/authService';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [trips, setTrips] = useState([]);
  const [cities, setCities] = useState([]);
  const [savedDestinations, setSavedDestinations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // New Trip Quick Modal state
  const [isNewTripModalOpen, setIsNewTripModalOpen] = useState(false);
  const [newTripData, setNewTripData] = useState({
    title: '',
    startDate: '',
    endDate: '',
    budget: '',
    description: '',
  });
  const [isCreatingTrip, setIsCreatingTrip] = useState(false);

  const loadDashboardData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Parallel fetch with error resilience
      const [tripsRes, citiesRes, savedRes] = await Promise.allSettled([
        tripService.getTrips(),
        cityService.getCities(),
        authService.getSavedDestinations(),
      ]);

      if (tripsRes.status === 'fulfilled' && tripsRes.value?.data) {
        setTrips(tripsRes.value.data);
      }
      if (citiesRes.status === 'fulfilled' && citiesRes.value?.data) {
        setCities(citiesRes.value.data);
      }
      if (savedRes.status === 'fulfilled' && savedRes.value?.data) {
        setSavedDestinations(savedRes.value.data);
      }
    } catch (err) {
      console.error('Error loading dashboard:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const savedCityIds = savedDestinations.map((s) => s.cityId);

  // Toggle Save Destination handler
  const handleToggleSaveDestination = async (cityId) => {
    try {
      if (savedCityIds.includes(cityId)) {
        await authService.removeSavedDestination(cityId);
        setSavedDestinations((prev) => prev.filter((s) => s.cityId !== cityId));
      } else {
        const res = await authService.addSavedDestination(cityId);
        if (res.data) {
          setSavedDestinations((prev) => [...prev, res.data]);
        }
      }
    } catch (err) {
      console.error('Failed to toggle saved destination:', err);
    }
  };

  // Quick create trip handler
  const handleCreateTrip = async (e) => {
    e.preventDefault();
    if (!newTripData.title || !newTripData.startDate || !newTripData.endDate) {
      alert('Please fill out the title, start date, and end date.');
      return;
    }

    setIsCreatingTrip(true);
    try {
      const res = await tripService.createTrip({
        ...newTripData,
        budget: newTripData.budget ? parseFloat(newTripData.budget) : 0,
      });
      setIsNewTripModalOpen(false);
      setNewTripData({ title: '', startDate: '', endDate: '', budget: '', description: '' });
      if (res.data?.id) {
        navigate(`/trips/${res.data.id}/itinerary`);
      } else {
        loadDashboardData();
      }
    } catch (err) {
      console.error('Failed to create trip:', err);
      alert(err.message || 'Failed to create trip.');
    } finally {
      setIsCreatingTrip(false);
    }
  };

  if (isLoading) {
    return <Loading text="Assembling your personalized travel dashboard..." />;
  }

  return (
    <div>
      {/* Welcome Banner */}
      <WelcomeCard
        userName={user?.firstName}
        onPlanTrip={() => setIsNewTripModalOpen(true)}
      />

      {/* Budget & Statistics Highlight */}
      <BudgetHighlight
        trips={trips}
        savedCount={savedDestinations.length}
      />

      {/* Trips Section */}
      <UpcomingTrips
        trips={trips}
        onPlanTrip={() => setIsNewTripModalOpen(true)}
      />

      {/* Recommended Destinations */}
      <RecommendedCities
        cities={cities}
        savedCityIds={savedCityIds}
        onToggleSave={handleToggleSaveDestination}
      />

      {/* Plan New Trip Modal */}
      <Modal
        isOpen={isNewTripModalOpen}
        onClose={() => setIsNewTripModalOpen(false)}
        title="Plan a New Journey"
        subtitle="Set the dates, title, and budget for your upcoming travel itinerary."
      >
        <form onSubmit={handleCreateTrip} className="space-y-4">
          <Input
            label="Trip Title *"
            placeholder="e.g. Italian Summer Escapade"
            value={newTripData.title}
            onChange={(e) => setNewTripData({ ...newTripData, title: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Start Date *"
              type="date"
              value={newTripData.startDate}
              onChange={(e) => setNewTripData({ ...newTripData, startDate: e.target.value })}
              required
            />
            <Input
              label="End Date *"
              type="date"
              value={newTripData.endDate}
              onChange={(e) => setNewTripData({ ...newTripData, endDate: e.target.value })}
              required
            />
          </div>

          <Input
            label="Target Budget (₹ INR)"
            type="number"
            placeholder="45000"
            value={newTripData.budget}
            onChange={(e) => setNewTripData({ ...newTripData, budget: e.target.value })}
          />

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Trip Description / Goals
            </label>
            <textarea
              rows={2}
              placeholder="Highlight key destinations, travel companions, or culinary aspirations..."
              value={newTripData.description}
              onChange={(e) => setNewTripData({ ...newTripData, description: e.target.value })}
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Button
              variant="outline"
              onClick={() => setIsNewTripModalOpen(false)}
              disabled={isCreatingTrip}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isCreatingTrip}
            >
              Start Building Itinerary
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
