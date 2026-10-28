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
import { PrevalenceItem } from '../types';

interface Props {
  data: PrevalenceItem[];
}

export const PrevalenceBarChart: React.FC<Props> = ({ data }) => {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#94A3B8" opacity={0.2} />
          <XAxis
            dataKey="disease"
            stroke="#64748B"
            tick={{ fill: 'currentColor', fontSize: 13, fontWeight: 500 }}
          />
          <YAxis
            stroke="#64748B"
            unit="%"
            tick={{ fill: 'currentColor', fontSize: 12 }}
            domain={[0, 'dataMax + 10']}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload as PrevalenceItem;
                return (
                  <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-xl dark:border-slate-800 dark:bg-slate-900">
                    <p className="font-semibold text-slate-800 dark:text-slate-100">{item.disease}</p>
                    <div className="mt-1.5 space-y-1 text-xs">
                      <p className="text-teal-600 dark:text-teal-400 font-medium">
                        Prevalence: <span className="font-bold text-sm">{item.prevalence_rate}%</span>
                      </p>
                      <p className="text-slate-500 dark:text-slate-400">
                        Positive cases: <span className="font-semibold text-slate-700 dark:text-slate-200">{item.positive_count}</span>
                      </p>
                      <p className="text-slate-500 dark:text-slate-400">
                        Cohort denominator: <span className="font-semibold text-slate-700 dark:text-slate-200">{item.valid_sample_size}</span>
                      </p>
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar dataKey="prevalence_rate" radius={[6, 6, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color || '#0D9488'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
