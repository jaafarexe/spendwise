import React, { useState, useEffect } from 'react';
import { X, Calendar, DollarSign, Tag, AlignLeft, Sparkles } from 'lucide-react';
import { CATEGORIES, CATEGORY_LIST } from '../data/categories';
import type { Expense, ExpenseCategory, CurrencyConfig } from '../types';

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (expenseData: {
    title: string;
    amount: number;
    category: ExpenseCategory;
    date: string;
    notes?: string;
  }) => void;
  editingExpense?: Expense | null;
  currency: CurrencyConfig;
}

const COMMON_SUGGESTIONS = [
  'Groceries',
  'Coffee & Bakery',
  'Restaurant Dinner',
  'Gasoline / Fuel',
  'Public Transit',
  'Electric & Gas Utility',
  'Home WiFi Fiber',
  'Mobile Phone Bill',
  'Movie & Streaming',
  'Pharmacy & Meds',
];

export const ExpenseModal: React.FC<ExpenseModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingExpense,
  currency,
}) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('Food');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<{ title?: string; amount?: string; date?: string }>({});

  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (editingExpense) {
      setTitle(editingExpense.title);
      setAmount(editingExpense.amount.toString());
      setCategory(editingExpense.category);
      setDate(editingExpense.date);
      setNotes(editingExpense.notes || '');
    } else {
      setTitle('');
      setAmount('');
      setCategory('Food');
      setDate(todayStr);
      setNotes('');
    }
    setErrors({});
  }, [editingExpense, isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { title?: string; amount?: string; date?: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }

    const numAmount = parseFloat(amount);
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      newErrors.amount = 'Please enter a valid amount greater than 0';
    }

    if (!date) {
      newErrors.date = 'Date is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      title: title.trim(),
      amount: Math.round(numAmount * 100) / 100,
      category,
      date,
      notes: notes.trim() || undefined,
    });
  };

  const setRelativeDate = (offsetDays: number) => {
    const d = new Date();
    d.setDate(d.getDate() - offsetDays);
    setDate(d.toISOString().split('T')[0]);
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Modal Container */}
      <div
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100">
          <div>
            <h3 id="modal-title" className="text-lg font-bold text-slate-900 tracking-tight">
              {editingExpense ? 'Edit Expense' : 'Log New Expense'}
            </h3>
            <p className="text-xs text-slate-500">
              {editingExpense ? 'Update expense details and category' : 'Enter transaction amount, category, and date'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4.5">
          {/* Amount Field (Hero input) */}
          <div>
            <label htmlFor="expense-amount" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Amount ({currency.symbol})
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold font-mono text-slate-400 select-none">
                {currency.symbol}
              </span>
              <input
                id="expense-amount"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  if (errors.amount) setErrors((prev) => ({ ...prev, amount: undefined }));
                }}
                autoFocus
                className={`w-full pl-10 pr-4 py-3 text-2xl font-bold font-mono tabular-nums rounded-xl border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                  errors.amount
                    ? 'border-rose-400 focus:ring-rose-500 text-rose-900'
                    : 'border-slate-200 focus:ring-slate-900 text-slate-900'
                }`}
              />
            </div>
            {errors.amount && (
              <p className="text-xs text-rose-600 mt-1 font-medium">{errors.amount}</p>
            )}
          </div>

          {/* Title Field */}
          <div>
            <label htmlFor="expense-title" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Expense Title / Description
            </label>
            <input
              id="expense-title"
              type="text"
              placeholder="e.g. Trader Joe's grocery run, Subway ticket..."
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
              }}
              className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                errors.title
                  ? 'border-rose-400 focus:ring-rose-500 text-rose-900'
                  : 'border-slate-200 focus:ring-slate-900 text-slate-900'
              }`}
            />
            {errors.title && (
              <p className="text-xs text-rose-600 mt-1 font-medium">{errors.title}</p>
            )}

            {/* Quick Suggestions Chips */}
            {!editingExpense && (
              <div className="flex items-center gap-1.5 overflow-x-auto py-2 no-scrollbar">
                <span className="text-[11px] text-slate-400 whitespace-nowrap flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-500" /> Quick:
                </span>
                {COMMON_SUGGESTIONS.slice(0, 5).map((sug) => (
                  <button
                    key={sug}
                    type="button"
                    onClick={() => setTitle(sug)}
                    className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Category Selector Grid */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {CATEGORY_LIST.map((cat) => {
                const meta = CATEGORIES[cat];
                const Icon = meta.icon;
                const isSelected = category === cat;

                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`flex items-center gap-2 p-2 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-slate-900 bg-slate-900 text-white shadow-xs font-semibold'
                        : 'border-slate-200 bg-slate-50/70 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-white/20 text-white' : 'text-slate-600'
                      }`}
                      style={{
                        color: isSelected ? '#ffffff' : meta.color,
                      }}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs truncate">{cat}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date Picker + Quick Buttons */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="expense-date" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Date
              </label>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setRelativeDate(0)}
                  className="text-[11px] font-semibold text-slate-600 hover:text-slate-900 px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Today
                </button>
                <button
                  type="button"
                  onClick={() => setRelativeDate(1)}
                  className="text-[11px] font-semibold text-slate-600 hover:text-slate-900 px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Yesterday
                </button>
              </div>
            </div>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="expense-date"
                type="date"
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  if (errors.date) setErrors((prev) => ({ ...prev, date: undefined }));
                }}
                className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                  errors.date
                    ? 'border-rose-400 focus:ring-rose-500 text-rose-900'
                    : 'border-slate-200 focus:ring-slate-900 text-slate-900'
                }`}
              />
            </div>
            {errors.date && (
              <p className="text-xs text-rose-600 mt-1 font-medium">{errors.date}</p>
            )}
          </div>

          {/* Notes (Optional) */}
          <div>
            <label htmlFor="expense-notes" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Notes / Receipt memo <span className="text-slate-400 font-normal lowercase">(optional)</span>
            </label>
            <textarea
              id="expense-notes"
              rows={2}
              placeholder="Add any extra details, store location, or receipt note..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 text-slate-900 placeholder:text-slate-400 transition-all resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs hover:shadow transition-all"
            >
              {editingExpense ? 'Save Changes' : 'Add Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
