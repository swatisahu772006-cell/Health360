import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.endpoints import router as api_router
from app.services.data_service import data_service, DEFAULT_CSV_PATH
from app.services.ml_service import ml_manager

# Ensure models are trained and ready
try:
    data_service.load_data()
    if os.path.exists(DEFAULT_CSV_PATH):
        print("Calibrating ML models on benchmark cohort...")
        ml_manager.train_models(DEFAULT_CSV_PATH)
        print("ML models ready.")
except Exception as e:
    print(f"Warning during model initialization: {e}")

app = FastAPI(
    title="Health360 — Comprehensive Healthcare Risk & Disease Analytics API",
    description="Production-grade REST API powering multi-disease prevalence exploration, clinical risk assessment, demographic analysis, and synthetic cohort surveillance.",
    version="1.0.0"
)

# CORS configuration
allowed_origins_env = os.getenv("ALLOWED_ORIGINS", "*")
origins = [origin.strip() for origin in allowed_origins_env.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins if "*" not in origins else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")

@app.get("/")
def root():
    return {
        "platform": "Health360 Healthcare Risk & Disease Analytics",
        "api_docs": "/docs",
        "health_check": "/api/health",
        "status": "active"
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
