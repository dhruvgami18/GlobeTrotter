import React from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  TrendingUp,
  MapPin,
  Compass,
  PieChart as PieIcon,
  Sparkles,
} from 'lucide-react';
import { formatCurrency } from '../../../utils/currencyUtils';

const DONUT_COLORS = ['#10b981', '#64748b'];

export default function AdminAnalyticsCharts({
  tripsCreatedOverTime = [],
  popularCities = [],
  popularActivities = [],
  publicTrips = 0,
  privateTrips = 0,
}) {
  const publicPrivateData = [
    { name: 'Public Trips', value: publicTrips },
    { name: 'Private Trips', value: privateTrips },
  ].filter((d) => d.value > 0);

  const topCitiesData = popularCities.slice(0, 6).map((c) => ({
    name: c.name,
    stops: c.stopsCount,
  }));

  const topActivitiesData = popularActivities.slice(0, 6).map((a) => ({
    name: a.name.length > 22 ? `${a.name.substring(0, 22)}...` : a.name,
    fullName: a.name,
    count: a.itineraryCount,
    rating: a.rating,
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* 1. Trips Created Over Time Area Chart */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-tight">
                Trip Creations Over Time
              </h3>
              <p className="text-xs text-slate-500">Monthly new travel itineraries</p>
            </div>
          </div>
        </div>

        <div className="h-64 w-full my-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={tripsCreatedOverTime}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="tripGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0284c7" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#0284c7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={{ stroke: '#e2e8f0' }}
                tick={{ fontSize: 11, fill: '#64748b' }}
              />
              <YAxis
                tickLine={false}
                axisLine={{ stroke: '#e2e8f0' }}
                tick={{ fontSize: 11, fill: '#64748b' }}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '0.75rem',
                  fontSize: '0.75rem',
                  color: '#ffffff',
                }}
              />
              <Area
                type="monotone"
                dataKey="trips"
                name="Trips Created"
                stroke="#0284c7"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#tripGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Top Cities by Stops Bar Chart */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-tight">
                Top Visited Cities
              </h3>
              <p className="text-xs text-slate-500">Ranked by total trip stops planned</p>
            </div>
          </div>
        </div>

        <div className="h-64 w-full my-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={topCitiesData}
              layout="vertical"
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
              <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis
                dataKey="name"
                type="category"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: '#334155', fontWeight: 600 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '0.75rem',
                  fontSize: '0.75rem',
                  color: '#ffffff',
                }}
              />
              <Bar dataKey="stops" name="Stops Count" fill="#3b82f6" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. Popular Activities Bar Chart */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-tight">
                Most Scheduled Activities
              </h3>
              <p className="text-xs text-slate-500">Activities added most to itineraries</p>
            </div>
          </div>
        </div>

        <div className="h-64 w-full my-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={topActivitiesData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={{ stroke: '#e2e8f0' }}
                tick={{ fontSize: 10, fill: '#64748b' }}
              />
              <YAxis
                tickLine={false}
                axisLine={{ stroke: '#e2e8f0' }}
                tick={{ fontSize: 11, fill: '#64748b' }}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '0.75rem',
                  fontSize: '0.75rem',
                  color: '#ffffff',
                }}
              />
              <Bar dataKey="count" name="Times Scheduled" fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. Public vs Private Trips Donut */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <PieIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-tight">
                Public vs. Private Trips
              </h3>
              <p className="text-xs text-slate-500">Trip visibility distribution</p>
            </div>
          </div>
        </div>

        <div className="h-64 w-full my-2">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={publicPrivateData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {publicPrivateData.map((entry, index) => (
                  <Cell
                    key={`donut-${index}`}
                    fill={DONUT_COLORS[index % DONUT_COLORS.length]}
                    stroke="#ffffff"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '0.75rem',
                  fontSize: '0.75rem',
                  color: '#ffffff',
                }}
              />
              <Legend
                verticalAlign="bottom"
                iconType="circle"
                wrapperStyle={{ fontSize: '0.75rem', paddingTop: '10px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
