from pydantic import BaseModel, Field


class Candidate(BaseModel):
    id: str
    full_name: str
    rank: str
    skills: list[str] = Field(default_factory=list)
    availability: float = Field(ge=0, le=1)
    experience_years: float = Field(ge=0)
    recent_mission_load: int = Field(ge=0)


class AssignmentRecommendationRequest(BaseModel):
    mission_id: str
    required_skills: list[str] = Field(default_factory=list)
    risk_level: str = "MEDIUM"
    candidates: list[Candidate] = Field(default_factory=list)


class Recommendation(BaseModel):
    candidate_id: str
    full_name: str
    score: float
    reasons: list[str]


class RecommendationResponse(BaseModel):
    mission_id: str
    recommendations: list[Recommendation]


class AnomalyRequest(BaseModel):
    unit_workloads: dict[str, int] = Field(default_factory=dict)
    missing_critical_skills: list[str] = Field(default_factory=list)


class Anomaly(BaseModel):
    level: str
    message: str


class AnomalyResponse(BaseModel):
    anomalies: list[Anomaly]

