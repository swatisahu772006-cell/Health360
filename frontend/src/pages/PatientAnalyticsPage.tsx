import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Download,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Eye,
  CheckCircle2,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { api } from '../services/api';
import { Patient, FilterState } from '../types';
import { PatientDrawer } from '../components/layout/PatientDrawer';

interface Props {
  initialSearch?: string;
}

export const PatientAnalyticsPage: React.FC<Props> = ({ initialSearch = '' }) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('patient_id');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const [filters, setFilters] = useState<FilterState>({
    age_group: 'All',
    bmi_category: 'All',
    disease: 'All',
    smoking_status: 'All',
    exercise_level: 'All',
    search: initialSearch
  });

  useEffect(() => {
    if (initialSearch !== filters.search) {
      setFilters((prev: FilterState) => ({ ...prev, search: initialSearch }));
    }
  }, [initialSearch]);

  const loadPatients = async () => {
    setLoading(true);
    try {
      const res = await api.getPatients(page, pageSize, sortBy, sortDir, filters);
      setPatients(res.patients);
      setTotal(res.total);
      setTotalPages(res.total_pages);
    } catch (err) {
      console.error('Error fetching patients:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();
  }, [page, pageSize, sortBy, sortDir, filters]);

  const handleSort = (col: string) => {
    if (sortBy === col) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(col);
      setSortDir('asc');
    }
    setPage(1);
  };

  const handleReset = () => {
    setFilters({
      age_group: 'All',
      bmi_category: 'All',
      disease: 'All',
      smoking_status: 'All',
      exercise_level: 'All',
      search: ''
    });
    setSortBy('patient_id');
    setSortDir('asc');
    setPage(1);
  };

  const exportFilteredCSV = () => {
    if (patients.length === 0) return;
    const headers = [
      'patient_id', 'age', 'sex', 'bmi', 'systolic_bp', 'diastolic_bp',
      'cholesterol', 'glucose', 'smoking_status', 'alcohol_consumption',
      'exercise_level', 'chest_pain', 'fatigue', 'dizziness',
      'heart_disease', 'diabetes', 'stroke', 'risk_category'
    ];
    const csvRows = [headers.join(',')];

    patients.forEach(p => {
      const values = headers.map(h => (p as any)[h]);
      csvRows.push(values.join(','));
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvRows.join('\n'));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', csvContent);
    downloadAnchor.setAttribute('download', `health360_patients_export_page_${page}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const getRiskBadge = (cat: string) => {
    switch (cat) {
      case 'Critical':
        return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/80 dark:text-rose-300 dark:border-rose-900';
      case 'High':
        return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-900';
      case 'Moderate':
        return 'bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950/80 dark:text-cyan-300 dark:border-cyan-900';
      default:
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-900';
    }
  };

  const renderSortIcon = (col: string) => {
    if (sortBy !== col) return <ArrowUpDown className="w-3 h-3 text-slate-300 dark:text-slate-600" />;
    return sortDir === 'asc' ? <ArrowUp className="w-3 h-3 text-teal-500" /> : <ArrowDown className="w-3 h-3 text-teal-500" />;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Patient Analytics & Clinical Registry
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Searchable, multi-parameter filtered patient cohort with individual diagnostic drawers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportFilteredCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-teal-600" />
            Export Page to CSV
          </button>
        </div>
      </div>

      {/* Filters Card */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-teal-600" />
            <span className="font-bold text-slate-800 dark:text-slate-100">Filter Registry:</span>
          </div>
          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 font-medium"
          >
            <RotateCcw className="w-3 h-3" />
            Reset All Filters
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5 text-xs">
          {/* Patient ID Search */}
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">Search ID</label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="e.g. P-1050"
                value={filters.search || ''}
                onChange={(e) => {
                  setFilters({ ...filters, search: e.target.value });
                  setPage(1);
                }}
                className="w-full pl-8 pr-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Age Group */}
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">Age Cohort</label>
            <select
              value={filters.age_group}
              onChange={(e) => {
                setFilters({ ...filters, age_group: e.target.value });
                setPage(1);
              }}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="All">All Ages</option>
              <option value="Under 30">Under 30</option>
              <option value="30–39">30–39</option>
              <option value="40–49">40–49</option>
              <option value="50–59">50–59</option>
              <option value="60+">60+</option>
            </select>
          </div>

          {/* BMI Category */}
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">BMI Category</label>
            <select
              value={filters.bmi_category}
              onChange={(e) => {
                setFilters({ ...filters, bmi_category: e.target.value });
                setPage(1);
              }}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="All">All BMI Categories</option>
              <option value="Underweight">Underweight (&lt;18.5)</option>
              <option value="Normal">Normal (18.5–24.9)</option>
              <option value="Overweight">Overweight (25–29.9)</option>
              <option value="Obesity Class I">Obesity Class I (30–34.9)</option>
              <option value="Obesity Class II">Obesity Class II (35–39.9)</option>
              <option value="Obesity Class III">Obesity Class III (≥40)</option>
            </select>
          </div>

          {/* Disease Status */}
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">Disease Diagnosis</label>
            <select
              value={filters.disease}
              onChange={(e) => {
                setFilters({ ...filters, disease: e.target.value });
                setPage(1);
              }}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="All">All Disease Status</option>
              <option value="Heart Disease">Heart Disease Positive</option>
              <option value="Diabetes">Diabetes Positive</option>
              <option value="Stroke">Stroke Positive</option>
            </select>
          </div>

          {/* Smoking Status */}
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">Smoking Habit</label>
            <select
              value={filters.smoking_status}
              onChange={(e) => {
                setFilters({ ...filters, smoking_status: e.target.value });
                setPage(1);
              }}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="All">All Smoking Habits</option>
              <option value="Never">Never</option>
              <option value="Former">Former</option>
              <option value="Current">Current</option>
            </select>
          </div>

          {/* Exercise Level */}
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">Physical Activity</label>
            <select
              value={filters.exercise_level}
              onChange={(e) => {
                setFilters({ ...filters, exercise_level: e.target.value });
                setPage(1);
              }}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="All">All Activity Levels</option>
              <option value="Sedentary">Sedentary</option>
              <option value="Light">Light</option>
              <option value="Moderate">Moderate</option>
              <option value="Active">Active</option>
            </select>
          </div>
        </div>
      </div>

      {/* Patient Table */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
        <div className="p-4 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-600 dark:text-slate-300">
            Showing {patients.length} of {total.toLocaleString()} filtered patients
          </span>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
              className="px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"
            >
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[11px] font-semibold border-b border-slate-200/80 dark:border-slate-800">
              <tr>
                <th onClick={() => handleSort('patient_id')} className="py-3 px-3.5 cursor-pointer hover:text-slate-900 dark:hover:text-white">
                  <div className="flex items-center gap-1.5">ID {renderSortIcon('patient_id')}</div>
                </th>
                <th onClick={() => handleSort('age')} className="py-3 px-3 cursor-pointer hover:text-slate-900 dark:hover:text-white">
                  <div className="flex items-center gap-1.5">Age {renderSortIcon('age')}</div>
                </th>
                <th onClick={() => handleSort('sex')} className="py-3 px-3 cursor-pointer hover:text-slate-900 dark:hover:text-white">
                  <div className="flex items-center gap-1.5">Sex {renderSortIcon('sex')}</div>
                </th>
                <th onClick={() => handleSort('bmi')} className="py-3 px-3 cursor-pointer hover:text-slate-900 dark:hover:text-white">
                  <div className="flex items-center gap-1.5">BMI {renderSortIcon('bmi')}</div>
                </th>
                <th onClick={() => handleSort('systolic_bp')} className="py-3 px-3 cursor-pointer hover:text-slate-900 dark:hover:text-white">
                  <div className="flex items-center gap-1.5">BP (mmHg) {renderSortIcon('systolic_bp')}</div>
                </th>
                <th onClick={() => handleSort('cholesterol')} className="py-3 px-3 cursor-pointer hover:text-slate-900 dark:hover:text-white">
                  <div className="flex items-center gap-1.5">Chol. {renderSortIcon('cholesterol')}</div>
                </th>
                <th onClick={() => handleSort('glucose')} className="py-3 px-3 cursor-pointer hover:text-slate-900 dark:hover:text-white">
                  <div className="flex items-center gap-1.5">Glucose {renderSortIcon('glucose')}</div>
                </th>
                <th className="py-3 px-3">Smoking</th>
                <th className="py-3 px-3">Activity</th>
                <th className="py-3 px-3 text-center">Heart Dis.</th>
                <th className="py-3 px-3 text-center">Diabetes</th>
                <th className="py-3 px-3 text-center">Stroke</th>
                <th onClick={() => handleSort('risk_category')} className="py-3 px-3 text-center cursor-pointer hover:text-slate-900 dark:hover:text-white">
                  <div className="flex items-center justify-center gap-1.5">Risk Tier {renderSortIcon('risk_category')}</div>
                </th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={14} className="py-12 text-center text-slate-400">
                    Loading patient cohort records...
                  </td>
                </tr>
              ) : patients.length === 0 ? (
                <tr>
                  <td colSpan={14} className="py-12 text-center text-slate-400">
                    No patient records match the applied criteria. Try resetting filters.
                  </td>
                </tr>
              ) : (
                patients.map((p) => (
                  <tr
                    key={p.patient_id}
                    onClick={() => setSelectedPatient(p)}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-3.5 font-bold text-teal-600 dark:text-teal-400">
                      {p.patient_id}
                    </td>
                    <td className="py-3 px-3 text-slate-800 dark:text-slate-100">
                      {p.age}
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-300">
                      {p.sex}
                    </td>
                    <td className="py-3 px-3 text-slate-800 dark:text-slate-100">
                      {p.bmi}
                    </td>
                    <td className="py-3 px-3 text-slate-800 dark:text-slate-100 font-mono text-[11px]">
                      {p.systolic_bp}/{p.diastolic_bp}
                    </td>
                    <td className="py-3 px-3 text-slate-800 dark:text-slate-100">
                      {p.cholesterol}
                    </td>
                    <td className="py-3 px-3 text-slate-800 dark:text-slate-100">
                      {p.glucose}
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-400">
                      {p.smoking_status}
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-400">
                      {p.exercise_level}
                    </td>
                    <td className="py-3 px-3 text-center">
                      {p.heart_disease === 1 ? (
                        <span className="inline-flex text-rose-500 font-bold" title="Positive">
                          <CheckCircle2 className="w-4 h-4" />
                        </span>
                      ) : (
                        <span className="inline-flex text-slate-300 dark:text-slate-700" title="Negative">
                          &ndash;
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center">
                      {p.diabetes === 1 ? (
                        <span className="inline-flex text-cyan-500 font-bold" title="Positive">
                          <CheckCircle2 className="w-4 h-4" />
                        </span>
                      ) : (
                        <span className="inline-flex text-slate-300 dark:text-slate-700" title="Negative">
                          &ndash;
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center">
                      {p.stroke === 1 ? (
                        <span className="inline-flex text-indigo-500 font-bold" title="Positive">
                          <CheckCircle2 className="w-4 h-4" />
                        </span>
                      ) : (
                        <span className="inline-flex text-slate-300 dark:text-slate-700" title="Negative">
                          &ndash;
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getRiskBadge(p.risk_category)}`}>
                        {p.risk_category}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPatient(p);
                        }}
                        className="p-1 rounded-md text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                        title="View Detailed Record"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <span className="text-slate-500">
            Page {page} of {totalPages} ({total} patient records total)
          </span>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page <= 1}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 font-semibold text-slate-700 dark:text-slate-300">
              {page}
            </span>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page >= totalPages}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Patient Detail Drawer */}
      <PatientDrawer
        patient={selectedPatient}
        onClose={() => setSelectedPatient(null)}
      />
    </div>
  );
};
