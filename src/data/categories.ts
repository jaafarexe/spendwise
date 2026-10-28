import {
  Utensils,
  Car,
  Home,
  Film,
  ShoppingBag,
  HeartPulse,
  CircleEllipsis,
  type LucideIcon,
} from 'lucide-react';
import type { ExpenseCategory, CurrencyConfig, Expense } from '../types';

export interface CategoryMeta {
  category: ExpenseCategory;
  label: string;
  color: string; // Hex for canvas/SVG
  lightBg: string;
  textColor: string;
  borderColor: string;
  icon: LucideIcon;
  description: string;
}

export const CATEGORIES: Record<ExpenseCategory, CategoryMeta> = {
  Food: {
    category: 'Food',
    label: 'Food & Dining',
    color: '#f59e0b', // amber-500
    lightBg: 'bg-amber-50 dark:bg-amber-950/30',
    textColor: 'text-amber-700 dark:text-amber-300',
    borderColor: 'border-amber-200 dark:border-amber-800/60',
    icon: Utensils,
    description: 'Groceries, restaurants, cafes, snacks & takeout',
  },
  Transport: {
    category: 'Transport',
    label: 'Transportation',
    color: '#3b82f6', // blue-500
    lightBg: 'bg-blue-50 dark:bg-blue-950/30',
    textColor: 'text-blue-700 dark:text-blue-300',
    borderColor: 'border-blue-200 dark:border-blue-800/60',
    icon: Car,
    description: 'Fuel, transit passes, rideshares, parking & tolls',
  },
  Housing: {
    category: 'Housing',
    label: 'Housing & Utilities',
    color: '#0d9488', // teal-600
    lightBg: 'bg-teal-50 dark:bg-teal-950/30',
    textColor: 'text-teal-700 dark:text-teal-300',
    borderColor: 'border-teal-200 dark:border-teal-800/60',
    icon: Home,
    description: 'Rent, mortgage, electricity, water, internet & home repair',
  },
  Entertainment: {
    category: 'Entertainment',
    label: 'Entertainment',
    color: '#8b5cf6', // purple-500
    lightBg: 'bg-purple-50 dark:bg-purple-950/30',
    textColor: 'text-purple-700 dark:text-purple-300',
    borderColor: 'border-purple-200 dark:border-purple-800/60',
    icon: Film,
    description: 'Streaming, movies, games, concerts & recreational hobbies',
  },
  Shopping: {
    category: 'Shopping',
    label: 'Shopping',
    color: '#ec4899', // pink-500
    lightBg: 'bg-pink-50 dark:bg-pink-950/30',
    textColor: 'text-pink-700 dark:text-pink-300',
    borderColor: 'border-pink-200 dark:border-pink-800/60',
    icon: ShoppingBag,
    description: 'Clothing, gadgets, electronics, books & household items',
  },
  Health: {
    category: 'Health',
    label: 'Health & Wellness',
    color: '#06b6d4', // cyan-500
    lightBg: 'bg-cyan-50 dark:bg-cyan-950/30',
    textColor: 'text-cyan-700 dark:text-cyan-300',
    borderColor: 'border-cyan-200 dark:border-cyan-800/60',
    icon: HeartPulse,
    description: 'Gym memberships, doctor visits, medications & pharmacy',
  },
  Other: {
    category: 'Other',
    label: 'Miscellaneous',
    color: '#64748b', // slate-500
    lightBg: 'bg-slate-100 dark:bg-slate-800/60',
    textColor: 'text-slate-700 dark:text-slate-300',
    borderColor: 'border-slate-200 dark:border-slate-700',
    icon: CircleEllipsis,
    description: 'Bank fees, gifts, personal services & miscellaneous items',
  },
};

export const CATEGORY_LIST: ExpenseCategory[] = [
  'Food',
  'Transport',
  'Housing',
  'Entertainment',
  'Shopping',
  'Health',
  'Other',
];

