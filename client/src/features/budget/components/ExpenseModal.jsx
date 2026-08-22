import React, { useState, useEffect } from 'react';
import Modal from '../../../components/ui/Modal';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import {
  Plane,
  Hotel,
  Compass,
  UtensilsCrossed,
  Sparkles,
  DollarSign,
  Calendar,
} from 'lucide-react';

const CATEGORIES = [
  { value: 'TRANSPORT', label: 'Transport', icon: Plane, color: 'text-sky-600' },
  { value: 'STAY', label: 'Stay / Hotel', icon: Hotel, color: 'text-indigo-600' },
  { value: 'ACTIVITY', label: 'Activity / Tour', icon: Compass, color: 'text-emerald-600' },
  { value: 'MEAL', label: 'Meals & Dining', icon: UtensilsCrossed, color: 'text-amber-600' },
  { value: 'MISCELLANEOUS', label: 'Miscellaneous', icon: Sparkles, color: 'text-purple-600' },
];

export default function ExpenseModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  tripStartDate = '',
  tripEndDate = '',
  isLoading = false,
}) {
  const isEditing = Boolean(initialData);

  const [formData, setFormData] = useState({
    category: 'TRANSPORT',
    description: '',
    amount: '',
    date: tripStartDate || new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        category: initialData.category || 'TRANSPORT',
        description: initialData.description || '',
        amount: initialData.amount !== undefined ? String(initialData.amount) : '',
        date: initialData.date || tripStartDate || new Date().toISOString().split('T')[0],
      });
    } else {
      setFormData({
        category: 'TRANSPORT',
        description: '',
        amount: '',
        date: tripStartDate || new Date().toISOString().split('T')[0],
      });
    }
  }, [initialData, tripStartDate, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.description.trim() || !formData.amount || !formData.date) {
      alert('Please fill out all required fields.');
      return;
    }

    const parsedAmount = parseFloat(formData.amount);
    if (isNaN(parsedAmount) || parsedAmount < 0) {
      alert('Please enter a valid non-negative amount.');
      return;
    }

    onSubmit({
      category: formData.category,
      description: formData.description.trim(),
      amount: parsedAmount,
      date: formData.date,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Expense Record' : 'Record New Expense'}
      subtitle="Log travel expenses across transport, lodging, meals, activities, or general purchases."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Category Selector Grid */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Expense Category *
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isSelected = formData.category === cat.value;
              return (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, category: cat.value })}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition-all ${
                    isSelected
                      ? 'border-brand-600 bg-brand-50 text-brand-700 shadow-2xs'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${cat.color}`} />
                  <span className="truncate">{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Description Field */}
        <Input
          label="Description *"
          placeholder="e.g. Shinkansen Bullet Train Tokyo to Kyoto"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Amount Field */}
          <Input
            label="Amount ($ USD) *"
            type="number"
            step="0.01"
            min="0"
            placeholder="140.00"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            required
          />

          {/* Date Picker */}
          <Input
            label="Expense Date *"
            type="date"
            min={tripStartDate || undefined}
            max={tripEndDate || undefined}
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            {isEditing ? 'Save Changes' : 'Add Expense'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
