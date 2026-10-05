from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.session import Base

class Station(Base):
    __tablename__ = "stations"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(10), unique=True, index=True, nullable=False)
    name = Column(String(100), nullable=False)
    km_distance = Column(Float, nullable=False) # Distance along corridor in KM
    total_platforms = Column(Integer, default=4)
    has_loop_line = Column(Boolean, default=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)

class Train(Base):
    __tablename__ = "trains"

    id = Column(Integer, primary_key=True, index=True)
    train_number = Column(String(10), unique=True, index=True, nullable=False)
    train_name = Column(String(100), nullable=False)
    train_type = Column(String(50), nullable=False) # VANDE_BHARAT, RAJDHANI, EXPRESS, PASSENGER, FREIGHT
    priority = Column(Integer, default=3) # 1 = Highest (Vande Bharat/Rajdhani), 5 = Lowest (Freight)
    max_speed = Column(Float, default=110.0) # km/h
    current_station_code = Column(String(10), default="NDLS")
    next_station_code = Column(String(10), default="GZB")
    current_speed = Column(Float, default=85.0) # km/h
    current_delay_min = Column(Float, default=0.0) # minutes
    status = Column(String(50), default="ON_TIME") # ON_TIME, DELAYED, SEVERELY_DELAYED, HELD_AT_LOOP
    current_lat = Column(Float, nullable=True)
    current_lon = Column(Float, nullable=True)
    direction = Column(String(10), default="DOWN") # UP = Towards NDLS, DOWN = Towards PRYJ
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    schedules = relationship("Schedule", back_populates="train", cascade="all, delete-orphan")

class Schedule(Base):
    __tablename__ = "schedules"

    id = Column(Integer, primary_key=True, index=True)
    train_id = Column(Integer, ForeignKey("trains.id"), nullable=False)
    station_code = Column(String(10), nullable=False)
    station_name = Column(String(100), nullable=False)
    stop_sequence = Column(Integer, nullable=False)
    distance_km = Column(Float, default=0.0)
    scheduled_arrival = Column(String(10), nullable=False) # "HH:MM"
    scheduled_departure = Column(String(10), nullable=False) # "HH:MM"
    platform_number = Column(Integer, default=1)

    train = relationship("Train", back_populates="schedules")

class Disruption(Base):
    __tablename__ = "disruptions"

    id = Column(Integer, primary_key=True, index=True)
    section_name = Column(String(100), nullable=False) # e.g., "ETW-CNB"
    start_station_code = Column(String(10), nullable=False)
    end_station_code = Column(String(10), nullable=False)
    disruption_type = Column(String(50), nullable=False) # HEAVY_RAIN, WATERLOGGING, DENSE_FOG, TRACK_CAUTION
    severity = Column(String(20), default="MEDIUM") # LOW, MEDIUM, HIGH, CRITICAL
    speed_cap_kmh = Column(Float, default=45.0)
    description = Column(Text, nullable=False)
    is_active = Column(Boolean, default=True)
    detected_at = Column(DateTime, default=datetime.utcnow)
    lead_time_min = Column(Integer, default=45) # Lead time provided before arrival

class RecoveryAction(Base):
    __tablename__ = "recovery_actions"

    id = Column(Integer, primary_key=True, index=True)
    train_number = Column(String(10), nullable=False)
    action_type = Column(String(50), nullable=False) # LOOP_OVERTAKE, PLATFORM_REALLOCATION, SPEED_RECOVERY
    location = Column(String(50), nullable=False) # Station or Section
    recommendation_title = Column(String(150), nullable=False)
    recommendation_details = Column(Text, nullable=False)
    baseline_network_delay_min = Column(Float, default=0.0)
    optimized_network_delay_min = Column(Float, default=0.0)
    delay_saved_min = Column(Float, default=0.0)
    status = Column(String(30), default="PENDING") # PENDING, APPROVED, REJECTED
    created_at = Column(DateTime, default=datetime.utcnow)
