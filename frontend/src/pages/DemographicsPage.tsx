import React, { useState, useEffect } from 'react';
import {
  PieChart,
  Users,
  Filter,
  CheckCircle2,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { api } from '../services/api';
import { DemographicsData } from '../types';
import { DemographicCharts } from '../charts/DemographicCharts';

export const DemographicsPage: React.FC = () => {
  const [data, setData] = useState<DemographicsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDisease, setSelectedDisease] = useState('All');
  const [selectedBmi, setSelectedBmi] = useState('All');

  const loadDemographics = async () => {
    setLoading(true);
    try {
      const res = await api.getDemographics({
        disease: selectedDisease,
        bmi_category: selectedBmi
      });
      setData(res);
    } catch (err) {
      console.error('Error fetching demographics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDemographics();
  }, [selectedDisease, selectedBmi]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Title & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            Demographic Stratification & Cohort Pyramids
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Population-level epidemiological distribution across age brackets, biological sex, and disease incidence.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <select
            value={selectedDisease}
            onChange={(e) => setSelectedDisease(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-medium"
          >
            <option value="All">All Diagnoses</option>
            <option value="Heart Disease">Heart Disease</option>
            <option value="Diabetes">Diabetes</option>
            <option value="Stroke">Stroke</option>
          </select>

          <select
            value={selectedBmi}
            onChange={(e) => setSelectedBmi(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-medium"
          >
            <option value="All">All BMI Classes</option>
            <option value="Normal">Normal Weight</option>
            <option value="Overweight">Overweight</option>
            <option value="Obesity Class I">Obesity Class I</option>
            <option value="Obesity Class II">Obesity Class II</option>
            <option value="Obesity Class III">Obesity Class III</option>
          </select>

          {(selectedDisease !== 'All' || selectedBmi !== 'All') && (
            <button
              onClick={() => {
                setSelectedDisease('All');
                setSelectedBmi('All');
              }}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
              title="Reset"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="p-16 text-center text-slate-400 text-xs">
          Loading demographic cohort distributions...
        </div>
      ) : data ? (
        <DemographicCharts data={data} />
      ) : null}
    </div>
  );
};
