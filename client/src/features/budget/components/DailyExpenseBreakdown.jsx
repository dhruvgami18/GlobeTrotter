import React, { useState } from 'react';
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  Compass,
  Receipt,
  AlertTriangle,
  Clock,
  MapPin,
} from 'lucide-react';
import { formatCurrency } from '../../../utils/currencyUtils';
import { formatShortDate } from '../../../utils/dateUtils';

export default function DailyExpenseBreakdown({
  dailyBreakdown = [],
  averageDailyBudget = 0,
}) {
  // Keep first 2 days open by default
  const [openDays, setOpenDays] = useState({ 0: true, 1: true });

  const toggleDay = (idx) => {
    setOpenDays((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  if (!dailyBreakdown || dailyBreakdown.length === 0) return null;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 leading-tight">
              Day-by-Day Itemized Schedule
            </h3>
            <p className="text-xs text-slate-500">
              Combined scheduled activities and logged expenses per date
            </p>
          </div>
        </div>
        <span className="text-xs font-semibold text-slate-500">
          {dailyBreakdown.length} Days Total
        </span>
      </div>

      <div className="space-y-3">
        {dailyBreakdown.map((day, idx) => {
          const isOpen = Boolean(openDays[idx]);
          const isOver = day.isOverBudget;
          const totalItems = (day.activities?.length || 0) + (day.expenses?.length || 0);

          return (
            <div
              key={day.date}
              className={`rounded-2xl border transition-all ${
                isOver
                  ? 'border-amber-300 bg-amber-50/20'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              {/* Accordion Header */}
              <button
                type="button"
                onClick={() => toggleDay(idx)}
                className="w-full px-5 py-3.5 flex items-center justify-between gap-4 text-left"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-extrabold shrink-0 ${
                      isOver
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    D{day.dayNumber}
                  </span>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">
                        {formatShortDate(day.date)}
                      </span>
                      {isOver && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-100 text-rose-700 border border-rose-200 flex items-center gap-1">
                          <AlertTriangle className="w-2.5 h-2.5" />
                          Over Avg
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400">
                      {totalItems} {totalItems === 1 ? 'item' : 'items'} planned
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span className="text-sm font-black text-slate-900 block">
                      {formatCurrency(day.total)}
                    </span>
                    {averageDailyBudget > 0 && (
                      <span className="text-[10px] text-slate-400 block font-medium">
                        Target: {formatCurrency(averageDailyBudget)}
                      </span>
                    )}
                  </div>
                  <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                    {isOpen ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </div>
                </div>
              </button>

              {/* Accordion Expanded Body */}
              {isOpen && (
                <div className="px-5 pb-4 pt-2 border-t border-slate-100 space-y-3 animate-in fade-in duration-150">
                  {totalItems === 0 ? (
                    <p className="text-xs text-slate-400 italic py-2">
                      No activities or expenses logged for this date.
                    </p>
                  ) : (
                    <>
                      {/* Activities Section */}
                      {day.activities && day.activities.length > 0 && (
                        <div>
                          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1.5 flex items-center gap-1">
                            <Compass className="w-3 h-3 text-emerald-500" />
                            Itinerary Activities ({day.activities.length})
                          </span>
                          <div className="space-y-1.5">
                            {day.activities.map((act) => (
                              <div
                                key={act.id}
                                className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs"
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  {act.time && (
                                    <span className="text-[10px] font-bold text-slate-500 flex items-center gap-0.5 shrink-0 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                                      <Clock className="w-2.5 h-2.5" />
                                      {act.time}
                                    </span>
                                  )}
                                  <span className="font-semibold text-slate-800 truncate">
                                    {act.name}
                                  </span>
                                  {act.cityName && (
                                    <span className="text-[10px] text-slate-400 shrink-0">
                                      ({act.cityName})
                                    </span>
                                  )}
                                </div>
                                <span className="font-extrabold text-slate-900 shrink-0 pl-2">
                                  {formatCurrency(act.cost)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Expenses Section */}
                      {day.expenses && day.expenses.length > 0 && (
                        <div>
                          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1.5 flex items-center gap-1">
                            <Receipt className="w-3 h-3 text-sky-500" />
                            Logged Expenses ({day.expenses.length})
                          </span>
                          <div className="space-y-1.5">
                            {day.expenses.map((exp) => (
                              <div
                                key={exp.id}
                                className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs"
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <span className="text-[10px] font-bold text-slate-500 uppercase px-1.5 py-0.5 rounded bg-white border border-slate-200 shrink-0">
                                    {exp.category}
                                  </span>
                                  <span className="font-semibold text-slate-800 truncate">
                                    {exp.description}
                                  </span>
                                </div>
                                <span className="font-extrabold text-slate-900 shrink-0 pl-2">
                                  {formatCurrency(exp.amount)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
