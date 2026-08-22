import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, Plane } from 'lucide-react';
import TripForm from '../components/TripForm';
import PageHeader from '../../../components/layout/PageHeader';
import Card from '../../../components/ui/Card';
import tripService from '../../../services/tripService';

export default function CreateTrip() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    try {
      const res = await tripService.createTrip(formData);
      if (res.data?.id) {
        navigate(`/trips/${res.data.id}/itinerary`);
      } else {
        navigate('/trips');
      }
    } catch (err) {
      console.error('Failed to create trip:', err);
      alert(err.message || 'Failed to create trip.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader
        title="Plan a New Journey"
        subtitle="Specify dates, set a target budget, pick your cover photo, and add initial city stops."
        breadcrumbs={
          <Link to="/trips" className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-800 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to My Trips</span>
          </Link>
        }
      />

      <Card className="p-6 sm:p-8 bg-white border-slate-200 shadow-sm">
        <TripForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
          submitLabel="Create Journey & Open Itinerary"
        />
      </Card>
    </div>
  );
}
