# Health360 REST API Reference Manual

Base Path: `/api`

### Core Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Service health status, record count, and telemetry. |
| `GET` | `/api/dashboard/summary` | Aggregated executive KPIs, disease prevalence, BMI distribution, correlation matrix, and lifestyle statistics. Supports filtering. |
| `GET` | `/api/diseases/prevalence` | Multi-condition prevalence rates across active filters. |
| `GET` | `/api/diseases/heart` | Detailed heart disease metrics, risk distribution, and vital comparisons. |
| `GET` | `/api/diseases/diabetes` | Fasting glucose, BMI classification, and fatigue incidence for diabetes. |
| `GET` | `/api/diseases/stroke` | Blood pressure distribution and cerebrovascular risk indicators. |
| `GET` | `/api/analytics/demographics` | Age histograms, biological sex comparisons, and age-disease heatmaps. |
| `GET` | `/api/analytics/lifestyle` | Stratified lifestyle associations and dynamically generated odds/risk ratios. |
| `GET` | `/api/patients` | Paginated, sortable, and searchable patient registry. |
| `GET` | `/api/patients/{patient_id}` | Detailed clinical record drawer data for an individual patient. |
| `POST` | `/api/risk-assessment` | Evaluates simulated patient attributes using calibrated ML models. |
| `POST` | `/api/data/upload` | Validates, sanitizes, and ingests user-uploaded CSV cohorts. |
| `POST` | `/api/data/reset` | Resets active dataset back to the 1,500 patient benchmark cohort. |
| `GET` | `/api/data/sample` | Downloads the sample patient CSV file. |
| `GET` | `/api/reports/summary` | Compiles an institutional surveillance report with limitations and disclaimer. |
