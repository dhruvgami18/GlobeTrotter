import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Compass,
  Calendar,
  MapPin,
  Globe,
  User,
  LogOut,
  Sparkles,
  Home,
  PlusCircle,
  Users,
  ShieldCheck,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';

export default function Sidebar({ isOpen, onClose }) {
  const { user, isAuthenticated, logout } = useAuth();

  const mainLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
    { name: 'My Trips', path: '/trips', icon: Calendar },
    { name: 'Cities', path: '/cities', icon: Compass },
    { name: 'Activities', path: '/activities', icon: MapPin },
    { name: 'Community', path: '/community', icon: Users },
    ...(user?.role === 'ADMIN'
      ? [{ name: 'Admin Dashboard', path: '/admin', icon: ShieldCheck }]
      : []),
  ];

  return (
    <>
      {/* Slide-over Backdrop (only visible when isOpen) */}
      <div
        className={`fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-72 bg-slate-900 text-white flex flex-col justify-between shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } border-r border-slate-800`}
      >
        <div>
          {/* Brand & Close Header */}
          <div className="h-16 px-6 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-500 to-sky-400 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <span className="text-base font-extrabold tracking-tight text-white block">
                  GlobeTrotter
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-brand-400">
                  Travel Planner
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Close Menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {mainLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                      isActive
                        ? 'bg-brand-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{link.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User / Profile Footer Section */}
        <div className="p-4 border-t border-slate-800">
          {isAuthenticated && user ? (
            <div className="space-y-3">
              <NavLink
                to="/profile"
                onClick={onClose}
                className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 transition-colors group"
              >
                <img
                  src={
                    user.avatarUrl ||
                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.firstName || 'Traveler')}`
                  }
                  alt={user.firstName}
                  className="w-10 h-10 rounded-full border border-slate-700 object-cover shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-white truncate group-hover:text-brand-400 transition-colors">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-slate-400 truncate">{user.email}</p>
                </div>
              </NavLink>

              <button
                type="button"
                onClick={() => {
                  logout();
                  if (onClose) onClose();
                }}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <NavLink
                to="/login"
                onClick={onClose}
                className="block w-full text-center py-2 px-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-colors"
              >
                Sign In
              </NavLink>
              <NavLink
                to="/register"
                onClick={onClose}
                className="block w-full text-center py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
              >
                Create Account
              </NavLink>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
