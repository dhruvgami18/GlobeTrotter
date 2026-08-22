import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Globe,
  Compass,
  MapPin,
  Calendar,
  Wallet,
  Share2,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Star,
  Users,
  ChevronRight,
  ShieldCheck,
  Copy,
  ArrowUpRight,
  Plane,
  Heart,
  TrendingUp,
  Clock,
  Layers,
  Check
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import Button from '../../../components/ui/Button';

export default function LandingPage() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const destinations = [
    {
      name: 'Goa',
      state: 'India',
      tagline: 'Golden Beaches, Scuba Diving & Coastal Heritage',
      image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
      badge: 'Popular',
      rating: 4.9,
      activities: 18,
      avgBudget: '₹28,000',
    },
    {
      name: 'Jaipur',
      state: 'Rajasthan',
      tagline: 'Royal Palaces, Amber Fort & Vibrant Bazaars',
      image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
      badge: 'Heritage',
      rating: 4.8,
      activities: 24,
      avgBudget: '₹35,000',
    },
    {
      name: 'Munnar',
      state: 'Kerala',
      tagline: 'Misty Mountains & Emerald Tea Plantations',
      image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
      badge: 'Scenic',
      rating: 4.9,
      activities: 14,
      avgBudget: '₹25,000',
    },
    {
      name: 'Manali',
      state: 'Himachal Pradesh',
      tagline: 'Snow-capped Peaks, Solang Valley & Treks',
      image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
      badge: 'Adventure',
      rating: 4.7,
      activities: 20,
      avgBudget: '₹30,000',
    },
  ];

  const features = [
    {
      icon: MapPin,
      bg: 'bg-sky-50 text-sky-600 border-sky-100',
      title: 'Smart Multi-City Itineraries',
      desc: 'Organize multi-city routes, customize daily time blocks, and drag-and-drop activities in seconds.',
    },
    {
      icon: Wallet,
      bg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      title: 'Real-Time Budget Tracking (₹)',
      desc: 'Set total and daily budgets, track expenses across categories, and get automated over-budget alerts.',
    },
    {
      icon: Calendar,
      bg: 'bg-indigo-50 text-indigo-600 border-indigo-100',
      title: 'Interactive Calendar Sync',
      desc: 'Switch between timeline, day-by-day schedules, and monthly calendar views for seamless schedule management.',
    },
    {
      icon: Sparkles,
      bg: 'bg-amber-50 text-amber-600 border-amber-100',
      title: 'Curated Activities & Cost Index',
      desc: 'Explore vetted attractions, culture, culinary experiences, and outdoor adventures with live Indian Rupee pricing.',
    },
    {
      icon: Share2,
      bg: 'bg-rose-50 text-rose-600 border-rose-100',
      title: '1-Click Public Sharing & Cloning',
      desc: 'Publish read-only trip links for family & friends. Browse the community hub and clone itineraries into your account.',
    },
    {
      icon: ShieldCheck,
      bg: 'bg-purple-50 text-purple-600 border-purple-100',
      title: 'Admin Analytics & Moderation',
      desc: 'Full platform insights with user management, trip statistics, and trending destination telemetry.',
    },
  ];

  const steps = [
    {
      num: '01',
      title: 'Pick Your Destinations',
      desc: 'Select cities, set arrival and departure dates, and define your trip budget in ₹ INR.',
    },
    {
      num: '02',
      title: 'Assemble Your Schedule',
      desc: 'Add curated activities, dining spots, and custom time slots. Reorder activities with drag-and-drop.',
    },
    {
      num: '03',
      title: 'Track Expenses & Share',
      desc: 'Log expenses in real time, monitor category breakdowns, and share your public link with one click.',
    },
  ];

  const testimonials = [
    {
      quote: 'GlobeTrotter made our 10-day Rajasthan trip effortless. The budget tracker kept us perfectly on track with zero spreadsheet stress!',
      name: 'Aanya Verma',
      location: 'Delhi, India',
      role: 'Solo Explorer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    },
    {
      quote: 'The drag-and-drop itinerary builder and calendar view are top tier. Cloning top community trips saved me hours of planning.',
      name: 'Rohan Mehta',
      location: 'Mumbai, India',
      role: 'Adventure Traveler',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    },
    {
      quote: 'Clean design, super fast, and easy to export. The Indian destination activities with exact ticket costs are incredibly helpful.',
      name: 'Pooja Nair',
      location: 'Bangalore, India',
      role: 'Family Vacationer',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 selection:bg-brand-500 selection:text-white font-sans">
      {/* ========================================================================= */}
      {/* 1. NAVIGATION BAR (Aligned with App Layout) */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18">
            
            {/* Brand Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-sky-400 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform shrink-0">
                <Globe className="w-5 h-5 animate-pulse" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight bg-gradient-to-r from-brand-700 via-sky-600 to-brand-600 bg-clip-text text-transparent">
                  GlobeTrotter
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider bg-brand-50 text-brand-700 border border-brand-200/60 rounded-md">
                  Planner
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-semibold text-slate-600">
              <a href="#features" className="hover:text-brand-600 transition-colors">Features</a>
              <a href="#destinations" className="hover:text-brand-600 transition-colors">Destinations</a>
              <a href="#how-it-works" className="hover:text-brand-600 transition-colors">How It Works</a>
              <a href="#testimonials" className="hover:text-brand-600 transition-colors">Reviews</a>
            </nav>

            {/* Right Action Buttons */}
            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <Link to="/dashboard">
                  <Button variant="primary" size="md" icon={ArrowRight}>
                    Go to Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-3.5 py-2 text-xs sm:text-sm font-bold text-slate-700 hover:text-brand-600 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link to="/login">
                    <Button variant="primary" size="md" icon={ArrowRight}>
                      Get Started Free
                    </Button>
                  </Link>
                </>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. HERO SECTION */}
      {/* ========================================================================= */}
      <section className="relative pt-12 pb-16 lg:pt-20 lg:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        {/* Soft Background Radial Gradient */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-b from-brand-50/80 via-sky-50/40 to-transparent -z-10 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center max-w-4xl mx-auto space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-bold shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-brand-600 animate-spin" style={{ animationDuration: '6s' }} />
            <span>Next-Gen Smart Travel Planning & Itinerary Builder</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
            Plan, Explore & Experience{' '}
            <span className="bg-gradient-to-r from-brand-700 via-sky-600 to-brand-600 bg-clip-text text-transparent">
              Unforgettable Journeys
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Organize multi-city routes with intuitive drag-and-drop, track your budget in real time (₹ INR), sync your schedule with interactive calendars, and discover curated Indian destinations.
          </p>

          {/* Call-to-Actions */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/login" className="w-full sm:w-auto">
              <Button
                variant="primary"
                size="lg"
                className="w-full sm:w-auto text-sm font-bold shadow-md shadow-brand-500/25 px-7 py-3"
                icon={Compass}
              >
                Start Planning Free
              </Button>
            </Link>

            <Link to="/login" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto text-sm font-bold shadow-2xs px-6 py-3"
                icon={Sparkles}
              >
                1-Click Demo Login (demo123)
              </Button>
            </Link>
          </div>

          {/* Value Checklist */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs font-semibold text-slate-500">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> 100% Free & No Credit Card
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Multi-City Drag & Drop
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Real-Time Budget Alerts (₹)
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> 1-Click Trip Cloning
            </span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* HERO INTERACTIVE APP SHOWCASE MOCKUP (Light Theme Aligned) */}
        {/* ========================================================================= */}
        <div className="mt-12 max-w-5xl mx-auto">
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
            
            {/* Mock Header Window */}
            <div className="bg-slate-100/80 px-4 sm:px-6 py-3.5 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="ml-3 text-xs font-semibold text-slate-500 hidden sm:inline">
                  globetrotter.app/trips/goa-beach-adventure
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Live Sync Active
                </span>
              </div>
            </div>

            {/* Mock Dashboard Body */}
            <div className="p-4 sm:p-6 lg:p-8 bg-slate-50/50">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left Side: Daily Itinerary Preview */}
                <div className="lg:col-span-7 space-y-3">
                  <div className="flex items-center justify-between pb-1">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-brand-600" />
                      <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                        Goa Beach & Coastal Adventure
                      </h3>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-brand-50 text-brand-700 border border-brand-200">
                      Day 2 of 5
                    </span>
                  </div>

                  {/* Activity Row 1 */}
                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-brand-300 transition-all flex items-center gap-3.5">
                    <div className="px-2.5 py-1 rounded-xl bg-brand-50 text-brand-700 border border-brand-200 text-xs font-bold text-center shrink-0">
                      08:30<br />13:30
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 truncate">Grande Island Scuba Diving</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200">
                          Adventure
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 truncate">Coral reef exploration with certified PADI divemaster</p>
                    </div>
                    <span className="text-xs font-extrabold text-emerald-600 shrink-0">₹3,500</span>
                  </div>

                  {/* Activity Row 2 */}
                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-brand-300 transition-all flex items-center gap-3.5">
                    <div className="px-2.5 py-1 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold text-center shrink-0">
                      16:00<br />18:30
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 truncate">Fort Aguada Sunset Viewpoint</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                          Heritage
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 truncate">Portuguese fortress ramparts overlooking Arabian Sea</p>
                    </div>
                    <span className="text-xs font-extrabold text-emerald-600 shrink-0">₹200</span>
                  </div>

                  {/* Activity Row 3 */}
                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-brand-300 transition-all flex items-center gap-3.5">
                    <div className="px-2.5 py-1 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold text-center shrink-0">
                      19:30<br />22:00
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 truncate">Beach Shack Seafood Dinner</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                          Dining
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 truncate">Candlelight dinner at Britto’s shack with live acoustics</p>
                    </div>
                    <span className="text-xs font-extrabold text-emerald-600 shrink-0">₹750</span>
                  </div>
                </div>

                {/* Right Side: Budget Breakdown Card */}
                <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
                  <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">Trip Budget Meter</span>
                      <span className="text-xs font-extrabold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-md border border-brand-200">
                        58% Utilized
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                      <div className="bg-gradient-to-r from-brand-500 to-emerald-500 h-full rounded-full w-[58%]" />
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                        <span className="text-[10px] text-slate-500 block font-semibold">Total Budget</span>
                        <span className="text-sm font-extrabold text-slate-900">₹28,000</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                        <span className="text-[10px] text-slate-500 block font-semibold">Spent So Far</span>
                        <span className="text-sm font-extrabold text-emerald-600">₹16,240</span>
                      </div>
                    </div>

                    {/* Category List */}
                    <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
                      <div className="flex justify-between font-semibold">
                        <span className="text-slate-600">Activities & Sightseeing</span>
                        <span className="text-slate-900 font-bold">₹4,450</span>
                      </div>
                      <div className="flex justify-between font-semibold">
                        <span className="text-slate-600">Accommodations & Stays</span>
                        <span className="text-slate-900 font-bold">₹7,200</span>
                      </div>
                      <div className="flex justify-between font-semibold">
                        <span className="text-slate-600">Meals & Beach Shacks</span>
                        <span className="text-slate-900 font-bold">₹3,150</span>
                      </div>
                    </div>
                  </div>

                  <Link to="/login" className="w-full">
                    <Button
                      variant="subtle"
                      size="md"
                      className="w-full text-xs font-bold"
                      icon={Copy}
                    >
                      Log In to Clone This Trip to Your Account
                    </Button>
                  </Link>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. PLATFORM FEATURES (Clean Card Grid) */}
      {/* ========================================================================= */}
      <section id="features" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <span className="text-xs uppercase tracking-wider text-brand-600 font-extrabold">
            Core Features
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Everything You Need to Plan Flawless Trips
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Eliminate chaotic spreadsheets and scattered notes. GlobeTrotter unifies every aspect of your travel itinerary in one intuitive workspace.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-brand-300 transition-all flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className={`w-12 h-12 rounded-2xl border ${item.bg} flex items-center justify-center group-hover:scale-105 transition-transform shrink-0`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
                <div className="pt-5 mt-5 border-t border-slate-100">
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700"
                  >
                    <span>Explore feature</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. DESTINATIONS SHOWCASE */}
      {/* ========================================================================= */}
      <section id="destinations" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-wider text-brand-600 font-extrabold">
              Destinations Guide
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Featured Indian Destinations
            </h2>
            <p className="text-slate-600 text-sm sm:text-base max-w-xl">
              Discover vetted activities, sightseeing highlights, and estimated budgets for iconic travel hubs across India.
            </p>
          </div>
          <Link to="/login">
            <Button variant="outline" size="md" icon={ArrowRight}>
              Browse All Cities
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {destinations.map((dest, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-brand-300 overflow-hidden transition-all flex flex-col group"
            >
              {/* Photo */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[11px] font-extrabold text-brand-700 border border-brand-200 shadow-2xs">
                  {dest.badge}
                </span>
                <div className="absolute bottom-3 left-3 px-2 py-0.5 rounded-md bg-slate-900/70 backdrop-blur-sm text-white text-xs font-bold flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{dest.rating}</span>
                </div>
              </div>

              {/* Card Details */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-extrabold text-slate-900">{dest.name}</h3>
                    <span className="text-xs font-semibold text-slate-500">{dest.state}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                    {dest.tagline}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 block">Avg Budget</span>
                    <span className="font-extrabold text-emerald-600">{dest.avgBudget}</span>
                  </div>
                  <Link
                    to="/login"
                    className="font-bold text-brand-600 hover:text-brand-700"
                  >
                    View details →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. HOW IT WORKS (3 Simple Steps) */}
      {/* ========================================================================= */}
      <section id="how-it-works" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <span className="text-xs uppercase tracking-wider text-brand-600 font-extrabold">
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Plan Your Vacation in 3 Easy Steps
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            From initial brainstorm to full day-by-day itineraries and budget tracking in under 5 minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {steps.map((s, idx) => (
            <div
              key={idx}
              className="p-7 rounded-3xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <span className="text-4xl font-black text-brand-600/30 font-mono">
                  {s.num}
                </span>
                <h3 className="text-lg font-extrabold text-slate-900">
                  {s.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {s.desc}
                </p>
              </div>
              <div className="pt-5 mt-5 border-t border-slate-100">
                <Link
                  to="/login"
                  className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
                >
                  <span>Get started</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. STATS & TESTIMONIALS */}
      {/* ========================================================================= */}
      <section id="testimonials" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200">
        {/* Key Metrics Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8 rounded-3xl bg-gradient-to-tr from-brand-700 via-brand-600 to-sky-600 text-white shadow-lg mb-16">
          <div className="text-center space-y-1">
            <span className="text-3xl sm:text-4xl font-black">15,000+</span>
            <p className="text-xs font-semibold text-brand-100 uppercase tracking-wider">Trips Planned</p>
          </div>
          <div className="text-center space-y-1">
            <span className="text-3xl sm:text-4xl font-black">98.4%</span>
            <p className="text-xs font-semibold text-brand-100 uppercase tracking-wider">Satisfaction</p>
          </div>
          <div className="text-center space-y-1">
            <span className="text-3xl sm:text-4xl font-black">₹4.5Cr+</span>
            <p className="text-xs font-semibold text-brand-100 uppercase tracking-wider">Budgets Managed</p>
          </div>
          <div className="text-center space-y-1">
            <span className="text-3xl sm:text-4xl font-black">50+</span>
            <p className="text-xs font-semibold text-brand-100 uppercase tracking-wider">Destinations</p>
          </div>
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="p-7 rounded-3xl bg-white border border-slate-200/90 shadow-2xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-600 italic leading-relaxed">
                  "{t.quote}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-brand-500/20"
                />
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900">{t.name}</h4>
                  <span className="text-[11px] text-slate-500">{t.role} • {t.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. HIGH-CONVERTING BOTTOM CTA */}
      {/* ========================================================================= */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden p-8 sm:p-14 text-center bg-gradient-to-tr from-brand-700 via-brand-600 to-sky-600 text-white shadow-xl">
          <div className="relative z-10 max-w-3xl mx-auto space-y-5">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              Ready for Your Next Great Adventure?
            </h2>
            <p className="text-sm sm:text-base text-brand-50 max-w-xl mx-auto">
              Join thousands of travelers planning itineraries, tracking budgets, and sharing trips worldwide.
            </p>
            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/login" className="w-full sm:w-auto">
                <button
                  type="button"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white text-slate-900 font-extrabold text-sm shadow-md hover:bg-slate-50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  <span>Create Account Free</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
              <Link to="/login" className="w-full sm:w-auto">
                <button
                  type="button"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-brand-800/60 hover:bg-brand-800 text-white border border-brand-400/40 font-bold text-sm transition-all"
                >
                  Sign In to Existing Account
                </button>
              </Link>
            </div>
            <p className="text-xs text-brand-100 pt-1">
              No credit card required • Instant access in under 30 seconds
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. FOOTER (Clean & Aligned) */}
      {/* ========================================================================= */}
      <footer className="border-t border-slate-200 bg-white py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-sky-400 flex items-center justify-center text-white shadow-sm shrink-0">
              <Globe className="w-4 h-4" />
            </div>
            <span className="text-sm font-black text-slate-900">
              Globe<span className="text-brand-600">Trotter</span>
            </span>
            <span className="text-xs text-slate-400">
              © {new Date().getFullYear()} All rights reserved.
            </span>
          </div>

          <div className="flex items-center gap-5 text-xs text-slate-500 font-semibold">
            <Link to="/login" className="hover:text-brand-600 transition-colors">Sign In</Link>
            <Link to="/register" className="hover:text-brand-600 transition-colors">Register</Link>
            <a href="#features" className="hover:text-brand-600 transition-colors">Features</a>
            <a href="#destinations" className="hover:text-brand-600 transition-colors">Destinations</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
