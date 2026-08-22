import React from 'react';
import {
  DollarSign,
  TrendingUp,
  Wallet,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  PieChart,
} from 'lucide-react';
import { formatCurrency } from '../../../utils/currencyUtils';

export default function BudgetSummaryCards({ data }) {
  if (!data) return null;

  const {
    budget = 0,
    total = 0,
    remaining = 0,
    averagePerDay = 0,
    averageDailyBudget = 0,
    utilization = 0,
    durationDays = 1,
    overBudgetDays = [],
  } = data;

  const isOverTotalBudget = remaining < 0;
  const hasOverBudgetDays = overBudgetDays.length > 0;

  return (
    <div className="space-y-4 mb-8">
      {/* 4 Core Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Budget Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Trip Budget
            </span>
            <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-slate-900 tracking-tight block">
              {formatCurrency(budget)}
            </span>
            <span className="text-xs text-slate-500 mt-1 block">
              Target for {durationDays} {durationDays === 1 ? 'day' : 'days'}
            </span>
          </div>
        </div>

        {/* Total Estimated Cost Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Estimated
            </span>
            <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-slate-900 tracking-tight block">
              {formatCurrency(total)}
            </span>
            <span className="text-xs text-slate-500 mt-1 block">
              Activities + Expenses
            </span>
          </div>
        </div>

        {/* Remaining Budget Card */}
        <div
          className={`rounded-2xl border p-5 shadow-xs transition-all hover:shadow-md ${
            isOverTotalBudget
              ? 'bg-rose-50/70 border-rose-200'
              : 'bg-emerald-50/70 border-emerald-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span
              className={`text-xs font-bold uppercase tracking-wider ${
                isOverTotalBudget ? 'text-rose-700' : 'text-emerald-700'
              }`}
            >
              {isOverTotalBudget ? 'Over Budget By' : 'Remaining Budget'}
            </span>
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                isOverTotalBudget
                  ? 'bg-rose-100 text-rose-700'
                  : 'bg-emerald-100 text-emerald-700'
              }`}
            >
              {isOverTotalBudget ? (
                <AlertTriangle className="w-4 h-4" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}
            </div>
          </div>
          <div className="mt-3">
            <span
              className={`text-2xl font-black tracking-tight block ${
                isOverTotalBudget ? 'text-rose-800' : 'text-emerald-800'
              }`}
            >
              {formatCurrency(Math.abs(remaining))}
            </span>
            <span
              className={`text-xs mt-1 block font-medium ${
                isOverTotalBudget ? 'text-rose-600' : 'text-emerald-600'
              }`}
            >
              {isOverTotalBudget
                ? 'Exceeds target limit'
                : `${(100 - Math.min(utilization, 100)).toFixed(1)}% buffer left`}
            </span>
          </div>
        </div>

        {/* Average Cost Per Day Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Avg Cost / Day
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-slate-900 tracking-tight block">
              {formatCurrency(averagePerDay)}
            </span>
            <span className="text-xs text-slate-500 mt-1 block">
              Budget target: {formatCurrency(averageDailyBudget)}/day
            </span>
          </div>
        </div>
      </div>

      {/* Budget Utilization Progress Bar */}
      {budget > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
            <div className="flex items-center gap-2">
              <PieChart className="w-4 h-4 text-brand-600" />
              <span className="text-sm font-bold text-slate-800">
                Budget Utilization
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  utilization > 100
                    ? 'bg-rose-100 text-rose-800 border border-rose-200'
                    : utilization > 85
                    ? 'bg-amber-100 text-amber-800 border border-amber-200'
                    : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                }`}
              >
                {utilization}%
              </span>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              {formatCurrency(total)} spent of {formatCurrency(budget)}
            </span>
          </div>

          {/* Bar track */}
          <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                utilization > 100
                  ? 'bg-gradient-to-r from-rose-500 to-red-600'
                  : utilization > 85
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                  : 'bg-gradient-to-r from-brand-500 to-emerald-500'
              }`}
              style={{ width: `${Math.min(utilization, 100)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
