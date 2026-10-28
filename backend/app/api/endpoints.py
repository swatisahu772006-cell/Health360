import os
from fastapi import APIRouter, Query, HTTPException, UploadFile, File
from fastapi.responses import FileResponse, JSONResponse
from typing import Optional

from app.services.data_service import data_service
from app.services.ml_service import ml_manager
from app.schemas.healthcare_schemas import RiskAssessmentRequest, ReportRequest

router = APIRouter()

@router.get("/health")
async def health_check():
    return {
        "status": "online",
        "service": "Health360 Analytics Platform",
        "version": "1.0.0",
        "active_records": len(data_service.raw_df),
        "is_custom_dataset": data_service.is_custom_dataset
    }

@router.get("/dashboard/summary")
async def get_dashboard_summary(
    age_group: Optional[str] = Query(None),
    bmi_category: Optional[str] = Query(None),
    disease: Optional[str] = Query(None),
    smoking_status: Optional[str] = Query(None),
    exercise_level: Optional[str] = Query(None),
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    search: Optional[str] = Query(None)
):
    filtered_df = data_service.filter_data(
        age_group=age_group,
        bmi_category=bmi_category,
        disease=disease,
        smoking_status=smoking_status,
        exercise_level=exercise_level,
        start_date=start_date,
        end_date=end_date,
        search=search
    )
    summary = data_service.get_summary(filtered_df)
    prevalence = data_service.get_prevalence_distribution(filtered_df)
    age_analysis = data_service.get_age_group_analysis(filtered_df)
    bmi_dist = data_service.get_bmi_distribution(filtered_df)
    corr_matrix = data_service.get_correlation_matrix(filtered_df)
    lifestyle = data_service.get_lifestyle_insights(filtered_df)

    return {
        "kpis": summary,
        "disease_prevalence": prevalence,
        "age_group_analysis": age_analysis,
        "bmi_distribution": bmi_dist,
        "correlation_matrix": corr_matrix,
        "lifestyle": lifestyle
    }

@router.get("/diseases/prevalence")
async def get_prevalence(
    age_group: Optional[str] = Query(None),
    bmi_category: Optional[str] = Query(None),
    smoking_status: Optional[str] = Query(None),
    exercise_level: Optional[str] = Query(None)
):
    df = data_service.filter_data(
        age_group=age_group,
        bmi_category=bmi_category,
        smoking_status=smoking_status,
        exercise_level=exercise_level
    )
    return data_service.get_prevalence_distribution(df)

@router.get("/diseases/heart")
async def get_heart_disease_analysis():
    return data_service.get_disease_detail('heart', data_service.raw_df)

@router.get("/diseases/diabetes")
async def get_diabetes_analysis():
    return data_service.get_disease_detail('diabetes', data_service.raw_df)

@router.get("/diseases/stroke")
async def get_stroke_analysis():
    return data_service.get_disease_detail('stroke', data_service.raw_df)

@router.get("/analytics/demographics")
async def get_demographics(
    age_group: Optional[str] = Query(None),
    bmi_category: Optional[str] = Query(None),
    disease: Optional[str] = Query(None)
):
    df = data_service.filter_data(age_group=age_group, bmi_category=bmi_category, disease=disease)
    return data_service.get_demographics(df)

@router.get("/analytics/lifestyle")
async def get_lifestyle(
    age_group: Optional[str] = Query(None),
    bmi_category: Optional[str] = Query(None),
    disease: Optional[str] = Query(None)
):
    df = data_service.filter_data(age_group=age_group, bmi_category=bmi_category, disease=disease)
    return data_service.get_lifestyle_insights(df)

@router.get("/patients")
async def get_patients(
    page: int = Query(1, ge=1),
    page_size: int = Query(15, ge=1, le=100),
    sort_by: str = Query('patient_id'),
    sort_dir: str = Query('asc'),
    age_group: Optional[str] = Query(None),
    bmi_category: Optional[str] = Query(None),
    disease: Optional[str] = Query(None),
    smoking_status: Optional[str] = Query(None),
    exercise_level: Optional[str] = Query(None),
    search: Optional[str] = Query(None)
):
    df = data_service.filter_data(
        age_group=age_group,
        bmi_category=bmi_category,
        disease=disease,
        smoking_status=smoking_status,
        exercise_level=exercise_level,
        search=search
    )
    return data_service.get_patients_paged(
        df, page=page, page_size=page_size, sort_by=sort_by, sort_dir=sort_dir
    )

