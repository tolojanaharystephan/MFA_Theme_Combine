from app.schemas import AssignmentRecommendationRequest, Recommendation, RecommendationResponse


RISK_WEIGHT = {
    "LOW": 0.8,
    "MEDIUM": 1.0,
    "HIGH": 1.15,
    "CRITICAL": 1.25,
}


def recommend_assignments(payload: AssignmentRecommendationRequest) -> RecommendationResponse:
    recommendations: list[Recommendation] = []
    required = set(skill.lower() for skill in payload.required_skills)
    risk_weight = RISK_WEIGHT.get(payload.risk_level.upper(), 1.0)

    for candidate in payload.candidates:
        candidate_skills = set(skill.lower() for skill in candidate.skills)
        matching_skills = required.intersection(candidate_skills)
        skill_score = len(matching_skills) / max(len(required), 1)
        experience_score = min(candidate.experience_years / 10, 1)
        load_penalty = min(candidate.recent_mission_load * 0.08, 0.35)

        score = (
            (skill_score * 0.48)
            + (candidate.availability * 0.28)
            + (experience_score * 0.18)
            - load_penalty
        ) * 100
        score = max(0, min(score * risk_weight, 100))

        reasons = [
            f"{len(matching_skills)} competence(s) requise(s) correspondante(s)",
            f"Disponibilite estimee a {candidate.availability * 100:.0f}%",
            f"Experience operationnelle: {candidate.experience_years:.1f} an(s)",
        ]
        if load_penalty > 0:
            reasons.append("Penalite appliquee pour charge operationnelle recente")

        recommendations.append(
            Recommendation(
                candidate_id=candidate.id,
                full_name=candidate.full_name,
                score=round(score, 2),
                reasons=reasons,
            )
        )

    recommendations.sort(key=lambda item: item.score, reverse=True)
    return RecommendationResponse(mission_id=payload.mission_id, recommendations=recommendations[:10])

