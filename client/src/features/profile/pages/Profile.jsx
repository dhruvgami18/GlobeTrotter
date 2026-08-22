import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Globe2,
  Languages,
  LogOut,
  Trash2,
  Save,
  CheckCircle2,
  AlertCircle,
  Bookmark,
  Sparkles,
  Camera,
} from 'lucide-react';
import PageHeader from '../../../components/layout/PageHeader';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import ConfirmDialog from '../../../components/ui/ConfirmDialog';
import Loading from '../../../components/ui/Loading';
import SavedDestinations from '../components/SavedDestinations';
import { useAuth } from '../../../context/AuthContext';
import authService from '../../../services/authService';

const languageOptions = [
  { value: 'English', label: 'English (US)' },
  { value: 'Hindi', label: 'Hindi (हिंदी)' },
  { value: 'Spanish', label: 'Spanish (Español)' },
  { value: 'French', label: 'French (Français)' },
];

export default function Profile() {
  const navigate = useNavigate();
  const { user, updateUser, logout, deleteAccount } = useAuth();

  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    country: '',
    bio: '',
    avatarUrl: '',
    language: 'English',
  });

  const [savedDestinations, setSavedDestinations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState(null);

  // Delete account confirmation state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadProfile = useCallback(async () => {
    setIsLoading(true);
    try {
      const [profileRes, savedRes] = await Promise.allSettled([
        authService.getProfile(),
        authService.getSavedDestinations(),
      ]);

      if (profileRes.status === 'fulfilled' && profileRes.value?.data) {
        const u = profileRes.value.data;
        setProfileData({
          firstName: u.firstName || '',
          lastName: u.lastName || '',
          email: u.email || '',
          phone: u.phone || '',
          city: u.city || '',
          country: u.country || '',
          bio: u.bio || '',
          avatarUrl: u.avatarUrl || '',
          language: u.language || 'English',
        });
      }

      if (savedRes.status === 'fulfilled' && savedRes.value?.data) {
        setSavedDestinations(savedRes.value.data);
      }
    } catch (err) {
      console.error('Error loading profile:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateUser({
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        phone: profileData.phone,
        city: profileData.city,
        country: profileData.country,
        bio: profileData.bio,
        avatarUrl: profileData.avatarUrl,
        language: profileData.language,
      });
      showNotification('Profile and settings updated successfully!');
    } catch (err) {
      console.error('Failed to update profile:', err);
      showNotification(err.message || 'Failed to update profile.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveSavedDestination = async (cityId) => {
    try {
      await authService.removeSavedDestination(cityId);
      setSavedDestinations((prev) => prev.filter((s) => s.cityId !== cityId));
      showNotification('Destination removed from bucket list.');
    } catch (err) {
      console.error('Failed to remove saved destination:', err);
      showNotification('Failed to remove destination.', 'error');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleConfirmDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await deleteAccount();
      navigate('/login', { replace: true });
    } catch (err) {
      console.error('Failed to delete account:', err);
      alert(err.message || 'Failed to delete account.');
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return <Loading text="Loading your profile details..." />;
  }

  const avatarDisplay =
    profileData.avatarUrl ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
      profileData.firstName || 'Traveler'
    )}`;

  return (
    <div>
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

      <PageHeader
        title="User Profile & Settings"
        subtitle="Manage your personal traveler information, language preferences, and saved bucket-list destinations."
      >
        <Button variant="outline" size="sm" onClick={handleLogout} icon={LogOut}>
          Sign Out
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Avatar Card & Account summary */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="p-6 text-center">
            <div className="relative w-28 h-28 mx-auto mb-4">
              <img
                src={avatarDisplay}
                alt={profileData.firstName}
                className="w-full h-full rounded-full object-cover border-4 border-white shadow-lg bg-slate-100"
              />
              <button
                type="button"
                onClick={() => {
                  const newSeed = prompt('Enter a new avatar keyword / name:', profileData.firstName);
                  if (newSeed) {
                    setProfileData({
                      ...profileData,
                      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(newSeed)}`,
                    });
                  }
                }}
                className="absolute bottom-0 right-0 p-2 rounded-full bg-brand-600 hover:bg-brand-700 text-white shadow-md transition-colors"
                title="Change Avatar"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            <h2 className="text-xl font-black text-slate-900">
              {profileData.firstName} {profileData.lastName}
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">{profileData.email}</p>

            {profileData.bio && (
              <p className="mt-3 text-xs text-slate-600 italic bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                "{profileData.bio}"
              </p>
            )}

            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-around text-xs font-semibold text-slate-600">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Language</span>
                <span className="text-slate-800">{profileData.language}</span>
              </div>
              <div className="w-px h-6 bg-slate-200" />
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Saved Places</span>
                <span className="text-brand-600 font-bold">{savedDestinations.length} Cities</span>
              </div>
            </div>
          </Card>

          {/* Danger Zone: Delete Account */}
          <Card className="p-6 border-rose-200/80 bg-rose-50/20">
            <h3 className="text-sm font-bold text-rose-900 flex items-center gap-1.5 mb-1">
              <Trash2 className="w-4 h-4 text-rose-600" />
              Danger Zone
            </h3>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Permanently delete your account, saved destinations, and custom itineraries. This action cannot be undone.
            </p>
            <Button
              variant="danger"
              size="sm"
              className="w-full font-bold"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              Delete Account
            </Button>
          </Card>
        </div>

        {/* Right Column: Edit Profile Form & Saved Destinations */}
        <div className="lg:col-span-8 space-y-8">
          {/* Edit Profile Form */}
          <Card className="p-6 sm:p-8">
            <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-brand-600" />
              Personal Traveler Details
            </h3>

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  value={profileData.firstName}
                  onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                  required
                />
                <Input
                  label="Last Name"
                  value={profileData.lastName}
                  onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Email Address"
                  type="email"
                  value={profileData.email}
                  disabled
                  helperText="Email address is associated with your account login."
                  icon={Mail}
                />
                <Input
                  label="Phone Number"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  icon={Phone}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="City"
                  placeholder="e.g. San Francisco"
                  value={profileData.city}
                  onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                  icon={MapPin}
                />
                <Input
                  label="Country"
                  placeholder="e.g. United States"
                  value={profileData.country}
                  onChange={(e) => setProfileData({ ...profileData, country: e.target.value })}
                  icon={Globe2}
                />
              </div>

              {/* Language Preference (PART 10) */}
              <div>
                <Select
                  label="Language Preference"
                  value={profileData.language}
                  onChange={(e) => setProfileData({ ...profileData, language: e.target.value })}
                  options={languageOptions}
                  helperText="Preferred display language for destination guides and notifications."
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  About You / Travel Style
                </label>
                <textarea
                  rows={3}
                  placeholder="Share your favorite travel experiences, bucket list destinations, or dietary preferences..."
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 resize-none"
                />
              </div>

              <div className="flex items-center justify-end pt-4 border-t border-slate-100">
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isSaving}
                  icon={Save}
                  className="font-bold"
                >
                  Save Profile Changes
                </Button>
              </div>
            </form>
          </Card>

          {/* Saved Destinations Section (PART 11) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <Bookmark className="w-5 h-5 text-amber-500" />
                  Saved Bucket List Destinations
                </h3>
                <p className="text-xs text-slate-500">
                  Quick access to international cities bookmarked from your dashboard or explorer.
                </p>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                {savedDestinations.length} Bookmarked
              </span>
            </div>

            <SavedDestinations
              savedDestinations={savedDestinations}
              onRemove={handleRemoveSavedDestination}
            />
          </div>
        </div>
      </div>

      {/* Delete Account Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDeleteAccount}
        title="Permanently Delete Account?"
        message="Are you completely sure? This will delete your traveler profile, saved destinations, and custom itineraries. You will be signed out immediately."
        confirmText="Yes, Delete My Account"
        isLoading={isDeleting}
      />
    </div>
  );
}
