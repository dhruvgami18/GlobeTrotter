import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import TripForm from '../components/TripForm';
import PageHeader from '../../../components/layout/PageHeader';
import Card from '../../../components/ui/Card';
import Loading from '../../../components/ui/Loading';
import tripService from '../../../services/tripService';
import api from '../../../services/api';

export default function EditTrip() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadTrip() {
      setIsLoading(true);
      try {
        const res = await tripService.getTripById(tripId);
        setTrip(res.data);
      } catch (err) {
        console.error('Failed to load trip for editing:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadTrip();
  }, [tripId]);

  const handleSubmit = async (formData) => {
    setIsSaving(true);
    try {
      await api.put(`/trips/${tripId}`, formData);
      navigate(`/trips/${tripId}/itinerary`);
    } catch (err) {
      console.error('Failed to update trip:', err);
      alert(err.message || 'Failed to update trip.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <Loading text="Loading trip details for editing..." />;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader
        title={`Edit Trip: ${trip?.title || 'Journey'}`}
        subtitle="Modify your travel dates, budget targets, cover photo, or destination stops."
        breadcrumbs={
          <Link to={`/trips/${tripId}/itinerary`} className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-800 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Itinerary</span>
          </Link>
        }
      />

      <Card className="p-6 sm:p-8 bg-white border-slate-200 shadow-sm">
        <TripForm
          initialData={trip}
          onSubmit={handleSubmit}
          isLoading={isSaving}
          submitLabel="Save Trip Changes"
        />
      </Card>
    </div>
  );
}
