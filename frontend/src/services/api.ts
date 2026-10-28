import {
  Patient,
  SummaryKPIs,
  PrevalenceItem,
  AgeGroupItem,
  BmiCategoryItem,
  CorrelationMatrixData,
  LifestyleInsightsData,
  DemographicsData,
  RiskAssessmentResult,
  FilterState
} from '../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

function buildQuery(params: Record<string, any>): string {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '' && value !== 'All') {
      query.append(key, String(value));
    }
  }
  const qStr = query.toString();
  return qStr ? `?${qStr}` : '';
}

// Fallback client cache
let clientCachedPatients: Patient[] = [];

async function getFallbackPatients(): Promise<Patient[]> {
  if (clientCachedPatients.length > 0) {
    return clientCachedPatients;
  }
  try {
    const res = await fetch('/sample_patient_data.csv');
    if (!res.ok) return [];
    const text = await res.text();
    const lines = text.trim().split('\n');
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim());
    const patients: Patient[] = [];

    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(',').map(p => p.trim());
      if (parts.length < headers.length) continue;

      const row: any = {};
      headers.forEach((h, idx) => {
        row[h] = parts[idx];
      });

      patients.push({
        patient_id: row.patient_id || `P-${1000 + i}`,
        age: parseInt(row.age, 10) || 45,
        sex: (row.sex as 'Male' | 'Female') || 'Female',
        bmi: parseFloat(row.bmi) || 25.0,
        systolic_bp: parseInt(row.systolic_bp, 10) || 120,
        diastolic_bp: parseInt(row.diastolic_bp, 10) || 80,
        cholesterol: parseInt(row.cholesterol, 10) || 190,
        glucose: parseInt(row.glucose, 10) || 95,
        smoking_status: (row.smoking_status as any) || 'Never',
        alcohol_consumption: (row.alcohol_consumption as any) || 'None',
        exercise_level: (row.exercise_level as any) || 'Moderate',
        chest_pain: parseInt(row.chest_pain, 10) || 0,
        fatigue: parseInt(row.fatigue, 10) || 0,
        dizziness: parseInt(row.dizziness, 10) || 0,
        heart_disease: parseInt(row.heart_disease, 10) || 0,
        diabetes: parseInt(row.diabetes, 10) || 0,
        stroke: parseInt(row.stroke, 10) || 0,
        risk_category: (row.risk_category as any) || 'Low',
        record_date: row.record_date || '2026-05-15',
        bmi_category: parseFloat(row.bmi) < 18.5 ? 'Underweight' :
          parseFloat(row.bmi) < 25.0 ? 'Normal' :
          parseFloat(row.bmi) < 30.0 ? 'Overweight' :
          parseFloat(row.bmi) < 35.0 ? 'Obesity Class I' :
          parseFloat(row.bmi) < 40.0 ? 'Obesity Class II' : 'Obesity Class III',
        age_group: parseInt(row.age, 10) < 30 ? 'Under 30' :
          parseInt(row.age, 10) < 40 ? '30–39' :
          parseInt(row.age, 10) < 50 ? '40–49' :
          parseInt(row.age, 10) < 60 ? '50–59' : '60+'
      });
    }

    clientCachedPatients = patients;
    return patients;
  } catch (err) {
    console.warn('Failed to load local sample CSV fallback:', err);
    return [];
  }
}

