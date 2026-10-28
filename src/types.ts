export type ExpenseCategory =
  | 'Food'
  | 'Transport'
  | 'Housing'
  | 'Entertainment'
  | 'Shopping'
  | 'Health'
  | 'Other';

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: ExpenseCategory;
  date: string; // YYYY-MM-DD
  notes?: string;
  createdAt: number;
}

export type TimeframeFilter = 'all' | 'this-month' | 'last-30-days' | 'this-year';

export type SortOption = 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc';

export interface CurrencyConfig {
  code: string;
  symbol: string;
  label: string;
}

export interface CategorySummary {
  category: ExpenseCategory;
  amount: number;
  count: number;
  percentage: number;
}
