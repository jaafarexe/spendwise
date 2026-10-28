import React, { useState } from 'react';
import { CATEGORIES, CATEGORY_LIST } from '../data/categories';
import { formatCurrency } from '../utils/formatters';
import type { Expense, ExpenseCategory, CurrencyConfig, CategorySummary } from '../types';
import { Filter, Check, ArrowRight } from 'lucide-react';

interface CategoryBreakdownProps {
  expenses: Expense[];
  currency: CurrencyConfig;
  selectedCategory: ExpenseCategory | 'all';
  onSelectCategory: (category: ExpenseCategory | 'all') => void;
}

export const CategoryBreakdown: React.FC<CategoryBreakdownProps> = ({
  expenses,
  currency,
  selectedCategory,
  onSelectCategory,
}) => {
  const [hoveredCategory, setHoveredCategory] = useState<ExpenseCategory | null>(null);

  // Calculate totals and percentages per category
  const totalAmount = expenses.reduce((sum, item) => sum + item.amount, 0);

  const categorySummaries: CategorySummary[] = CATEGORY_LIST.map((cat) => {
    const categoryExpenses = expenses.filter((e) => e.category === cat);
    const amount = categoryExpenses.reduce((sum, item) => sum + item.amount, 0);
    const count = categoryExpenses.length;
    const percentage = totalAmount > 0 ? (amount / totalAmount) * 100 : 0;
    return {
      category: cat,
      amount,
      count,
      percentage,
    };
  }).sort((a, b) => b.amount - a.amount); // highest spending first

  // SVG Donut calculation
  const radius = 64;
  const strokeWidth = 18;
  const circumference = 2 * Math.PI * radius;
  let accumulatedOffset = 0;

  // Active category display in donut center
  const activeFocusCategory = hoveredCategory || (selectedCategory !== 'all' ? selectedCategory : null);
  const activeFocusSummary = activeFocusCategory
    ? categorySummaries.find((c) => c.category === activeFocusCategory)
    : null;

  return (
    <section id="breakdown" className="mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-slate-900">
            Category Spending Breakdown
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Visual distribution of spending across all 7 expense categories
          </p>
        </div>

        {selectedCategory !== 'all' && (
          <button
            type="button"
            onClick={() => onSelectCategory('all')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors self-start sm:self-auto"
          >
            <span>Filtering: {selectedCategory}</span>
            <span className="text-slate-400 font-normal">·</span>
            <span className="text-slate-600 hover:underline">Show All</span>
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
        {totalAmount === 0 ? (
          <div className="py-12 text-center">
            <p className="text-sm text-slate-500">
              No spending logged in this timeframe to display.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Interactive Donut Chart */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center p-2">
              <div className="relative w-56 h-56 flex items-center justify-center">
                <svg
                  viewBox="0 0 160 160"
                  className="w-full h-full transform -rotate-90"
                  role="img"
                  aria-label="Category spending breakdown pie chart"
                >
                  <circle
                    cx="80"
                    cy="80"
                    r={radius}
                    fill="transparent"
                    stroke="#f1f5f9"
                    strokeWidth={strokeWidth}
                  />

                  {categorySummaries.map((summary) => {
                    if (summary.amount <= 0) return null;
                    const strokeDasharray = `${(summary.percentage / 100) * circumference} ${circumference}`;
                    const strokeDashoffset = -accumulatedOffset;
                    accumulatedOffset += (summary.percentage / 100) * circumference;

                    const isSelected = selectedCategory === summary.category;
                    const isHovered = hoveredCategory === summary.category;

                    return (
                      <circle
                        key={summary.category}
                        cx="80"
                        cy="80"
                        r={radius}
                        fill="transparent"
                        stroke={CATEGORIES[summary.category].color}
                        strokeWidth={isSelected || isHovered ? strokeWidth + 4 : strokeWidth}
                        strokeDasharray={strokeDasharray}
                        strokeDashoffset={strokeDashoffset}
                        className="cursor-pointer transition-all duration-300 hover:opacity-90"
                        onMouseEnter={() => setHoveredCategory(summary.category)}
                        onMouseLeave={() => setHoveredCategory(null)}
                        onClick={() =>
                          onSelectCategory(
                            selectedCategory === summary.category ? 'all' : summary.category
                          )
                        }
                      />
                    );
                  })}
                </svg>

                {/* Donut Center Display */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-4">
                  {activeFocusSummary ? (
                    <>
                      <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                        {CATEGORIES[activeFocusSummary.category].label}
                      </span>
                      <span className="text-xl sm:text-2xl font-bold text-slate-900 font-mono tabular-nums">
                        {formatCurrency(activeFocusSummary.amount, currency.symbol)}
                      </span>
                      <span className="text-xs font-semibold text-slate-500 tabular-nums">
                        {activeFocusSummary.percentage.toFixed(1)}% of total
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        Total
                      </span>
                      <span className="text-xl sm:text-2xl font-bold text-slate-900 font-mono tabular-nums">
                        {formatCurrency(totalAmount, currency.symbol)}
                      </span>
                      <span className="text-xs text-slate-500">
                        {expenses.length} expenses
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Stacked Proportional Bar */}
              <div className="w-full mt-4">
                <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden flex">
                  {categorySummaries.map((summary) => {
                    if (summary.percentage <= 0) return null;
                    return (
                      <div
                        key={summary.category}
                        className="h-full transition-all duration-300"
                        style={{
                          width: `${summary.percentage}%`,
                          backgroundColor: CATEGORIES[summary.category].color,
                        }}
                        title={`${summary.category}: ${summary.percentage.toFixed(1)}%`}
                      />
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right: Category List with percentage bars and direct filters */}
            <div className="lg:col-span-7">
              <div className="space-y-3">
                {categorySummaries.map((item) => {
                  const meta = CATEGORIES[item.category];
                  const Icon = meta.icon;
                  const isSelected = selectedCategory === item.category;

                  return (
                    <div
                      key={item.category}
                      onMouseEnter={() => setHoveredCategory(item.category)}
                      onMouseLeave={() => setHoveredCategory(null)}
                      onClick={() =>
                        onSelectCategory(isSelected ? 'all' : item.category)
                      }
                      className={`group p-3 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-slate-900 bg-slate-50/80 shadow-xs'
                          : 'border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/50'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3 mb-1.5">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                            style={{
                              backgroundColor: `${meta.color}18`,
                              color: meta.color,
                            }}
                          >
                            <Icon className="w-4 h-4 stroke-[2.2]" />
                          </div>
                          <div className="truncate">
                            <span className="text-sm font-semibold text-slate-900 block truncate">
                              {meta.label}
                            </span>
                            <span className="text-xs text-slate-400">
                              {item.count} {item.count === 1 ? 'expense' : 'expenses'}
                            </span>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <div className="text-sm font-bold font-mono text-slate-900 tabular-nums">
                            {formatCurrency(item.amount, currency.symbol)}
                          </div>
                          <div className="text-xs font-semibold text-slate-500 font-mono tabular-nums">
                            {item.percentage.toFixed(1)}%
                          </div>
                        </div>
                      </div>

                      {/* Percentage progress bar */}
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{
                            width: `${item.percentage}%`,
                            backgroundColor: meta.color,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
