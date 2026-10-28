import numpy as np
import pandas as pd
import os
from datetime import datetime, timedelta

def generate_synthetic_healthcare_dataset(n_patients=1500, random_state=42):
    np.random.seed(random_state)
    
    patient_ids = [f"P-{1000 + i}" for i in range(1, n_patients + 1)]
    
    # Age: realistic general population age distribution (18-86)
    ages = np.clip(np.concatenate([
        np.random.normal(36, 11, int(n_patients * 0.45)),
        np.random.normal(63, 10, int(n_patients * 0.55))
    ]), 18, 86).astype(int)
    np.random.shuffle(ages)
    
    sexes = np.random.choice(['Male', 'Female'], size=n_patients, p=[0.49, 0.51])
    
    # BMI: Normal mean ~ 26.8, std 5.2
    bmis = np.round(np.clip(np.random.normal(26.8, 5.2, size=n_patients), 17.0, 46.5), 1)
    
    # Systolic & Diastolic BP correlated with age and BMI
    base_sys = 104 + (ages * 0.32) + (bmis * 0.45) + np.random.normal(0, 11, size=n_patients)
    systolic_bp = np.clip(base_sys, 92, 195).astype(int)
    
    base_dia = 62 + (systolic_bp * 0.16) + (bmis * 0.25) + np.random.normal(0, 7, size=n_patients)
    diastolic_bp = np.clip(base_dia, 58, 118).astype(int)
    
    # Cholesterol: normal 140-200, borderline 200-239, high > 240
    cholesterol = np.clip(
        145 + (ages * 0.45) + (bmis * 0.6) + np.random.normal(0, 30, size=n_patients),
        115, 330
    ).astype(int)
    
    # Fasting blood glucose
    glucose_base = 78 + (bmis * 0.75) + (ages * 0.18) + np.random.normal(0, 12, size=n_patients)
    diabetic_surge = np.random.choice([0, 45, 90], size=n_patients, p=[0.75, 0.16, 0.09])
    glucose = np.clip(glucose_base + diabetic_surge, 65, 275).astype(int)
    
    # Lifestyle factors
    smoking_options = ['Never', 'Former', 'Current']
    smoking_status = np.random.choice(smoking_options, size=n_patients, p=[0.56, 0.26, 0.18])
    
    alcohol_options = ['None', 'Moderate', 'Heavy']
    alcohol_consumption = np.random.choice(alcohol_options, size=n_patients, p=[0.52, 0.38, 0.10])
    
    exercise_options = ['Sedentary', 'Light', 'Moderate', 'Active']
    exercise_level = np.random.choice(exercise_options, size=n_patients, p=[0.30, 0.36, 0.22, 0.12])
    
    # Symptoms
    chest_pain_prob = np.clip(0.04 + (ages > 55) * 0.10 + (systolic_bp > 140) * 0.12 + (smoking_status == 'Current') * 0.08, 0.02, 0.45)
    chest_pain = (np.random.rand(n_patients) < chest_pain_prob).astype(int)
    
    fatigue_prob = np.clip(0.08 + (bmis > 30) * 0.12 + (glucose > 130) * 0.16 + (exercise_level == 'Sedentary') * 0.12, 0.04, 0.5)
    fatigue = (np.random.rand(n_patients) < fatigue_prob).astype(int)
    
    dizziness_prob = np.clip(0.04 + (systolic_bp > 150) * 0.14 + (systolic_bp < 100) * 0.12 + (ages > 65) * 0.10, 0.02, 0.4)
    dizziness = (np.random.rand(n_patients) < dizziness_prob).astype(int)
    
    # Calibrated Disease Outcomes matching CDC / WHO prevalence rates:
    # 1. Heart Disease (~ 19%)
    hd_logit = (
        -3.2 +
        (ages - 50) * 0.045 +
        (systolic_bp - 125) * 0.028 +
        (cholesterol - 200) * 0.015 +
        (bmis - 26) * 0.035 +
        (smoking_status == 'Current') * 0.65 +
        (smoking_status == 'Former') * 0.20 +
        (exercise_level == 'Sedentary') * 0.35 -
        (exercise_level == 'Active') * 0.45 +
        chest_pain * 1.1 +
        (sexes == 'Male') * 0.30
    )
    hd_prob = 1 / (1 + np.exp(- hd_logit))
    heart_disease = (np.random.rand(n_patients) < hd_prob).astype(int)
    
    # 2. Diabetes (~ 16%)
    db_logit = (
        -3.4 +
        (glucose - 105) * 0.055 +
        (bmis - 27) * 0.075 +
        (ages - 48) * 0.030 +
        (exercise_level == 'Sedentary') * 0.40 -
        (exercise_level == 'Active') * 0.40 +
        fatigue * 0.40
    )
    db_prob = 1 / (1 + np.exp(- db_logit))
    diabetes = (np.random.rand(n_patients) < db_prob).astype(int)
    diabetes = np.where(glucose >= 155, 1, diabetes)
    diabetes = np.where(glucose < 90, 0, diabetes)
    
    # 3. Stroke (~ 8%)
    str_logit = (
        -4.0 +
        (ages - 58) * 0.055 +
        (systolic_bp - 135) * 0.038 +
        (smoking_status == 'Current') * 0.70 +
        heart_disease * 0.90 +
        diabetes * 0.70 +
        (bmis - 28) * 0.03 +
        dizziness * 0.60
    )
    str_prob = 1 / (1 + np.exp(- str_logit))
    stroke = (np.random.rand(n_patients) < str_prob).astype(int)
    
    # Record dates over the last 12 months
    base_date = datetime.now() - timedelta(days=365)
    random_days = np.random.randint(0, 365, size=n_patients)
    record_dates = [(base_date + timedelta(days=int(d))).strftime('%Y-%m-%d') for d in random_days]
    
    # Composite Risk Tier
    disease_count = heart_disease + diabetes + stroke
    vitals_risk = (
        (systolic_bp >= 140).astype(int) * 2 +
        (systolic_bp >= 160).astype(int) * 2 +
        (cholesterol >= 240).astype(int) * 2 +
        (glucose >= 126).astype(int) * 2 +
        (bmis >= 30).astype(int) * 2 +
        (smoking_status == 'Current').astype(int) * 2 +
        (ages >= 65).astype(int) * 2
    )
    composite_points = disease_count * 4 + vitals_risk
    
    risk_categories = []
    for pts in composite_points:
        if pts >= 10:
            risk_categories.append('Critical')
        elif pts >= 6:
            risk_categories.append('High')
        elif pts >= 3:
            risk_categories.append('Moderate')
        else:
            risk_categories.append('Low')
            
    df = pd.DataFrame({
        'patient_id': patient_ids,
        'age': ages,
        'sex': sexes,
        'bmi': bmis,
        'systolic_bp': systolic_bp,
        'diastolic_bp': diastolic_bp,
        'cholesterol': cholesterol,
        'glucose': glucose,
        'smoking_status': smoking_status,
        'alcohol_consumption': alcohol_consumption,
        'exercise_level': exercise_level,
        'chest_pain': chest_pain,
        'fatigue': fatigue,
        'dizziness': dizziness,
        'heart_disease': heart_disease,
        'diabetes': diabetes,
        'stroke': stroke,
        'risk_category': risk_categories,
        'record_date': record_dates
    })
    
    return df

if __name__ == '__main__':
    df = generate_synthetic_healthcare_dataset(1500)
    
    os.makedirs('health360/backend/data', exist_ok=True)
    os.makedirs('health360/frontend/public', exist_ok=True)
    
    csv_path = 'health360/backend/data/patients_synthetic.csv'
    public_csv_path = 'health360/frontend/public/sample_patient_data.csv'
    
    df.to_csv(csv_path, index=False)
    df.to_csv(public_csv_path, index=False)
    
    print(f"Generated {len(df)} synthetic patient records.")
    print("Heart disease prevalence:", f"{df['heart_disease'].mean()*100:.2f}%")
    print("Diabetes prevalence:", f"{df['diabetes'].mean()*100:.2f}%")
    print("Stroke prevalence:", f"{df['stroke'].mean()*100:.2f}%")
    print("Risk categories count:\n", df['risk_category'].value_counts())
