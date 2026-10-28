import unittest
from fastapi.testclient import TestClient
from app.main import app

class Health360ApiTests(unittest.TestCase):
    def test_all_endpoints(self):
        with TestClient(app) as client:
            # 1. Health check
            resp = client.get("/api/health")
            self.assertEqual(resp.status_code, 200)
            data = resp.json()
            self.assertEqual(data["status"], "online")
            self.assertGreater(data["active_records"], 0)

            # 2. Dashboard summary
            resp = client.get("/api/dashboard/summary")
            self.assertEqual(resp.status_code, 200)
            summary = resp.json()
            self.assertIn("kpis", summary)
            self.assertIn("disease_prevalence", summary)
            self.assertIn("age_group_analysis", summary)
            self.assertIn("bmi_distribution", summary)
            self.assertIn("correlation_matrix", summary)

            # 3. Disease endpoints
            for d in ["heart", "diabetes", "stroke"]:
                r = client.get(f"/api/diseases/{d}")
                self.assertEqual(r.status_code, 200)
                self.assertIn("prevalence_rate", r.json())

            # 4. Risk assessment
            payload = {
                "disease": "heart_disease",
                "age": 55,
                "bmi": 28.5,
                "systolic_bp": 142,
                "diastolic_bp": 88,
                "cholesterol": 230,
                "glucose": 105,
                "smoking_status": "Current",
                "alcohol_consumption": "Moderate",
                "exercise_level": "Sedentary",
                "chest_pain": 1,
                "fatigue": 0,
                "dizziness": 0
            }
            resp = client.post("/api/risk-assessment", json=payload)
            self.assertEqual(resp.status_code, 200)
            risk = resp.json()
            self.assertIn("probability", risk)
            self.assertIn("risk_category", risk)

            # 5. Patients pagination
            resp = client.get("/api/patients?page=1&page_size=5")
            self.assertEqual(resp.status_code, 200)
            p_data = resp.json()
            self.assertEqual(len(p_data["patients"]), 5)
            print("\n>>> All API tests passed successfully! <<<")

if __name__ == "__main__":
    unittest.main()
