# Health360 System Architecture & Technical Specifications

Health360 is built as a modular, production-ready healthcare analytics platform designed for high-concurrency epidemiological surveillance, multi-disease risk factor exploration, and responsible clinical decision support.

```mermaid
graph TD
    User([Healthcare Researcher / Clinician]) -->|HTTPS / WSS| Frontend[React 18 + Vite + TypeScript]
    
    subgraph Frontend Architecture
        Frontend --> Router[Client-Side Router & Navigation]
        Router --> P1[Overview Dashboard]
        Router --> P2[Patient Analytics Registry]
        Router --> P3[Disease Phenotype Analysis]
        Router --> P4[ML Risk Assessment Engine]
        Router --> P5[Lifestyle Modifiable Risk Insights]
        Router --> P6[Demographic Cohort Pyramids]
        Router --> P7[Data Explorer & CSV Ingestion]
        Router --> P8[Surveillance Report Generator]
        Router --> P9[Platform Settings & Telemetry]
        
        Frontend --> Cache[Client-Side Analytical Engine & Fallback]
    end
    
    Frontend -->|REST JSON API| FastAPI[FastAPI REST Backend]
    
    subgraph Backend Architecture
        FastAPI --> CORS[CORS Middleware & Security Headers]
        FastAPI --> Endpoints[API Route Handlers]
        Endpoints --> DataSvc[Data & Aggregation Service]
        Endpoints --> MLSvc[Machine Learning Service]
        
        DataSvc --> PandasEngine[Pandas & NumPy Vectorized Compute]
        MLSvc --> SklearnModels[Stratified Random Forest & Logistic Classifiers]
        
        DataSvc --> BenchmarkData[(Synthetic CDC/AHA Benchmark Cohort N=1,500)]
        DataSvc --> CustomData[(Ingested Custom CSV Datasets)]
    end
```

## Key Architectural Principles

1. **Deterministic Separation of Concerns**:
   - The backend handles data parsing, type validation, statistical computation, stratification, and ML model fitting with proper train/test partitioning.
   - The frontend renders responsive, accessible visualizations using Recharts and Tailwind CSS with instant client-side fallback handling.

2. **Data Leakage Safeguards**:
   - Machine learning pipelines partition training and testing data using stratified 80/20 splits before applying StandardScaler and dummy variables, preventing test-set contamination.

3. **Responsible Clinical AI & Guardrails**:
   - Prevalence rates explicitly cite valid non-null denominators ($N_{valid}$).
   - Statistical correlations display mandatory notices stating that correlation does not establish causation.
   - Small demographic sub-cohorts ($N < 15$) are visually flagged with low-sample warnings.
   - All analytical screens include non-diagnostic educational disclaimers.
