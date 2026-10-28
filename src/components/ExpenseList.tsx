import React from 'react';
import {
  Edit3,
  Trash2,
  FileQuestion,
  PlusCircle,
  RotateCcw,
  Receipt,
  FileText,
} from 'lucide-react';
import { CATEGORIES } from '../data/categories';
import { formatCurrency, getRelativeDateLabel } from '../utils/formatters';
import type { Expense, CurrencyConfig } from '../types';

interface ExpenseListProps {
  expenses: Expense[];
  currency: CurrencyConfig;
  onEditExpense: (expense: Expense) => void;
  onDeleteExpense: (expense: Expense) => void;
  onOpenAddModal: () => void;
  onResetSampleData: () => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

export const ExpenseList: React.FC<ExpenseListProps> = ({
  expenses,
  currency,
  onEditExpense,
  onDeleteExpense,
  onOpenAddModal,
  onResetSampleData,
  hasActiveFilters,
  onClearFilters,
}) => {
  // If there are no expenses matching current filters
  if (expenses.length === 0) {
    if (hasActiveFilters) {
      return (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
            <FileQuestion className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-900">
            No expenses found
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto mt-1 mb-4">
            No logged expenses match your current search query or category filter.
          </p>
          <button
            type="button"
            onClick={onClearFilters}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Clear Filters
          </button>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center mb-3">
          <Receipt className="w-6 h-6 stroke-[2]" />
        </div>
        <h3 className="text-base font-semibold text-slate-900">
          No expenses recorded yet
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto mt-1 mb-5">
          Start tracking your daily spending to see your category breakdown and manage your budget wisely.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
          <button
            type="button"
            onClick={onOpenAddModal}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add First Expense</span>
          </button>
          <button
            type="button"
            onClick={onResetSampleData}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4 text-slate-500" />
            <span>Load Sample Data</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <section id="transactions" className="mb-12">
      <div className="flex items-center justify-between mb-3 px-1">
        <h2 className="text-lg font-bold tracking-tight text-slate-900">
          Recent Expenses
        </h2>
        <span className="text-xs text-slate-500">
          <span className="font-semibold text-slate-800 font-mono tabular-nums">
            {expenses.length}
          </span>{' '}
          {expenses.length === 1 ? 'record' : 'records'}
        </span>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden">
        {expenses.map((expense) => {
          const categoryMeta = CATEGORIES[expense.category] || CATEGORIES.Other;
          const Icon = categoryMeta.icon;
          const relativeDate = getRelativeDateLabel(expense.date);

          return (
            <div
              key={expense.id}
              className="group p-4 sm:p-4.5 hover:bg-slate-50/70 transition-colors flex items-center justify-between gap-4"
            >
              {/* Left Column: Category Icon + Title + Unboxed Zero-Pill Metadata */}
              <div className="flex items-center gap-3.5 min-w-0">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-2xs"
                  style={{
                    backgroundColor: `${categoryMeta.color}15`,
                    color: categoryMeta.color,
                  }}
                  title={categoryMeta.label}
                >
                  <Icon className="w-5 h-5 stroke-[2.2]" />
                </div>

                <div className="min-w-0">
                  <div className="text-sm sm:text-base font-semibold text-slate-900 truncate">
                    {expense.title}
                  </div>

                  {/* Clean unboxed text metadata with typographic separators */}
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 flex-wrap mt-0.5">
                    <span className="font-medium text-slate-700">
                      {expense.category}
                    </span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span className="tabular-nums">
                      {relativeDate}
                    </span>
                    {expense.notes && (
                      <>
                        <span aria-hidden="true" className="text-slate-300">·</span>
                        <span className="truncate max-w-[180px] sm:max-w-xs text-slate-500 italic">
                          "{expense.notes}"
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Amount + Action Buttons */}
              <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                <div className="text-right">
                  <div className="text-sm sm:text-base font-bold font-mono text-slate-900 tabular-nums">
                    -{formatCurrency(expense.amount, currency.symbol)}
                  </div>
                </div>

                {/* Edit & Delete Action Buttons */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => onEditExpense(expense)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors focus-visible:outline-2 focus-visible:outline-slate-900"
                    aria-label={`Edit ${expense.title}`}
                    title="Edit expense"
                  >
                    <Edit3 className="w-4 h-4 stroke-[2]" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteExpense(expense)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors focus-visible:outline-2 focus-visible:outline-rose-600"
                    aria-label={`Delete ${expense.title}`}
                    title="Delete expense"
                  >
                    <Trash2 className="w-4 h-4 stroke-[2]" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
