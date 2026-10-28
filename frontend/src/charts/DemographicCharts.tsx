import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { DemographicsData } from '../types';

interface Props {
  data: DemographicsData;
}

export const DemographicCharts: React.FC<Props> = ({ data }) => {
  return (
    <div className="space-y-6">
      {/* Age & Sex Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Age Distribution Histogram */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-100">Age Distribution Histogram</h3>
              <p className="text-xs text-slate-500">Cohort volume across discrete decade age brackets</p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300 font-medium">
              Population Pyramid
            </span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.age_distribution} margin={{ top: 10, right: 20, left: -10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#94A3B8" opacity={0.2} />
                <XAxis dataKey="bin" stroke="#64748B" tick={{ fill: 'currentColor', fontSize: 11 }} />
                <YAxis stroke="#64748B" tick={{ fill: 'currentColor', fontSize: 11 }} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0].payload;
                      return (
                        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-xl dark:border-slate-800 dark:bg-slate-900 text-xs">
                          <p className="font-semibold text-slate-800 dark:text-slate-100 mb-1">Ages: {label}</p>
                          <p className="text-teal-600 font-bold">{item.count} Patients ({item.percentage}%)</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="count" fill="#0D9488" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sex-based Comparisons */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-100">Sex-Stratified Disease Prevalence</h3>
              <p className="text-xs text-slate-500">Prevalence comparison between biological male and female cohorts</p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-cyan-50 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300 font-medium">
              Sex Stratification
            </span>
          </div>

          <div className="space-y-4 pt-1">
            {data.sex_distribution.map((item) => (
              <div key={item.sex} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800 dark:text-slate-100">{item.sex}</span>
                    <span className="text-xs text-slate-500">N={item.count} ({item.percentage}%)</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 text-xs pt-1">
                  <div className="p-2 rounded-lg bg-teal-50 dark:bg-teal-950/50 border border-teal-100 dark:border-teal-900/50">
                    <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Heart Disease</span>
                    <span className="text-sm font-bold text-teal-700 dark:text-teal-300">{item.heart_disease_rate}%</span>
                  </div>
                  <div className="p-2 rounded-lg bg-cyan-50 dark:bg-cyan-950/50 border border-cyan-100 dark:border-cyan-900/50">
                    <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Diabetes</span>
                    <span className="text-sm font-bold text-cyan-700 dark:text-cyan-300">{item.diabetes_rate}%</span>
                  </div>
                  <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900/50">
                    <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Stroke</span>
                    <span className="text-sm font-bold text-indigo-700 dark:text-indigo-300">{item.stroke_rate}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Age Group x Disease Prevalence Heatmap Matrix */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-slate-800 dark:text-slate-100">
              Age Group & Disease Prevalence Heatmap Matrix
            </h3>
            <p className="text-xs text-slate-500">
              Cross-tabulation of disease prevalence across age cohorts with sample size indicators
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            N &ge; 15 validation
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400">
                <th className="py-2.5 px-3 text-left font-medium">Age Group</th>
                <th className="py-2.5 px-3 text-center font-medium">Cohort Size (N)</th>
                <th className="py-2.5 px-3 text-center font-medium">Heart Disease</th>
                <th className="py-2.5 px-3 text-center font-medium">Diabetes</th>
                <th className="py-2.5 px-3 text-center font-medium">Stroke</th>
                <th className="py-2.5 px-3 text-center font-medium">Reliability Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {data.heatmap_data.map((row) => (
                <tr key={row.age_group} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-3 font-semibold text-slate-700 dark:text-slate-200">
                    {row.age_group}
                  </td>
                  <td className="py-3 px-3 text-center text-slate-500">
                    N = {row.sample_size}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className="px-2.5 py-1 rounded-md font-bold inline-block"
                      style={{
                        backgroundColor: `rgba(13, 148, 136, ${Math.min(row.heart_disease / 40, 1)})`,
                        color: row.heart_disease > 15 ? '#ffffff' : '#0F766E'
                      }}
                    >
                      {row.heart_disease}%
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className="px-2.5 py-1 rounded-md font-bold inline-block"
                      style={{
                        backgroundColor: `rgba(8, 145, 178, ${Math.min(row.diabetes / 45, 1)})`,
                        color: row.diabetes > 18 ? '#ffffff' : '#0E7490'
                      }}
                    >
                      {row.diabetes}%
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className="px-2.5 py-1 rounded-md font-bold inline-block"
                      style={{
                        backgroundColor: `rgba(99, 102, 241, ${Math.min(row.stroke / 20, 1)})`,
                        color: row.stroke > 8 ? '#ffffff' : '#4338CA'
                      }}
                    >
                      {row.stroke}%
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    {row.flag_low_sample ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 font-medium">
                        ⚠️ Low Sample (&lt;15)
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 font-medium">
                        ✓ High Confidence
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
