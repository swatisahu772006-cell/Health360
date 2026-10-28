from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class RiskAssessmentRequest(BaseModel):
    disease: str = Field(..., description="Target disease to assess: heart_disease, diabetes, or stroke")
    age: float = Field(..., ge=18, le=110, description="Patient age in years")
    bmi: float = Field(..., ge=10.0, le=70.0, description="Body Mass Index (kg/m²)")
    systolic_bp: float = Field(..., ge=60, le=260, description="Systolic blood pressure (mmHg)")
    diastolic_bp: float = Field(..., ge=40, le=160, description="Diastolic blood pressure (mmHg)")
    cholesterol: float = Field(..., ge=80, le=500, description="Total serum cholesterol (mg/dL)")
    glucose: float = Field(..., ge=40, le=450, description="Fasting blood glucose (mg/dL)")
    smoking_status: str = Field("Never", description="Never, Former, or Current")
    alcohol_consumption: str = Field("None", description="None, Moderate, or Heavy")
    exercise_level: str = Field("Moderate", description="Sedentary, Light, Moderate, or Active")
    chest_pain: int = Field(0, ge=0, le=1, description="1 if experiencing chest pain/pressure, else 0")
    fatigue: int = Field(0, ge=0, le=1, description="1 if experiencing unusual fatigue, else 0")
    dizziness: int = Field(0, ge=0, le=1, description="1 if experiencing dizziness/lightheadedness, else 0")

class ReportRequest(BaseModel):
    disease: Optional[str] = "All"
    age_group: Optional[str] = "All"
    bmi_category: Optional[str] = "All"
    smoking_status: Optional[str] = "All"
    exercise_level: Optional[str] = "All"
    start_date: Optional[str] = None
    end_date: Optional[str] = None
