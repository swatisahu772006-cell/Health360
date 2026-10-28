import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { BmiCategoryItem } from '../types';

interface Props {
  data: BmiCategoryItem[];
}

export const BmiDistributionChart: React.FC<Props> = ({ data }) => {
  return (
    <div className="flex flex-col h-full">
      <div className="h-60 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="category"
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={3}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload as BmiCategoryItem;
                  return (
                    <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-xl dark:border-slate-800 dark:bg-slate-900">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                        <p className="font-semibold text-slate-800 dark:text-slate-100">{item.category}</p>
                      </div>
                      <div className="mt-2 space-y-1 text-xs">
                        <p className="text-slate-600 dark:text-slate-300">
                          Patients: <span className="font-bold">{item.count}</span> ({item.percentage}%)
                        </p>
                        <p className="text-teal-600 dark:text-teal-400">
                          Heart Disease Rate: <span className="font-bold">{item.heart_disease_prevalence}%</span>
                        </p>
                        <p className="text-cyan-600 dark:text-cyan-400">
                          Diabetes Rate: <span className="font-bold">{item.diabetes_prevalence}%</span>
                        </p>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">Cohorts</span>
          <span className="text-lg font-bold text-slate-800 dark:text-slate-100">6 Classes</span>
        </div>
      </div>

      {/* Legend Grid */}
      <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
        {data.map((item) => (
          <div key={item.category} className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
              <span className="truncate text-slate-600 dark:text-slate-300 font-medium">{item.category}</span>
            </div>
            <span className="font-bold text-slate-700 dark:text-slate-200 ml-2">{item.percentage}%</span>
          </div>
        ))}
      </div>

      <div className="mt-3 p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
        <span className="font-semibold text-slate-700 dark:text-slate-300">Clinical Screening Note:</span> BMI is a population screening indicator and does not differentiate between lean muscle mass and visceral adiposity.
      </div>
    </div>
  );
};
