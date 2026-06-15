from fastapi import FastAPI
from app.schemas import AssignmentRecommendationRequest, AnomalyRequest
from app.services.anomaly_service import detect_anomalies
from app.services.recommendation_service import recommend_assignments

app = FastAPI(
    title="MFA AI Service",
    description="Microservice IA pour recommandations, scoring et anomalies",
    version="0.1.0",
)


@app.get("/health")
def health():
    return {"service": "mfa-ai-service", "status": "ok"}


@app.post("/recommendations/assignments")
def recommendations(payload: AssignmentRecommendationRequest):
    return recommend_assignments(payload)


@app.post("/anomalies")
def anomalies(payload: AnomalyRequest):
    return detect_anomalies(payload)

