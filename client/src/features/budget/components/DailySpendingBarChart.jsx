import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from 'recharts';
import { BarChart3, AlertTriangle, Calendar } from 'lucide-react';
import { formatCurrency } from '../../../utils/currencyUtils';
import { formatShortDate } from '../../../utils/dateUtils';

const CustomBarTooltip = ({ active, payload, averageDailyBudget }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const isOver = data.isOverBudget;

    return (
      <div className="bg-slate-900 text-white px-3.5 py-2.5 rounded-xl shadow-xl border border-slate-700 text-xs">
        <div className="flex items-center justify-between gap-3 mb-1">
          <span className="font-bold text-slate-200">
            Day {data.dayNumber}: {formatShortDate(data.date)}
          </span>
          {isOver && (
            <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-bold border border-rose-500/30 flex items-center gap-1">
              <AlertTriangle className="w-2.5 h-2.5" /> Over Budget
            </span>
          )}
        </div>

        <p className="text-base font-black text-white">{formatCurrency(data.total)}</p>

        <div className="mt-2 pt-2 border-t border-slate-800 space-y-1 text-[11px]">
          <div className="flex justify-between text-slate-400">
            <span>Activities:</span>
            <span className="text-slate-200 font-semibold">{formatCurrency(data.activitiesCost)}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Expenses:</span>
            <span className="text-slate-200 font-semibold">{formatCurrency(data.expensesCost)}</span>
          </div>
          {averageDailyBudget > 0 && (
            <div className="flex justify-between text-slate-400 pt-1 border-t border-slate-800/80">
              <span>Avg Daily Target:</span>
              <span className="text-brand-300 font-semibold">{formatCurrency(averageDailyBudget)}</span>
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
};

export default function DailySpendingBarChart({
  dailyBreakdown = [],
  averageDailyBudget = 0,
}) {
  const chartData = dailyBreakdown.map((d) => ({
    ...d,
    formattedDate: formatShortDate(d.date),
  }));

  const hasData = chartData.some((d) => d.total > 0);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 leading-tight">
              Daily Spending Timeline
            </h3>
            <p className="text-xs text-slate-500">
              Estimated costs allocated per calendar day
            </p>
          </div>
        </div>

        {averageDailyBudget > 0 && (
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 self-start sm:self-auto">
            <span className="w-2.5 h-0.5 bg-amber-500 rounded-full" />
            <span>Avg Target: {formatCurrency(averageDailyBudget)}/day</span>
          </div>
        )}
      </div>

      {!hasData ? (
        <div className="py-12 text-center text-slate-400">
          <Calendar className="w-10 h-10 mx-auto stroke-1 mb-2 text-slate-300" />
          <p className="text-xs font-semibold">No daily spending recorded</p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Add itinerary activities or expenses to populate timeline.
          </p>
        </div>
      ) : (
        <div className="h-64 w-full my-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="formattedDate"
                tickLine={false}
                axisLine={{ stroke: '#e2e8f0' }}
                tick={{ fontSize: 11, fill: '#64748b', fontWeight: 500 }}
              />
              <YAxis
                tickLine={false}
                axisLine={{ stroke: '#e2e8f0' }}
                tick={{ fontSize: 11, fill: '#64748b' }}
                tickFormatter={(val) => `$${val}`}
              />
              <Tooltip
                content={<CustomBarTooltip averageDailyBudget={averageDailyBudget} />}
              />
              {averageDailyBudget > 0 && (
                <ReferenceLine
                  y={averageDailyBudget}
                  stroke="#f59e0b"
                  strokeDasharray="4 4"
                  strokeWidth={2}
                  label={{
                    value: 'Daily Target',
                    position: 'insideTopRight',
                    fill: '#b45309',
                    fontSize: 10,
                    fontWeight: 600,
                  }}
                />
              )}
              <Bar dataKey="total" radius={[6, 6, 0, 0]} maxBarSize={48}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`bar-cell-${index}`}
                    fill={entry.isOverBudget ? '#f43f5e' : '#0ea5e9'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Legend & Over-budget helper */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-500">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-sky-500" />
            <span>Within Target</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-rose-500" />
            <span>Above Daily Avg</span>
          </div>
        </div>
        <span className="text-[11px] text-slate-400">
          {dailyBreakdown.length} scheduled days
        </span>
      </div>
    </div>
  );
}