@router.get("/patients/{patient_id}")
async def get_patient_detail(patient_id: str):
    patient = data_service.get_patient_by_id(patient_id)
    if not patient:
        raise HTTPException(status_code=404, detail=f"Patient with ID {patient_id} not found.")
    return patient

@router.post("/risk-assessment")
async def assess_risk(req: RiskAssessmentRequest):
    result = ml_manager.predict(req.disease, req.model_dump())
    return result

@router.post("/data/upload")
async def upload_csv(file: UploadFile = File(...)):
    # Security checks: file type and size
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files (.csv) are accepted.")
    
    contents = await file.read()
    if len(contents) > 10 * 1024 * 1024: # 10MB limit
        raise HTTPException(status_code=400, detail="Uploaded file exceeds 10MB limit.")

    result = data_service.process_csv_upload(contents, file.filename)
    if not result.get("success"):
        raise HTTPException(status_code=400, detail=result.get("error", "CSV parsing failed."))

    # Retrain ML models on the newly uploaded data if compatible
    try:
        if len(data_service.raw_df) >= 50 and 'heart_disease' in data_service.raw_df.columns:
            # write temporary CSV and train
            tmp_path = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'temp_uploaded.csv')
            data_service.raw_df.to_csv(tmp_path, index=False)
            ml_manager.train_models(tmp_path)
    except Exception as e:
        # non-fatal: fallback to existing or rule-based
        print(f"Retraining on uploaded dataset failed: {e}")

    return result

@router.post("/data/reset")
async def reset_dataset():
    data_service.reset_to_default()
    csv_path = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'patients_synthetic.csv')
    if os.path.exists(csv_path):
        ml_manager.train_models(csv_path)
    return {
        "status": "success",
        "message": "Dataset reset to default benchmark cohort.",
        "active_records": len(data_service.raw_df)
    }

@router.get("/data/sample")
async def download_sample():
    csv_path = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'patients_synthetic.csv')
    if not os.path.exists(csv_path):
        raise HTTPException(status_code=404, detail="Sample dataset not found.")
    return FileResponse(
        csv_path,
        media_type='text/csv',
        filename='health360_sample_patient_cohort.csv'
    )

@router.get("/reports/summary")
async def generate_report_summary(
    disease: Optional[str] = Query("All"),
    age_group: Optional[str] = Query("All"),
    bmi_category: Optional[str] = Query("All"),
    smoking_status: Optional[str] = Query("All"),
    exercise_level: Optional[str] = Query("All"),
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None)
):
    df = data_service.filter_data(
        disease=disease,
        age_group=age_group,
        bmi_category=bmi_category,
        smoking_status=smoking_status,
        exercise_level=exercise_level,
        start_date=start_date,
        end_date=end_date
    )

    kpis = data_service.get_summary(df)
    prevalence = data_service.get_prevalence_distribution(df)
    demographics = data_service.get_demographics(df)
    lifestyle = data_service.get_lifestyle_insights(df)

    return {
        "report_id": f"RPT-{int(os.urandom(3).hex(), 16)}",
        "generated_at": data_service.raw_df['record_date'].max() if 'record_date' in data_service.raw_df.columns else "2026-10-28",
        "filters_applied": {
            "disease": disease,
            "age_group": age_group,
            "bmi_category": bmi_category,
            "smoking_status": smoking_status,
            "exercise_level": exercise_level,
            "start_date": start_date or "Earliest",
            "end_date": end_date or "Latest"
        },
        "kpis": kpis,
        "prevalence": prevalence,
        "demographics": demographics,
        "lifestyle": lifestyle,
        "data_quality_limitations": [
            "Cross-sectional analytical cohort; does not support longitudinal causal tracking.",
            "De-identified synthetic benchmark records calibrated to CDC/AHA prevalence statistics.",
            "BMI represents an anthropometric screening indicator, not an exhaustive adiposity or metabolic diagnosis.",
            "Small demographic subsets (N < 15) should be interpreted with statistical caution."
        ],
        "disclaimer": "This analytical summary is generated exclusively for clinical research, public health surveillance demonstrations, and educational support. It does not constitute medical diagnosis or therapeutic treatment recommendations."
    }
