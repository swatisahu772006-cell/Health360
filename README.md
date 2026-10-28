# Health360 — Comprehensive Healthcare Risk & Disease Analytics

[![License: MIT](https://img.shields.io/badge/License-MIT-teal.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20TypeScript-blue.svg)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/Backend-Python%20FastAPI-009688.svg)](https://fastapi.tiangolo.com/)
[![Scikit-Learn](https://img.shields.io/badge/ML-Scikit--Learn%20Validated-orange.svg)](https://scikit-learn.org/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC.svg)](https://tailwindcss.com/)

---

## Live Demo
🚀 **[https://health360-site.netlify.app](https://health360-site.netlify.app)**

## Repository
🔗 **[https://github.com/swatisahu772006-cell/Health360](https://github.com/swatisahu772006-cell/Health360)**

---

## Table of Contents
- [Project Overview](#project-overview)
- [Problem Statement](#problem-statement)
- [Proposed Solution](#proposed-solution)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Dashboard Pages](#dashboard-pages)
- [Screenshots](#screenshots)
- [Installation & Local Setup](#installation--local-setup)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
- [Dataset & Analytics](#dataset--analytics)
- [Healthcare Disclaimer](#healthcare-disclaimer)
- [Future Enhancements](#future-enhancements)
- [Author & Links](#author--links)
- [License](#license)

---

## Project Overview
Health360 is a full‑stack analytics platform that enables healthcare professionals and researchers to explore disease prevalence, patient demographics, clinical indicators, and lifestyle patterns for **Heart Disease**, **Diabetes**, and **Stroke**. The application visualises synthetic benchmark data through interactive dashboards, filters, and a searchable patient registry.

---

## Problem Statement
Identifying disease patterns and high‑risk patient profiles across large clinical datasets is challenging due to:
- Fragmented data sources and limited cross‑condition visibility.
- Black‑box risk models lacking transparent feature attribution.
- Absence of intuitive visual tools for rapid exploration of demographic and lifestyle associations.

---

## Proposed Solution
Health360 provides an interactive web UI that consolidates synthetic patient data, enabling users to:
- View executive KPI cards and trend visualisations.
- Filter and sort a detailed patient table.
- Analyse disease prevalence, BMI, age‑group distributions, and lifestyle risk factors.
- Run an educational risk‑assessment model with transparent contributions.
- Upload custom CSV cohorts for ad‑hoc analysis (fallback to local synthetic data when offline).

---

## Key Features
- **Healthcare analytics dashboard** with KPI cards.
- **Disease prevalence analysis** (Heart Disease, Diabetes, Stroke).
- **Patient demographics** visualisation.
- **BMI & age‑group analysis**.
- **Lifestyle insights** (smoking, alcohol, exercise).
- **Interactive charts** (Recharts) with filters and tooltips.
- **CSV upload & data explorer** (client‑side fallback).
- **Risk assessment** (rule‑based fallback when backend unavailable).
- **Report generation** (JSON summary used for printable reports).

---

## Technology Stack
### Frontend
- React 18 + Vite (TypeScript)
- Tailwind CSS
- Recharts for charts & Lucide React icons
- Vite build (`npm run build`) → `dist`

### Backend
- Python 3.13 + FastAPI
- Pandas & NumPy for data processing
- Scikit‑Learn RandomForest classifier (trained on synthetic data)
- SQLite (for future persistence – not required for the demo)
- Deployed on Render (placeholder – run locally for this repo)

---

## Dashboard Pages
| Page | Description |
|------|-------------|
| **Overview** | Executive KPI cards, disease prevalence bar chart, age‑group and BMI distribution charts. |
| **Patient Analytics** | Searchable, sortable table with filters for age, BMI, disease status, smoking, and exercise. |
| **Disease Analysis** | Deep‑dive visualisations for each disease, including prevalence by age and BMI. |
| **Risk Assessment** | Form to input patient metrics and view a risk score with factor contributions. |
| **Lifestyle Insights** | Visualise disease rates across smoking, alcohol, and activity levels. |
| **Demographics** | Age and sex distribution heatmaps. |
| **Data Explorer** | Upload a CSV cohort and explore statistics client‑side. |
| **Reports** | Generate a JSON summary that can be exported as a PDF (client‑side). |
| **Settings** | Theme toggle (light/dark) and API base‑URL configuration. |

---

## Screenshots
*(Replace placeholders with actual screenshots stored in `docs/screenshots/` when available.)*

| Overview | Patient Analytics |
|---|---|
| ![Overview Dashboard](docs/screenshots/overview_dashboard.png) | ![Patient Registry](docs/screenshots/patient_analytics.png) |

| Disease Analysis | Risk Assessment |
|---|---|
| ![Disease Analysis](docs/screenshots/disease_analysis.png) | ![Risk Predictor](docs/screenshots/risk_assessment.png) |

---

## Installation & Local Setup
### Prerequisites
- Node.js ≥ 18
- npm ≥ 9
- Python ≥ 3.10

### Clone the repository
```bash
git clone https://github.com/swatisahu772006-cell/Health360.git
cd Health360
```
### Backend
```bash
cd backend
python -m venv venv
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
The API docs are available at `http://localhost:8000/docs`.

### Frontend
```bash
cd ../frontend
npm install
npm run dev
```
Open `http://localhost:5173` in a browser. The frontend will communicate with the local backend at `http://localhost:8000`.

---

## Environment Variables
### Frontend (`frontend/.env.example`)
```ini
VITE_API_BASE_URL=http://localhost:8000
```
### Backend (`backend/.env.example`)
```ini
PORT=8000
ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
ENVIRONMENT=development
```
Copy the example files to `.env` before running.

---

## Project Structure
```
health360/
├─ backend/
│   ├─ app/
│   │   ├─ api/
│   │   ├─ models/
│   │   ├─ schemas/
│   │   ├─ services/
│   │   └─ main.py
│   ├─ data/
│   │   └─ patients_synthetic.csv
│   ├─ requirements.txt
│   └─ render.yaml
├─ frontend/
│   ├─ public/
│   ├─ src/
│   │   ├─ charts/
│   │   ├─ components/layout/
│   │   ├─ pages/
│   │   └─ services/api.ts
│   ├─ netlify.toml
│   └─ package.json
├─ docs/
│   ├─ ARCHITECTURE.md
│   └─ API_DOCUMENTATION.md
├─ .gitignore
├─ LICENSE
└─ README.md
```

---

## Deployment
The frontend is deployed on Netlify:
- **Live URL:** https://health360-site.netlify.app
- Netlify build command: `npm run build`
- Publish directory: `dist`

The backend can be deployed to any Python‑compatible platform (e.g., Render) using the provided `render.yaml`. In this repository the backend runs locally.

---

## Dataset & Analytics
Health360 ships with a synthetic dataset (`backend/data/patients_synthetic.csv`) containing 1,500 anonymised patient records calibrated to CDC/NHANES, AHA, and ADA prevalence statistics. All calculations (KPIs, prevalence rates, correlation matrices, risk scores) are performed on this dataset. No real patient data is used.

---

## Healthcare Disclaimer
> **IMPORTANT MEDICAL NOTICE:** Health360 is an educational, research‑oriented prototype. It does **not** provide medical diagnoses, treatment recommendations, or clinical advice. The synthetic data and risk model are for demonstration only and have not been validated for clinical use.

---

## Future Enhancements
- Implement proper CI/CD integration for automatic Netlify deployments.
- Deploy the FastAPI backend to a production environment (Render, Fly.io, etc.) and expose a stable API URL.
- Add server‑side authentication and role‑based access control.
- Optimize bundle size with code‑splitting (`dynamic import()`).
- Expand analytics with additional ML models and longitudinal data support.

---

## Author & Links
- **GitHub:** https://github.com/swatisahu772006-cell
- **Live Demo:** https://health360-site.netlify.app

---

## License
Distributed under the MIT License. See the `LICENSE` file for details.
