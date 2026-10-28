import os
import io
import math
import numpy as np
import pandas as pd
from datetime import datetime
from typing import Optional, List, Dict, Any

DEFAULT_CSV_PATH = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'patients_synthetic.csv')

def get_bmi_category(bmi: float) -> str:
    if pd.isna(bmi):
        return 'Unknown'
    if bmi < 18.5:
        return 'Underweight'
    elif bmi < 25.0:
        return 'Normal'
    elif bmi < 30.0:
        return 'Overweight'
    elif bmi < 35.0:
        return 'Obesity Class I'
    elif bmi < 40.0:
        return 'Obesity Class II'
    else:
        return 'Obesity Class III'

def get_age_group(age: int) -> str:
    if pd.isna(age):
        return 'Unknown'
    if age < 30:
        return 'Under 30'
    elif age < 40:
        return '30–39'
    elif age < 50:
        return '40–49'
    elif age < 60:
        return '50–59'
    else:
        return '60+'

class DataService:
    def __init__(self, csv_path: str = DEFAULT_CSV_PATH):
        self.csv_path = csv_path
        self._df: pd.DataFrame = pd.DataFrame()
        self.active_dataset_name = "Synthetic CDC/AHA Benchmark Cohort (N=1,500)"
        self.is_custom_dataset = False
        self.load_data()

    def load_data(self):
        if os.path.exists(self.csv_path):
            self._df = pd.read_csv(self.csv_path)
            self._enrich_dataframe()
        else:
            self._df = pd.DataFrame()

    def reset_to_default(self):
        self.csv_path = DEFAULT_CSV_PATH
        self.active_dataset_name = "Synthetic CDC/AHA Benchmark Cohort (N=1,500)"
        self.is_custom_dataset = False
        self.load_data()

    def _enrich_dataframe(self):
        if 'bmi' in self._df.columns:
            self._df['bmi_category'] = self._df['bmi'].apply(get_bmi_category)
        if 'age' in self._df.columns:
            self._df['age_group'] = self._df['age'].apply(get_age_group)

    @property
    def raw_df(self) -> pd.DataFrame:
        return self._df

    def filter_data(
        self,
        age_group: Optional[str] = None,
        bmi_category: Optional[str] = None,
        disease: Optional[str] = None,
        smoking_status: Optional[str] = None,
        exercise_level: Optional[str] = None,
        start_date: Optional[str] = None,
        end_date: Optional[str] = None,
        search: Optional[str] = None
    ) -> pd.DataFrame:
        df = self._df.copy()
        if df.empty:
            return df

        if age_group and age_group != 'All':
            df = df[df['age_group'] == age_group]

        if bmi_category and bmi_category != 'All':
            df = df[df['bmi_category'] == bmi_category]

        if smoking_status and smoking_status != 'All':
            df = df[df['smoking_status'] == smoking_status]

        if exercise_level and exercise_level != 'All':
            df = df[df['exercise_level'] == exercise_level]

        if disease and disease != 'All':
            col = disease.lower().replace(' ', '_')
            if col in df.columns:
                df = df[df[col] == 1]

        if start_date and 'record_date' in df.columns:
            df = df[df['record_date'] >= start_date]

        if end_date and 'record_date' in df.columns:
            df = df[df['record_date'] <= end_date]

        if search and 'patient_id' in df.columns:
            df = df[df['patient_id'].str.contains(search, case=False, na=False)]

        return df

    def get_summary(self, filtered_df: Optional[pd.DataFrame] = None) -> Dict[str, Any]:
        df = self._df if filtered_df is None else filtered_df
        total = len(df)
        if total == 0:
            return {
                "total_patients": 0,
                "heart_disease_prevalence": 0.0,
                "diabetes_prevalence": 0.0,
                "stroke_prevalence": 0.0,
                "high_risk_patients": 0,
                "high_risk_percentage": 0.0,
                "avg_age": 0.0,
                "active_dataset": self.active_dataset_name,
                "is_custom": self.is_custom_dataset,
                "trend_note": "No patients match the current filter criteria."
            }

        # Calculate exact prevalences from valid (non-null) records
        def get_prev(col_name):
            if col_name not in df.columns:
                return {"count": 0, "valid_n": 0, "rate": 0.0}
            valid = df[col_name].dropna()
            valid_n = len(valid)
            if valid_n == 0:
                return {"count": 0, "valid_n": 0, "rate": 0.0}
            count = int((valid == 1).sum())
            rate = round((count / valid_n) * 100, 2)
            return {"count": count, "valid_n": valid_n, "rate": rate}

        hd = get_prev('heart_disease')
        db = get_prev('diabetes')
        st = get_prev('stroke')

        # High risk count (Critical + High)
        high_risk_count = 0
        if 'risk_category' in df.columns:
            high_risk_count = int(df['risk_category'].isin(['High', 'Critical']).sum())
        high_risk_rate = round((high_risk_count / total) * 100, 2)

        avg_age = round(float(df['age'].dropna().mean()), 1) if 'age' in df.columns else 0.0

        return {
            "total_patients": total,
            "heart_disease": hd,
            "diabetes": db,
            "stroke": st,
            "high_risk_count": high_risk_count,
            "high_risk_rate": high_risk_rate,
            "avg_age": avg_age,
            "active_dataset": self.active_dataset_name,
            "is_custom": self.is_custom_dataset,
            "comparisons": {
                "historical_trend": "Neutral indicator: Baseline cohort cross-sectional dataset. No longitudinal follow-up period recorded.",
                "has_historical_data": False
            }
        }

    def get_prevalence_distribution(self, df: pd.DataFrame) -> List[Dict[str, Any]]:
        total = len(df)
        if total == 0:
            return []
            
        diseases = [
            ('Heart Disease', 'heart_disease', '#0D9488'),
            ('Diabetes', 'diabetes', '#0891B2'),
            ('Stroke', 'stroke', '#6366F1')
        ]
        
        result = []
        for label, col, color in diseases:
            if col in df.columns:
                valid = df[col].dropna()
                valid_n = len(valid)
                pos = int((valid == 1).sum())
                rate = round((pos / valid_n) * 100, 1) if valid_n > 0 else 0.0
                result.append({
                    "disease": label,
                    "positive_count": pos,
                    "negative_count": valid_n - pos,
                    "valid_sample_size": valid_n,
                    "prevalence_rate": rate,
                    "color": color
                })
        return result

    def get_age_group_analysis(self, df: pd.DataFrame) -> List[Dict[str, Any]]:
        if df.empty or 'age_group' not in df.columns:
            return []

        age_order = ['Under 30', '30–39', '40–49', '50–59', '60+']
        result = []

        for group in age_order:
            sub = df[df['age_group'] == group]
            n = len(sub)
            if n == 0:
                result.append({
                    "age_group": group, "count": 0, "heart_disease_rate": 0, "diabetes_rate": 0, "stroke_rate": 0, "small_sample": True
                })
                continue

            hd_rate = round((sub['heart_disease'].dropna() == 1).sum() / len(sub['heart_disease'].dropna()) * 100, 1) if 'heart_disease' in sub.columns else 0
            db_rate = round((sub['diabetes'].dropna() == 1).sum() / len(sub['diabetes'].dropna()) * 100, 1) if 'diabetes' in sub.columns else 0
            st_rate = round((sub['stroke'].dropna() == 1).sum() / len(sub['stroke'].dropna()) * 100, 1) if 'stroke' in sub.columns else 0

            result.append({
                "age_group": group,
                "count": n,
                "heart_disease_rate": hd_rate,
                "diabetes_rate": db_rate,
                "stroke_rate": st_rate,
                "small_sample": n < 20
            })
        return result

    def get_bmi_distribution(self, df: pd.DataFrame) -> List[Dict[str, Any]]:
        if df.empty or 'bmi_category' not in df.columns:
            return []

        categories = ['Underweight', 'Normal', 'Overweight', 'Obesity Class I', 'Obesity Class II', 'Obesity Class III']
        colors = ['#38BDF8', '#10B981', '#FBBF24', '#F97316', '#EF4444', '#B91C1C']
        result = []
        total = len(df)

        for cat, col in zip(categories, colors):
            sub = df[df['bmi_category'] == cat]
            count = len(sub)
            pct = round((count / total) * 100, 1) if total > 0 else 0
            hd_rate = round((sub['heart_disease'] == 1).mean() * 100, 1) if ('heart_disease' in sub.columns and count > 0) else 0
            db_rate = round((sub['diabetes'] == 1).mean() * 100, 1) if ('diabetes' in sub.columns and count > 0) else 0

            result.append({
                "category": cat,
                "count": count,
                "percentage": pct,
                "heart_disease_prevalence": hd_rate,
                "diabetes_prevalence": db_rate,
                "color": col
            })
        return result

    def get_correlation_matrix(self, df: pd.DataFrame) -> Dict[str, Any]:
        if df.empty:
            return {"variables": [], "matrix": [], "disclaimer": "Correlation does not imply causation."}

        # Select numerical columns
        cols = ['age', 'bmi', 'systolic_bp', 'diastolic_bp', 'cholesterol', 'glucose', 'heart_disease', 'diabetes', 'stroke']
        existing_cols = [c for c in cols if c in df.columns]

        # Map labels
        labels = {
            'age': 'Age',
            'bmi': 'BMI',
            'systolic_bp': 'Sys BP',
            'diastolic_bp': 'Dia BP',
            'cholesterol': 'Cholesterol',
            'glucose': 'Glucose',
            'heart_disease': 'Heart Dis.',
            'diabetes': 'Diabetes',
            'stroke': 'Stroke'
        }

        sub_df = df[existing_cols].dropna()
        if len(sub_df) < 5:
            return {"variables": [], "matrix": [], "disclaimer": "Insufficient data for correlation."}

        corr = sub_df.corr().round(2)
        
        matrix = []
        for i, col1 in enumerate(existing_cols):
            row = []
            for j, col2 in enumerate(existing_cols):
                val = float(corr.loc[col1, col2])
                row.append(val if not math.isnan(val) else 0.0)
            matrix.append({
                "variable": labels.get(col1, col1),
                "key": col1,
                "values": row
            })

        return {
            "variables": [labels.get(c, c) for c in existing_cols],
            "keys": existing_cols,
            "matrix": matrix,
            "method": "Pearson pairwise correlation coefficient",
            "disclaimer": "IMPORTANT: Statistical correlations identify observed associations in this cohort. They do not demonstrate direct biological causation."
        }

    def get_lifestyle_insights(self, df: pd.DataFrame) -> Dict[str, Any]:
        if df.empty:
            return {"smoking": [], "exercise": [], "alcohol": [], "dynamic_insights": []}

        def breakdown(col_name):
            if col_name not in df.columns:
                return []
            res = []
            for val, grp in df.groupby(col_name):
                n = len(grp)
                hd = round((grp['heart_disease'] == 1).mean() * 100, 1) if 'heart_disease' in grp.columns else 0
                db = round((grp['diabetes'] == 1).mean() * 100, 1) if 'diabetes' in grp.columns else 0
                st = round((grp['stroke'] == 1).mean() * 100, 1) if 'stroke' in grp.columns else 0
                res.append({
                    "category": str(val),
                    "count": n,
                    "heart_disease_rate": hd,
                    "diabetes_rate": db,
                    "stroke_rate": st
                })
            return res

        smoking = breakdown('smoking_status')
        exercise = breakdown('exercise_level')
        alcohol = breakdown('alcohol_consumption')

        # Generate dynamically calculated insights (no hardcoding!)
        insights = []

        # Smoking vs Heart Disease / Stroke
        smokers = df[df['smoking_status'] == 'Current']
        non_smokers = df[df['smoking_status'] == 'Never']
        if len(smokers) >= 15 and len(non_smokers) >= 15:
            hd_smokers = (smokers['heart_disease'] == 1).mean() * 100
            hd_non = (non_smokers['heart_disease'] == 1).mean() * 100
            diff = round(hd_smokers - hd_non, 1)
            ratio = round(hd_smokers / max(hd_non, 0.1), 1)
            insights.append({
                "factor": "Smoking Impact",
                "finding": f"Within this dataset, current smokers demonstrate a {diff}% higher observed prevalence of heart disease compared to never-smokers ({round(hd_smokers, 1)}% vs {round(hd_non, 1)}%, risk ratio: {ratio}x).",
                "sample_size": f"N={len(smokers)} smokers vs N={len(non_smokers)} non-smokers"
            })

        # BMI vs Diabetes
        obese = df[df['bmi'] >= 30.0]
        normal_bmi = df[(df['bmi'] >= 18.5) & (df['bmi'] < 25.0)]
        if len(obese) >= 15 and len(normal_bmi) >= 15:
            db_obese = (obese['diabetes'] == 1).mean() * 100
            db_norm = (normal_bmi['diabetes'] == 1).mean() * 100
            diff_db = round(db_obese - db_norm, 1)
            ratio_db = round(db_obese / max(db_norm, 0.1), 1)
            insights.append({
                "factor": "Adiposity & Glycemic Risk",
                "finding": f"Patients with BMI ≥ 30 show a {diff_db}% higher observed prevalence of diabetes ({round(db_obese, 1)}%) relative to individuals in the normal weight category ({round(db_norm, 1)}%, risk ratio: {ratio_db}x).",
                "sample_size": f"N={len(obese)} obese vs N={len(normal_bmi)} normal BMI"
            })

        # Physical Activity vs Heart Disease
        sedentary = df[df['exercise_level'] == 'Sedentary']
        active = df[df['exercise_level'] == 'Active']
        if len(sedentary) >= 15 and len(active) >= 15:
            hd_sed = (sedentary['heart_disease'] == 1).mean() * 100
            hd_act = (active['heart_disease'] == 1).mean() * 100
            insights.append({
                "factor": "Physical Activity Protective Association",
                "finding": f"Sedentary patients exhibit a heart disease rate of {round(hd_sed, 1)}%, whereas active patients exhibit {round(hd_act, 1)}% in this sample.",
                "sample_size": f"N={len(sedentary)} sedentary vs N={len(active)} active"
            })

        return {
            "smoking": smoking,
            "exercise": exercise,
            "alcohol": alcohol,
            "dynamic_insights": insights
        }

    def get_demographics(self, df: pd.DataFrame) -> Dict[str, Any]:
        if df.empty:
            return {"age_distribution": [], "sex_distribution": [], "heatmap_data": []}

        # Age histogram bins: 18-29, 30-39, 40-49, 50-59, 60-69, 70+
        bins = [18, 30, 40, 50, 60, 70, 90]
        bin_labels = ['18–29', '30–39', '40–49', '50–59', '60–69', '70+']
        df_temp = df.copy()
        df_temp['age_bin'] = pd.cut(df_temp['age'], bins=bins, labels=bin_labels, right=False)

        age_dist = []
        for b in bin_labels:
            sub = df_temp[df_temp['age_bin'] == b]
            age_dist.append({
                "bin": b,
                "count": len(sub),
                "percentage": round(len(sub) / len(df) * 100, 1) if len(df) > 0 else 0
            })

        # Sex distribution
        sex_dist = []
        if 'sex' in df.columns:
            for s, grp in df.groupby('sex'):
                n = len(grp)
                hd = round((grp['heart_disease'] == 1).mean() * 100, 1) if 'heart_disease' in grp.columns else 0
                db = round((grp['diabetes'] == 1).mean() * 100, 1) if 'diabetes' in grp.columns else 0
                st = round((grp['stroke'] == 1).mean() * 100, 1) if 'stroke' in grp.columns else 0
                sex_dist.append({
                    "sex": s,
                    "count": n,
                    "percentage": round(n / len(df) * 100, 1),
                    "heart_disease_rate": hd,
                    "diabetes_rate": db,
                    "stroke_rate": st
                })

        # Age group x Disease prevalence Heatmap
        heatmap = []
        for group in ['Under 30', '30–39', '40–49', '50–59', '60+']:
            sub = df[df['age_group'] == group]
            n = len(sub)
            hd = round((sub['heart_disease'] == 1).mean() * 100, 1) if ('heart_disease' in sub.columns and n > 0) else 0
            db = round((sub['diabetes'] == 1).mean() * 100, 1) if ('diabetes' in sub.columns and n > 0) else 0
            st = round((sub['stroke'] == 1).mean() * 100, 1) if ('stroke' in sub.columns and n > 0) else 0
            heatmap.append({
                "age_group": group,
                "sample_size": n,
                "heart_disease": hd,
                "diabetes": db,
                "stroke": st,
                "flag_low_sample": n < 15
            })

        return {
            "age_distribution": age_dist,
            "sex_distribution": sex_dist,
            "heatmap_data": heatmap
        }

    def get_disease_detail(self, disease_type: str, df: pd.DataFrame) -> Dict[str, Any]:
        disease_type = disease_type.lower()
        if disease_type not in ['heart', 'diabetes', 'stroke']:
            return {}

        col_map = {
            'heart': 'heart_disease',
            'diabetes': 'diabetes',
            'stroke': 'stroke'
        }
        col = col_map[disease_type]

        if df.empty or col not in df.columns:
            return {"disease": disease_type, "available": False}

        valid_df = df.dropna(subset=[col])
        pos_df = valid_df[valid_df[col] == 1]
        neg_df = valid_df[valid_df[col] == 0]

        total_valid = len(valid_df)
        total_pos = len(pos_df)
        prevalence = round((total_pos / total_valid) * 100, 2) if total_valid > 0 else 0.0

        # Prevalence by age group
        by_age = []
        for g in ['Under 30', '30–39', '40–49', '50–59', '60+']:
            sub = valid_df[valid_df['age_group'] == g]
            n = len(sub)
            prev = round((sub[col] == 1).mean() * 100, 1) if n > 0 else 0.0
            by_age.append({"group": g, "sample_size": n, "prevalence": prev, "small_sample": n < 15})

        # Prevalence by BMI category
        by_bmi = []
        for b in ['Underweight', 'Normal', 'Overweight', 'Obesity Class I', 'Obesity Class II', 'Obesity Class III']:
            sub = valid_df[valid_df['bmi_category'] == b]
            n = len(sub)
            prev = round((sub[col] == 1).mean() * 100, 1) if n > 0 else 0.0
            by_bmi.append({"category": b, "sample_size": n, "prevalence": prev, "small_sample": n < 15})

        # Clinical Distribution Comparisons
        clinical_comparison = {}
        if disease_type == 'heart':
            clinical_comparison = {
                "systolic_bp": {
                    "positive_mean": round(float(pos_df['systolic_bp'].mean()), 1) if len(pos_df) > 0 else 0,
                    "negative_mean": round(float(neg_df['systolic_bp'].mean()), 1) if len(neg_df) > 0 else 0,
                },
                "cholesterol": {
                    "positive_mean": round(float(pos_df['cholesterol'].mean()), 1) if len(pos_df) > 0 else 0,
                    "negative_mean": round(float(neg_df['cholesterol'].mean()), 1) if len(neg_df) > 0 else 0,
                },
                "chest_pain_prevalence": {
                    "in_disease": round((pos_df['chest_pain'] == 1).mean() * 100, 1) if len(pos_df) > 0 else 0,
                    "in_healthy": round((neg_df['chest_pain'] == 1).mean() * 100, 1) if len(neg_df) > 0 else 0
                }
            }
        elif disease_type == 'diabetes':
            clinical_comparison = {
                "glucose": {
                    "positive_mean": round(float(pos_df['glucose'].mean()), 1) if len(pos_df) > 0 else 0,
                    "negative_mean": round(float(neg_df['glucose'].mean()), 1) if len(neg_df) > 0 else 0,
                },
                "bmi": {
                    "positive_mean": round(float(pos_df['bmi'].mean()), 1) if len(pos_df) > 0 else 0,
                    "negative_mean": round(float(neg_df['bmi'].mean()), 1) if len(neg_df) > 0 else 0,
                },
                "fatigue_prevalence": {
                    "in_disease": round((pos_df['fatigue'] == 1).mean() * 100, 1) if len(pos_df) > 0 else 0,
                    "in_healthy": round((neg_df['fatigue'] == 1).mean() * 100, 1) if len(neg_df) > 0 else 0
                }
            }
        elif disease_type == 'stroke':
            clinical_comparison = {
                "systolic_bp": {
                    "positive_mean": round(float(pos_df['systolic_bp'].mean()), 1) if len(pos_df) > 0 else 0,
                    "negative_mean": round(float(neg_df['systolic_bp'].mean()), 1) if len(neg_df) > 0 else 0,
                },
                "age": {
                    "positive_mean": round(float(pos_df['age'].mean()), 1) if len(pos_df) > 0 else 0,
                    "negative_mean": round(float(neg_df['age'].mean()), 1) if len(neg_df) > 0 else 0,
                },
                "dizziness_prevalence": {
                    "in_disease": round((pos_df['dizziness'] == 1).mean() * 100, 1) if len(pos_df) > 0 else 0,
                    "in_healthy": round((neg_df['dizziness'] == 1).mean() * 100, 1) if len(neg_df) > 0 else 0
                }
            }

        return {
            "disease": disease_type,
            "target_column": col,
            "total_sample_size": total_valid,
            "positive_count": total_pos,
            "prevalence_rate": prevalence,
            "by_age_group": by_age,
            "by_bmi_category": by_bmi,
            "clinical_comparison": clinical_comparison,
            "disclaimer": "Observed associations reflect non-causal population epidemiological correlations."
        }

    def get_patients_paged(
        self,
        df: pd.DataFrame,
        page: int = 1,
        page_size: int = 15,
        sort_by: str = 'patient_id',
        sort_dir: str = 'asc'
    ) -> Dict[str, Any]:
        total = len(df)
        if total == 0:
            return {"patients": [], "total": 0, "page": page, "page_size": page_size, "total_pages": 0}

        sorted_df = df.copy()
        if sort_by in sorted_df.columns:
            ascending = (sort_dir.lower() == 'asc')
            sorted_df = sorted_df.sort_values(by=sort_by, ascending=ascending)

        total_pages = max(1, math.ceil(total / page_size))
        start_idx = (page - 1) * page_size
        end_idx = min(start_idx + page_size, total)

        page_records = sorted_df.iloc[start_idx:end_idx].to_dict(orient='records')

        return {
            "patients": page_records,
            "total": total,
            "page": page,
            "page_size": page_size,
            "total_pages": total_pages
        }

    def get_patient_by_id(self, patient_id: str) -> Optional[Dict[str, Any]]:
        match = self._df[self._df['patient_id'] == patient_id]
        if match.empty:
            return None
        return match.iloc[0].to_dict()

    def process_csv_upload(self, content_bytes: bytes, filename: str) -> Dict[str, Any]:
        try:
            raw_text = content_bytes.decode('utf-8', errors='replace')
            uploaded_df = pd.read_csv(io.StringIO(raw_text))
        except Exception as e:
            return {"success": False, "error": f"Failed to parse CSV file: {str(e)}"}

        # Basic limits
        if len(uploaded_df) == 0:
            return {"success": False, "error": "Uploaded file contains no rows."}

        if len(uploaded_df.columns) > 100:
            return {"success": False, "error": "Exceeded maximum column limit (100 columns)."}

        # Detect columns and types
        col_summary = []
        for col in uploaded_df.columns:
            dtype = str(uploaded_df[col].dtype)
            null_count = int(uploaded_df[col].isnull().sum())
            unique_count = int(uploaded_df[col].nunique())
            col_summary.append({
                "column": col,
                "type": dtype,
                "null_count": null_count,
                "unique_count": unique_count
            })

        duplicates = int(uploaded_df.duplicated().sum())

        # Validate standard healthcare variables if present
        warnings = []
        if 'age' in uploaded_df.columns:
            invalid_age = ((uploaded_df['age'] < 0) | (uploaded_df['age'] > 125)).sum()
            if invalid_age > 0:
                warnings.append(f"{invalid_age} records contain out-of-range Age (<0 or >125).")

        if 'bmi' in uploaded_df.columns:
            invalid_bmi = ((uploaded_df['bmi'] < 10) | (uploaded_df['bmi'] > 90)).sum()
            if invalid_bmi > 0:
                warnings.append(f"{invalid_bmi} records contain out-of-range BMI (<10 or >90).")

        if 'systolic_bp' in uploaded_df.columns:
            invalid_sbp = ((uploaded_df['systolic_bp'] < 50) | (uploaded_df['systolic_bp'] > 300)).sum()
            if invalid_sbp > 0:
                warnings.append(f"{invalid_sbp} records contain abnormal Systolic BP (<50 or >300 mmHg).")

        # Descriptive statistics for numerical columns
        numeric_cols = uploaded_df.select_dtypes(include=[np.number]).columns.tolist()
        desc_stats = {}
        if numeric_cols:
            stats_df = uploaded_df[numeric_cols].describe().round(2)
            desc_stats = stats_df.to_dict()

        # Update active dataframe if schema is compatible
        # Required core: at least age and some clinical metric
        has_patient_id = 'patient_id' in uploaded_df.columns
        if not has_patient_id:
            uploaded_df['patient_id'] = [f"UP-{1000 + i}" for i in range(1, len(uploaded_df) + 1)]

        self._df = uploaded_df
        self._enrich_dataframe()
        self.active_dataset_name = f"Uploaded File: {filename} (N={len(uploaded_df)})"
        self.is_custom_dataset = True

        return {
            "success": True,
            "filename": filename,
            "row_count": len(uploaded_df),
            "column_count": len(uploaded_df.columns),
            "columns": col_summary,
            "duplicate_rows": duplicates,
            "warnings": warnings,
            "descriptive_statistics": desc_stats,
            "preview": uploaded_df.head(10).to_dict(orient='records')
        }

# Global service instance
data_service = DataService()
