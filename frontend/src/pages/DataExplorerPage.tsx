import React, { useState } from 'react';
import {
  Upload,
  FileText,
  AlertCircle,
  CheckCircle2,
  Download,
  RotateCcw,
  Table,
  BarChart3,
  ShieldCheck,
  FileCheck
} from 'lucide-react';
import { api } from '../services/api';

export const DataExplorerPage: React.FC = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [resetting, setResetting] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      setErrorMsg('Invalid file format. Please upload a standard CSV file (.csv).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg('File exceeds 10MB limit. Please upload a smaller patient cohort.');
      return;
    }

    setErrorMsg(null);
    setUploading(true);
    try {
      const res = await api.uploadCSV(file);
      setUploadResult(res);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to upload and validate CSV file.');
    } finally {
      setUploading(false);
    }
  };

  const handleResetToDefault = async () => {
    setResetting(true);
    try {
      await api.resetDataset();
      setUploadResult(null);
      setErrorMsg(null);
      alert('Successfully reset active dataset to default 1,500 patient synthetic benchmark.');
    } catch (err) {
      console.error(err);
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            Data Explorer & Healthcare Schema Ingestion
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Validate, inspect, and ingest clinical CSV datasets with automated schema harmonization.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/sample_patient_data.csv"
            download="health360_sample_patient_cohort.csv"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-teal-600" />
            Download Sample CSV
          </a>

          <button
            onClick={handleResetToDefault}
            disabled={resetting}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${resetting ? 'animate-spin' : ''}`} />
            Reset Benchmark
          </button>
        </div>
      </div>

      {/* Upload Drop Zone Card */}
      <div className="rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-900/40 p-8 text-center flex flex-col items-center justify-center relative hover:border-teal-500 transition-colors">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          disabled={uploading}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
        />
        <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 dark:bg-teal-950/80 dark:text-teal-400 flex items-center justify-center mb-3">
          <Upload className={`w-6 h-6 ${uploading ? 'animate-bounce' : ''}`} />
        </div>
        <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
          {uploading ? 'Validating and Parsing CSV...' : 'Click or Drag & Drop Patient CSV File to Ingest'}
        </h3>
        <p className="text-xs text-slate-400 mt-1 max-w-sm">
          Accepts standard comma-delimited files up to 10MB. Content is validated server-side without executing or storing unauthorized code.
        </p>

        {errorMsg && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 text-rose-800 dark:bg-rose-950/80 dark:text-rose-200 text-xs flex items-center gap-2 border border-rose-200 dark:border-rose-900">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Uploaded File Analysis Results */}
      {uploadResult && (
        <div className="space-y-6 animate-in slide-in-from-bottom-3 duration-300">
          {/* Summary Metric Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 text-xs">
              <span className="text-slate-400 block">Ingested Records</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white mt-1 block">
                {uploadResult.row_count.toLocaleString()} rows
              </span>
              <span className="text-emerald-600 text-[11px] font-semibold mt-1 block">✓ Successfully validated</span>
            </div>

            <div className="p-4 rounded-xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 text-xs">
              <span className="text-slate-400 block">Detected Columns</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white mt-1 block">
                {uploadResult.column_count} fields
              </span>
              <span className="text-slate-400 text-[11px] mt-1 block">Automatic type inference</span>
            </div>

            <div className="p-4 rounded-xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 text-xs">
              <span className="text-slate-400 block">Duplicate Rows</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white mt-1 block">
                {uploadResult.duplicate_rows}
              </span>
              <span className="text-slate-400 text-[11px] mt-1 block">Exact row duplicates</span>
            </div>

            <div className="p-4 rounded-xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 text-xs">
              <span className="text-slate-400 block">Data Hygiene Warnings</span>
              <span className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1 block">
                {uploadResult.warnings?.length || 0}
              </span>
              <span className="text-slate-400 text-[11px] mt-1 block">Out-of-range clinical flags</span>
            </div>
          </div>

          {/* Warnings list if any */}
          {uploadResult.warnings?.length > 0 && (
            <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 dark:bg-amber-950/40 dark:border-amber-900/80 text-xs text-amber-900 dark:text-amber-200">
              <h4 className="font-bold mb-1.5 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                Data Quality & Range Warnings
              </h4>
              <ul className="list-disc list-inside space-y-1">
                {uploadResult.warnings.map((w: string, i: number) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Column Metadata Table */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm mb-3">
              Detected Schema & Missing-Value Counts
            </h3>
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-semibold">
                  <tr>
                    <th className="p-3">Column Name</th>
                    <th className="p-3">Inferred Data Type</th>
                    <th className="p-3">Missing Values</th>
                    <th className="p-3">Distinct Values</th>
                    <th className="p-3">Completeness</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {uploadResult.columns.map((c: any) => {
                    const completeness = ((uploadResult.row_count - c.null_count) / uploadResult.row_count) * 100;
                    return (
                      <tr key={c.column} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="p-3 font-semibold text-slate-800 dark:text-slate-200 font-mono">
                          {c.column}
                        </td>
                        <td className="p-3 text-slate-500 font-mono text-[11px]">{c.type}</td>
                        <td className="p-3 text-slate-700 dark:text-slate-300">
                          {c.null_count > 0 ? (
                            <span className="text-amber-600 font-bold">{c.null_count} null</span>
                          ) : (
                            <span className="text-emerald-600 font-medium">0 (Complete)</span>
                          )}
                        </td>
                        <td className="p-3 text-slate-500">{c.unique_count} unique</td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                              <div
                                className="h-full bg-teal-500 rounded-full"
                                style={{ width: `${completeness}%` }}
                              />
                            </div>
                            <span className="font-bold text-[11px] text-slate-600 dark:text-slate-300">
                              {completeness.toFixed(1)}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* First 10 Rows Preview */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm mb-3">
              Ingested Dataset Preview (First 10 Records)
            </h3>
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-semibold font-mono text-[11px]">
                  <tr>
                    {uploadResult.columns.map((c: any) => (
                      <th key={c.column} className="p-2.5 whitespace-nowrap">{c.column}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-[11px]">
                  {uploadResult.preview.map((row: any, rIdx: number) => (
                    <tr key={rIdx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      {uploadResult.columns.map((c: any) => (
                        <td key={c.column} className="p-2.5 whitespace-nowrap text-slate-700 dark:text-slate-300">
                          {String(row[c.column] ?? '—')}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
