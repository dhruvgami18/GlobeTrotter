import React, { useState } from 'react';
import {
  Calendar,
  Search,
  Trash2,
  Globe,
  Lock,
  ExternalLink,
  MapPin,
  Compass,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import ConfirmDialog from '../../../components/ui/ConfirmDialog';
import { formatCurrency } from '../../../utils/currencyUtils';
import { formatShortDate } from '../../../utils/dateUtils';

export default function TripManagementTable({
  trips = [],
  onDeleteTrip,
  isDeleting = false,
}) {
  const [search, setSearch] = useState('');
  const [visibilityFilter, setVisibilityFilter] = useState('ALL');
  const [deletingTarget, setDeletingTarget] = useState(null);

  const filtered = trips.filter((t) => {
    const matchesSearch =
      !search.trim() ||
      t.title?.toLowerCase().includes(search.toLowerCase()) ||
      t.user?.email?.toLowerCase().includes(search.toLowerCase()) ||
      t.user?.firstName?.toLowerCase().includes(search.toLowerCase());

    const matchesVisibility =
      visibilityFilter === 'ALL' ||
      (visibilityFilter === 'PUBLIC' && t.isPublic) ||
      (visibilityFilter === 'PRIVATE' && !t.isPublic);

    return matchesSearch && matchesVisibility;
  });

  const handleConfirmDelete = async () => {
    if (!deletingTarget) return;
    await onDeleteTrip(deletingTarget.id);
    setDeletingTarget(null);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 leading-tight">
              All Platform Itineraries
            </h3>
            <span className="text-xs font-extrabold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
              {trips.length} Trips
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Audit trips across all accounts, check public status, or remove test content.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search trips..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none"
            />
          </div>

          <select
            value={visibilityFilter}
            onChange={(e) => setVisibilityFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-50 border border-slate-200 text-slate-700 focus:outline-none"
          >
            <option value="ALL">All Visibility</option>
            <option value="PUBLIC">Public Shared</option>
            <option value="PRIVATE">Private Only</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="py-12 text-center text-slate-400">
          <p className="text-xs font-semibold">No itineraries matching criteria.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3.5">Trip Title</th>
                <th className="px-4 py-3.5">Creator</th>
                <th className="px-4 py-3.5">Dates</th>
                <th className="px-4 py-3.5">Budget</th>
                <th className="px-4 py-3.5 text-center">Stops</th>
                <th className="px-4 py-3.5">Visibility</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((trip) => {
                const isPublic = trip.isPublic;
                return (
                  <tr key={trip.id} className="hover:bg-slate-50 transition-colors">
                    {/* Title & Cover */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            trip.coverImage ||
                            'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=150&q=80'
                          }
                          alt={trip.title}
                          className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                        />
                        <div>
                          <p className="font-bold text-slate-900 max-w-xs truncate">
                            {trip.title}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            Created {formatShortDate(trip.createdAt)}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Creator */}
                    <td className="px-4 py-3.5 whitespace-nowrap text-slate-700 font-medium">
                      {trip.user ? (
                        <span>
                          {trip.user.firstName} {trip.user.lastName}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">Unassigned</span>
                      )}
                    </td>

                    {/* Dates */}
                    <td className="px-4 py-3.5 whitespace-nowrap text-slate-600">
                      {formatShortDate(trip.startDate)} – {formatShortDate(trip.endDate)}
                    </td>

                    {/* Budget */}
                    <td className="px-4 py-3.5 whitespace-nowrap font-bold text-slate-900">
                      {formatCurrency(trip.budget)}
                    </td>

                    {/* Stops Count */}
                    <td className="px-4 py-3.5 whitespace-nowrap text-center font-bold text-slate-800">
                      {trip.tripStops?.length || 0}
                    </td>

                    {/* Visibility */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isPublic
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        {isPublic ? (
                          <>
                            <Globe className="w-3 h-3 text-emerald-600" />
                            <span>Public</span>
                          </>
                        ) : (
                          <>
                            <Lock className="w-3 h-3 text-slate-400" />
                            <span>Private</span>
                          </>
                        )}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {isPublic && trip.shareToken && (
                          <Link
                            to={`/public/trips/${trip.shareToken}`}
                            target="_blank"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-brand-50 transition-colors"
                            title="View Public Page"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                        )}
                        <button
                          type="button"
                          onClick={() => setDeletingTarget(trip)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete Trip"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deletingTarget && (
        <ConfirmDialog
          isOpen={Boolean(deletingTarget)}
          onClose={() => setDeletingTarget(null)}
          onConfirm={handleConfirmDelete}
          title="Delete Platform Trip?"
          message={`Are you sure you want to permanently delete "${deletingTarget.title}" and all its scheduled activities?`}
          isLoading={isDeleting}
        />
      )}
    </div>
  );
}
