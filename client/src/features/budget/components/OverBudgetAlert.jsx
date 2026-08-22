import React, { useState } from 'react';
import {
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  Calendar,
  DollarSign,
  Info,
} from 'lucide-react';
import { formatCurrency } from '../../../utils/currencyUtils';
import { formatShortDate } from '../../../utils/dateUtils';

export default function OverBudgetAlert({
  overBudgetDays = [],
  averageDailyBudget = 0,
  tripBudget = 0,
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!overBudgetDays || overBudgetDays.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-amber-500/10 border-2 border-amber-300 rounded-3xl p-5 mb-8 shadow-xs animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-amber-500/20">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight">
                ⚠️ Budget Advisory: {overBudgetDays.length}{' '}
                {overBudgetDays.length === 1 ? 'Day Exceeds' : 'Days Exceed'} Target Daily Average
              </h4>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
                Non-blocking
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              Your average daily target is{' '}
              <strong className="text-slate-900">{formatCurrency(averageDailyBudget)}/day</strong>.
              Review high-spend days below to rebalance activities or transport.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-white text-slate-800 border border-slate-200 hover:bg-slate-50 transition-colors shrink-0 shadow-2xs self-start sm:self-auto"
        >
          {isExpanded ? (
            <>
              <span>Hide Details</span>
              <ChevronUp className="w-4 h-4" />
            </>
          ) : (
            <>
              <span>Inspect {overBudgetDays.length} Days</span>
              <ChevronDown className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      {/* Expandable detailed day breakdown */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-amber-200/80 space-y-3 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {overBudgetDays.map((day) => (
              <div
                key={day.date}
                className="bg-white rounded-2xl p-4 border border-amber-200/90 shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-bold">
                      Day {day.dayNumber}: {formatShortDate(day.date)}
                    </span>
                    <span className="text-[11px] font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                      +{formatCurrency(day.overBudgetAmount)}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Total Day Spending:</span>
                      <strong className="text-slate-900 font-extrabold">
                        {formatCurrency(day.total)}
                      </strong>
                    </div>
                    <div className="flex justify-between text-slate-500 text-[11px]">
                      <span>Activities ({day.activities.length}):</span>
                      <span>{formatCurrency(day.activitiesCost)}</span>
                    </div>
                    <div className="flex justify-between text-slate-500 text-[11px]">
                      <span>Expenses ({day.expenses.length}):</span>
                      <span>{formatCurrency(day.expensesCost)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center gap-1.5 text-[10px] text-amber-700 font-semibold">
                  <Info className="w-3 h-3 shrink-0" />
                  <span>Exceeds daily average of {formatCurrency(averageDailyBudget)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