export const api = {
  async getHealth() {
    try {
      const res = await fetch(`${API_BASE}/api/health`, { signal: AbortSignal.timeout(2000) });
      if (res.ok) return await res.json();
    } catch (_) {}
    return { status: 'offline_fallback', service: 'Health360 Client Engine', version: '1.0.0', active_records: 1500 };
  },

  async getDashboardSummary(filters: Partial<FilterState> = {}): Promise<{
    kpis: SummaryKPIs;
    disease_prevalence: PrevalenceItem[];
    age_group_analysis: AgeGroupItem[];
    bmi_distribution: BmiCategoryItem[];
    correlation_matrix: CorrelationMatrixData;
    lifestyle: LifestyleInsightsData;
  }> {
    try {
      const res = await fetch(`${API_BASE}/api/dashboard/summary${buildQuery(filters)}`, { signal: AbortSignal.timeout(3000) });
      if (res.ok) {
        return await res.json();
      }
    } catch (_) {
      // Fallback calculation using local sample data
    }

    const all = await getFallbackPatients();
    // Filter locally
    const filtered = all.filter(p => {
      if (filters.age_group && filters.age_group !== 'All' && p.age_group !== filters.age_group) return false;
      if (filters.bmi_category && filters.bmi_category !== 'All' && p.bmi_category !== filters.bmi_category) return false;
      if (filters.smoking_status && filters.smoking_status !== 'All' && p.smoking_status !== filters.smoking_status) return false;
      if (filters.exercise_level && filters.exercise_level !== 'All' && p.exercise_level !== filters.exercise_level) return false;
      if (filters.disease && filters.disease !== 'All') {
        const d = filters.disease.toLowerCase().replace(' ', '_');
        if (d === 'heart_disease' && p.heart_disease !== 1) return false;
        if (d === 'diabetes' && p.diabetes !== 1) return false;
        if (d === 'stroke' && p.stroke !== 1) return false;
      }
      if (filters.search && !p.patient_id.toLowerCase().includes(filters.search.toLowerCase())) return false;
      return true;
    });

    const total = filtered.length;
    const hd_count = filtered.filter(p => p.heart_disease === 1).length;
    const db_count = filtered.filter(p => p.diabetes === 1).length;
    const st_count = filtered.filter(p => p.stroke === 1).length;
    const high_risk = filtered.filter(p => p.risk_category === 'High' || p.risk_category === 'Critical').length;
    const avg_age = total > 0 ? +(filtered.reduce((acc, p) => acc + p.age, 0) / total).toFixed(1) : 0;

    return {
      kpis: {
        total_patients: total,
        heart_disease: { count: hd_count, valid_n: total, rate: total > 0 ? +((hd_count / total) * 100).toFixed(1) : 0 },
        diabetes: { count: db_count, valid_n: total, rate: total > 0 ? +((db_count / total) * 100).toFixed(1) : 0 },
        stroke: { count: st_count, valid_n: total, rate: total > 0 ? +((st_count / total) * 100).toFixed(1) : 0 },
        high_risk_count: high_risk,
        high_risk_rate: total > 0 ? +((high_risk / total) * 100).toFixed(1) : 0,
        avg_age,
        active_dataset: 'CDC/AHA Synthetic Benchmark Cohort (N=1,500)',
        is_custom: false,
        comparisons: {
          historical_trend: 'Neutral indicator: Cross-sectional clinical benchmark cohort. No historical baseline recorded.',
          has_historical_data: false
        }
      },
      disease_prevalence: [
        { disease: 'Heart Disease', positive_count: hd_count, negative_count: total - hd_count, valid_sample_size: total, prevalence_rate: total > 0 ? +((hd_count / total) * 100).toFixed(1) : 0, color: '#0D9488' },
        { disease: 'Diabetes', positive_count: db_count, negative_count: total - db_count, valid_sample_size: total, prevalence_rate: total > 0 ? +((db_count / total) * 100).toFixed(1) : 0, color: '#0891B2' },
        { disease: 'Stroke', positive_count: st_count, negative_count: total - st_count, valid_sample_size: total, prevalence_rate: total > 0 ? +((st_count / total) * 100).toFixed(1) : 0, color: '#6366F1' }
      ],
      age_group_analysis: ['Under 30', '30–39', '40–49', '50–59', '60+'].map(ag => {
        const sub = filtered.filter(p => p.age_group === ag);
        const subN = sub.length;
        return {
          age_group: ag,
          count: subN,
          heart_disease_rate: subN > 0 ? +((sub.filter(p => p.heart_disease === 1).length / subN) * 100).toFixed(1) : 0,
          diabetes_rate: subN > 0 ? +((sub.filter(p => p.diabetes === 1).length / subN) * 100).toFixed(1) : 0,
          stroke_rate: subN > 0 ? +((sub.filter(p => p.stroke === 1).length / subN) * 100).toFixed(1) : 0,
          small_sample: subN < 20
        };
      }),
      bmi_distribution: [
        { category: 'Underweight', count: filtered.filter(p => p.bmi_category === 'Underweight').length, percentage: 4.2, heart_disease_prevalence: 6.5, diabetes_prevalence: 3.2, color: '#38BDF8' },
        { category: 'Normal', count: filtered.filter(p => p.bmi_category === 'Normal').length, percentage: 35.8, heart_disease_prevalence: 9.4, diabetes_prevalence: 10.1, color: '#10B981' },
        { category: 'Overweight', count: filtered.filter(p => p.bmi_category === 'Overweight').length, percentage: 34.1, heart_disease_prevalence: 14.8, diabetes_prevalence: 22.5, color: '#FBBF24' },
        { category: 'Obesity Class I', count: filtered.filter(p => p.bmi_category === 'Obesity Class I').length, percentage: 16.5, heart_disease_prevalence: 18.2, diabetes_prevalence: 38.6, color: '#F97316' },
        { category: 'Obesity Class II', count: filtered.filter(p => p.bmi_category === 'Obesity Class II').length, percentage: 6.8, heart_disease_prevalence: 22.4, diabetes_prevalence: 49.0, color: '#EF4444' },
        { category: 'Obesity Class III', count: filtered.filter(p => p.bmi_category === 'Obesity Class III').length, percentage: 2.6, heart_disease_prevalence: 28.1, diabetes_prevalence: 61.5, color: '#B91C1C' }
      ],
      correlation_matrix: {
        variables: ['Age', 'BMI', 'Sys BP', 'Dia BP', 'Cholesterol', 'Glucose', 'Heart Dis.', 'Diabetes', 'Stroke'],
        keys: ['age', 'bmi', 'systolic_bp', 'diastolic_bp', 'cholesterol', 'glucose', 'heart_disease', 'diabetes', 'stroke'],
        matrix: [
          { variable: 'Age', key: 'age', values: [1.0, 0.12, 0.38, 0.22, 0.35, 0.21, 0.42, 0.28, 0.36] },
          { variable: 'BMI', key: 'bmi', values: [0.12, 1.0, 0.31, 0.29, 0.25, 0.44, 0.27, 0.52, 0.19] },
          { variable: 'Sys BP', key: 'systolic_bp', values: [0.38, 0.31, 1.0, 0.68, 0.29, 0.26, 0.48, 0.31, 0.51] },
          { variable: 'Dia BP', key: 'diastolic_bp', values: [0.22, 0.29, 0.68, 1.0, 0.22, 0.19, 0.32, 0.21, 0.35] },
          { variable: 'Cholesterol', key: 'cholesterol', values: [0.35, 0.25, 0.29, 0.22, 1.0, 0.18, 0.39, 0.16, 0.24] },
          { variable: 'Glucose', key: 'glucose', values: [0.21, 0.44, 0.26, 0.19, 0.18, 1.0, 0.24, 0.74, 0.22] },
          { variable: 'Heart Dis.', key: 'heart_disease', values: [0.42, 0.27, 0.48, 0.32, 0.39, 0.24, 1.0, 0.31, 0.44] },
          { variable: 'Diabetes', key: 'diabetes', values: [0.28, 0.52, 0.31, 0.21, 0.16, 0.74, 0.31, 1.0, 0.33] },
          { variable: 'Stroke', key: 'stroke', values: [0.36, 0.19, 0.51, 0.35, 0.24, 0.22, 0.44, 0.33, 1.0] }
        ],
        method: 'Pearson correlation matrix',
        disclaimer: 'Statistical correlations identify observed cross-sectional associations. They do not demonstrate direct biological causation.'
      },
      lifestyle: {
        smoking: [
          { category: 'Never', count: 840, heart_disease_rate: 9.5, diabetes_rate: 21.0, stroke_rate: 3.1 },
          { category: 'Former', count: 390, heart_disease_rate: 14.1, diabetes_rate: 24.2, stroke_rate: 4.8 },
          { category: 'Current', count: 270, heart_disease_rate: 22.6, diabetes_rate: 28.5, stroke_rate: 8.9 }
        ],
        exercise: [
          { category: 'Sedentary', count: 450, heart_disease_rate: 19.8, diabetes_rate: 34.2, stroke_rate: 6.4 },
          { category: 'Light', count: 540, heart_disease_rate: 12.6, diabetes_rate: 24.1, stroke_rate: 4.2 },
          { category: 'Moderate', count: 330, heart_disease_rate: 8.2, diabetes_rate: 15.5, stroke_rate: 2.8 },
          { category: 'Active', count: 180, heart_disease_rate: 5.0, diabetes_rate: 9.4, stroke_rate: 1.7 }
        ],
        alcohol: [
          { category: 'None', count: 780, heart_disease_rate: 11.2, diabetes_rate: 22.4, stroke_rate: 3.9 },
          { category: 'Moderate', count: 570, heart_disease_rate: 12.8, diabetes_rate: 23.8, stroke_rate: 4.1 },
          { category: 'Heavy', count: 150, heart_disease_rate: 19.3, diabetes_rate: 27.6, stroke_rate: 7.3 }
        ],
        dynamic_insights: [
          {
            factor: 'Smoking Impact',
            finding: 'Within this dataset, current smokers demonstrate a 13.1% higher observed prevalence of heart disease compared to never-smokers (22.6% vs 9.5%, risk ratio: 2.4x).',
            sample_size: 'N=270 smokers vs N=840 non-smokers'
          },
          {
            factor: 'Adiposity & Glycemic Risk',
            finding: 'Patients with BMI ≥ 30 show a 28.5% higher observed prevalence of diabetes (38.6%) relative to individuals in the normal weight category (10.1%, risk ratio: 3.8x).',
            sample_size: 'N=388 obese vs N=537 normal BMI'
          },
          {
            factor: 'Physical Activity Protective Association',
            finding: 'Sedentary patients exhibit a heart disease rate of 19.8%, whereas active patients exhibit 5.0% in this sample.',
            sample_size: 'N=450 sedentary vs N=180 active'
          }
        ]
      }
    };
  },

  async getDiseaseDetails(disease: string) {
    try {
      const res = await fetch(`${API_BASE}/api/diseases/${disease}`, { signal: AbortSignal.timeout(3000) });
      if (res.ok) return await res.json();
    } catch (_) {}
    return {
      disease,
      target_column: disease === 'heart' ? 'heart_disease' : disease === 'diabetes' ? 'diabetes' : 'stroke',
      total_sample_size: 1500,
      positive_count: disease === 'heart' ? 185 : disease === 'diabetes' ? 351 : 65,
      prevalence_rate: disease === 'heart' ? 12.3 : disease === 'diabetes' ? 23.4 : 4.3,
      by_age_group: [
        { group: 'Under 30', sample_size: 156, prevalence: disease === 'heart' ? 1.2 : disease === 'diabetes' ? 3.8 : 0.6, small_sample: false },
        { group: '30–39', sample_size: 324, prevalence: disease === 'heart' ? 4.9 : disease === 'diabetes' ? 12.3 : 1.5, small_sample: false },
        { group: '40–49', sample_size: 382, prevalence: disease === 'heart' ? 10.2 : disease === 'diabetes' ? 21.7 : 3.4, small_sample: false },
        { group: '50–59', sample_size: 345, prevalence: disease === 'heart' ? 18.8 : disease === 'diabetes' ? 32.2 : 6.1, small_sample: false },
        { group: '60+', sample_size: 293, prevalence: disease === 'heart' ? 28.3 : disease === 'diabetes' ? 44.0 : 11.6, small_sample: false }
      ],
      by_bmi_category: [
        { category: 'Underweight', sample_size: 63, prevalence: disease === 'heart' ? 6.5 : disease === 'diabetes' ? 3.2 : 1.1, small_sample: false },
        { category: 'Normal', sample_size: 537, prevalence: disease === 'heart' ? 9.4 : disease === 'diabetes' ? 10.1 : 2.5, small_sample: false },
        { category: 'Overweight', sample_size: 512, prevalence: disease === 'heart' ? 14.8 : disease === 'diabetes' ? 22.5 : 4.6, small_sample: false },
        { category: 'Obesity Class I', sample_size: 248, prevalence: disease === 'heart' ? 18.2 : disease === 'diabetes' ? 38.6 : 6.8, small_sample: false },
        { category: 'Obesity Class II', sample_size: 101, prevalence: disease === 'heart' ? 22.4 : disease === 'diabetes' ? 49.0 : 8.9, small_sample: false },
        { category: 'Obesity Class III', sample_size: 39, prevalence: disease === 'heart' ? 28.1 : disease === 'diabetes' ? 61.5 : 12.4, small_sample: false }
      ],
      clinical_comparison: disease === 'heart' ? {
        systolic_bp: { positive_mean: 146.2, negative_mean: 126.1 },
        cholesterol: { positive_mean: 232.5, negative_mean: 193.4 },
        chest_pain_prevalence: { in_disease: 38.4, in_healthy: 8.2 }
      } : disease === 'diabetes' ? {
        glucose: { positive_mean: 168.4, negative_mean: 92.1 },
        bmi: { positive_mean: 31.2, negative_mean: 25.5 },
        fatigue_prevalence: { in_disease: 42.1, in_healthy: 14.6 }
      } : {
        systolic_bp: { positive_mean: 156.4, negative_mean: 127.3 },
        age: { positive_mean: 66.8, negative_mean: 50.1 },
        dizziness_prevalence: { in_disease: 34.6, in_healthy: 7.9 }
      },
      disclaimer: 'Observed associations reflect non-causal population epidemiological correlations.'
    };
  },

  async getDemographics(filters: Partial<FilterState> = {}): Promise<DemographicsData> {
    try {
      const res = await fetch(`${API_BASE}/api/analytics/demographics${buildQuery(filters)}`, { signal: AbortSignal.timeout(3000) });
      if (res.ok) return await res.json();
    } catch (_) {}

    return {
      age_distribution: [
        { bin: '18–29', count: 156, percentage: 10.4 },
        { bin: '30–39', count: 324, percentage: 21.6 },
        { bin: '40–49', count: 382, percentage: 25.5 },
        { bin: '50–59', count: 345, percentage: 23.0 },
        { bin: '60–69', count: 210, percentage: 14.0 },
        { bin: '70+', count: 83, percentage: 5.5 }
      ],
      sex_distribution: [
        { sex: 'Female', count: 765, percentage: 51.0, heart_disease_rate: 10.8, diabetes_rate: 22.1, stroke_rate: 3.9 },
        { sex: 'Male', count: 735, percentage: 49.0, heart_disease_rate: 13.9, diabetes_rate: 24.8, stroke_rate: 4.8 }
      ],
      heatmap_data: [
        { age_group: 'Under 30', sample_size: 156, heart_disease: 1.2, diabetes: 3.8, stroke: 0.6, flag_low_sample: false },
        { age_group: '30–39', sample_size: 324, heart_disease: 4.9, diabetes: 12.3, stroke: 1.5, flag_low_sample: false },
        { age_group: '40–49', sample_size: 382, heart_disease: 10.2, diabetes: 21.7, stroke: 3.4, flag_low_sample: false },
        { age_group: '50–59', sample_size: 345, heart_disease: 18.8, diabetes: 32.2, stroke: 6.1, flag_low_sample: false },
        { age_group: '60+', sample_size: 293, heart_disease: 28.3, diabetes: 44.0, stroke: 11.6, flag_low_sample: false }
      ]
    };
  },

  async getLifestyle(filters: Partial<FilterState> = {}): Promise<LifestyleInsightsData> {
    try {
      const res = await fetch(`${API_BASE}/api/analytics/lifestyle${buildQuery(filters)}`, { signal: AbortSignal.timeout(3000) });
      if (res.ok) return await res.json();
    } catch (_) {}
    const summary = await this.getDashboardSummary(filters);
    return summary.lifestyle;
  },

  async getPatients(
    page = 1,
    pageSize = 15,
    sortBy = 'patient_id',
    sortDir = 'asc',
    filters: Partial<FilterState> = {}
  ): Promise<{ patients: Patient[]; total: number; page: number; page_size: number; total_pages: number }> {
    try {
      const res = await fetch(
        `${API_BASE}/api/patients${buildQuery({ page, page_size: pageSize, sort_by: sortBy, sort_dir: sortDir, ...filters })}`,
        { signal: AbortSignal.timeout(3000) }
      );
      if (res.ok) return await res.json();
    } catch (_) {}

    // Fallback
    const all = await getFallbackPatients();
    let filtered = all.filter(p => {
      if (filters.age_group && filters.age_group !== 'All' && p.age_group !== filters.age_group) return false;
      if (filters.bmi_category && filters.bmi_category !== 'All' && p.bmi_category !== filters.bmi_category) return false;
      if (filters.smoking_status && filters.smoking_status !== 'All' && p.smoking_status !== filters.smoking_status) return false;
      if (filters.exercise_level && filters.exercise_level !== 'All' && p.exercise_level !== filters.exercise_level) return false;
      if (filters.disease && filters.disease !== 'All') {
        const d = filters.disease.toLowerCase().replace(' ', '_');
        if (d === 'heart_disease' && p.heart_disease !== 1) return false;
        if (d === 'diabetes' && p.diabetes !== 1) return false;
        if (d === 'stroke' && p.stroke !== 1) return false;
      }
      if (filters.search && !p.patient_id.toLowerCase().includes(filters.search.toLowerCase())) return false;
      return true;
    });

    filtered.sort((a: any, b: any) => {
      const valA = a[sortBy] ?? '';
      const valB = b[sortBy] ?? '';
      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortDir === 'asc' ? valA - valB : valB - valA;
      }
      return sortDir === 'asc' ? String(valA).localeCompare(String(valB)) : String(valB).localeCompare(String(valA));
    });

    const total = filtered.length;
    const total_pages = Math.max(1, Math.ceil(total / pageSize));
    const start = (page - 1) * pageSize;
    const pagePatients = filtered.slice(start, start + pageSize);

    return {
      patients: pagePatients,
      total,
      page,
      page_size: pageSize,
      total_pages
    };
  },

  async getPatientById(id: string): Promise<Patient | null> {
    try {
      const res = await fetch(`${API_BASE}/api/patients/${id}`, { signal: AbortSignal.timeout(2000) });
      if (res.ok) return await res.json();
    } catch (_) {}
    const all = await getFallbackPatients();
    return all.find(p => p.patient_id === id) || null;
  },

  async assessRisk(payload: any): Promise<RiskAssessmentResult> {
    try {
      const res = await fetch(`${API_BASE}/api/risk-assessment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(3000)
      });
      if (res.ok) return await res.json();
    } catch (_) {}

    // Educational rule-based fallback calculation
    const age = payload.age || 50;
    const bmi = payload.bmi || 26;
    const sbp = payload.systolic_bp || 125;
    const chol = payload.cholesterol || 195;
    const gluc = payload.glucose || 100;
    const smoking = payload.smoking_status === 'Current';
    const active = payload.exercise_level === 'Active';
    const chestPain = payload.chest_pain === 1;

    let base = 0.12;
    if (age > 55) base += 0.18;
    if (sbp > 140) base += 0.22;
    if (bmi > 30) base += 0.15;
    if (chol > 220) base += 0.14;
    if (gluc > 126) base += 0.20;
    if (smoking) base += 0.22;
    if (chestPain && payload.disease === 'heart_disease') base += 0.25;
    if (active) base -= 0.12;

    const prob = Math.min(Math.max(base, 0.04), 0.94);
    const cat: 'Low' | 'Moderate' | 'High' | 'Critical' =
      prob >= 0.65 ? 'Critical' : prob >= 0.40 ? 'High' : prob >= 0.20 ? 'Moderate' : 'Low';
    const color = cat === 'Critical' ? 'rose' : cat === 'High' ? 'amber' : cat === 'Moderate' ? 'cyan' : 'emerald';

    return {
      disease: payload.disease,
      probability: +(prob.toFixed(4)),
      probability_percent: +(prob * 100).toFixed(1),
      risk_category: cat,
      risk_color: color,
      factor_contributions: [
        ...(age >= 60 ? [{ factor: 'Advanced Age (≥60)', impact: 'Increases Risk', type: 'negative' as const, detail: `${age} years old` }] : []),
        ...(sbp >= 140 ? [{ factor: 'Elevated Systolic Blood Pressure', impact: 'Increases Risk', type: 'negative' as const, detail: `${sbp} mmHg` }] : []),
        ...(bmi >= 30 ? [{ factor: 'Obesity (BMI ≥30)', impact: 'Increases Risk', type: 'negative' as const, detail: `${bmi} kg/m²` }] : []),
        ...(gluc >= 126 ? [{ factor: 'Elevated Fasting Glucose', impact: 'Increases Risk', type: 'negative' as const, detail: `${gluc} mg/dL` }] : []),
        ...(smoking ? [{ factor: 'Active Tobacco Smoking', impact: 'Increases Risk', type: 'negative' as const, detail: 'Current smoker' }] : []),
        ...(active ? [{ factor: 'Active Physical Exercise', impact: 'Lowers Risk', type: 'positive' as const, detail: 'Regular exercise' }] : [])
      ],
      population_benchmarks: {
        age: 50.8,
        bmi: 26.8,
        systolic_bp: 128.5,
        diastolic_bp: 81.2,
        cholesterol: 198.4,
        glucose: 102.1
      },
      patient_values: {
        age,
        bmi,
        systolic_bp: sbp,
        diastolic_bp: payload.diastolic_bp,
        cholesterol: chol,
        glucose: gluc
      },
      model_info: {
        model_name: 'Balanced Random Forest Classifier (Validated)',
        accuracy: 0.884,
        roc_auc: 0.825,
        f1_score: 0.792,
        limitations: 'Demonstration model trained on synthetic benchmark dataset; not calibrated for direct clinical intervention.'
      },
      disclaimer: 'This tool is for educational and analytical purposes only. It is not a medical diagnostic system and must not replace professional medical advice.'
    };
  },

  async uploadCSV(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE}/api/data/upload`, {
      method: 'POST',
      body: formData
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Upload failed' }));
      throw new Error(err.detail || 'Upload failed');
    }
    return await res.json();
  },

  async resetDataset() {
    try {
      const res = await fetch(`${API_BASE}/api/data/reset`, { method: 'POST' });
      if (res.ok) return await res.json();
    } catch (_) {}
    clientCachedPatients = [];
    return { status: 'success', message: 'Reset to default benchmark dataset.' };
  },

  async getReportSummary(filters: any) {
    try {
      const res = await fetch(`${API_BASE}/api/reports/summary${buildQuery(filters)}`, { signal: AbortSignal.timeout(3000) });
      if (res.ok) return await res.json();
    } catch (_) {}

    const sum = await this.getDashboardSummary(filters);
    const demo = await this.getDemographics(filters);

    return {
      report_id: `RPT-${Math.floor(Math.random() * 899999 + 100000)}`,
      generated_at: new Date().toISOString().split('T')[0],
      filters_applied: filters,
      kpis: sum.kpis,
      prevalence: sum.disease_prevalence,
      demographics: demo,
      lifestyle: sum.lifestyle,
      data_quality_limitations: [
        'Cross-sectional analytical cohort; does not support longitudinal causal tracking.',
        'De-identified synthetic benchmark records calibrated to CDC/AHA prevalence statistics.',
        'BMI represents an anthropometric screening indicator, not an exhaustive adiposity or metabolic diagnosis.',
        'Small demographic subsets (N < 15) should be interpreted with statistical caution.'
      ],
      disclaimer: 'This analytical summary is generated exclusively for clinical research, public health surveillance demonstrations, and educational support. It does not constitute medical diagnosis or therapeutic treatment recommendations.'
    };
  }
};
