from app.schemas import Anomaly, AnomalyRequest, AnomalyResponse


def detect_anomalies(payload: AnomalyRequest) -> AnomalyResponse:
    anomalies: list[Anomaly] = []

    for unit, workload in payload.unit_workloads.items():
        if workload >= 8:
            anomalies.append(
                Anomaly(level="HIGH", message=f"Surcharge probable detectee pour {unit}: {workload} missions")
            )
        elif workload >= 5:
            anomalies.append(
                Anomaly(level="MEDIUM", message=f"Charge operationnelle elevee pour {unit}: {workload} missions")
            )

    for skill in payload.missing_critical_skills:
        anomalies.append(
            Anomaly(level="CRITICAL", message=f"Competence critique manquante: {skill}")
        )

    return AnomalyResponse(anomalies=anomalies)

