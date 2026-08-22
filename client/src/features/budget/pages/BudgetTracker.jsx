import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Calendar,
  DollarSign,
  TrendingUp,
  Share2,
  Plus,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Wallet,
} from 'lucide-react';
import BudgetSummaryCards from '../components/BudgetSummaryCards';
import CategoryPieChart from '../components/CategoryPieChart';
import DailySpendingBarChart from '../components/DailySpendingBarChart';
import OverBudgetAlert from '../components/OverBudgetAlert';
import ExpenseTable from '../components/ExpenseTable';
import ExpenseModal from '../components/ExpenseModal';
import DailyExpenseBreakdown from '../components/DailyExpenseBreakdown';
import ShareTripModal from '../../community/components/ShareTripModal';
import ConfirmDialog from '../../../components/ui/ConfirmDialog';
import Button from '../../../components/ui/Button';
import Loading from '../../../components/ui/Loading';
import EmptyState from '../../../components/ui/EmptyState';
import budgetService from '../../../services/budgetService';
import tripService from '../../../services/tripService';
import { formatShortDate } from '../../../utils/dateUtils';
import { formatCurrency } from '../../../utils/currencyUtils';

export default function BudgetTracker() {
  const { tripId = '1' } = useParams();

  const [budgetData, setBudgetData] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [tripInfo, setTripInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);

  // Modals state
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [isExpenseSubmitting, setIsExpenseSubmitting] = useState(false);

  const [deletingExpense, setDeletingExpense] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [budgetRes, expensesRes, tripRes] = await Promise.all([
        budgetService.getTripBudget(tripId),
        budgetService.getTripExpenses(tripId),
        tripService.getTripById(tripId),
      ]);

      if (budgetRes.data) {
        setBudgetData(budgetRes.data);
      }
      if (expensesRes.data) {
        setExpenses(expensesRes.data);
      }
      if (tripRes.data) {
        setTripInfo(tripRes.data);
      }
    } catch (err) {
      console.error('Failed to load budget data:', err);
      setError(err.message || 'Failed to load trip budget details.');
    } finally {
      setIsLoading(false);
    }
  }, [tripId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle Save Expense (Create or Edit)
  const handleSaveExpense = async (formData) => {
    setIsExpenseSubmitting(true);
    try {
      if (editingExpense) {
        await budgetService.updateExpense(editingExpense.id, formData);
        showNotification('Expense updated successfully.');
      } else {
        await budgetService.createExpense(tripId, formData);
        showNotification('Expense recorded successfully!');
      }

      setIsExpenseModalOpen(false);
      setEditingExpense(null);
      await loadData();
    } catch (err) {
      console.error('Failed to save expense:', err);
      alert(err.message || 'Failed to save expense. Please check input values.');
    } finally {
      setIsExpenseSubmitting(false);
    }
  };

  // Handle Delete Expense
  const handleConfirmDeleteExpense = async () => {
    if (!deletingExpense) return;
    setIsDeleting(true);
    try {
      await budgetService.deleteExpense(deletingExpense.id);
      showNotification('Expense deleted.');
      setDeletingExpense(null);
      await loadData();
    } catch (err) {
      console.error('Failed to delete expense:', err);
      alert(err.message || 'Failed to delete expense.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return <Loading text="Calculating trip budget analytics & expenses..." />;
  }

  if (error || !budgetData) {
    return (
      <EmptyState
        title="Failed to load budget tracker"
        description={error || 'Could not find budget information for this trip.'}
        actionLabel="Try Again"
        onAction={loadData}
      />
    );
  }

  const {
    tripTitle,
    startDate,
    endDate,
    durationDays,
    budget,
    total,
    remaining,
    averagePerDay,
    averageDailyBudget,
    utilization,
    categoryBreakdown,
    dailyBreakdown,
    overBudgetDays,
  } = budgetData;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl text-xs font-semibold animate-bounce">
          {notification.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                Budget & Expense Hub
              </span>
              <span className="text-xs text-slate-500 font-semibold">
                {durationDays} {durationDays === 1 ? 'Day' : 'Days'} Trip
              </span>
              {tripInfo?.isPublic && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-sky-50 text-sky-700 border border-sky-200">
                  Public
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {tripTitle}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-brand-600" />
              <span>
                {formatShortDate(startDate)} – {formatShortDate(endDate)}
              </span>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setIsShareModalOpen(true)}
              className="flex items-center gap-1.5 text-xs font-bold"
            >
              <Share2 className="w-3.5 h-3.5 text-brand-600" />
              <span>{tripInfo?.isPublic ? 'Shared Publicly' : 'Share & Publish'}</span>
            </Button>

            <Button
              variant="primary"
              onClick={() => {
                setEditingExpense(null);
                setIsExpenseModalOpen(true);
              }}
              className="flex items-center gap-1.5 text-xs font-bold"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record Expense</span>
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-6 pt-6 border-t border-slate-100 flex items-center gap-2">
          <Link
            to={`/trips/${tripId}/itinerary`}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            Itinerary
          </Link>
          <Link
            to={`/trips/${tripId}/calendar`}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            Calendar Schedule
          </Link>
          <Link
            to={`/trips/${tripId}/budget`}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-brand-600 text-white shadow-xs"
          >
            Budget & Expenses
          </Link>
        </div>
      </div>

      {/* Summary KPI Cards & Progress Bar */}
      <BudgetSummaryCards data={budgetData} />

      {/* Over-Budget Non-blocking Advisory Banner */}
      <OverBudgetAlert
        overBudgetDays={overBudgetDays}
        averageDailyBudget={averageDailyBudget}
        tripBudget={budget}
      />

      {/* 2-Column Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Pie Chart + Bar Chart */}
        <div className="space-y-8">
          <CategoryPieChart
            categoryBreakdown={categoryBreakdown}
            total={total}
          />
          <DailySpendingBarChart
            dailyBreakdown={dailyBreakdown}
            averageDailyBudget={averageDailyBudget}
          />
        </div>

        {/* Right Column: Itemized Daily Accordion */}
        <div>
          <DailyExpenseBreakdown
            dailyBreakdown={dailyBreakdown}
            averageDailyBudget={averageDailyBudget}
          />
        </div>
      </div>

      {/* Full-Width Expense Management Table */}
      <ExpenseTable
        expenses={expenses}
        onAddExpense={() => {
          setEditingExpense(null);
          setIsExpenseModalOpen(true);
        }}
        onEditExpense={(expense) => {
          setEditingExpense(expense);
          setIsExpenseModalOpen(true);
        }}
        onDeleteExpense={(expense) => setDeletingExpense(expense)}
      />

      {/* Add / Edit Expense Modal */}
      {isExpenseModalOpen && (
        <ExpenseModal
          isOpen={isExpenseModalOpen}
          onClose={() => {
            setIsExpenseModalOpen(false);
            setEditingExpense(null);
          }}
          onSubmit={handleSaveExpense}
          initialData={editingExpense}
          tripStartDate={startDate}
          tripEndDate={endDate}
          isLoading={isExpenseSubmitting}
        />
      )}

      {/* Confirm Delete Expense Dialog */}
      {deletingExpense && (
        <ConfirmDialog
          isOpen={Boolean(deletingExpense)}
          onClose={() => setDeletingExpense(null)}
          onConfirm={handleConfirmDeleteExpense}
          title="Delete Expense Record?"
          message={`Are you sure you want to remove '${deletingExpense.description}' (${formatCurrency(
            deletingExpense.amount
          )}) from your trip expenses?`}
          isLoading={isDeleting}
        />
      )}

      {/* Share / Publish Trip Modal */}
      {isShareModalOpen && (
        <ShareTripModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          trip={tripInfo || { id: tripId, title: tripTitle, isPublic: false }}
          onTripUpdated={(updated) => {
            setTripInfo(updated);
          }}
        />
      )}
    </div>
  );
}
