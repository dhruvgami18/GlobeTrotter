import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Plus, Sparkles, Calendar } from 'lucide-react';
import CityCard from '../components/CityCard';
import CityFilters from '../components/CityFilters';
import Modal from '../../../components/ui/Modal';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import PageHeader from '../../../components/layout/PageHeader';
import Loading from '../../../components/ui/Loading';
import EmptyState from '../../../components/ui/EmptyState';
import cityService from '../../../services/cityService';
import tripService from '../../../services/tripService';
import api from '../../../services/api';

export default function CitySearch() {
  const navigate = useNavigate();
  const [cities, setCities] = useState([]);
  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [filters, setFilters] = useState({
    search: '',
    country: '',
  });

  // Add to Trip Modal State
  const [targetCity, setTargetCity] = useState(null);
  const [selectedTripId, setSelectedTripId] = useState('');
  const [arrivalDate, setArrivalDate] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [isAddingStop, setIsAddingStop] = useState(false);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [citiesRes, tripsRes] = await Promise.allSettled([
        cityService.getCities({ search: filters.search }),
        tripService.getTrips(),
      ]);

      if (citiesRes.status === 'fulfilled' && citiesRes.value?.data) {
        setCities(citiesRes.value.data);
      }
      if (tripsRes.status === 'fulfilled' && tripsRes.value?.data) {
        setTrips(tripsRes.value.data);
        if (tripsRes.value.data.length > 0 && !selectedTripId) {
          setSelectedTripId(tripsRes.value.data[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to load city search data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [filters.search]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Extract unique countries
  const countries = Array.from(new Set(cities.map((c) => c.country).filter(Boolean)));

  const filteredCities = cities.filter((c) => {
    if (filters.country && c.country !== filters.country) return false;
    return true;
  });

  const handleOpenAddToTrip = (city) => {
    setTargetCity(city);
    const trip = trips.find((t) => t.id === Number(selectedTripId)) || trips[0];
    if (trip) {
      setArrivalDate(trip.startDate || '');
      setDepartureDate(trip.endDate || '');
    }
  };

  const handleConfirmAddStop = async (e) => {
    e.preventDefault();
    if (!targetCity || !selectedTripId || !arrivalDate || !departureDate) {
      alert('Please fill out all fields.');
      return;
    }

    setIsAddingStop(true);
    try {
      await api.post(`/trips/${selectedTripId}/stops`, {
        cityId: targetCity.id,
        arrivalDate,
        departureDate,
      });
      setTargetCity(null);
      navigate(`/trips/${selectedTripId}/itinerary`);
    } catch (err) {
      console.error('Failed to add stop to trip:', err);
      alert(err.message || 'Failed to add stop to trip.');
    } finally {
      setIsAddingStop(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Destination & City Explorer"
        subtitle="Discover world-class destinations with cost index, popularity ratings, and rich activity catalogs."
        badge={
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200">
            {filteredCities.length} Global Cities
          </span>
        }
      />

      <CityFilters
        filters={filters}
        onChange={setFilters}
        onReset={() => setFilters({ search: '', country: '' })}
        countries={countries}
      />

      {isLoading ? (
        <Loading text="Loading global destinations..." />
      ) : filteredCities.length === 0 ? (
        <EmptyState
          title="No destinations found"
          description="Try relaxing your search terms or clearing your country filter."
          actionLabel="Reset Filters"
          onAction={() => setFilters({ search: '', country: '' })}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCities.map((city) => (
            <CityCard
              key={city.id}
              city={city}
              onAddToTrip={handleOpenAddToTrip}
            />
          ))}
        </div>
      )}

      {/* Add to Trip Modal */}
      {targetCity && (
        <Modal
          isOpen={Boolean(targetCity)}
          onClose={() => setTargetCity(null)}
          title={`Add ${targetCity.name} to Trip`}
          subtitle={`Schedule ${targetCity.name}, ${targetCity.country} as a destination stop in your itinerary.`}
        >
          {trips.length === 0 ? (
            <div className="text-center py-4 space-y-3">
              <p className="text-sm text-slate-600">
                You haven't created any trips yet. Create a trip first to add {targetCity.name}.
              </p>
              <Button
                variant="primary"
                onClick={() => navigate('/trips/create')}
                icon={Plus}
              >
                Create a Trip Now
              </Button>
            </div>
          ) : (
            <form onSubmit={handleConfirmAddStop} className="space-y-4">
              <Select
                label="Select Trip Target"
                value={selectedTripId}
                onChange={(e) => {
                  const id = e.target.value;
                  setSelectedTripId(id);
                  const trip = trips.find((t) => t.id === Number(id));
                  if (trip) {
                    setArrivalDate(trip.startDate);
                    setDepartureDate(trip.endDate);
                  }
                }}
              >
                {trips.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title} ({t.startDate} – {t.endDate})
                  </option>
                ))}
              </Select>

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Arrival Date *"
                  type="date"
                  value={arrivalDate}
                  onChange={(e) => setArrivalDate(e.target.value)}
                  required
                />
                <Input
                  label="Departure Date *"
                  type="date"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <Button
                  variant="outline"
                  onClick={() => setTargetCity(null)}
                  disabled={isAddingStop}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isAddingStop}
                  icon={Plus}
                >
                  Confirm & Open Itinerary
                </Button>
              </div>
            </form>
          )}
        </Modal>
      )}
    </div>
  );
}
