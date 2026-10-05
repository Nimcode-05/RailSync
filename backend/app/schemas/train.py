from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class ScheduleItem(BaseModel):
    station_code: str
    station_name: str
    stop_sequence: int
    distance_km: float
    scheduled_arrival: str
    scheduled_departure: str
    platform_number: int

    class Config:
        from_attributes = True

class TrainBase(BaseModel):
    train_number: str
    train_name: str
    train_type: str
    priority: int
    max_speed: float
    current_station_code: str
    next_station_code: str
    current_speed: float
    current_delay_min: float
    status: str
    direction: str

class TrainResponse(TrainBase):
    id: int
    current_lat: Optional[float] = None
    current_lon: Optional[float] = None
    updated_at: Optional[datetime] = None
    schedules: List[ScheduleItem] = []

    class Config:
        from_attributes = True

class StationResponse(BaseModel):
    id: int
    code: str
    name: str
    km_distance: float
    total_platforms: int
    has_loop_line: bool
    latitude: Optional[float] = None
    longitude: Optional[float] = None

    class Config:
        from_attributes = True
