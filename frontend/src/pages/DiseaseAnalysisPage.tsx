import React, { useState, useEffect } from 'react';
import {
  Heart,
  Activity,
  Zap,
  Layers,
  ArrowUpRight,
  ShieldAlert,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  BarChart2
} from 'lucide-react';
import { api } from '../services/api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LineChart,
  Line
} from 'recharts';

export const DiseaseAnalysisPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'heart' | 'diabetes' | 'stroke' | 'comorbidity'>('heart');
  const [diseaseData, setDiseaseData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (activeTab === 'comorbidity') {
      setLoading(false);
      return;
    }
    const loadDisease = async () => {
      setLoading(true);
      try {
        const res = await api.getDiseaseDetails(activeTab);
        setDiseaseData(res);
      } catch (err) {
        console.error('Error fetching disease data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadDisease();
  }, [activeTab]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Title & Disease Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            Disease Analysis & Clinical Risk Phenotyping
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Deep dive exploration of epidemiological indicators, clinical markers, and diagnostic co-morbidities.
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl w-fit">
          <button
            onClick={() => setActiveTab('heart')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'heart'
                ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            Heart Disease
          </button>

          <button
            onClick={() => setActiveTab('diabetes')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'diabetes'
                ? 'bg-white dark:bg-slate-900 text-cyan-600 dark:text-cyan-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            Diabetes
          </button>

          <button
            onClick={() => setActiveTab('stroke')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'stroke'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            Stroke
          </button>

          <button
            onClick={() => setActiveTab('comorbidity')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'comorbidity'
                ? 'bg-white dark:bg-slate-900 text-slate-800 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Cross-Disease Matrix
          </button>
        </div>
      </div>

      {activeTab === 'comorbidity' ? (
        /* Cross-Disease Co-morbidity & Overlap View */
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="font-bold text-slate-800 dark:text-slate-100 text-base mb-1">
              Cross-Disease Co-morbidity & Multi-Condition Overlap
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              Analysis of shared patient pathology across cardiovascular and metabolic conditions
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-teal-50/50 dark:bg-teal-950/40 border border-teal-100 dark:border-teal-900/60">
                <span className="text-xs text-teal-800 dark:text-teal-300 font-semibold block">Heart Disease Only</span>
                <span className="text-2xl font-black text-teal-700 dark:text-teal-300 mt-1 block">128</span>
                <span className="text-[11px] text-slate-500">69.2% of heart disease cohort</span>
              </div>

              <div className="p-4 rounded-xl bg-cyan-50/50 dark:bg-cyan-950/40 border border-cyan-100 dark:border-cyan-900/60">
                <span className="text-xs text-cyan-800 dark:text-cyan-300 font-semibold block">Diabetes Only</span>
                <span className="text-2xl font-black text-cyan-700 dark:text-cyan-300 mt-1 block">282</span>
                <span className="text-[11px] text-slate-500">80.3% of diabetes cohort</span>
              </div>

              <div className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/60">
                <span className="text-xs text-amber-800 dark:text-amber-300 font-semibold block">Heart Disease + Diabetes</span>
                <span className="text-2xl font-black text-amber-700 dark:text-amber-300 mt-1 block">42</span>
                <span className="text-[11px] text-slate-500">Dual cardiometabolic co-morbidity</span>
              </div>

              <div className="p-4 rounded-xl bg-rose-50/50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900/60">
                <span className="text-xs text-rose-800 dark:text-rose-300 font-semibold block">Triad (Heart + Diabetes + Stroke)</span>
                <span className="text-2xl font-black text-rose-700 dark:text-rose-300 mt-1 block">15</span>
                <span className="text-[11px] text-slate-500">High-complexity multi-morbidity</span>
              </div>
            </div>

            {/* Overlap Summary Table */}
            <div className="mt-6 border-t border-slate-100 dark:border-slate-800 pt-6">
              <h3 className="font-semibold text-xs text-slate-700 dark:text-slate-300 mb-3">
                Relative Risk Amplification in Co-morbid Patients
              </h3>
              <div className="overflow-x-auto text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-semibold">
                    <tr>
                      <th className="p-3">Primary Diagnosis</th>
                      <th className="p-3">Co-occurring Condition</th>
                      <th className="p-3">Prevalence in Primary Cohort</th>
                      <th className="p-3">Prevalence in Non-Primary Cohort</th>
                      <th className="p-3">Observed Risk Multiplier</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    <tr>
                      <td className="p-3 font-medium text-slate-800 dark:text-slate-200">Diabetes Patients (N=351)</td>
                      <td className="p-3 text-slate-600 dark:text-slate-300">Heart Disease</td>
                      <td className="p-3 font-bold text-teal-600">16.2%</td>
                      <td className="p-3 text-slate-500">11.1%</td>
                      <td className="p-3 font-bold text-amber-600">1.46x Elev.</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium text-slate-800 dark:text-slate-200">Heart Disease Patients (N=185)</td>
                      <td className="p-3 text-slate-600 dark:text-slate-300">Stroke</td>
                      <td className="p-3 font-bold text-indigo-600">14.6%</td>
                      <td className="p-3 text-slate-500">2.9%</td>
                      <td className="p-3 font-bold text-rose-600">5.03x Elev.</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium text-slate-800 dark:text-slate-200">Hypertension (SBP ≥140)</td>
                      <td className="p-3 text-slate-600 dark:text-slate-300">Stroke</td>
                      <td className="p-3 font-bold text-indigo-600">9.8%</td>
                      <td className="p-3 text-slate-500">1.8%</td>
                      <td className="p-3 font-bold text-rose-600">5.44x Elev.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      ) : diseaseData ? (
        /* Single Disease Detail View */
        <div className="space-y-6">
          {/* Top KPI Cards for the Disease */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <span className="text-xs font-semibold text-slate-500">Diagnosed Cohort Cases</span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900 dark:text-white">
                  {diseaseData.positive_count}
                </span>
                <span className="text-xs text-slate-400">of {diseaseData.total_sample_size} valid records</span>
              </div>
              <span className="text-xs text-slate-400 mt-1 block">Full analytical cohort representation</span>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <span className="text-xs font-semibold text-slate-500">Overall Disease Prevalence</span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-black text-teal-600 dark:text-teal-400">
                  {diseaseData.prevalence_rate}%
                </span>
                <span className="text-xs text-slate-400">population rate</span>
              </div>
              <span className="text-xs text-slate-400 mt-1 block">Calibrated CDC/AHA baseline frequency</span>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <span className="text-xs font-semibold text-slate-500">Primary Correlated Biomarker</span>
              <div className="mt-2">
                <span className="text-xl font-bold text-slate-800 dark:text-slate-100">
                  {activeTab === 'heart' ? 'Systolic BP & Cholesterol' :
                   activeTab === 'diabetes' ? 'Fasting Blood Glucose' : 'Systolic BP & Age'}
                </span>
              </div>
              <span className="text-xs text-slate-400 mt-1 block">Strongest linear association observed</span>
            </div>
          </div>

          {/* Visualizations Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Age Stratification Chart */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm mb-1">
                Prevalence by Age Cohort
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Rate of {activeTab === 'heart' ? 'Heart Disease' : activeTab === 'diabetes' ? 'Diabetes' : 'Stroke'} across age brackets
              </p>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={diseaseData.by_age_group} margin={{ top: 10, right: 20, left: -10, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#94A3B8" opacity={0.2} />
                    <XAxis dataKey="group" stroke="#64748B" tick={{ fill: 'currentColor', fontSize: 11 }} />
                    <YAxis stroke="#64748B" unit="%" tick={{ fill: 'currentColor', fontSize: 11 }} />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const item = payload[0].payload;
                          return (
                            <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-xl dark:border-slate-800 dark:bg-slate-900 text-xs">
                              <p className="font-semibold text-slate-800 dark:text-slate-100 mb-1">{label}</p>
                              <p className="text-teal-600 font-bold">Prevalence: {item.prevalence}%</p>
                              <p className="text-slate-400 text-[11px]">Cohort sample: N={item.sample_size}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="prevalence" fill="#0D9488" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* BMI Category Chart */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm mb-1">
                Prevalence Across BMI Categories
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Comparison from Underweight to Obesity Class III
              </p>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={diseaseData.by_bmi_category} margin={{ top: 10, right: 20, left: -10, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#94A3B8" opacity={0.2} />
                    <XAxis dataKey="category" stroke="#64748B" tick={{ fill: 'currentColor', fontSize: 10 }} angle={-15} textAnchor="end" height={45} />
                    <YAxis stroke="#64748B" unit="%" tick={{ fill: 'currentColor', fontSize: 11 }} />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const item = payload[0].payload;
                          return (
                            <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-xl dark:border-slate-800 dark:bg-slate-900 text-xs">
                              <p className="font-semibold text-slate-800 dark:text-slate-100 mb-1">{label}</p>
                              <p className="text-cyan-600 font-bold">Prevalence: {item.prevalence}%</p>
                              <p className="text-slate-400 text-[11px]">Cohort sample: N={item.sample_size}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="prevalence" fill="#0891B2" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Clinical Distribution Comparison */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm mb-1">
              Comparative Clinical Indicators (Positive vs Non-Diagnosed Cohorts)
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Biometric contrasts between individuals with and without the diagnosed outcome
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              {activeTab === 'heart' && diseaseData.clinical_comparison && (
                <>
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500 font-medium block">Mean Systolic Blood Pressure</span>
                    <div className="mt-2 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-slate-400 block">Heart Disease (+)</span>
                        <span className="text-lg font-bold text-rose-600">{diseaseData.clinical_comparison.systolic_bp?.positive_mean} mmHg</span>
                      </div>
                      <div>
                        <span className="text-xs text-slate-400 block">Healthy (&ndash;)</span>
                        <span className="text-lg font-bold text-slate-700 dark:text-slate-200">{diseaseData.clinical_comparison.systolic_bp?.negative_mean} mmHg</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500 font-medium block">Mean Total Cholesterol</span>
                    <div className="mt-2 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-slate-400 block">Heart Disease (+)</span>
                        <span className="text-lg font-bold text-amber-600">{diseaseData.clinical_comparison.cholesterol?.positive_mean} mg/dL</span>
                      </div>
                      <div>
                        <span className="text-xs text-slate-400 block">Healthy (&ndash;)</span>
                        <span className="text-lg font-bold text-slate-700 dark:text-slate-200">{diseaseData.clinical_comparison.cholesterol?.negative_mean} mg/dL</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500 font-medium block">Chest Pain Symptom Rate</span>
                    <div className="mt-2 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-slate-400 block">In Heart Disease</span>
                        <span className="text-lg font-bold text-rose-600">{diseaseData.clinical_comparison.chest_pain_prevalence?.in_disease}%</span>
                      </div>
                      <div>
                        <span className="text-xs text-slate-400 block">In Healthy Cohort</span>
                        <span className="text-lg font-bold text-slate-700 dark:text-slate-200">{diseaseData.clinical_comparison.chest_pain_prevalence?.in_healthy}%</span>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'diabetes' && diseaseData.clinical_comparison && (
                <>
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500 font-medium block">Mean Fasting Glucose</span>
                    <div className="mt-2 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-slate-400 block">Diabetes (+)</span>
                        <span className="text-lg font-bold text-cyan-600">{diseaseData.clinical_comparison.glucose?.positive_mean} mg/dL</span>
                      </div>
                      <div>
                        <span className="text-xs text-slate-400 block">Healthy (&ndash;)</span>
                        <span className="text-lg font-bold text-slate-700 dark:text-slate-200">{diseaseData.clinical_comparison.glucose?.negative_mean} mg/dL</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500 font-medium block">Mean Body Mass Index (BMI)</span>
                    <div className="mt-2 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-slate-400 block">Diabetes (+)</span>
                        <span className="text-lg font-bold text-amber-600">{diseaseData.clinical_comparison.bmi?.positive_mean} kg/m²</span>
                      </div>
                      <div>
                        <span className="text-xs text-slate-400 block">Healthy (&ndash;)</span>
                        <span className="text-lg font-bold text-slate-700 dark:text-slate-200">{diseaseData.clinical_comparison.bmi?.negative_mean} kg/m²</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500 font-medium block">Reported Fatigue Rate</span>
                    <div className="mt-2 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-slate-400 block">In Diabetic Cohort</span>
                        <span className="text-lg font-bold text-cyan-600">{diseaseData.clinical_comparison.fatigue_prevalence?.in_disease}%</span>
                      </div>
                      <div>
                        <span className="text-xs text-slate-400 block">In Healthy Cohort</span>
                        <span className="text-lg font-bold text-slate-700 dark:text-slate-200">{diseaseData.clinical_comparison.fatigue_prevalence?.in_healthy}%</span>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'stroke' && diseaseData.clinical_comparison && (
                <>
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500 font-medium block">Mean Systolic Blood Pressure</span>
                    <div className="mt-2 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-slate-400 block">Stroke (+)</span>
                        <span className="text-lg font-bold text-indigo-600">{diseaseData.clinical_comparison.systolic_bp?.positive_mean} mmHg</span>
                      </div>
                      <div>
                        <span className="text-xs text-slate-400 block">Healthy (&ndash;)</span>
                        <span className="text-lg font-bold text-slate-700 dark:text-slate-200">{diseaseData.clinical_comparison.systolic_bp?.negative_mean} mmHg</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500 font-medium block">Mean Age at Incidence</span>
                    <div className="mt-2 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-slate-400 block">Stroke (+)</span>
                        <span className="text-lg font-bold text-slate-800 dark:text-slate-100">{diseaseData.clinical_comparison.age?.positive_mean} yrs</span>
                      </div>
                      <div>
                        <span className="text-xs text-slate-400 block">Cohort Mean</span>
                        <span className="text-lg font-bold text-slate-700 dark:text-slate-200">{diseaseData.clinical_comparison.age?.negative_mean} yrs</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500 font-medium block">Reported Dizziness Rate</span>
                    <div className="mt-2 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-slate-400 block">In Stroke Cohort</span>
                        <span className="text-lg font-bold text-indigo-600">{diseaseData.clinical_comparison.dizziness_prevalence?.in_disease}%</span>
                      </div>
                      <div>
                        <span className="text-xs text-slate-400 block">In Healthy Cohort</span>
                        <span className="text-lg font-bold text-slate-700 dark:text-slate-200">{diseaseData.clinical_comparison.dizziness_prevalence?.in_healthy}%</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      ) : null}

      {/* Causal Disclaimer Alert */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <span className="font-bold">Medical Analytical Disclaimer:</span> Observed associations reflect statistical correlations in this benchmark cohort and must not be interpreted as proving direct causation. This application is an educational and analytical research demonstration and does not substitute for qualified clinical evaluation.
        </p>
      </div>
    </div>
  );
};
