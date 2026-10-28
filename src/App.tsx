/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { SummaryCards } from './components/SummaryCards';
import { CategoryBreakdown } from './components/CategoryBreakdown';
import { ExpenseFilters } from './components/ExpenseFilters';
import { ExpenseList } from './components/ExpenseList';
import { ExpenseModal } from './components/ExpenseModal';
import { DeleteConfirmationModal } from './components/DeleteConfirmationModal';
import { BudgetModal } from './components/BudgetModal';
import { CURRENCIES, getInitialSampleExpenses } from './data/categories';
import { exportToCsv, exportToJson } from './utils/formatters';
import type {
  Expense,
  ExpenseCategory,
  CurrencyConfig,
  TimeframeFilter,
  SortOption,
} from './types';
import { Plus } from 'lucide-react';

const STORAGE_KEY_EXPENSES = 'spendwise_expenses_v2';
const STORAGE_KEY_CURRENCY = 'spendwise_currency_v2';
const STORAGE_KEY_BUDGET = 'spendwise_budget_v2';

export default function App() {
  // Load expenses from localStorage or fallback to realistic initial sample
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_EXPENSES);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error reading localStorage expenses', e);
    }
    return getInitialSampleExpenses();
  });

  // Current active currency
  const [currency, setCurrency] = useState<CurrencyConfig>(() => {
    try {
      const storedCode = localStorage.getItem(STORAGE_KEY_CURRENCY);
      if (storedCode) {
        const found = CURRENCIES.find((c) => c.code === storedCode);
        if (found) return found;
      }
    } catch (e) {
      console.error('Error reading localStorage currency', e);
    }
    return CURRENCIES[0]; // USD default
  });

  // Monthly budget
  const [monthlyBudget, setMonthlyBudget] = useState<number>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_BUDGET);
      if (stored !== null) {
        return parseFloat(stored) || 0;
      }
    } catch (e) {
      console.error('Error reading localStorage budget', e);
    }
    return 1500; // Default $1,500 monthly budget
  });

  // Filter & sorting states
  const [timeframe, setTimeframe] = useState<TimeframeFilter>('this-month');
  const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortOption>('date-desc');

  // Modals state
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [deletingExpense, setDeletingExpense] = useState<Expense | null>(null);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Sync expenses to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_EXPENSES, JSON.stringify(expenses));
    } catch (e) {
      console.error('Error writing to localStorage', e);
    }
  }, [expenses]);

  // Sync currency to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CURRENCY, currency.code);
    } catch (e) {
      console.error('Error writing currency to localStorage', e);
    }
  }, [currency]);

  // Sync budget to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_BUDGET, monthlyBudget.toString());
    } catch (e) {
      console.error('Error writing budget to localStorage', e);
    }
  }, [monthlyBudget]);

  // Helper for notification toast
  const showToast = (message: string) => {
    setNotification(message);
    setTimeout(() => {
      setNotification((curr) => (curr === message ? null : curr));
    }, 3000);
  };

  // 1. Timeframe filtering
  const timeframeFilteredExpenses = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    return expenses.filter((exp) => {
      if (timeframe === 'all') return true;

      const [year, month, day] = exp.date.split('-').map(Number);
      const expDate = new Date(year, month - 1, day);

      if (timeframe === 'this-month') {
        return year === currentYear && month - 1 === currentMonth;
      }

      if (timeframe === 'last-30-days') {
        const thirtyDaysAgo = new Date(now);
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return expDate >= thirtyDaysAgo && expDate <= now;
      }

      if (timeframe === 'this-year') {
        return year === currentYear;
      }

      return true;
    });
  }, [expenses, timeframe]);

  // 2. Search & Category filtering & Sorting
  const filteredAndSortedExpenses = useMemo(() => {
    let result = [...timeframeFilteredExpenses];

    // Filter by Category
    if (selectedCategory !== 'all') {
      result = result.filter((item) => item.category === selectedCategory);
    }

    // Filter by Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          (item.notes && item.notes.toLowerCase().includes(q)) ||
          item.category.toLowerCase().includes(q)
      );
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'date-desc') {
        const dateDiff = new Date(b.date).getTime() - new Date(a.date).getTime();
        return dateDiff !== 0 ? dateDiff : b.createdAt - a.createdAt;
      }
      if (sortBy === 'date-asc') {
        const dateDiff = new Date(a.date).getTime() - new Date(b.date).getTime();
        return dateDiff !== 0 ? dateDiff : a.createdAt - b.createdAt;
      }
      if (sortBy === 'amount-desc') {
        return b.amount - a.amount;
      }
      if (sortBy === 'amount-asc') {
        return a.amount - b.amount;
      }
      return 0;
    });

    return result;
  }, [timeframeFilteredExpenses, selectedCategory, searchQuery, sortBy]);

  // Handlers for Add / Edit
  const handleOpenAddModal = () => {
    setEditingExpense(null);
    setIsAddEditModalOpen(true);
  };

  const handleOpenEditModal = (expense: Expense) => {
    setEditingExpense(expense);
    setIsAddEditModalOpen(true);
  };

  const handleSaveExpense = (data: {
    title: string;
    amount: number;
    category: ExpenseCategory;
    date: string;
    notes?: string;
  }) => {
    if (editingExpense) {
      // Update existing
      setExpenses((prev) =>
        prev.map((item) =>
          item.id === editingExpense.id
            ? { ...item, ...data }
            : item
        )
      );
      showToast(`Updated "${data.title}"`);
    } else {
      // Add new
      const newId =
        typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : `exp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

      const newExpense: Expense = {
        id: newId,
        ...data,
        createdAt: Date.now(),
      };
      setExpenses((prev) => [newExpense, ...prev]);
      showToast(`Added "${data.title}"`);
    }
    setIsAddEditModalOpen(false);
    setEditingExpense(null);
  };

  // Handlers for Delete
  const handleConfirmDelete = () => {
    if (!deletingExpense) return;
    const title = deletingExpense.title;
    setExpenses((prev) => prev.filter((item) => item.id !== deletingExpense.id));
    setDeletingExpense(null);
    showToast(`Deleted "${title}"`);
  };

  // Reset sample data
  const handleResetSampleData = () => {
    const samples = getInitialSampleExpenses();
    setExpenses(samples);
    showToast('Reset sample expenses');
  };

  // Clear filters
  const handleClearFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Toast Notification Banner */}
      {notification && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl text-xs sm:text-sm font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <span>{notification}</span>
        </div>
      )}

      {/* Top Bar Header */}
      <Header
        onOpenAddModal={handleOpenAddModal}
        currency={currency}
        onSelectCurrency={setCurrency}
        onExportCsv={() => exportToCsv(timeframeFilteredExpenses, currency.symbol)}
        onExportJson={() => exportToJson(expenses)}
        onResetSampleData={handleResetSampleData}
        totalExpensesCount={expenses.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Summary Metric Cards with Dominant Total Spent display */}
        <SummaryCards
          expenses={expenses}
          filteredExpenses={timeframeFilteredExpenses}
          timeframe={timeframe}
          onTimeframeChange={setTimeframe}
          currency={currency}
          monthlyBudget={monthlyBudget}
          onOpenBudgetModal={() => setIsBudgetModalOpen(true)}
          selectedCategory={selectedCategory}
        />

        {/* Visual Category Spending Breakdown (Donut + Bars + Direct Filters) */}
        <CategoryBreakdown
          expenses={timeframeFilteredExpenses}
          currency={currency}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Search, Category Filter Tabs & Sorting */}
        <ExpenseFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          sortBy={sortBy}
          onSortChange={setSortBy}
          totalFilteredCount={filteredAndSortedExpenses.length}
          totalAllCount={timeframeFilteredExpenses.length}
          onResetFilters={handleClearFilters}
        />

        {/* Clean List of Recent Expenses */}
        <ExpenseList
          expenses={filteredAndSortedExpenses}
          currency={currency}
          onEditExpense={handleOpenEditModal}
          onDeleteExpense={(exp) => setDeletingExpense(exp)}
          onOpenAddModal={handleOpenAddModal}
          onResetSampleData={handleResetSampleData}
          hasActiveFilters={searchQuery.trim() !== '' || selectedCategory !== 'all'}
          onClearFilters={handleClearFilters}
        />
      </main>

      {/* Mobile Floating Action Button (FAB) for fast thumb-reach add */}
      <div className="sm:hidden fixed bottom-5 right-5 z-40">
        <button
          type="button"
          onClick={handleOpenAddModal}
          className="w-14 h-14 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-lg active:scale-95 transition-transform"
          aria-label="Add new expense"
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </button>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-6 text-center text-xs text-slate-500 bg-white">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">SpendWise Expense Tracker</span>
            <span aria-hidden="true">·</span>
            <span>Local private storage</span>
          </div>
          <div className="text-slate-400">
            Keep your spending intentional and balanced
          </div>
        </div>
      </footer>

      {/* Add / Edit Expense Modal */}
      <ExpenseModal
        isOpen={isAddEditModalOpen}
        onClose={() => {
          setIsAddEditModalOpen(false);
          setEditingExpense(null);
        }}
        onSave={handleSaveExpense}
        editingExpense={editingExpense}
        currency={currency}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={!!deletingExpense}
        expense={deletingExpense}
        currency={currency}
        onClose={() => setDeletingExpense(null)}
        onConfirm={handleConfirmDelete}
      />

      {/* Budget Goal Configuration Modal */}
      <BudgetModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
        monthlyBudget={monthlyBudget}
        onSaveBudget={setMonthlyBudget}
        currency={currency}
      />
    </div>
  );
}
