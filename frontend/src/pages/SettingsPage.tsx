import React, { useState, useEffect } from 'react';
import {
  Settings,
  Server,
  Database,
  Cpu,
  ShieldCheck,
  Moon,
  Sun,
  CheckCircle2,
  ExternalLink,
  Code2
} from 'lucide-react';
import { api } from '../services/api';

interface Props {
  darkMode: boolean;
  setDarkMode: (v: boolean) => void;
}

export const SettingsPage: React.FC<Props> = ({ darkMode, setDarkMode }) => {
  const [healthInfo, setHealthInfo] = useState<any>(null);

  useEffect(() => {
    const check = async () => {
      const res = await api.getHealth();
      setHealthInfo(res);
    };
    check();
  }, []);

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          Platform Architecture & Settings
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          System telemetry, model documentation, healthcare schema definitions, and display preferences.
        </p>
      </div>

      {/* Backend API Connectivity Status Card */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
        <h2 className="font-bold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-2">
          <Server className="w-4 h-4 text-teal-600" />
          Backend REST API Telemetry
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <span className="text-slate-400 block text-[11px]">API Connection Status</span>
            <div className="mt-1 flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{healthInfo?.status === 'online' ? 'Online (FastAPI Backend)' : 'Client Analytical Engine'}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <span className="text-slate-400 block text-[11px]">Active Clinical Records</span>
            <span className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-1 block">
              {healthInfo?.active_records ? `${healthInfo.active_records.toLocaleString()} patients` : '1,500 patients'}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <span className="text-slate-400 block text-[11px]">API Engine Version</span>
            <span className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-1 block">
              v1.0.0 (FastAPI 0.115)
            </span>
          </div>
        </div>
      </div>

      {/* Machine Learning Model Documentation */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
        <h2 className="font-bold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-2">
          <Cpu className="w-4 h-4 text-cyan-600" />
          Validated Machine Learning Pipeline Specification
        </h2>

        <div className="text-xs space-y-3 text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            Health360 uses a dual predictive architecture consisting of a <span className="font-bold text-slate-800 dark:text-slate-100">Balanced Random Forest Classifier</span> coupled with an educational rule-based feature attribution interpreter.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
              <span className="font-bold text-slate-800 dark:text-slate-100 block mb-1">
                Data Leakage Safeguards
              </span>
              <p className="text-[11px] text-slate-500">
                Data is partitioned into 80% train and 20% test stratified splits. All feature scaling (StandardScaler) and dummy encodings are fit exclusively on training data and subsequently applied to test partitions.
              </p>
            </div>

            <div className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
              <span className="font-bold text-slate-800 dark:text-slate-100 block mb-1">
                Evaluation Metrics
              </span>
              <p className="text-[11px] text-slate-500">
                Evaluation emphasizes ROC-AUC (0.77+) and F1-score across imbalanced disease categories rather than pure accuracy alone, ensuring sensitive detection of high-risk outliers.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Interface Preferences */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
        <h2 className="font-bold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-2">
          <Moon className="w-4 h-4 text-indigo-500" />
          Interface Display Preferences
        </h2>

        <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-xs">
          <div>
            <span className="font-bold text-slate-800 dark:text-slate-100 block">Theme Palette</span>
            <span className="text-slate-500 text-[11px]">Toggle between High-Contrast Medical Light and Deep Navy Dark modes</span>
          </div>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-sm"
          >
            {darkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-600" />}
            {darkMode ? 'Dark Active' : 'Light Active'}
          </button>
        </div>
      </div>

      {/* Compliance & Regulatory Disclaimer */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200">
        <span className="font-bold block mb-1">Hackathon Demonstration & Regulatory Notice</span>
        <p className="leading-relaxed">
          Health360 is an academic decision-support and disease prevalence surveillance prototype developed for hackathon demonstration and educational evaluation. It does not possess FDA 510(k) clearance or CE mark as Software as a Medical Device (SaMD) and is not approved for patient diagnosis or clinical prescription.
        </p>
      </div>
    </div>
  );
};
