import React from 'react';
import {
  TrendingDown,
  Receipt,
  PieChart,
  ArrowUpRight,
  Target,
  SlidersHorizontal,
} from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import { CATEGORIES } from '../data/categories';
import type { Expense, ExpenseCategory, CurrencyConfig, TimeframeFilter } from '../types';

interface SummaryCardsProps {
  expenses: Expense[];
  filteredExpenses: Expense[];
  timeframe: TimeframeFilter;
  onTimeframeChange: (tf: TimeframeFilter) => void;
  currency: CurrencyConfig;
  monthlyBudget: number;
  onOpenBudgetModal: () => void;
  selectedCategory: ExpenseCategory | 'all';
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({
  filteredExpenses,
  timeframe,
  onTimeframeChange,
  currency,
  monthlyBudget,
  onOpenBudgetModal,
  selectedCategory,
}) => {
  // Total spent in the current filtered view
  const totalSpent = filteredExpenses.reduce((sum, item) => sum + item.amount, 0);

  // Average expense amount
  const averageExpense =
    filteredExpenses.length > 0 ? totalSpent / filteredExpenses.length : 0;

  // Highest expense in current view
  const highestExpense =
    filteredExpenses.length > 0
      ? filteredExpenses.reduce((max, item) => (item.amount > max.amount ? item : max), filteredExpenses[0])
      : null;

  // Find top spending category in current view
  const categoryTotals: Partial<Record<ExpenseCategory, number>> = {};
  filteredExpenses.forEach((exp) => {
    categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
  });

  const topCategory = React.useMemo<{ category: ExpenseCategory; amount: number } | null>(() => {
    let best: { category: ExpenseCategory; amount: number } | null = null;
    (Object.entries(categoryTotals) as [ExpenseCategory, number][]).forEach(([cat, amt]) => {
      if (amt !== undefined && amt > 0) {
        if (!best || amt > best.amount) {
          best = { category: cat, amount: amt };
        }
      }
    });
    return best;
  }, [categoryTotals]);

  // Calculate budget utilization
  const budgetUtilization = monthlyBudget > 0 ? (totalSpent / monthlyBudget) * 100 : 0;
  const budgetRemaining = monthlyBudget > 0 ? monthlyBudget - totalSpent : 0;

  const timeframeLabels: Record<TimeframeFilter, string> = {
    'this-month': 'This Month',
    'last-30-days': 'Last 30 Days',
    'this-year': 'This Year',
    all: 'All Time',
  };

  return (
    <section id="overview" className="mb-8">
      {/* Top row: Section Header with Period Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Financial Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Spending insights and category balances for {timeframeLabels[timeframe].toLowerCase()}
          </p>
        </div>

        {/* Timeframe Segmented Control (Functional buttons) */}
        <div className="inline-flex items-center p-1 bg-slate-200/70 rounded-xl self-start sm:self-auto">
          {(['this-month', 'last-30-days', 'this-year', 'all'] as TimeframeFilter[]).map((tf) => (
            <button
              key={tf}
              type="button"
              onClick={() => onTimeframeChange(tf)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                timeframe === tf
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {timeframeLabels[tf]}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Primary Total Card + Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Dominant Visual Anchor - Total Spent Display */}
        <div className="p-5 sm:p-6 bg-white rounded-2xl border border-slate-200 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-medium text-slate-500 mb-2">
              <span className="flex items-center gap-1.5">
                <Receipt className="w-4 h-4 text-slate-400" />
                <span>Total Spent ({timeframeLabels[timeframe]})</span>
              </span>
              {selectedCategory !== 'all' && (
                <span className="text-emerald-700 font-semibold">
                  {selectedCategory}
                </span>
              )}
            </div>

            <div className="text-3xl sm:text-4xl font-bold text-slate-900 font-mono tracking-tight tabular-nums">
              {formatCurrency(totalSpent, currency.symbol)}
            </div>

            <div className="flex items-center gap-2 mt-3 text-xs text-slate-500">
              <span className="font-semibold text-slate-700 tabular-nums">
                {filteredExpenses.length}
              </span>
              <span>{filteredExpenses.length === 1 ? 'transaction logged' : 'transactions logged'}</span>
            </div>
          </div>

          {/* Monthly Budget Progress Bar */}
          {monthlyBudget > 0 && (
            <div className="mt-5 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-500 font-medium flex items-center gap-1">
                  <Target className="w-3.5 h-3.5 text-slate-400" />
                  Monthly Budget
                </span>
                <button
                  type="button"
                  onClick={onOpenBudgetModal}
                  className="text-[11px] font-semibold text-slate-600 hover:text-slate-900 underline decoration-slate-300"
                >
                  Edit
                </button>
              </div>

              {/* Progress Track */}
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 rounded-full ${
                    budgetUtilization > 100
                      ? 'bg-rose-500'
                      : budgetUtilization > 85
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(budgetUtilization, 100)}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1.5 font-mono tabular-nums">
                <span>
                  {budgetUtilization.toFixed(0)}% of {formatCurrency(monthlyBudget, currency.symbol)}
                </span>
                <span className={budgetRemaining < 0 ? 'text-rose-600 font-semibold' : 'text-slate-600'}>
                  {budgetRemaining >= 0
                    ? `${formatCurrency(budgetRemaining, currency.symbol)} left`
                    : `${formatCurrency(Math.abs(budgetRemaining), currency.symbol)} over`}
                </span>
              </div>
            </div>
          )}

          {monthlyBudget === 0 && (
            <div className="mt-5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onOpenBudgetModal}
                className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1.5 font-medium transition-colors"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                <span>Set a monthly spending target</span>
              </button>
            </div>
          )}
        </div>

        {/* Card 2: Top Category & Average Spend */}
        <div className="p-5 sm:p-6 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-medium text-slate-500 mb-2">
              <span className="flex items-center gap-1.5">
                <PieChart className="w-4 h-4 text-slate-400" />
                <span>Top Spending Category</span>
              </span>
            </div>

            {topCategory ? (
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: CATEGORIES[topCategory.category].color }}
                  />
                  <div className="text-xl sm:text-2xl font-bold text-slate-900">
                    {CATEGORIES[topCategory.category].label}
                  </div>
                </div>

                <div className="text-base font-semibold font-mono text-slate-700 tabular-nums">
                  {formatCurrency(topCategory.amount, currency.symbol)}{' '}
                  <span className="text-xs font-sans font-normal text-slate-500">
                    ({totalSpent > 0 ? ((topCategory.amount / totalSpent) * 100).toFixed(1) : 0}% of total)
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-sm text-slate-400 py-3">No expenses logged yet</div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Average per transaction</span>
            <span className="font-semibold font-mono text-slate-800 tabular-nums">
              {formatCurrency(averageExpense, currency.symbol)}
            </span>
          </div>
        </div>

        {/* Card 3: Largest Expense & Quick Stats */}
        <div className="p-5 sm:p-6 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-medium text-slate-500 mb-2">
              <span className="flex items-center gap-1.5">
                <ArrowUpRight className="w-4 h-4 text-slate-400" />
                <span>Largest Single Expense</span>
              </span>
            </div>

            {highestExpense ? (
              <div>
                <div className="text-xl sm:text-2xl font-bold text-slate-900 truncate">
                  {highestExpense.title}
                </div>
                <div className="text-base font-semibold font-mono text-slate-700 tabular-nums mt-0.5">
                  {formatCurrency(highestExpense.amount, currency.symbol)}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  <span>{highestExpense.category}</span>
                  <span aria-hidden="true" className="mx-1.5">·</span>
                  <span>{highestExpense.date}</span>
                </div>
              </div>
            ) : (
              <div className="text-sm text-slate-400 py-3">No expenses logged yet</div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Active period range</span>
            <span className="font-medium text-slate-700">
              {timeframeLabels[timeframe]}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
