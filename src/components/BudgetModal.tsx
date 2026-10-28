import React, { useState, useEffect } from 'react';
import { Target, X, Check } from 'lucide-react';
import type { CurrencyConfig } from '../types';

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  monthlyBudget: number;
  onSaveBudget: (newBudget: number) => void;
  currency: CurrencyConfig;
}

const PRESET_BUDGETS = [1000, 2000, 3000, 5000];

export const BudgetModal: React.FC<BudgetModalProps> = ({
  isOpen,
  onClose,
  monthlyBudget,
  onSaveBudget,
  currency,
}) => {
  const [budgetInput, setBudgetInput] = useState(monthlyBudget > 0 ? monthlyBudget.toString() : '');

  useEffect(() => {
    setBudgetInput(monthlyBudget > 0 ? monthlyBudget.toString() : '');
  }, [monthlyBudget, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(budgetInput);
    if (isNaN(parsed) || parsed < 0) {
      onSaveBudget(0);
    } else {
      onSaveBudget(Math.round(parsed));
    }
    onClose();
  };

  const handleDisable = () => {
    onSaveBudget(0);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden p-6 animate-in fade-in-50 zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Target className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Monthly Spending Budget
              </h3>
              <p className="text-xs text-slate-500">
                Set a monthly spending limit to track on your dashboard
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="budget-amount" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Target Monthly Limit ({currency.symbol})
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lg font-bold font-mono text-slate-400 select-none">
                {currency.symbol}
              </span>
              <input
                id="budget-amount"
                type="number"
                min="0"
                step="50"
                placeholder="2000"
                value={budgetInput}
                onChange={(e) => setBudgetInput(e.target.value)}
                autoFocus
                className="w-full pl-9 pr-4 py-2.5 text-xl font-bold font-mono tabular-nums rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 text-slate-900 transition-all"
              />
            </div>
          </div>

          {/* Quick presets */}
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
              Quick presets
            </span>
            <div className="flex items-center gap-1.5">
              {PRESET_BUDGETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setBudgetInput(preset.toString())}
                  className="flex-1 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors font-mono tabular-nums"
                >
                  {currency.symbol}{preset.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
            {monthlyBudget > 0 ? (
              <button
                type="button"
                onClick={handleDisable}
                className="text-xs font-semibold text-rose-600 hover:underline"
              >
                Disable Budget
              </button>
            ) : (
              <span />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition-colors"
              >
                Save Target
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
