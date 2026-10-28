import React from 'react';
import {
  X,
  User,
  Heart,
  Activity,
  AlertTriangle,
  Calendar,
  FileSpreadsheet,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Stethoscope
} from 'lucide-react';
import { Patient } from '../../types';

interface Props {
  patient: Patient | null;
  onClose: () => void;
}

export const PatientDrawer: React.FC<Props> = ({ patient, onClose }) => {
  if (!patient) return null;

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

  const exportPatientJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(patient, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${patient.patient_id}_clinical_record.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold text-sm border border-teal-500/20">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
                  {patient.patient_id}
                </h2>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getRiskBadge(patient.risk_category)}`}>
                  {patient.risk_category} Risk
                </span>
              </div>
              <p className="text-xs text-slate-500">De-identified Patient Record • Synthetic Cohort</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 text-xs">
          {/* Demographics Card */}
          <div className="rounded-2xl border border-slate-200/80 p-4 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-800/40">
            <h3 className="font-semibold text-slate-700 dark:text-slate-200 mb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-teal-500" />
              Demographic Profile
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <span className="text-slate-400 block text-[11px]">Age</span>
                <span className="font-bold text-sm text-slate-800 dark:text-slate-100">{patient.age} yrs</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Sex</span>
                <span className="font-bold text-sm text-slate-800 dark:text-slate-100">{patient.sex}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Age Group</span>
                <span className="font-bold text-sm text-slate-800 dark:text-slate-100">{patient.age_group || 'Standard'}</span>
              </div>
            </div>
          </div>

          {/* Clinical Vitals */}
          <div className="rounded-2xl border border-slate-200/80 p-4 bg-white dark:border-slate-800 dark:bg-slate-900">
            <h3 className="font-semibold text-slate-700 dark:text-slate-200 mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-500" />
              Clinical Vitals & Screening Indicators
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block text-[11px]">Blood Pressure</span>
                <span className="font-bold text-sm text-slate-800 dark:text-slate-100">
                  {patient.systolic_bp} / {patient.diastolic_bp} <span className="text-xs font-normal text-slate-400">mmHg</span>
                </span>
                <span className={`inline-block mt-1 text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                  patient.systolic_bp >= 140 ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                }`}>
                  {patient.systolic_bp >= 140 ? 'Hypertensive' : 'Normal / Prehypertensive'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block text-[11px]">Body Mass Index (BMI)</span>
                <span className="font-bold text-sm text-slate-800 dark:text-slate-100">
                  {patient.bmi} <span className="text-xs font-normal text-slate-400">kg/m²</span>
                </span>
                <span className="inline-block mt-1 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                  {patient.bmi_category || 'Screening Measure'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block text-[11px]">Total Cholesterol</span>
                <span className="font-bold text-sm text-slate-800 dark:text-slate-100">
                  {patient.cholesterol} <span className="text-xs font-normal text-slate-400">mg/dL</span>
                </span>
                <span className={`inline-block mt-1 text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                  patient.cholesterol >= 240 ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                }`}>
                  {patient.cholesterol >= 240 ? 'High (≥240)' : 'Desirable / Borderline'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block text-[11px]">Fasting Glucose</span>
                <span className="font-bold text-sm text-slate-800 dark:text-slate-100">
                  {patient.glucose} <span className="text-xs font-normal text-slate-400">mg/dL</span>
                </span>
                <span className={`inline-block mt-1 text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                  patient.glucose >= 126 ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                }`}>
                  {patient.glucose >= 126 ? 'Elevated (≥126)' : 'Normal (<100)'}
                </span>
              </div>
            </div>
          </div>

          {/* Disease Diagnoses */}
          <div className="rounded-2xl border border-slate-200/80 p-4 bg-white dark:border-slate-800 dark:bg-slate-900">
            <h3 className="font-semibold text-slate-700 dark:text-slate-200 mb-3 flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-500" />
              Disease Status in Dataset
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                <span className="font-medium text-slate-700 dark:text-slate-200">Heart Disease Status</span>
                {patient.heart_disease === 1 ? (
                  <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400 font-bold">
                    <CheckCircle2 className="w-4 h-4" /> Positive
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-slate-400 font-medium">
                    <XCircle className="w-4 h-4" /> Negative
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                <span className="font-medium text-slate-700 dark:text-slate-200">Diabetes Status</span>
                {patient.diabetes === 1 ? (
                  <span className="flex items-center gap-1 text-cyan-600 dark:text-cyan-400 font-bold">
                    <CheckCircle2 className="w-4 h-4" /> Positive
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-slate-400 font-medium">
                    <XCircle className="w-4 h-4" /> Negative
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                <span className="font-medium text-slate-700 dark:text-slate-200">Stroke Status</span>
                {patient.stroke === 1 ? (
                  <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-bold">
                    <CheckCircle2 className="w-4 h-4" /> Positive
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-slate-400 font-medium">
                    <XCircle className="w-4 h-4" /> Negative
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Lifestyle & Symptoms */}
          <div className="rounded-2xl border border-slate-200/80 p-4 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-800/40">
            <h3 className="font-semibold text-slate-700 dark:text-slate-200 mb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Lifestyle & Reported Symptoms
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <p className="text-slate-600 dark:text-slate-300">
                Smoking: <span className="font-bold text-slate-800 dark:text-slate-100">{patient.smoking_status}</span>
              </p>
              <p className="text-slate-600 dark:text-slate-300">
                Exercise: <span className="font-bold text-slate-800 dark:text-slate-100">{patient.exercise_level}</span>
              </p>
              <p className="text-slate-600 dark:text-slate-300">
                Alcohol: <span className="font-bold text-slate-800 dark:text-slate-100">{patient.alcohol_consumption}</span>
              </p>
              <p className="text-slate-600 dark:text-slate-300">
                Chest Pain: <span className="font-bold">{patient.chest_pain ? 'Reported' : 'None'}</span>
              </p>
              <p className="text-slate-600 dark:text-slate-300">
                Fatigue: <span className="font-bold">{patient.fatigue ? 'Reported' : 'None'}</span>
              </p>
              <p className="text-slate-600 dark:text-slate-300">
                Dizziness: <span className="font-bold">{patient.dizziness ? 'Reported' : 'None'}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50/80 dark:bg-slate-900">
          <button
            onClick={exportPatientJSON}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-teal-600" />
            Export JSON
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-teal-600 hover:bg-teal-700 text-white transition-colors"
          >
            Close Record
          </button>
        </div>
      </div>
    </div>
  );
};
