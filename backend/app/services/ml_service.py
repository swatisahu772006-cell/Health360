import os
import joblib
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score, confusion_matrix

MODELS_DIR = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'models')
os.makedirs(MODELS_DIR, exist_ok=True)

FEATURE_COLS = [
    'age', 'bmi', 'systolic_bp', 'diastolic_bp', 'cholesterol', 'glucose',
    'smoking_status_Current', 'smoking_status_Former', 'smoking_status_Never',
    'alcohol_consumption_Heavy', 'alcohol_consumption_Moderate', 'alcohol_consumption_None',
    'exercise_level_Active', 'exercise_level_Light', 'exercise_level_Moderate', 'exercise_level_Sedentary',
    'chest_pain', 'fatigue', 'dizziness'
]

FEATURE_LABELS = {
    'age': 'Patient Age',
    'bmi': 'Body Mass Index (BMI)',
    'systolic_bp': 'Systolic Blood Pressure (mmHg)',
    'diastolic_bp': 'Diastolic Blood Pressure (mmHg)',
    'cholesterol': 'Total Cholesterol (mg/dL)',
    'glucose': 'Fasting Blood Glucose (mg/dL)',
    'smoking_status_Current': 'Current Smoker',
    'smoking_status_Former': 'Former Smoker',
    'smoking_status_Never': 'Non-Smoker',
    'alcohol_consumption_Heavy': 'Heavy Alcohol Intake',
    'alcohol_consumption_Moderate': 'Moderate Alcohol Intake',
    'alcohol_consumption_None': 'No Alcohol Intake',
    'exercise_level_Active': 'Active Physical Exercise',
    'exercise_level_Light': 'Light Physical Exercise',
    'exercise_level_Moderate': 'Moderate Exercise',
    'exercise_level_Sedentary': 'Sedentary Lifestyle',
    'chest_pain': 'Chest Pain Symptom',
    'fatigue': 'Fatigue Symptom',
    'dizziness': 'Dizziness Symptom'
}

POPULATION_BENCHMARKS = {
    'age': 50.8,
    'bmi': 26.8,
    'systolic_bp': 128.5,
    'diastolic_bp': 81.2,
    'cholesterol': 198.4,
    'glucose': 102.1
}

