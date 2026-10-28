export interface Patient {
  patient_id: string;
  age: number;
  sex: 'Male' | 'Female';
  bmi: number;
  bmi_category?: string;
  age_group?: string;
  systolic_bp: number;
  diastolic_bp: number;
  cholesterol: number;
  glucose: number;
  smoking_status: 'Never' | 'Former' | 'Current';
  alcohol_consumption: 'None' | 'Moderate' | 'Heavy';
  exercise_level: 'Sedentary' | 'Light' | 'Moderate' | 'Active';
  chest_pain: number;
  fatigue: number;
  dizziness: number;
  heart_disease: number;
  diabetes: number;
  stroke: number;
  risk_category: 'Low' | 'Moderate' | 'High' | 'Critical';
  record_date: string;
}

export interface SummaryKPIs {
  total_patients: number;
  heart_disease: {
    count: number;
    valid_n: number;
    rate: number;
  };
  diabetes: {
    count: number;
    valid_n: number;
    rate: number;
  };
  stroke: {
    count: number;
    valid_n: number;
    rate: number;
  };
  high_risk_count: number;
  high_risk_rate: number;
  avg_age: number;
  active_dataset: string;
  is_custom: boolean;
  comparisons?: {
    historical_trend: string;
    has_historical_data: boolean;
  };
}

export interface PrevalenceItem {
  disease: string;
  positive_count: number;
  negative_count: number;
  valid_sample_size: number;
  prevalence_rate: number;
  color: string;
}

export interface AgeGroupItem {
  age_group: string;
  count: number;
  heart_disease_rate: number;
  diabetes_rate: number;
  stroke_rate: number;
  small_sample: boolean;
}

export interface BmiCategoryItem {
  category: string;
  count: number;
  percentage: number;
  heart_disease_prevalence: number;
  diabetes_prevalence: number;
  color: string;
}

export interface CorrelationMatrixData {
  variables: string[];
  keys: string[];
  matrix: {
    variable: string;
    key: string;
    values: number[];
  }[];
  method: string;
  disclaimer: string;
}

export interface DynamicInsight {
  factor: string;
  finding: string;
  sample_size: string;
}

export interface LifestyleInsightsData {
  smoking: { category: string; count: number; heart_disease_rate: number; diabetes_rate: number; stroke_rate: number }[];
  exercise: { category: string; count: number; heart_disease_rate: number; diabetes_rate: number; stroke_rate: number }[];
  alcohol: { category: string; count: number; heart_disease_rate: number; diabetes_rate: number; stroke_rate: number }[];
  dynamic_insights: DynamicInsight[];
}

export interface DemographicsData {
  age_distribution: { bin: string; count: number; percentage: number }[];
  sex_distribution: { sex: string; count: number; percentage: number; heart_disease_rate: number; diabetes_rate: number; stroke_rate: number }[];
  heatmap_data: { age_group: string; sample_size: number; heart_disease: number; diabetes: number; stroke: number; flag_low_sample: boolean }[];
}

export interface RiskFactorContribution {
  factor: string;
  impact: string;
  type: 'positive' | 'negative';
  detail: string;
}

export interface RiskAssessmentResult {
  disease: string;
  probability: number;
  probability_percent: number;
  risk_category: 'Low' | 'Moderate' | 'High' | 'Critical';
  risk_color: 'emerald' | 'cyan' | 'amber' | 'rose';
  factor_contributions: RiskFactorContribution[];
  population_benchmarks: {
    age: number;
    bmi: number;
    systolic_bp: number;
    diastolic_bp: number;
    cholesterol: number;
    glucose: number;
  };
  patient_values: {
    age: number;
    bmi: number;
    systolic_bp: number;
    diastolic_bp?: number;
    cholesterol?: number;
    glucose?: number;
  };
  model_info: {
    model_name?: string;
    accuracy?: number;
    roc_auc?: number;
    f1_score?: number;
    limitations?: string;
    top_features?: { feature: string; label: string; importance: number }[];
  };
  disclaimer: string;
}

export interface FilterState {
  age_group: string;
  bmi_category: string;
  disease: string;
  smoking_status: string;
  exercise_level: string;
  start_date?: string;
  end_date?: string;
  search?: string;
}