export const CURRENCIES: CurrencyConfig[] = [
  { code: 'USD', symbol: '$', label: 'USD ($)' },
  { code: 'EUR', symbol: '€', label: 'EUR (€)' },
  { code: 'GBP', symbol: '£', label: 'GBP (£)' },
  { code: 'CAD', symbol: 'CA$', label: 'CAD (CA$)' },
  { code: 'AUD', symbol: 'A$', label: 'AUD (A$)' },
  { code: 'JPY', symbol: '¥', label: 'JPY (¥)' },
  { code: 'INR', symbol: '₹', label: 'INR (₹)' },
];

/**
 * Generates relative sample expenses based on today's date so initial preview is rich and realistic.
 */
export function getInitialSampleExpenses(): Expense[] {
  const today = new Date();
  
  const formatDateOffset = (daysAgo: number): string => {
    const d = new Date(today);
    d.setDate(d.getDate() - daysAgo);
    return d.toISOString().split('T')[0];
  };

  return [
    {
      id: 'sample-1',
      title: 'Farmers Market Groceries',
      amount: 68.45,
      category: 'Food',
      date: formatDateOffset(0), // Today
      notes: 'Fresh vegetables, sourdough bread, eggs and fruit',
      createdAt: Date.now() - 3600000 * 2,
    },
    {
      id: 'sample-2',
      title: 'High-speed Fiber Internet',
      amount: 55.0,
      category: 'Housing',
      date: formatDateOffset(1), // Yesterday
      notes: 'Monthly 500Mbps connection bill',
      createdAt: Date.now() - 86400000 * 1,
    },
    {
      id: 'sample-3',
      title: 'Weekly Metro Transit Pass',
      amount: 32.5,
      category: 'Transport',
      date: formatDateOffset(2),
      notes: 'Unlimited weekly subway and bus travel',
      createdAt: Date.now() - 86400000 * 2,
    },
    {
      id: 'sample-4',
      title: 'Cinema Tickets & Popcorn',
      amount: 28.75,
      category: 'Entertainment',
      date: formatDateOffset(3),
      notes: 'Weekend evening movie screening',
      createdAt: Date.now() - 86400000 * 3,
    },
    {
      id: 'sample-5',
      title: 'Ergonomic Desk Mat & Cable Clip',
      amount: 34.99,
      category: 'Shopping',
      date: formatDateOffset(4),
      notes: 'Home workspace upgrade',
      createdAt: Date.now() - 86400000 * 4,
    },
    {
      id: 'sample-6',
      title: 'Pharmacy Vitamins & Supplements',
      amount: 24.8,
      category: 'Health',
      date: formatDateOffset(6),
      notes: 'Vitamin D3 and electrolyte powders',
      createdAt: Date.now() - 86400000 * 6,
    },
    {
      id: 'sample-7',
      title: 'Espresso & Almond Croissant',
      amount: 8.5,
      category: 'Food',
      date: formatDateOffset(7),
      notes: 'Local specialty coffee roasters',
      createdAt: Date.now() - 86400000 * 7,
    },
    {
      id: 'sample-8',
      title: 'Rideshare to Airport Terminal',
      amount: 44.2,
      category: 'Transport',
      date: formatDateOffset(9),
      notes: 'Early morning flight transfer',
      createdAt: Date.now() - 86400000 * 9,
    },
    {
      id: 'sample-9',
      title: 'Monthly Streaming Subscriptions',
      amount: 19.98,
      category: 'Entertainment',
      date: formatDateOffset(12),
      notes: 'Music streaming + documentary channel',
      createdAt: Date.now() - 86400000 * 12,
    },
    {
      id: 'sample-10',
      title: 'Supermarket Weekly Pantry Restock',
      amount: 112.35,
      category: 'Food',
      date: formatDateOffset(14),
      notes: 'Olive oil, proteins, grains, and kitchen essentials',
      createdAt: Date.now() - 86400000 * 14,
    },
    {
      id: 'sample-11',
      title: 'Postal Shipping & Courier Box',
      amount: 14.25,
      category: 'Other',
      date: formatDateOffset(18),
      notes: 'Sent gift package to family',
      createdAt: Date.now() - 86400000 * 18,
    },
  ];
}
