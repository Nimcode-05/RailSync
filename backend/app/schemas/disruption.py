from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class DisruptionBase(BaseModel):
    section_name: str
    start_station_code: str
    end_station_code: str
    disruption_type: str
    severity: str
    speed_cap_kmh: float
    description: str
    lead_time_min: int

class DisruptionCreate(DisruptionBase):
    pass

class DisruptionResponse(DisruptionBase):
    id: int
    is_active: bool
    detected_at: datetime

    class Config:
        from_attributes = True
