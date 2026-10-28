import React from 'react';
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
import { AgeGroupItem } from '../types';

interface Props {
  data: AgeGroupItem[];
}

export const AgeGroupChart: React.FC<Props> = ({ data }) => {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#94A3B8" opacity={0.2} />
          <XAxis
            dataKey="age_group"
            stroke="#64748B"
            tick={{ fill: 'currentColor', fontSize: 12, fontWeight: 500 }}
          />
          <YAxis stroke="#64748B" unit="%" tick={{ fill: 'currentColor', fontSize: 12 }} />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                const item = data.find(d => d.age_group === label);
                return (
                  <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-xl dark:border-slate-800 dark:bg-slate-900">
                    <p className="font-semibold text-slate-800 dark:text-slate-100">
                      Age Group: {label}
                    </p>
                    <p className="text-xs text-slate-400 mb-2">Sample size: N={item?.count || 0}</p>
                    <div className="space-y-1 text-xs">
                      {payload.map((p: any) => (
                        <div key={p.name} className="flex items-center justify-between gap-4">
                          <span style={{ color: p.color }} className="font-medium">
                            {p.name}:
                          </span>
                          <span className="font-bold text-slate-700 dark:text-slate-200">
                            {p.value}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend
            verticalAlign="top"
            height={36}
            iconType="circle"
            wrapperStyle={{ fontSize: 12 }}
          />
          <Bar name="Heart Disease" dataKey="heart_disease_rate" fill="#0D9488" radius={[4, 4, 0, 0]} />
          <Bar name="Diabetes" dataKey="diabetes_rate" fill="#0891B2" radius={[4, 4, 0, 0]} />
          <Bar name="Stroke" dataKey="stroke_rate" fill="#6366F1" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
