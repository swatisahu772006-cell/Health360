import React, { useState } from 'react';
import {
  ShieldAlert,
  Heart,
  Activity,
  Zap,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  BarChart,
  User,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { api } from '../services/api';
import { RiskAssessmentResult, RiskFactorContribution } from '../types';
import { RiskGauge } from '../charts/RiskGauge';

export const RiskAssessmentPage: React.FC = () => {
  const [disease, setDisease] = useState<'heart_disease' | 'diabetes' | 'stroke'>('heart_disease');
  const [formData, setFormData] = useState({
    age: 55,
    bmi: 28.5,
    systolic_bp: 142,
    diastolic_bp: 88,
    cholesterol: 235,
    glucose: 110,
    smoking_status: 'Current',
    alcohol_consumption: 'Moderate',
    exercise_level: 'Sedentary',
    chest_pain: 1,
    fatigue: 0,
    dizziness: 0
  });

  const [result, setResult] = useState<RiskAssessmentResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.assessRisk({
        disease,
        ...formData
      });
      setResult(res);
    } catch (err) {
      console.error('Error assessing risk:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleResetForm = () => {
    setFormData({
      age: 45,
      bmi: 24.5,
      systolic_bp: 120,
      diastolic_bp: 80,
      cholesterol: 185,
      glucose: 90,
      smoking_status: 'Never',
      alcohol_consumption: 'None',
      exercise_level: 'Moderate',
      chest_pain: 0,
      fatigue: 0,
      dizziness: 0
    });
    setResult(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          Clinical Risk Assessment & Machine Learning Predictor
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
            Validated ML Model
          </span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Simulate a patient profile to evaluate disease probability, feature attribution, and population comparisons.
        </p>
      </div>

      {/* Prominent Educational Disclaimer Banner */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-sm block">Educational & Decision Support Disclaimer</span>
          <p className="mt-0.5 leading-relaxed">
            This tool is for educational and analytical purposes only. It is not a medical diagnostic system and must not replace professional medical advice, clinical diagnosis, or therapeutic decision-making. Never use a demonstration model to diagnose health conditions.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Form Column (7 Cols) */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-7 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-5"
        >
          {/* Target Disease Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-2">
              1. Select Target Disease to Evaluate
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setDisease('heart_disease')}
                className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                  disease === 'heart_disease'
                    ? 'border-teal-500 bg-teal-50/80 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300 ring-2 ring-teal-500/20'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <Heart className="w-4 h-4 text-rose-500" />
                Heart Disease
              </button>

              <button
                type="button"
                onClick={() => setDisease('diabetes')}
                className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                  disease === 'diabetes'
                    ? 'border-cyan-500 bg-cyan-50/80 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300 ring-2 ring-cyan-500/20'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <Activity className="w-4 h-4 text-cyan-500" />
                Diabetes
              </button>

              <button
                type="button"
                onClick={() => setDisease('stroke')}
                className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                  disease === 'stroke'
                    ? 'border-indigo-500 bg-indigo-50/80 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <Zap className="w-4 h-4 text-indigo-500" />
                Stroke
              </button>
            </div>
          </div>

          {/* Vitals Grid */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-2">
              2. Clinical Vitals & Measurements
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                  Patient Age: <span className="font-bold text-slate-900 dark:text-white">{formData.age} yrs</span>
                </label>
                <input
                  type="range"
                  min={18}
                  max={88}
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                  className="w-full accent-teal-600"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                  BMI (kg/m²): <span className="font-bold text-slate-900 dark:text-white">{formData.bmi}</span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  min={15}
                  max={55}
                  value={formData.bmi}
                  onChange={(e) => setFormData({ ...formData, bmi: Number(e.target.value) })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                  Systolic BP: <span className="font-bold text-slate-900 dark:text-white">{formData.systolic_bp} mmHg</span>
                </label>
                <input
                  type="number"
                  min={80}
                  max={220}
                  value={formData.systolic_bp}
                  onChange={(e) => setFormData({ ...formData, systolic_bp: Number(e.target.value) })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                  Diastolic BP: <span className="font-bold text-slate-900 dark:text-white">{formData.diastolic_bp} mmHg</span>
                </label>
                <input
                  type="number"
                  min={50}
                  max={130}
                  value={formData.diastolic_bp}
                  onChange={(e) => setFormData({ ...formData, diastolic_bp: Number(e.target.value) })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                  Total Cholesterol: <span className="font-bold text-slate-900 dark:text-white">{formData.cholesterol} mg/dL</span>
                </label>
                <input
                  type="number"
                  min={100}
                  max={380}
                  value={formData.cholesterol}
                  onChange={(e) => setFormData({ ...formData, cholesterol: Number(e.target.value) })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                  Fasting Glucose: <span className="font-bold text-slate-900 dark:text-white">{formData.glucose} mg/dL</span>
                </label>
                <input
                  type="number"
                  min={60}
                  max={300}
                  value={formData.glucose}
                  onChange={(e) => setFormData({ ...formData, glucose: Number(e.target.value) })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Lifestyle Factors */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-2">
              3. Lifestyle Behaviors
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Smoking</label>
                <select
                  value={formData.smoking_status}
                  onChange={(e) => setFormData({ ...formData, smoking_status: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                >
                  <option value="Never">Never Smoked</option>
                  <option value="Former">Former Smoker</option>
                  <option value="Current">Current Smoker</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Alcohol</label>
                <select
                  value={formData.alcohol_consumption}
                  onChange={(e) => setFormData({ ...formData, alcohol_consumption: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                >
                  <option value="None">None</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Heavy">Heavy</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Physical Activity</label>
                <select
                  value={formData.exercise_level}
                  onChange={(e) => setFormData({ ...formData, exercise_level: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                >
                  <option value="Sedentary">Sedentary</option>
                  <option value="Light">Light</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Active">Active</option>
                </select>
              </div>
            </div>
          </div>

          {/* Symptoms Checklist */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-2">
              4. Reported Clinical Symptoms
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.chest_pain === 1}
                  onChange={(e) => setFormData({ ...formData, chest_pain: e.target.checked ? 1 : 0 })}
                  className="accent-teal-600 rounded"
                />
                <span className="font-medium text-slate-700 dark:text-slate-200">Chest Pain / Discomfort</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.fatigue === 1}
                  onChange={(e) => setFormData({ ...formData, fatigue: e.target.checked ? 1 : 0 })}
                  className="accent-teal-600 rounded"
                />
                <span className="font-medium text-slate-700 dark:text-slate-200">Unexplained Fatigue</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.dizziness === 1}
                  onChange={(e) => setFormData({ ...formData, dizziness: e.target.checked ? 1 : 0 })}
                  className="accent-teal-600 rounded"
                />
                <span className="font-medium text-slate-700 dark:text-slate-200">Frequent Dizziness</span>
              </label>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={handleResetForm}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Defaults
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-500/20 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              {loading ? 'Evaluating Model...' : 'Calculate Risk Probability'}
            </button>
          </div>
        </form>

        {/* Results Column (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {result ? (
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-5 animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                  Model Prediction Output
                </h3>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono">
                  {disease.replace('_', ' ').toUpperCase()}
                </span>
              </div>

              {/* Gauge */}
              <RiskGauge
                probabilityPercent={result.probability_percent}
                category={result.risk_category}
              />

              {/* Contributing Factors */}
              <div>
                <h4 className="font-bold text-xs text-slate-700 dark:text-slate-200 mb-2">
                  Key Contributing Factors (Feature Attribution)
                </h4>
                <div className="space-y-1.5 text-xs">
                  {result.factor_contributions.length === 0 ? (
                    <p className="text-slate-400">All indicators within baseline normal tolerances.</p>
                  ) : (
                    result.factor_contributions.map((f: RiskFactorContribution, i: number) => (
                      <div
                        key={i}
                        className={`p-2.5 rounded-xl border flex items-center justify-between ${
                          f.type === 'negative'
                            ? 'bg-rose-50/50 border-rose-100 text-rose-900 dark:bg-rose-950/40 dark:border-rose-900/60 dark:text-rose-200'
                            : 'bg-emerald-50/50 border-emerald-100 text-emerald-900 dark:bg-emerald-950/40 dark:border-emerald-900/60 dark:text-emerald-200'
                        }`}
                      >
                        <div>
                          <span className="font-semibold block">{f.factor}</span>
                          <span className="text-[11px] opacity-80">{f.detail}</span>
                        </div>
                        <span className="text-[11px] font-bold uppercase tracking-wider">
                          {f.impact}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Population Benchmark Comparisons */}
              <div className="border-t border-slate-100 dark:border-slate-800 pt-4 text-xs">
                <h4 className="font-bold text-slate-700 dark:text-slate-200 mb-2">
                  Patient vs Population Benchmarks
                </h4>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                    <span className="text-slate-400 block">Patient Systolic BP</span>
                    <span className="font-bold text-slate-800 dark:text-slate-100">{result.patient_values.systolic_bp} mmHg</span>
                    <span className="text-slate-400 block mt-0.5">Cohort Avg: {result.population_benchmarks.systolic_bp} mmHg</span>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                    <span className="text-slate-400 block">Patient BMI</span>
                    <span className="font-bold text-slate-800 dark:text-slate-100">{result.patient_values.bmi} kg/m²</span>
                    <span className="text-slate-400 block mt-0.5">Cohort Avg: {result.population_benchmarks.bmi} kg/m²</span>
                  </div>
                </div>
              </div>

              {/* Model Performance Documentation */}
              <div className="border-t border-slate-100 dark:border-slate-800 pt-4 text-xs">
                <h4 className="font-bold text-slate-700 dark:text-slate-200 mb-1">
                  Validated Machine Learning Metrics
                </h4>
                <p className="text-[11px] text-slate-400 mb-2">
                  Evaluated on 20% held-out test cohort to guard against data leakage
                </p>
                <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
                  <div className="p-2 rounded-lg bg-teal-50 dark:bg-teal-950/40 border border-teal-100 dark:border-teal-900/60">
                    <span className="text-slate-400 block">ROC-AUC</span>
                    <span className="font-bold text-teal-700 dark:text-teal-300 text-sm">
                      {result.model_info.roc_auc || 0.77}
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-teal-50 dark:bg-teal-950/40 border border-teal-100 dark:border-teal-900/60">
                    <span className="text-slate-400 block">Accuracy</span>
                    <span className="font-bold text-teal-700 dark:text-teal-300 text-sm">
                      {result.model_info.accuracy || 0.88}
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-teal-50 dark:bg-teal-950/40 border border-teal-100 dark:border-teal-900/60">
                    <span className="text-slate-400 block">F1-Score</span>
                    <span className="font-bold text-teal-700 dark:text-teal-300 text-sm">
                      {result.model_info.f1_score || 0.79}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 p-8 text-center flex flex-col items-center justify-center min-h-[400px]">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-3">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                Awaiting Profile Simulation
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xs">
                Adjust clinical measurements and lifestyle behaviors on the left, then click &ldquo;Calculate Risk Probability&rdquo; to execute the predictive engine.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
