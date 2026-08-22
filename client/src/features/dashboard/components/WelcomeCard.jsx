import React from 'react';
import { Sparkles, Compass, Plus, Plane } from 'lucide-react';
import Button from '../../../components/ui/Button';

export default function WelcomeCard({
  userName,
  onPlanTrip,
}) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-brand-950 p-6 sm:p-8 text-white shadow-md border border-slate-800 mb-8">
      {/* Background decoration elements */}
      <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-sky-500/20 via-brand-600/10 to-transparent pointer-events-none" />
      <div className="absolute -right-6 -bottom-10 opacity-10 text-white pointer-events-none">
        <Plane className="w-64 h-64 transform -rotate-12" />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-brand-500/20 text-brand-300 border border-brand-400/30 mb-3 backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Travel Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
            Welcome back, {userName || 'Traveler'}!
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-300 leading-relaxed">
            Ready for your next adventure? Organize your itineraries, explore world-class destinations, and optimize your travel schedule.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button
            variant="primary"
            size="lg"
            onClick={onPlanTrip}
            icon={Plus}
            className="shadow-xl shadow-brand-500/25 bg-brand-600 hover:bg-brand-500 text-white font-bold"
          >
            Plan New Trip
          </Button>
        </div>
      </div>
    </div>
  );
}