class MLModelManager:
    def __init__(self):
        self.models = {}
        self.scalers = {}
        self.metrics = {}
        self.feature_names = FEATURE_COLS

    def prepare_features(self, df: pd.DataFrame):
        data = df.copy()
        for col in ['smoking_status', 'alcohol_consumption', 'exercise_level']:
            if col in data.columns:
                dummies = pd.get_dummies(data[col], prefix=col)
                data = pd.concat([data, dummies], axis=1)
        
        for col in self.feature_names:
            if col not in data.columns:
                data[col] = 0
                
        return data[self.feature_names].fillna(0)

    def train_models(self, data_path: str):
        if not os.path.exists(data_path):
            raise FileNotFoundError(f"Data file not found at {data_path}")
            
        df = pd.read_csv(data_path)
        X = self.prepare_features(df)
        
        target_diseases = ['heart_disease', 'diabetes', 'stroke']
        
        for disease in target_diseases:
            if disease not in df.columns:
                continue
                
            y = df[disease].astype(int)
            
            # Stratified train/test split (80% train, 20% test) to prevent data leakage
            X_train, X_test, y_train, y_test = train_test_split(
                X, y, test_size=0.20, random_state=42, stratify=y
            )
            
            scaler = StandardScaler()
            X_train_scaled = scaler.fit_transform(X_train)
            X_test_scaled = scaler.transform(X_test)
            
            # Use Balanced Random Forest / Logistic Regression
            clf = RandomForestClassifier(
                n_estimators=100,
                max_depth=6,
                min_samples_split=6,
                class_weight='balanced',
                random_state=42
            )
            clf.fit(X_train_scaled, y_train)
            
            y_pred = clf.predict(X_test_scaled)
            y_prob = clf.predict_proba(X_test_scaled)[:, 1]
            
            acc = float(accuracy_score(y_test, y_pred))
            prec = float(precision_score(y_test, y_pred, zero_division=0))
            rec = float(recall_score(y_test, y_pred, zero_division=0))
            f1 = float(f1_score(y_test, y_pred, zero_division=0))
            roc_auc = float(roc_auc_score(y_test, y_prob)) if len(np.unique(y_test)) > 1 else 0.5
            cm = confusion_matrix(y_test, y_pred).tolist()
            
            importances = dict(zip(self.feature_names, [float(x) for x in clf.feature_importances_]))
            sorted_imp = sorted(importances.items(), key=lambda x: x[1], reverse=True)
            
            self.models[disease] = clf
            self.scalers[disease] = scaler
            self.metrics[disease] = {
                'disease': disease,
                'model_name': 'RandomForestClassifier (Validated)',
                'train_samples': len(X_train),
                'test_samples': len(X_test),
                'prevalence_in_test': float(y_test.mean()),
                'accuracy': round(acc, 3),
                'precision': round(prec, 3),
                'recall': round(rec, 3),
                'f1_score': round(f1, 3),
                'roc_auc': round(roc_auc, 3),
                'confusion_matrix': cm,
                'top_features': [{'feature': k, 'label': FEATURE_LABELS.get(k, k), 'importance': round(v, 4)} for k, v in sorted_imp[:6]],
                'limitations': 'Model trained on benchmark synthetic cohort; does not account for genetics, detailed medication history, or laboratory biomarkers (e.g. HbA1c, troponin).'
            }

    def predict(self, disease: str, input_dict: dict):
        if disease not in self.models:
            # Fallback rule-based estimation if model not loaded
            return self._rule_based_fallback(disease, input_dict)
            
        clf = self.models[disease]
        scaler = self.scalers[disease]
        
        # Build one-row dataframe
        row_dict = {
            'age': float(input_dict.get('age', 45)),
            'bmi': float(input_dict.get('bmi', 25.0)),
            'systolic_bp': float(input_dict.get('systolic_bp', 120)),
            'diastolic_bp': float(input_dict.get('diastolic_bp', 80)),
            'cholesterol': float(input_dict.get('cholesterol', 190)),
            'glucose': float(input_dict.get('glucose', 95)),
            'smoking_status_Current': 1.0 if input_dict.get('smoking_status') == 'Current' else 0.0,
            'smoking_status_Former': 1.0 if input_dict.get('smoking_status') == 'Former' else 0.0,
            'smoking_status_Never': 1.0 if input_dict.get('smoking_status') == 'Never' else 0.0,
            'alcohol_consumption_Heavy': 1.0 if input_dict.get('alcohol_consumption') == 'Heavy' else 0.0,
            'alcohol_consumption_Moderate': 1.0 if input_dict.get('alcohol_consumption') == 'Moderate' else 0.0,
            'alcohol_consumption_None': 1.0 if input_dict.get('alcohol_consumption') == 'None' else 0.0,
            'exercise_level_Active': 1.0 if input_dict.get('exercise_level') == 'Active' else 0.0,
            'exercise_level_Light': 1.0 if input_dict.get('exercise_level') == 'Light' else 0.0,
            'exercise_level_Moderate': 1.0 if input_dict.get('exercise_level') == 'Moderate' else 0.0,
            'exercise_level_Sedentary': 1.0 if input_dict.get('exercise_level') == 'Sedentary' else 0.0,
            'chest_pain': float(input_dict.get('chest_pain', 0)),
            'fatigue': float(input_dict.get('fatigue', 0)),
            'dizziness': float(input_dict.get('dizziness', 0))
        }
        
        df_row = pd.DataFrame([row_dict])[self.feature_names]
        X_scaled = scaler.transform(df_row)
        
        prob = float(clf.predict_proba(X_scaled)[0, 1])
        
        # Determine category
        if prob >= 0.65:
            cat = 'Critical'
            risk_color = 'rose'
        elif prob >= 0.40:
            cat = 'High'
            risk_color = 'amber'
        elif prob >= 0.20:
            cat = 'Moderate'
            risk_color = 'cyan'
        else:
            cat = 'Low'
            risk_color = 'emerald'
            
        # Determine individual factor contributions
        contributions = []
        patient_age = row_dict['age']
        if patient_age >= 60:
            contributions.append({'factor': 'Advanced Age (≥60)', 'impact': 'Increases Risk', 'type': 'negative', 'detail': f'{int(patient_age)} years old'})
        elif patient_age <= 35:
            contributions.append({'factor': 'Younger Age (<35)', 'impact': 'Lowers Risk', 'type': 'positive', 'detail': f'{int(patient_age)} years old'})

        patient_sys = row_dict['systolic_bp']
        if patient_sys >= 140:
            contributions.append({'factor': 'Elevated Systolic BP', 'impact': 'Increases Risk', 'type': 'negative', 'detail': f'{int(patient_sys)} mmHg'})
        elif patient_sys < 120:
            contributions.append({'factor': 'Optimal Systolic BP', 'impact': 'Lowers Risk', 'type': 'positive', 'detail': f'{int(patient_sys)} mmHg'})

        patient_bmi = row_dict['bmi']
        if patient_bmi >= 30:
            contributions.append({'factor': 'Obesity (BMI ≥30)', 'impact': 'Increases Risk', 'type': 'negative', 'detail': f'{patient_bmi:.1f} kg/m²'})
        elif 18.5 <= patient_bmi <= 24.9:
            contributions.append({'factor': 'Normal BMI (18.5-24.9)', 'impact': 'Lowers Risk', 'type': 'positive', 'detail': f'{patient_bmi:.1f} kg/m²'})

        patient_gluc = row_dict['glucose']
        if patient_gluc >= 126:
            contributions.append({'factor': 'High Fasting Glucose (≥126)', 'impact': 'Increases Risk', 'type': 'negative', 'detail': f'{int(patient_gluc)} mg/dL'})

        patient_chol = row_dict['cholesterol']
        if patient_chol >= 240:
            contributions.append({'factor': 'High Total Cholesterol (≥240)', 'impact': 'Increases Risk', 'type': 'negative', 'detail': f'{int(patient_chol)} mg/dL'})

        if row_dict['smoking_status_Current'] == 1.0:
            contributions.append({'factor': 'Active Tobacco Smoking', 'impact': 'Increases Risk', 'type': 'negative', 'detail': 'Current smoker'})
        elif row_dict['smoking_status_Never'] == 1.0:
            contributions.append({'factor': 'Non-Smoker Status', 'impact': 'Lowers Risk', 'type': 'positive', 'detail': 'Never smoked'})

        if row_dict['exercise_level_Active'] == 1.0:
            contributions.append({'factor': 'High Physical Activity', 'impact': 'Lowers Risk', 'type': 'positive', 'detail': 'Active exercise'})
        elif row_dict['exercise_level_Sedentary'] == 1.0:
            contributions.append({'factor': 'Sedentary Physical Activity', 'impact': 'Increases Risk', 'type': 'negative', 'detail': 'Sedentary'})

        if row_dict['chest_pain'] == 1.0 and disease == 'heart_disease':
            contributions.append({'factor': 'Reported Chest Pain', 'impact': 'Increases Risk', 'type': 'negative', 'detail': 'Active symptom'})
            
        if row_dict['dizziness'] == 1.0 and disease == 'stroke':
            contributions.append({'factor': 'Reported Dizziness', 'impact': 'Increases Risk', 'type': 'negative', 'detail': 'Active symptom'})

        return {
            'disease': disease,
            'probability': round(prob, 4),
            'probability_percent': round(prob * 100, 1),
            'risk_category': cat,
            'risk_color': risk_color,
            'factor_contributions': contributions,
            'population_benchmarks': POPULATION_BENCHMARKS,
            'patient_values': {
                'age': patient_age,
                'bmi': patient_bmi,
                'systolic_bp': patient_sys,
                'diastolic_bp': row_dict['diastolic_bp'],
                'cholesterol': patient_chol,
                'glucose': patient_gluc
            },
            'model_info': self.metrics.get(disease, {}),
            'disclaimer': 'This tool is for educational and analytical purposes only. It is not a medical diagnostic system and must not replace professional medical advice.'
        }

    def _rule_based_fallback(self, disease: str, input_dict: dict):
        # Educational rule-based demonstration if models have not finished fitting
        age = float(input_dict.get('age', 45))
        bmi = float(input_dict.get('bmi', 25.0))
        sbp = float(input_dict.get('systolic_bp', 120))
        chol = float(input_dict.get('cholesterol', 190))
        gluc = float(input_dict.get('glucose', 95))
        smoking = input_dict.get('smoking_status', 'Never')
        exercise = input_dict.get('exercise_level', 'Moderate')
        
        score = 0.1
        if age > 50: score += 0.15
        if sbp > 140: score += 0.2
        if bmi > 30: score += 0.15
        if chol > 220: score += 0.15
        if gluc > 125: score += 0.2
        if smoking == 'Current': score += 0.2
        if exercise == 'Sedentary': score += 0.1
        
        prob = min(max(score, 0.05), 0.95)
        cat = 'High' if prob > 0.5 else ('Moderate' if prob > 0.25 else 'Low')
        
        return {
            'disease': disease,
            'probability': round(prob, 3),
            'probability_percent': round(prob * 100, 1),
            'risk_category': cat,
            'risk_color': 'amber' if cat == 'High' else 'cyan',
            'factor_contributions': [],
            'population_benchmarks': POPULATION_BENCHMARKS,
            'patient_values': {'age': age, 'bmi': bmi, 'systolic_bp': sbp},
            'model_info': {'model_name': 'Educational Rule-Based Demo'},
            'disclaimer': 'This tool is for educational and analytical purposes only. It is not a medical diagnostic system and must not replace professional medical advice.'
        }

# Global singleton
ml_manager = MLModelManager()
