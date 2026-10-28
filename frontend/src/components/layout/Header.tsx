import React, { useState } from 'react';
import {
  Search,
  Calendar,
  Bell,
  Moon,
  Sun,
  UserCheck,
  ShieldAlert,
  Database,
  Menu,
  X
} from 'lucide-react';

interface Props {
  darkMode: boolean;
  setDarkMode: (v: boolean) => void;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  selectedDateRange: string;
  setSelectedDateRange: (v: string) => void;
  activeDatasetName?: string;
  isCustomDataset?: boolean;
  onMobileMenuToggle?: () => void;
}

export const Header: React.FC<Props> = ({
  darkMode,
  setDarkMode,
  searchQuery,
  setSearchQuery,
  selectedDateRange,
  setSelectedDateRange,
  activeDatasetName = 'Benchmark Cohort',
  isCustomDataset = false,
  onMobileMenuToggle
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  return (
    <header className="h-16 border-b border-slate-200/80 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80 sticky top-0 z-20 px-4 lg:px-6 flex items-center justify-between gap-4">
      {/* Mobile toggle button */}
      <button
        onClick={onMobileMenuToggle}
        className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 lg:hidden"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Global Patient Search */}
      <div className="flex-1 max-w-md relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by Patient ID (e.g. P-1025)..."
          className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/80 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:bg-slate-800 transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Active dataset indicator */}
      <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200/70 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800/50 text-xs">
        <Database className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
        <span className="text-slate-600 dark:text-slate-300 font-medium truncate max-w-[200px]" title={activeDatasetName}>
          {activeDatasetName}
        </span>
        {isCustomDataset && (
          <span className="px-1.5 py-0.5 rounded text-[10px] bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 font-bold">
            Custom
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 lg:gap-3">
        {/* Date Filter selector */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={selectedDateRange}
            onChange={(e) => setSelectedDateRange(e.target.value)}
            className="bg-transparent focus:outline-none cursor-pointer pr-1 text-xs"
          >
            <option value="all">All Dates (Last 12 Mo)</option>
            <option value="last30">Last 30 Days</option>
            <option value="last90">Last 90 Days</option>
            <option value="last180">Last 6 Months</option>
          </select>
        </div>

        {/* Theme toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-colors"
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-teal-500 absolute top-1.5 right-1.5 ring-2 ring-white dark:ring-slate-900" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl dark:border-slate-800 dark:bg-slate-900 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="font-semibold text-xs text-slate-800 dark:text-slate-200">System Notifications</span>
                <span className="text-[10px] text-teal-600 dark:text-teal-400 font-medium">3 New</span>
              </div>
              <div className="mt-2 space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-teal-50/60 dark:bg-teal-950/40 border border-teal-100 dark:border-teal-900/60">
                  <p className="font-semibold text-teal-900 dark:text-teal-200">ML Model Calibrated</p>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                    Random Forest classifier evaluated with 80/20 train-test partition (ROC-AUC 0.77+).
                  </p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <p className="font-semibold text-slate-800 dark:text-slate-200">Cohort Benchmark Loaded</p>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                    1,500 synthetic patient records active for disease prevalence analysis.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar */}
        <div className="relative">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-slate-800 to-slate-900 dark:from-teal-600 dark:to-cyan-500 flex items-center justify-center text-white text-xs font-bold shadow-md">
              DR
            </div>
            <div className="hidden xl:flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Dr. Alex Rivers</span>
              <span className="text-[10px] text-slate-400">Chief Data Analyst</span>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
