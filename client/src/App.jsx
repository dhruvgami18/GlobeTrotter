import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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

          {/* Public Trip View Route (Standalone or within layout) */}
          <Route
            path="/public/trips/:shareToken"
            element={
              <div className="min-h-screen bg-slate-50 text-slate-900 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                <PublicTripView />
              </div>
            }
          />

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

            {/* Member 4 Routes */}
            <Route path="/trips/:tripId/budget" element={<BudgetTracker />} />
            <Route path="/community" element={<CommunityHub />} />

            {/* Admin Management Dashboard */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
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

