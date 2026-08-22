import React from 'react';
import { DollarSign, Calendar, MapPin, TrendingUp, Sparkles } from 'lucide-react';
import Card from '../../../components/ui/Card';
import { formatCurrency } from '../../../utils/currencyUtils';

export default function BudgetHighlight({
  trips = [],
  savedCount = 0,
}) {
  const totalTrips = trips.length;
  const totalBudget = trips.reduce((sum, t) => sum + (t.budget || 0), 0);
  const totalStops = trips.reduce((sum, t) => sum + (t.tripStops?.length || 0), 0);

  const stats = [
    {
      label: 'Planned Trips',
      value: totalTrips,
      subtext: 'Active and upcoming',
      icon: Calendar,
      color: 'bg-brand-50 text-brand-600 border-brand-200',
    },
    {
      label: 'Total Budgeted',
      value: formatCurrency(totalBudget),
      subtext: 'Across all journeys',
      icon: DollarSign,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    },
    {
      label: 'Destinations Visited',
      value: `${totalStops} Stops`,
      subtext: 'Across international cities',
      icon: MapPin,
      color: 'bg-purple-50 text-purple-600 border-purple-200',
    },
    {
      label: 'Saved Destinations',
      value: savedCount,
      subtext: 'In your bucket list',
      icon: Sparkles,
      color: 'bg-amber-50 text-amber-600 border-amber-200',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.label} className="p-5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shrink-0 ${stat.color}`}>
              <Icon className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block truncate">
                {stat.label}
              </span>
              <span className="text-xl font-extrabold text-slate-900 block leading-tight">
                {stat.value}
              </span>
              <span className="text-[11px] text-slate-500 truncate block mt-0.5">
                {stat.subtext}
              </span>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
