from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class StationETAResult(BaseModel):
    station_code: str
    station_name: str
    distance_km: float
    scheduled_arrival: str
    predicted_eta: str # "HH:MM"
    predicted_delay_min: float
    confidence_interval_min: float # +/- margin (e.g. 2.5 min)
    weather_impact_delay_min: float
    congestion_impact_delay_min: float

class TrainETAResponse(BaseModel):
    train_number: str
    train_name: str
    train_type: str
    current_station_code: str
    current_speed_kmh: float
    current_delay_min: float
    status: str
    station_etas: List[StationETAResult]
    model_metadata: Dict[str, Any]

class AffectedDownstreamTrain(BaseModel):
    train_number: str
    train_name: str
    train_type: str
    priority: int
    original_delay_min: float
    knock_on_delay_min: float
    total_projected_delay_min: float
    conflict_location: str
    conflict_cause: str # "HEADWAY_VIOLATION_BLOCK", "PLATFORM_OCCUPANCY_CONFLICT", "SINGLE_LINE_BOTTLENECK"
    risk_level: str # "CRITICAL", "HIGH", "MEDIUM"

class PropagationResponse(BaseModel):
    source_train_number: str
    source_delay_min: float
    total_network_knockon_delay_min: float
    affected_trains_count: int
    affected_trains: List[AffectedDownstreamTrain]
    congested_sections: List[str]
    critical_junction_bottlenecks: List[str]
    system_risk_index: str # "RED - HIGH RISK", "YELLOW - MODERATE", "GREEN - STABLE"
