from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.config import settings
from app.db.session import engine, SessionLocal, Base
from app.db.models import Station, Train, Schedule, Disruption
from app.ml.corridor_data import STATIONS_DATA, TRAINS_DATA, DISRUPTIONS_DATA
from app.api.v1.api import api_router

def seed_database():
    """Seeds initial Indian Railways corridor data if database is empty."""
    db = SessionLocal()
    try:
        # Check if stations exist
        if db.query(Station).count() == 0:
            print("[RailSync] Seeding Corridor Stations...")
            for s_data in STATIONS_DATA:
                station = Station(
                    code=s_data["code"],
                    name=s_data["name"],
                    km_distance=s_data["km_distance"],
                    total_platforms=s_data["total_platforms"],
                    has_loop_line=s_data["has_loop_line"],
                    latitude=s_data["latitude"],
                    longitude=s_data["longitude"]
                )
                db.add(station)
            db.commit()

        # Check if trains exist
        if db.query(Train).count() == 0:
            print("[RailSync] Seeding Coaching & Freight Trains with Schedules...")
            for t_data in TRAINS_DATA:
                train = Train(
                    train_number=t_data["train_number"],
                    train_name=t_data["train_name"],
                    train_type=t_data["train_type"],
                    priority=t_data["priority"],
                    max_speed=t_data["max_speed"],
                    current_station_code=t_data["current_station_code"],
                    next_station_code=t_data["next_station_code"],
                    current_speed=t_data["current_speed"],
                    current_delay_min=t_data["current_delay_min"],
                    status=t_data["status"],
                    current_lat=t_data["current_lat"],
                    current_lon=t_data["current_lon"],
                    direction=t_data["direction"]
                )
                db.add(train)
                db.flush()

                for s_data in t_data.get("schedules", []):
                    sched = Schedule(
                        train_id=train.id,
                        station_code=s_data["station_code"],
                        station_name=s_data["station_name"],
                        stop_sequence=s_data["stop_sequence"],
                        distance_km=s_data["distance_km"],
                        scheduled_arrival=s_data["scheduled_arrival"],
                        scheduled_departure=s_data["scheduled_departure"],
                        platform_number=s_data["platform_number"]
                    )
                    db.add(sched)
            db.commit()

        # Check if disruptions exist
        if db.query(Disruption).count() == 0:
            print("[RailSync] Seeding Active Natural/Weather Disruption Alerts...")
            for d_data in DISRUPTIONS_DATA:
                disruption = Disruption(
                    section_name=d_data["section_name"],
                    start_station_code=d_data["start_station_code"],
                    end_station_code=d_data["end_station_code"],
                    disruption_type=d_data["disruption_type"],
                    severity=d_data["severity"],
                    speed_cap_kmh=d_data["speed_cap_kmh"],
                    description=d_data["description"],
                    is_active=d_data["is_active"],
                    lead_time_min=d_data["lead_time_min"]
                )
                db.add(disruption)
            db.commit()

        print("[RailSync] Database ready with Indian Railways corridor seed data.")
    finally:
        db.close()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: create tables and seed
    Base.metadata.create_all(bind=engine)
    seed_database()
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Dynamic Forecast of Expected Time of Arrival (ETA), Delay Propagation, and Delay Recovery Decision Support System (SIH26028).",
    lifespan=lifespan
)

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "project": "RailSync",
        "sih_ps_id": "SIH26028",
        "status": "ONLINE",
        "pipeline": [
            "TRAIN DATA",
            "ETA PREDICTION",
            "DELAY PROPAGATION",
            "DISRUPTION AWARENESS",
            "RECOVERY SIMULATION",
            "RECOMMENDATION"
        ],
        "docs_url": "/docs"
    }

@app.get("/health")
def healthcheck():
    return {"status": "HEALTHY", "database": "CONNECTED"}
