import React, { useState, useEffect, useCallback } from 'react';
import {
  ShieldCheck,
  Users,
  Calendar,
  Globe,
  Compass,
  MapPin,
  Sparkles,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import AdminStatCard from '../components/AdminStatCard';
import AdminAnalyticsCharts from '../components/AdminAnalyticsCharts';
import UserManagementTable from '../components/UserManagementTable';
import TripManagementTable from '../components/TripManagementTable';
import Loading from '../../../components/ui/Loading';
import EmptyState from '../../../components/ui/EmptyState';
import adminService from '../../../services/adminService';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [trips, setTrips] = useState([]);
  const [activeTab, setActiveTab] = useState('users'); // 'users' or 'trips'
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const loadAdminData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [statsRes, usersRes, tripsRes] = await Promise.all([
        adminService.getAdminStats(),
        adminService.getUsers(),
        adminService.getTrips(),
      ]);

      if (statsRes.data) setStats(statsRes.data);
      if (usersRes.data) setUsers(usersRes.data);
      if (tripsRes.data) setTrips(tripsRes.data);
    } catch (err) {
      console.error('Failed to load admin dashboard:', err);
      setError(err.message || 'Failed to fetch administrator statistics.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAdminData();
  }, [loadAdminData]);

  // Handle Delete User
  const handleDeleteUser = async (userId) => {
    setIsDeleting(true);
    try {
      await adminService.deleteUser(userId);
      showNotification('User and associated data deleted successfully.');
      await loadAdminData();
    } catch (err) {
      console.error('Failed to delete user:', err);
      alert(err.message || 'Failed to delete user.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle Delete Trip
  const handleDeleteTrip = async (tripId) => {
    setIsDeleting(true);
    try {
      await adminService.deleteTrip(tripId);
      showNotification('Trip deleted from system.');
      await loadAdminData();
    } catch (err) {
      console.error('Failed to delete trip:', err);
      alert(err.message || 'Failed to delete trip.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return <Loading text="Fetching administrative telemetry & user analytics..." />;
  }

  if (error || !stats) {
    return (
      <EmptyState
        title="Admin Dashboard Unavailable"
        description={error || 'Could not load administrative data.'}
        actionLabel="Try Again"
        onAction={loadAdminData}
      />
    );
  }

  const {
    summary = {},
    userEngagement = {},
    popularCities = [],
    popularActivities = [],
    tripsCreatedOverTime = [],
  } = stats;

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl text-xs font-semibold animate-bounce">
          {notification.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Platform Administration
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
              Live DB Synced
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            System Analytics & Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Global metrics, popular travel trends, user permissions, and trip auditing.
          </p>
        </div>

        <button
          type="button"
          onClick={loadAdminData}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100 transition-colors self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* 5 Core Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <AdminStatCard
          title="Total Users"
          value={summary.totalUsers}
          subtext={`${userEngagement.activeTripCreators || 0} active trip creators`}
          icon={Users}
          colorScheme="purple"
        />
        <AdminStatCard
          title="Total Trips"
          value={summary.totalTrips}
          subtext={`${userEngagement.avgTripsPerUser || 0} avg / user`}
          icon={Calendar}
          colorScheme="sky"
        />
        <AdminStatCard
          title="Public Trips"
          value={summary.publicTrips}
          subtext={`${userEngagement.publicTripRatio || 0}% public ratio`}
          icon={Globe}
          colorScheme="emerald"
        />
        <AdminStatCard
          title="Activities Catalog"
          value={summary.totalActivities}
          subtext={`${summary.totalScheduledActivities || 0} scheduled`}
          icon={Compass}
          colorScheme="amber"
        />
        <AdminStatCard
          title="Cities Database"
          value={summary.totalCities}
          subtext={`${summary.totalStops || 0} stops recorded`}
          icon={MapPin}
          colorScheme="brand"
        />
      </div>

      {/* Interactive Analytics Charts */}
      <AdminAnalyticsCharts
        tripsCreatedOverTime={tripsCreatedOverTime}
        popularCities={popularCities}
        popularActivities={popularActivities}
        publicTrips={summary.publicTrips || 0}
        privateTrips={summary.privateTrips || 0}
      />

      {/* Management Tables Section */}
      <div className="space-y-4">
        {/* Table Tab Selector */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl w-fit border border-slate-200">
          <button
            type="button"
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'users'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Users Management ({users.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('trips')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'trips'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Trips Management ({trips.length})</span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'users' ? (
          <UserManagementTable
            users={users}
            onDeleteUser={handleDeleteUser}
            isDeleting={isDeleting}
          />
        ) : (
          <TripManagementTable
            trips={trips}
            onDeleteTrip={handleDeleteTrip}
            isDeleting={isDeleting}
          />
        )}
      </div>
    </div>
  );
}
