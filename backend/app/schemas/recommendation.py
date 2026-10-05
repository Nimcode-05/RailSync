from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class RecoveryOption(BaseModel):
    option_id: str
    strategy_type: str # "PRECEDENCE_OVERTAKE", "PLATFORM_REALLOCATION", "DYNAMIC_SPEED_RECOVERY"
    title: str
    target_trains: List[str]
    location: str
    action_details: str
    baseline_network_delay_min: float
    simulated_network_delay_min: float
    delay_saved_min: float
    delay_reduction_percentage: float
    feasibility_score: float # 0.0 to 1.0 (based on platform availability and loop line clearance)
    recommended: bool

class SimulationResult(BaseModel):
    corridor: str
    active_disruptions_count: int
    baseline_network_delay_min: float
    optimized_network_delay_min: float
    total_delay_saved_min: float
    overall_reduction_pct: float
    recommended_action: RecoveryOption
    alternative_actions: List[RecoveryOption]
    timestamp: datetime
