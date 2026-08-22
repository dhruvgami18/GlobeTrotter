import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import AppLayout from './components/layout/AppLayout';
import ProtectedRoute from './routes/ProtectedRoute';
import AdminRoute from './routes/AdminRoute';

// Member 1 Pages
import Login from './features/auth/pages/Login';
import Register from './features/auth/pages/Register';
import ForgotPassword from './features/auth/pages/ForgotPassword';
import Dashboard from './features/dashboard/pages/Dashboard';
import Profile from './features/profile/pages/Profile';

// Member 2 Pages
import CreateTrip from './features/trips/pages/CreateTrip';
import EditTrip from './features/trips/pages/EditTrip';
import TripDetail from './features/trips/pages/TripDetail';
import TripList from './features/trips/components/TripList';
import CitySearch from './features/cities/pages/CitySearch';

// Member 3 Pages
import ItineraryBuilder from './features/itinerary/pages/ItineraryBuilder';
import CalendarView from './features/calendar/CalendarView';
import ActivitySearch from './features/activities/pages/ActivitySearch';

// Member 4 Pages
import BudgetTracker from './features/budget/pages/BudgetTracker';
import CommunityHub from './features/community/pages/CommunityHub';
import PublicTripView from './features/community/pages/PublicTripView';
import AdminDashboard from './features/admin/pages/AdminDashboard';

function RootRedirect() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null;

  return (
    <Navigate
      to={isAuthenticated ? '/dashboard' : '/login'}
      replace
    />
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-100">
          <Toaster />

          <Routes>
            {/* Public auth routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Public shared-trip route */}
            <Route
              path="/public/trips/:shareToken"
              element={
                <div className="min-h-screen bg-slate-50 px-4 py-6 text-slate-900 sm:px-6 sm:py-8 lg:px-8">
                  <PublicTripView />
                </div>
              }
            />

            {/* Protected application routes */}
            <Route
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/" element={<RootRedirect />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />

              {/* Trips */}
              <Route path="/trips" element={<TripList />} />
              <Route path="/trips/create" element={<CreateTrip />} />
              <Route path="/trips/:tripId" element={<TripDetail />} />
              <Route path="/trips/:tripId/edit" element={<EditTrip />} />

              {/* Cities */}
              <Route path="/cities" element={<CitySearch />} />

              {/* Travel planning */}
              <Route
                path="/trips/:tripId/itinerary"
                element={<ItineraryBuilder />}
              />
              <Route
                path="/trips/:tripId/calendar"
                element={<CalendarView />}
              />
              <Route path="/activities" element={<ActivitySearch />} />

              {/* Budget and community */}
              <Route
                path="/trips/:tripId/budget"
                element={<BudgetTracker />}
              />
              <Route path="/community" element={<CommunityHub />} />

              {/* Admin */}
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />
            </Route>

            <Route path="*" element={<RootRedirect />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}