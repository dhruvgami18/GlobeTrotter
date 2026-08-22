import React, { useState } from 'react';
import {
  Users,
  Search,
  Trash2,
  Shield,
  User,
  Calendar,
  MapPin,
  Compass,
} from 'lucide-react';
import ConfirmDialog from '../../../components/ui/ConfirmDialog';
import { formatShortDate } from '../../../utils/dateUtils';
import { useAuth } from '../../../context/AuthContext';

export default function UserManagementTable({ users = [], onDeleteUser, isDeleting = false }) {
  const { user: currentUser } = useAuth();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [deletingTarget, setDeletingTarget] = useState(null);

  const filtered = users.filter((u) => {
    const fullName = `${u.firstName || ''} ${u.lastName || ''}`.toLowerCase();
    const matchesSearch =
      !search.trim() ||
      fullName.includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.city?.toLowerCase().includes(search.toLowerCase()) ||
      u.country?.toLowerCase().includes(search.toLowerCase());

    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const handleConfirmDelete = async () => {
    if (!deletingTarget) return;
    await onDeleteUser(deletingTarget.id);
    setDeletingTarget(null);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 leading-tight">
              User Directory & Permissions
            </h3>
            <span className="text-xs font-extrabold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
              {users.length} Users
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage user roles, platform memberships, and account lifecycle.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-50 border border-slate-200 text-slate-700 focus:outline-none"
          >
            <option value="ALL">All Roles</option>
            <option value="USER">Standard User</option>
            <option value="ADMIN">Administrator</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="py-12 text-center text-slate-400">
          <p className="text-xs font-semibold">No users matching search criteria.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3.5">User</th>
                <th className="px-4 py-3.5">Email</th>
                <th className="px-4 py-3.5">Role</th>
                <th className="px-4 py-3.5 text-center">Trips</th>
                <th className="px-4 py-3.5 text-center">Saved Cities</th>
                <th className="px-4 py-3.5">Joined</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((u) => {
                const isSelf = currentUser?.id === u.id;
                const isAdmin = u.role === 'ADMIN';

                return (
                  <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                    {/* User info */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={
                            u.avatarUrl ||
                            `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                              u.firstName || 'User'
                            )}`
                          }
                          alt={u.firstName}
                          className="w-8 h-8 rounded-full border border-slate-200 object-cover"
                        />
                        <div>
                          <p className="font-bold text-slate-900">
                            {u.firstName} {u.lastName} {isSelf && '(You)'}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {u.country || u.city || 'Global'}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-4 py-3.5 whitespace-nowrap text-slate-600 font-mono text-[11px]">
                      {u.email}
                    </td>

                    {/* Role Badge */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          isAdmin
                            ? 'bg-purple-50 text-purple-700 border border-purple-200'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}
                      >
                        {isAdmin ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
                        {u.role}
                      </span>
                    </td>

                    {/* Trips Count */}
                    <td className="px-4 py-3.5 whitespace-nowrap text-center font-bold text-slate-800">
                      {u._count?.trips || 0}
                    </td>

                    {/* Saved Destinations Count */}
                    <td className="px-4 py-3.5 whitespace-nowrap text-center text-slate-600">
                      {u._count?.savedDestinations || 0}
                    </td>

                    {/* Joined Date */}
                    <td className="px-4 py-3.5 whitespace-nowrap text-slate-500 text-[11px]">
                      {formatShortDate(u.createdAt)}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5 whitespace-nowrap text-right">
                      {!isSelf ? (
                        <button
                          type="button"
                          onClick={() => setDeletingTarget(u)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete User"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-semibold italic">
                          Protected
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete User Confirmation */}
      {deletingTarget && (
        <ConfirmDialog
          isOpen={Boolean(deletingTarget)}
          onClose={() => setDeletingTarget(null)}
          onConfirm={handleConfirmDelete}
          title="Delete User Account?"
          message={`Are you sure you want to permanently delete ${deletingTarget.firstName} ${deletingTarget.lastName} (${deletingTarget.email}) and all their associated trips?`}
          isLoading={isDeleting}
        />
      )}
    </div>
  );
}
