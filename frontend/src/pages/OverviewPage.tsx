import React, { useState, useEffect } from 'react';
import {
  Users,
  Heart,
  Activity,
  AlertTriangle,
  Calendar,
  Zap,
  Info,
  TrendingUp,
  RefreshCw,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import { api } from '../services/api';
import { SummaryKPIs, PrevalenceItem, AgeGroupItem, BmiCategoryItem, CorrelationMatrixData, LifestyleInsightsData, FilterState, DynamicInsight } from '../types';
import { PrevalenceBarChart } from '../charts/PrevalenceBarChart';
import { AgeGroupChart } from '../charts/AgeGroupChart';
import { BmiDistributionChart } from '../charts/BmiDistributionChart';
import { CorrelationHeatmap } from '../charts/CorrelationHeatmap';
import { LifestyleChart } from '../charts/LifestyleChart';

interface Props {
  onNavigateTab: (tab: any) => void;
  searchQuery: string;
  selectedDateRange: string;
}

export const OverviewPage: React.FC<Props> = ({ onNavigateTab, searchQuery, selectedDateRange }) => {
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Partial<FilterState>>({
    age_group: 'All',
    bmi_category: 'All',
    disease: 'All',
    smoking_status: 'All',
    exercise_level: 'All'
  });

  const [kpis, setKpis] = useState<SummaryKPIs | null>(null);
  const [prevalence, setPrevalence] = useState<PrevalenceItem[]>([]);
  const [ageGroupData, setAgeGroupData] = useState<AgeGroupItem[]>([]);
  const [bmiData, setBmiData] = useState<BmiCategoryItem[]>([]);
  const [corrMatrix, setCorrMatrix] = useState<CorrelationMatrixData | null>(null);
  const [lifestyleData, setLifestyleData] = useState<LifestyleInsightsData | null>(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const activeFilters = {
        ...filters,
        search: searchQuery || undefined,
        start_date: selectedDateRange === 'last30' ? '2026-09-28' :
                    selectedDateRange === 'last90' ? '2026-07-28' :
                    selectedDateRange === 'last180' ? '2026-04-28' : undefined
      };
      const res = await api.getDashboardSummary(activeFilters);
      setKpis(res.kpis);
      setPrevalence(res.disease_prevalence);
      setAgeGroupData(res.age_group_analysis);
      setBmiData(res.bmi_distribution);
      setCorrMatrix(res.correlation_matrix);
      setLifestyleData(res.lifestyle);
    } catch (err) {
      console.error('Error fetching dashboard summary:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [filters, searchQuery, selectedDateRange]);

  const resetFilters = () => {
    setFilters({
      age_group: 'All',
      bmi_category: 'All',
      disease: 'All',
      smoking_status: 'All',
      exercise_level: 'All'
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Title & Global Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            Executive Healthcare Analytics Dashboard
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
              Live Surveillance
            </span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time population epidemiology, disease risk associations, and clinical vitals distribution.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchDashboardData}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-teal-500' : ''}`} />
            Refresh
          </button>
          <button
            onClick={() => onNavigateTab('reports')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white transition-colors shadow-sm"
          >
            Generate Report
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Quick Filter Strip */}
      <div className="p-3.5 rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 font-medium">
          <SlidersHorizontal className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
          <span>Active Cohort Filter:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Age Group */}
          <select
            value={filters.age_group}
            onChange={(e) => setFilters({ ...filters, age_group: e.target.value })}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500"
          >
            <option value="All">All Age Groups</option>
            <option value="Under 30">Under 30</option>
            <option value="30–39">30–39</option>
            <option value="40–49">40–49</option>
            <option value="50–59">50–59</option>
            <option value="60+">60+</option>
          </select>

          {/* BMI Category */}
          <select
            value={filters.bmi_category}
            onChange={(e) => setFilters({ ...filters, bmi_category: e.target.value })}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500"
          >
            <option value="All">All BMI Classes</option>
            <option value="Underweight">Underweight (&lt;18.5)</option>
            <option value="Normal">Normal (18.5–24.9)</option>
            <option value="Overweight">Overweight (25–29.9)</option>
            <option value="Obesity Class I">Obesity Class I (30–34.9)</option>
            <option value="Obesity Class II">Obesity Class II (35–39.9)</option>
            <option value="Obesity Class III">Obesity Class III (≥40)</option>
          </select>

          {/* Disease */}
          <select
            value={filters.disease}
            onChange={(e) => setFilters({ ...filters, disease: e.target.value })}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500"
          >
            <option value="All">All Disease Diagnoses</option>
            <option value="Heart Disease">Heart Disease Positive</option>
            <option value="Diabetes">Diabetes Positive</option>
            <option value="Stroke">Stroke Positive</option>
          </select>

          {/* Smoking */}
          <select
            value={filters.smoking_status}
            onChange={(e) => setFilters({ ...filters, smoking_status: e.target.value })}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500"
          >
            <option value="All">All Smoking Habits</option>
            <option value="Never">Never Smoked</option>
            <option value="Former">Former Smoker</option>
            <option value="Current">Current Smoker</option>
          </select>

          {/* Exercise */}
          <select
            value={filters.exercise_level}
            onChange={(e) => setFilters({ ...filters, exercise_level: e.target.value })}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500"
          >
            <option value="All">All Activity Levels</option>
            <option value="Sedentary">Sedentary</option>
            <option value="Light">Light</option>
            <option value="Moderate">Moderate</option>
            <option value="Active">Active</option>
          </select>

          <button
            onClick={resetFilters}
            className="px-3 py-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-semibold transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      {/* 6 Executive KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* 1. Total Patients */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Analyzed</span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {kpis ? kpis.total_patients.toLocaleString() : '—'}
            </span>
            <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1" title="Neutral indicator: Cross-sectional clinical benchmark cohort.">
              <Info className="w-3 h-3 text-slate-400" />
              Baseline cohort records
            </p>
          </div>
        </div>

        {/* 2. Heart Disease Prevalence */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Heart Disease</span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 dark:bg-teal-950/80 dark:text-teal-400 flex items-center justify-center">
              <Heart className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-teal-600 dark:text-teal-400">
              {kpis ? `${kpis.heart_disease.rate}%` : '—'}
            </span>
            <p className="text-[11px] text-slate-400 mt-1" title="Number of positive valid records divided by known cases">
              {kpis ? `${kpis.heart_disease.count} / ${kpis.heart_disease.valid_n} positive` : 'Calculated from valid records'}
            </p>
          </div>
        </div>

        {/* 3. Diabetes Prevalence */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Diabetes</span>
            <div className="w-8 h-8 rounded-xl bg-cyan-50 text-cyan-600 dark:bg-cyan-950/80 dark:text-cyan-400 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-cyan-600 dark:text-cyan-400">
              {kpis ? `${kpis.diabetes.rate}%` : '—'}
            </span>
            <p className="text-[11px] text-slate-400 mt-1">
              {kpis ? `${kpis.diabetes.count} / ${kpis.diabetes.valid_n} positive` : 'Calculated from valid records'}
            </p>
          </div>
        </div>

        {/* 4. Stroke Prevalence */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Stroke</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/80 dark:text-indigo-400 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
              {kpis ? `${kpis.stroke.rate}%` : '—'}
            </span>
            <p className="text-[11px] text-slate-400 mt-1">
              {kpis ? `${kpis.stroke.count} / ${kpis.stroke.valid_n} positive` : 'Calculated from valid records'}
            </p>
          </div>
        </div>

        {/* 5. High-Risk Profiles */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">High Risk Cohort</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/80 dark:text-rose-400 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-rose-600 dark:text-rose-400">
              {kpis ? `${kpis.high_risk_rate}%` : '—'}
            </span>
            <p className="text-[11px] text-slate-400 mt-1">
              {kpis ? `${kpis.high_risk_count} patients critical` : 'Composite clinical score'}
            </p>
          </div>
        </div>

        {/* 6. Average Age */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Mean Patient Age</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/80 dark:text-amber-400 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-slate-800 dark:text-slate-100">
              {kpis ? `${kpis.avg_age} yrs` : '—'}
            </span>
            <p className="text-[11px] text-slate-400 mt-1">
              Adult epidemiological span
            </p>
          </div>
        </div>
      </div>

      {/* Row 2: Disease Prevalence Chart & Age Group Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                A. Disease Prevalence Distribution
              </h2>
              <p className="text-xs text-slate-500">
                Comparative prevalence of Heart Disease, Diabetes, and Stroke with exact cohort denominators
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('diseases')}
              className="text-xs text-teal-600 dark:text-teal-400 font-semibold hover:underline"
            >
              Detailed Breakdown &rarr;
            </button>
          </div>
          <PrevalenceBarChart data={prevalence} />
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                B. Age Group Multi-Disease Stratification
              </h2>
              <p className="text-xs text-slate-500">
                Discrete age cohort disease prevalence (&lt;30, 30–39, 40–49, 50–59, 60+)
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('demographics')}
              className="text-xs text-teal-600 dark:text-teal-400 font-semibold hover:underline"
            >
              Demographics &rarr;
            </button>
          </div>
          <AgeGroupChart data={ageGroupData} />
        </div>
      </div>

      {/* Row 3: BMI Distribution & Correlation Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-2">
            <h2 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
              C. BMI Category Distribution & Prevalence
            </h2>
            <p className="text-xs text-slate-500">
              Underweight, Normal, Overweight, and Obesity Classes I–III
            </p>
          </div>
          <BmiDistributionChart data={bmiData} />
        </div>

        <div className="lg:col-span-7 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                D. Risk Factor Correlation Matrix Heatmap
              </h2>
              <p className="text-xs text-slate-500">
                Pairwise linear associations across continuous clinical and lifestyle parameters
              </p>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              Pearson r
            </span>
          </div>
          {corrMatrix && <CorrelationHeatmap data={corrMatrix} />}
        </div>
      </div>

      {/* Row 4: Lifestyle Insights & Dynamic Observations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                E. Lifestyle Risk Associations
              </h2>
              <p className="text-xs text-slate-500">
                Disease prevalence across smoking habits, physical activity, and alcohol intake
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('lifestyle')}
              className="text-xs text-teal-600 dark:text-teal-400 font-semibold hover:underline"
            >
              Full Lifestyle Insights &rarr;
            </button>
          </div>
          {lifestyleData && <LifestyleChart data={lifestyleData} />}
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                  F. Dynamic Cohort Intelligence & Observations
                </h2>
                <p className="text-xs text-slate-500">
                  Data-backed observations dynamically generated from active filters (no hardcoded text)
                </p>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                Automated Insights
              </span>
            </div>

            <div className="space-y-3 mt-4">
              {lifestyleData && lifestyleData.dynamic_insights.map((insight: DynamicInsight, idx: number) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-800/40 text-xs"
                >
                  <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200 mb-1">
                    <span className="text-teal-600 dark:text-teal-400">{insight.factor}</span>
                    <span className="text-[10px] text-slate-400 font-normal">{insight.sample_size}</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {insight.finding}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-teal-500/10 border border-teal-500/20 text-xs text-teal-900 dark:text-teal-200 flex items-center justify-between">
            <span className="font-medium">
              Want to predict risk for a specific patient profile?
            </span>
            <button
              onClick={() => onNavigateTab('risk')}
              className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs shadow-sm transition-colors shrink-0 ml-2"
            >
              Launch Assessment Tool &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
