import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import {
  Plane,
  Hotel,
  Compass,
  UtensilsCrossed,
  Sparkles,
  PieChart as PieChartIcon,
} from 'lucide-react';
import { formatCurrency } from '../../../utils/currencyUtils';

const CATEGORY_CONFIG = {
  TRANSPORT: {
    label: 'Transport',
    color: '#0284c7', // sky-600
    icon: Plane,
    bgClass: 'bg-sky-50 text-sky-700 border-sky-200',
  },
  STAY: {
    label: 'Stay',
    color: '#6366f1', // indigo-500
    icon: Hotel,
    bgClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  },
  ACTIVITY: {
    label: 'Activities',
    color: '#10b981', // emerald-500
    icon: Compass,
    bgClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  MEAL: {
    label: 'Meals',
    color: '#f59e0b', // amber-500
    icon: UtensilsCrossed,
    bgClass: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  MISCELLANEOUS: {
    label: 'Miscellaneous',
    color: '#8b5cf6', // purple-500
    icon: Sparkles,
    bgClass: 'bg-purple-50 text-purple-700 border-purple-200',
  },
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const item = payload[0];
    const categoryKey = item.name;
    const config = CATEGORY_CONFIG[categoryKey] || { label: categoryKey, color: '#64748b' };
    const Icon = config.icon || Sparkles;

    return (
      <div className="bg-slate-900 text-white px-3.5 py-2.5 rounded-xl shadow-xl border border-slate-700 text-xs">
        <div className="flex items-center gap-2 mb-1">
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: config.color }}
          />
          <span className="font-bold">{config.label}</span>
        </div>
        <p className="text-sm font-black text-white">{formatCurrency(item.value)}</p>
        {item.payload.percent !== undefined && (
          <p className="text-[10px] text-slate-400 mt-0.5">
            {item.payload.percent}% of estimated trip budget
          </p>
        )}
      </div>
    );
  }
  return null;
};

export default function CategoryPieChart({ categoryBreakdown = {}, total = 0 }) {
  const chartData = Object.keys(categoryBreakdown)
    .map((key) => {
      const amount = categoryBreakdown[key] || 0;
      const percent = total > 0 ? Number(((amount / total) * 100).toFixed(1)) : 0;
      return {
        name: key,
        value: amount,
        percent,
      };
    })
    .filter((item) => item.value > 0);

  const hasData = chartData.length > 0;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">
            <PieChartIcon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 leading-tight">
              Expense Categories
            </h3>
            <p className="text-xs text-slate-500">Distribution across 5 key buckets</p>
          </div>
        </div>
        <span className="text-xs font-extrabold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
          Total: {formatCurrency(total)}
        </span>
      </div>

      {!hasData ? (
        <div className="py-12 text-center text-slate-400">
          <PieChartIcon className="w-10 h-10 mx-auto stroke-1 mb-2 text-slate-300" />
          <p className="text-xs font-semibold">No expenses recorded yet</p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Add manual expenses or schedule activities to see breakdown.
          </p>
        </div>
      ) : (
        <>
          <div className="h-64 w-full my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                  animationDuration={600}
                >
                  {chartData.map((entry) => {
                    const config = CATEGORY_CONFIG[entry.name] || { color: '#64748b' };
                    return (
                      <Cell
                        key={`cell-${entry.name}`}
                        fill={config.color}
                        stroke="#ffffff"
                        strokeWidth={2}
                      />
                    );
                  })}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Interactive Legend List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-4 border-t border-slate-100">
            {Object.keys(CATEGORY_CONFIG).map((catKey) => {
              const config = CATEGORY_CONFIG[catKey];
              const Icon = config.icon;
              const amount = categoryBreakdown[catKey] || 0;
              const percent = total > 0 ? ((amount / total) * 100).toFixed(1) : 0;

              return (
                <div
                  key={catKey}
                  className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: config.color }}
                    />
                    <span className="text-xs font-semibold text-slate-700">
                      {config.label}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-900 block">
                      {formatCurrency(amount)}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {percent}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
