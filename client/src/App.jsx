import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import AppLayout from './components/layout/AppLayout';
import ProtectedRoute from './routes/ProtectedRoute';

// Member 1 Pages
import Login from './features/auth/pages/Login';
import Register from './features/auth/pages/Register';
import ForgotPassword from './features/auth/pages/ForgotPassword';
import Dashboard from './features/dashboard/pages/Dashboard';
import Profile from './features/profile/pages/Profile';

// Member 3 Pages
import ItineraryBuilder from './features/itinerary/pages/ItineraryBuilder';
import CalendarView from './features/calendar/CalendarView';
import ActivitySearch from './features/activities/pages/ActivitySearch';

function RootRedirect() {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  return <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Protected Main Layout Routes */}
          <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
            <Route path="/" element={<RootRedirect />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />

            {/* Member 3 Travel Planning Routes */}
            <Route path="/trips/:tripId/itinerary" element={<ItineraryBuilder />} />
            <Route path="/trips/:tripId/calendar" element={<CalendarView />} />
            <Route path="/trips/:tripId" element={<ItineraryBuilder />} />
            <Route path="/activities" element={<ActivitySearch />} />

            {/* Community Placeholder */}
            <Route
              path="/community"
              element={
                <div className="p-8 text-center bg-white rounded-3xl border border-slate-200">
                  <h2 className="text-xl font-bold text-slate-900">Community Hub</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Discover public itineraries shared by the global traveler community.
                  </p>
                </div>
              }
            />
          </Route>

          {/* Catch-all fallback */}
          <Route path="*" element={<RootRedirect />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
