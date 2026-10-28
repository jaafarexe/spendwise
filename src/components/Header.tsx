import React, { useState, useRef, useEffect } from 'react';
import {
  Plus,
  Wallet,
  Download,
  RotateCcw,
  Check,
  ChevronDown,
  Globe,
  FileSpreadsheet,
  FileCode,
  Sparkles,
} from 'lucide-react';
import { CURRENCIES } from '../data/categories';
import type { CurrencyConfig } from '../types';

interface HeaderProps {
  onOpenAddModal: () => void;
  currency: CurrencyConfig;
  onSelectCurrency: (currency: CurrencyConfig) => void;
  onExportCsv: () => void;
  onExportJson: () => void;
  onResetSampleData: () => void;
  totalExpensesCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAddModal,
  currency,
  onSelectCurrency,
  onExportCsv,
  onExportJson,
  onResetSampleData,
  totalExpensesCount,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const currencyRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
      if (currencyRef.current && !currencyRef.current.contains(event.target as Node)) {
        setIsCurrencyOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-emerald-400 flex items-center justify-center shadow-xs">
              <Wallet className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900">
                SpendWise
              </span>
              <span className="hidden sm:inline text-xs text-slate-500 ml-2 font-normal">
                Expense Tracker
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation Links & Data Utilities */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <a
              href="#overview"
              className="text-slate-900 font-semibold hover:text-slate-900 transition-colors whitespace-nowrap"
            >
              Overview
            </a>
            <a
              href="#breakdown"
              className="hover:text-slate-900 transition-colors whitespace-nowrap"
            >
              Breakdown
            </a>
            <a
              href="#transactions"
              className="hover:text-slate-900 transition-colors whitespace-nowrap"
            >
              Transactions
            </a>
          </nav>

          {/* Zone 3: Actions (Currency, Options, Primary CTA) */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Currency Selector Dropdown */}
            <div className="relative" ref={currencyRef}>
              <button
                type="button"
                onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-colors border border-slate-200/60 focus-visible:outline-2 focus-visible:outline-slate-900"
                aria-label="Change currency"
                title="Select currency"
              >
                <Globe className="w-3.5 h-3.5 text-slate-500" />
                <span className="font-mono">{currency.symbol}</span>
                <span className="hidden sm:inline">{currency.code}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isCurrencyOpen && (
                <div className="absolute right-0 mt-1.5 w-44 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-40 animate-in fade-in-50 zoom-in-95 duration-100">
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                    Display Currency
                  </div>
                  {CURRENCIES.map((c) => (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => {
                        onSelectCurrency(c);
                        setIsCurrencyOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs flex items-center justify-between text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <span className="font-medium">
                        {c.label}
                      </span>
                      {currency.code === c.code && (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Data Tools Menu (Export / Reset) */}
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200/60 focus-visible:outline-2 focus-visible:outline-slate-900"
                title="Data & Export Options"
                aria-label="Data tools"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Export</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-1.5 w-52 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-40 animate-in fade-in-50 zoom-in-95 duration-100">
                  <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1">
                    Export & Backup
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onExportCsv();
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs flex items-center gap-2.5 text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                    <div>
                      <div className="font-medium text-slate-900">Export to CSV</div>
                      <div className="text-[11px] text-slate-500">For Excel & Google Sheets</div>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onExportJson();
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs flex items-center gap-2.5 text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <FileCode className="w-4 h-4 text-blue-600" />
                    <div>
                      <div className="font-medium text-slate-900">Export JSON Backup</div>
                      <div className="text-[11px] text-slate-500">Full structured data file</div>
                    </div>
                  </button>

                  <div className="border-t border-slate-100 my-1"></div>

                  <button
                    type="button"
                    onClick={() => {
                      onResetSampleData();
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs flex items-center gap-2.5 text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4 text-slate-500" />
                    <div>
                      <div className="font-medium text-slate-900">Reset Demo Data</div>
                      <div className="text-[11px] text-slate-500">Restore default sample expenses</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Primary Action Button: Add Expense */}
            <button
              type="button"
              onClick={onOpenAddModal}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 active:bg-slate-950 rounded-lg shadow-xs hover:shadow transition-all whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add Expense</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
