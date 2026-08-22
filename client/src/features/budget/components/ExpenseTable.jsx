import React, { useState } from 'react';
import {
  Plane,
  Hotel,
  Compass,
  UtensilsCrossed,
  Sparkles,
  Search,
  Plus,
  Pencil,
  Trash2,
  Calendar,
  Receipt,
  ArrowUpDown,
} from 'lucide-react';
import Button from '../../../components/ui/Button';
import { formatCurrency } from '../../../utils/currencyUtils';
import { formatShortDate } from '../../../utils/dateUtils';

const CATEGORY_BADGES = {
  TRANSPORT: {
    label: 'Transport',
    icon: Plane,
    bg: 'bg-sky-50 text-sky-700 border-sky-200',
  },
  STAY: {
    label: 'Stay',
    icon: Hotel,
    bg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  },
  ACTIVITY: {
    label: 'Activity',
    icon: Compass,
    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  MEAL: {
    label: 'Meal',
    icon: UtensilsCrossed,
    bg: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  MISCELLANEOUS: {
    label: 'Misc',
    icon: Sparkles,
    bg: 'bg-purple-50 text-purple-700 border-purple-200',
  },
};

export default function ExpenseTable({
  expenses = [],
  onAddExpense,
  onEditExpense,
  onDeleteExpense,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [sortBy, setSortBy] = useState('date-desc');

  // Filter expenses
  let filtered = expenses.filter((exp) => {
    const matchesCategory =
      selectedCategory === 'ALL' ||
      exp.category?.toUpperCase() === selectedCategory.toUpperCase();

    const matchesSearch =
      !searchTerm.trim() ||
      exp.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exp.category?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  // Sort expenses
  filtered.sort((a, b) => {
    if (sortBy === 'date-desc') {
      return new Date(b.date) - new Date(a.date);
    }
    if (sortBy === 'date-asc') {
      return new Date(a.date) - new Date(b.date);
    }
    if (sortBy === 'amount-desc') {
      return b.amount - a.amount;
    }
    if (sortBy === 'amount-asc') {
      return a.amount - b.amount;
    }
    return 0;
  });

  const totalFilteredAmount = filtered.reduce((sum, e) => sum + (e.amount || 0), 0);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
      {/* Header & Actions Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 leading-tight">
              Recorded Expenses
            </h3>
            <span className="text-xs font-extrabold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
              {expenses.length} Total
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Log hotel receipts, flight tickets, dining bills, and transport costs.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={onAddExpense}
          className="flex items-center gap-2 self-start lg:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Expense</span>
        </Button>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search expenses by description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter Pills */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-50 border border-slate-200 text-slate-700 focus:bg-white focus:border-brand-500 focus:outline-none"
          >
            <option value="ALL">All Categories</option>
            <option value="TRANSPORT">Transport</option>
            <option value="STAY">Stay</option>
            <option value="ACTIVITY">Activity</option>
            <option value="MEAL">Meals</option>
            <option value="MISCELLANEOUS">Miscellaneous</option>
          </select>

          {/* Sort Selector */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-50 border border-slate-200 text-slate-700 focus:bg-white focus:border-brand-500 focus:outline-none"
          >
            <option value="date-desc">Newest Date</option>
            <option value="date-asc">Oldest Date</option>
            <option value="amount-desc">Highest Cost</option>
            <option value="amount-asc">Lowest Cost</option>
          </select>
        </div>
      </div>

      {/* Table Content */}
      {filtered.length === 0 ? (
        <div className="py-12 text-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50">
          <Receipt className="w-10 h-10 mx-auto stroke-1 mb-2 text-slate-300" />
          <h4 className="text-sm font-bold text-slate-700">No expenses found</h4>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            {searchTerm || selectedCategory !== 'ALL'
              ? 'Try clearing your filters or search keywords.'
              : 'Add your first transportation, accommodation, or meal expense to track finances.'}
          </p>
          <Button
            variant="outline"
            onClick={onAddExpense}
            className="mt-4 inline-flex items-center gap-1.5 text-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Expense</span>
          </Button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3.5">Category</th>
                <th className="px-4 py-3.5">Description</th>
                <th className="px-4 py-3.5">Date</th>
                <th className="px-4 py-3.5 text-right">Amount</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((expense) => {
                const badge = CATEGORY_BADGES[expense.category?.toUpperCase()] || {
                  label: expense.category,
                  icon: Sparkles,
                  bg: 'bg-slate-50 text-slate-700 border-slate-200',
                };
                const Icon = badge.icon;

                return (
                  <tr
                    key={expense.id}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    {/* Category Badge */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold border ${badge.bg}`}
                      >
                        <Icon className="w-3 h-3" />
                        <span>{badge.label}</span>
                      </span>
                    </td>

                    {/* Description */}
                    <td className="px-4 py-3.5 font-semibold text-slate-900 max-w-xs truncate">
                      {expense.description}
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3.5 whitespace-nowrap text-slate-600 font-medium">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {formatShortDate(expense.date)}
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="px-4 py-3.5 whitespace-nowrap text-right font-black text-slate-900">
                      {formatCurrency(expense.amount)}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1.5 opacity-90 group-hover:opacity-100">
                        <button
                          type="button"
                          onClick={() => onEditExpense(expense)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-brand-600 hover:bg-brand-50 transition-colors"
                          title="Edit expense"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteExpense(expense)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete expense"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            {/* Table Footer with Filtered Subtotal */}
            <tfoot className="bg-slate-50 border-t border-slate-200">
              <tr>
                <td colSpan={3} className="px-4 py-3 text-xs font-bold text-slate-600">
                  Subtotal ({filtered.length} items):
                </td>
                <td className="px-4 py-3 text-right text-xs font-black text-slate-900">
                  {formatCurrency(totalFilteredAmount)}
                </td>
                <td className="px-4 py-3" />
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
}
