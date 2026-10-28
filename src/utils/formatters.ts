import type { Expense } from '../types';

/**
 * Format currency with tabular-friendly standard 2 decimal places.
 */
export function formatCurrency(amount: number, symbol: string = '$'): string {
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  const formatted = absAmount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return isNegative ? `-${symbol}${formatted}` : `${symbol}${formatted}`;
}

/**
 * Formats a YYYY-MM-DD date string into human-friendly string (e.g., "Oct 24, 2026")
 */
export function formatDate(dateString: string): string {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-').map(Number);
  if (!year || !month || !day) return dateString;
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Returns a friendly relative label: "Today", "Yesterday", or "Oct 24, 2026"
 */
export function getRelativeDateLabel(dateString: string): string {
  const [year, month, day] = dateString.split('-').map(Number);
  const expenseDate = new Date(year, month - 1, day);
  expenseDate.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (expenseDate.getTime() === today.getTime()) {
    return 'Today';
  }
  if (expenseDate.getTime() === yesterday.getTime()) {
    return 'Yesterday';
  }

  return formatDate(dateString);
}

/**
 * Generates and triggers download of a clean CSV file
 */
export function exportToCsv(expenses: Expense[], currencySymbol: string = '$'): void {
  const headers = ['Date', 'Title', 'Category', `Amount (${currencySymbol})`, 'Notes', 'ID'];
  
  const escapeCsv = (str: string | undefined): string => {
    if (str === undefined || str === null) return '""';
    const clean = String(str).replace(/"/g, '""');
    return `"${clean}"`;
  };

  const rows = expenses.map((item) => [
    escapeCsv(item.date),
    escapeCsv(item.title),
    escapeCsv(item.category),
    item.amount.toFixed(2),
    escapeCsv(item.notes || ''),
    escapeCsv(item.id),
  ]);

  const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  const todayStr = new Date().toISOString().split('T')[0];
  link.setAttribute('download', `spendwise-expenses-${todayStr}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generates and triggers download of a JSON backup
 */
export function exportToJson(expenses: Expense[]): void {
  const jsonContent = JSON.stringify(expenses, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  const todayStr = new Date().toISOString().split('T')[0];
  link.setAttribute('download', `spendwise-backup-${todayStr}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
