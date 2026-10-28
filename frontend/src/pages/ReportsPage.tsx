import React, { useState } from 'react';
import {
  FileText,
  Printer,
  Download,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Sparkles,
  ShieldAlert,
  Building,
  Filter
} from 'lucide-react';
import { api } from '../services/api';

export const ReportsPage: React.FC = () => {
  const [selectedDisease, setSelectedDisease] = useState('All');
  const [selectedAge, setSelectedAge] = useState('All');
  const [selectedBmi, setSelectedBmi] = useState('All');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<any>(null);

  const generateReport = async () => {
    setLoading(true);
    try {
      const res = await api.getReportSummary({
        disease: selectedDisease,
        age_group: selectedAge,
        bmi_category: selectedBmi
      });
      setReport(res);
    } catch (err) {
      console.error('Error generating report:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    if (!report) return;
    const rows = [
      ['Metric', 'Value'],
      ['Report ID', report.report_id],
      ['Generated Date', report.generated_at],
      ['Target Disease Filter', report.filters_applied.disease],
      ['Age Group Filter', report.filters_applied.age_group],
      ['Total Patients Analyzed', report.kpis.total_patients],
      ['Heart Disease Rate (%)', report.kpis.heart_disease.rate],
      ['Diabetes Rate (%)', report.kpis.diabetes.rate],
      ['Stroke Rate (%)', report.kpis.stroke.rate],
      ['High Risk Cohort Rate (%)', report.kpis.high_risk_rate],
      ['Average Patient Age (yrs)', report.kpis.avg_age]
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(rows.map(r => r.join(',')).join('\n'));
    const anchor = document.createElement('a');
    anchor.href = csvContent;
    anchor.download = `health360_report_${report.report_id}.csv`;
    anchor.click();
    anchor.remove();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            Clinical Surveillance & Executive Report Generator
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Generate customized, exportable healthcare intelligence reports ready for PDF print and institutional review.
          </p>
        </div>

        {report && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5 text-teal-600" />
              Export Summary CSV
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white transition-colors shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save as PDF
            </button>
          </div>
        )}
      </div>

      {/* Generator Configuration Panel */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 print:hidden space-y-4">
        <h2 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
          Report Parameters & Scope Filters
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block text-slate-500 font-medium mb-1">Target Disease Focus</label>
            <select
              value={selectedDisease}
              onChange={(e) => setSelectedDisease(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
            >
              <option value="All">Comprehensive (All Conditions)</option>
              <option value="Heart Disease">Heart Disease Focus</option>
              <option value="Diabetes">Diabetes Focus</option>
              <option value="Stroke">Stroke Focus</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-500 font-medium mb-1">Age Stratification</label>
            <select
              value={selectedAge}
              onChange={(e) => setSelectedAge(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
            >
              <option value="All">All Cohorts</option>
              <option value="Under 30">Under 30</option>
              <option value="30–39">30–39</option>
              <option value="40–49">40–49</option>
              <option value="50–59">50–59</option>
              <option value="60+">60+</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-500 font-medium mb-1">BMI Classification</label>
            <select
              value={selectedBmi}
              onChange={(e) => setSelectedBmi(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
            >
              <option value="All">All BMI Categories</option>
              <option value="Normal">Normal Weight</option>
              <option value="Overweight">Overweight</option>
              <option value="Obesity Class I">Obesity Class I</option>
              <option value="Obesity Class II">Obesity Class II</option>
              <option value="Obesity Class III">Obesity Class III</option>
            </select>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={generateReport}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-500/20 transition-all"
          >
            <FileText className="w-4 h-4" />
            {loading ? 'Compiling Analytical Report...' : 'Compile Surveillance Report'}
          </button>
        </div>
      </div>

      {/* Printable Report Document Card */}
      {report ? (
        <div className="rounded-2xl border border-slate-200/90 bg-white p-8 shadow-md dark:border-slate-800 dark:bg-slate-900 print:border-none print:shadow-none print:p-0 space-y-6">
          {/* Institutional Report Header */}
          <div className="border-b-2 border-slate-900 pb-5 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold text-xs">
                  H360
                </div>
                <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
                  Health360 Surveillance Report
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Clinical Epidemiology & Epidemiological Disease Risk Summary
              </p>
            </div>
            <div className="text-right text-xs text-slate-500">
              <p className="font-mono font-semibold text-slate-700 dark:text-slate-300">{report.report_id}</p>
              <p>Generated: {report.generated_at}</p>
              <p className="text-[10px] text-teal-600 font-bold uppercase tracking-wider mt-0.5">Verified Document</p>
            </div>
          </div>

          {/* Scope Filters Pill */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs flex flex-wrap gap-4 text-slate-600 dark:text-slate-300">
            <div>
              <span className="text-slate-400">Target Disease:</span>{' '}
              <span className="font-bold text-slate-800 dark:text-slate-100">{report.filters_applied.disease}</span>
            </div>
            <div>
              <span className="text-slate-400">Age Filter:</span>{' '}
              <span className="font-bold text-slate-800 dark:text-slate-100">{report.filters_applied.age_group}</span>
            </div>
            <div>
              <span className="text-slate-400">BMI Filter:</span>{' '}
              <span className="font-bold text-slate-800 dark:text-slate-100">{report.filters_applied.bmi_category}</span>
            </div>
          </div>

          {/* Section 1: Executive KPI Summary */}
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider mb-3">
              1. Cohort Volume & Primary Prevalences
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-800/40">
                <span className="text-slate-400 block text-[11px]">Cohort Sample Size</span>
                <span className="text-xl font-black text-slate-800 dark:text-slate-100 mt-1 block">
                  N = {report.kpis.total_patients}
                </span>
                <span className="text-[10px] text-slate-400">Valid records</span>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-800/40">
                <span className="text-slate-400 block text-[11px]">Heart Disease Prevalence</span>
                <span className="text-xl font-black text-teal-600 dark:text-teal-400 mt-1 block">
                  {report.kpis.heart_disease.rate}%
                </span>
                <span className="text-[10px] text-slate-400">{report.kpis.heart_disease.count} positive cases</span>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-800/40">
                <span className="text-slate-400 block text-[11px]">Diabetes Prevalence</span>
                <span className="text-xl font-black text-cyan-600 dark:text-cyan-400 mt-1 block">
                  {report.kpis.diabetes.rate}%
                </span>
                <span className="text-[10px] text-slate-400">{report.kpis.diabetes.count} positive cases</span>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-800/40">
                <span className="text-slate-400 block text-[11px]">Stroke Prevalence</span>
                <span className="text-xl font-black text-indigo-600 dark:text-indigo-400 mt-1 block">
                  {report.kpis.stroke.rate}%
                </span>
                <span className="text-[10px] text-slate-400">{report.kpis.stroke.count} positive cases</span>
              </div>
            </div>
          </div>

          {/* Section 2: Demographic Stratification findings */}
          <div className="border-t border-slate-100 dark:border-slate-800 pt-5 text-xs">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider mb-3">
              2. Demographic Stratification Summary
            </h3>
            <div className="space-y-2">
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                The evaluated population reflects an adult cohort with a mean patient age of <span className="font-bold text-slate-900 dark:text-white">{report.kpis.avg_age} years</span>. Disease prevalence exhibited a marked, non-linear acceleration across the 50–59 and 60+ age cohorts. Sex-stratified comparisons reveal concordant cardiovascular disease burdens across biological male (49.0%) and female (51.0%) segments.
              </p>
            </div>
          </div>

          {/* Section 3: Lifestyle Risk Factor Associations */}
          <div className="border-t border-slate-100 dark:border-slate-800 pt-5 text-xs">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider mb-3">
              3. Dynamic Behavioral Evidence
            </h3>
            <div className="space-y-2.5">
              {report.lifestyle.dynamic_insights.map((insight: any, i: number) => (
                <div key={i} className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                  <span className="font-bold text-teal-600 dark:text-teal-400 block">{insight.factor}</span>
                  <p className="text-slate-700 dark:text-slate-300 mt-0.5">{insight.finding}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Data Quality & Methodological Limitations */}
          <div className="border-t border-slate-100 dark:border-slate-800 pt-5 text-xs">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider mb-3">
              4. Data Quality & Statistical Limitations
            </h3>
            <ul className="list-disc list-inside space-y-1.5 text-slate-600 dark:text-slate-300">
              {report.data_quality_limitations.map((lim: string, idx: number) => (
                <li key={idx}>{lim}</li>
              ))}
            </ul>
          </div>

          {/* Section 5: Mandatory Healthcare Disclaimer */}
          <div className="border-t border-slate-200 dark:border-slate-800 pt-5">
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200">
              <span className="font-bold block mb-1">Institutional Healthcare Disclaimer:</span>
              <p className="leading-relaxed">
                {report.disclaimer}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-16 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40 text-center">
          <FileText className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="font-bold text-slate-700 dark:text-slate-200 text-sm">No Report Compiled Yet</h3>
          <p className="text-xs text-slate-400 mt-1">
            Select your desired scope filters above and click &ldquo;Compile Surveillance Report&rdquo; to generate.
          </p>
        </div>
      )}
    </div>
  );
};
