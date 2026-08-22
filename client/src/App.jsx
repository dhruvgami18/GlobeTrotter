// client/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CreateTrip from './features/trips/pages/CreateTrip';
import EditTrip from './features/trips/pages/EditTrip';
import TripDetail from './features/trips/pages/TripDetail';
import TripList from './features/trips/components/TripList';
import CitySearch from './features/cities/pages/CitySearch';
import { Toaster } from 'react-hot-toast';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Toaster />
        <Routes>
          <Route path="/" element={<Navigate to="/trips" replace />} />
          <Route path="/trips" element={<TripList />} />
          <Route path="/trips/create" element={<CreateTrip />} />
          <Route path="/trips/:tripId" element={<TripDetail />} />
          <Route path="/trips/:tripId/edit" element={<EditTrip />} />
          <Route path="/cities" element={<CitySearch />} />
        </Routes>
      </div>
    </Router>
  );
}
