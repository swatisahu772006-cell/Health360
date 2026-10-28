import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { LifestyleInsightsData } from '../types';

interface Props {
  data: LifestyleInsightsData;
}

export const LifestyleChart: React.FC<Props> = ({ data }) => {
  const [selectedFactor, setSelectedFactor] = useState<'smoking' | 'exercise' | 'alcohol'>('smoking');

  const chartData = selectedFactor === 'smoking' ? data.smoking :
                    selectedFactor === 'exercise' ? data.exercise : data.alcohol;

  return (
    <div className="flex flex-col w-full h-full">
      {/* Factor Selector Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-lg w-fit mb-4">
        <button
          onClick={() => setSelectedFactor('smoking')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
            selectedFactor === 'smoking'
              ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          Smoking Status
        </button>
        <button
          onClick={() => setSelectedFactor('exercise')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
            selectedFactor === 'exercise'
              ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          Physical Activity
        </button>
        <button
          onClick={() => setSelectedFactor('alcohol')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
            selectedFactor === 'alcohol'
              ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          Alcohol Intake
        </button>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#94A3B8" opacity={0.2} />
            <XAxis dataKey="category" stroke="#64748B" tick={{ fill: 'currentColor', fontSize: 12, fontWeight: 500 }} />
            <YAxis stroke="#64748B" unit="%" tick={{ fill: 'currentColor', fontSize: 12 }} />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-xl dark:border-slate-800 dark:bg-slate-900 text-xs">
                      <p className="font-semibold text-slate-800 dark:text-slate-100 mb-1.5">{label}</p>
                      <div className="space-y-1">
                        {payload.map((p: any) => (
                          <div key={p.name} className="flex items-center justify-between gap-4">
                            <span style={{ color: p.color }} className="font-medium">{p.name}:</span>
                            <span className="font-bold text-slate-700 dark:text-slate-200">{p.value}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend verticalAlign="top" height={32} iconType="circle" wrapperStyle={{ fontSize: 12 }} />
            <Bar name="Heart Disease" dataKey="heart_disease_rate" fill="#0D9488" radius={[4, 4, 0, 0]} />
            <Bar name="Diabetes" dataKey="diabetes_rate" fill="#0891B2" radius={[4, 4, 0, 0]} />
            <Bar name="Stroke" dataKey="stroke_rate" fill="#6366F1" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
