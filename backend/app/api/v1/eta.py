from fastapi import APIRouter, HTTPException, Depends
from typing import List
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.models import Train, Disruption
from app.schemas.prediction import TrainETAResponse
from app.ml.eta_model import eta_engine

router = APIRouter()

@router.get("/eta/{train_number}", response_model=TrainETAResponse)
def get_train_dynamic_eta(train_number: str, db: Session = Depends(get_db)):
    train = db.query(Train).filter(Train.train_number == train_number).first()
    if not train:
        raise HTTPException(status_code=404, detail=f"Train {train_number} not found")
    
    # Fetch active disruptions
    disruptions = db.query(Disruption).filter(Disruption.is_active == True).all()
    disruption_dicts = [
        {"speed_cap_kmh": d.speed_cap_kmh, "is_active": d.is_active, "section_name": d.section_name}
        for d in disruptions
    ]

    train_dict = {
        "train_number": train.train_number,
        "train_name": train.train_name,
        "train_type": train.train_type,
        "priority": train.priority,
        "max_speed": train.max_speed,
        "current_station_code": train.current_station_code,
        "current_speed": train.current_speed,
        "current_delay_min": train.current_delay_min,
        "schedules": [
            {
                "station_code": s.station_code,
                "station_name": s.station_name,
                "distance_km": s.distance_km,
                "scheduled_arrival": s.scheduled_arrival,
                "scheduled_departure": s.scheduled_departure,
                "platform_number": s.platform_number
            }
            for s in train.schedules
        ]
    }

    eta_result = eta_engine.predict_train_etas(train_dict, disruption_dicts)
    return eta_result

@router.get("/eta", response_model=List[TrainETAResponse])
def get_all_trains_dynamic_eta(db: Session = Depends(get_db)):
    trains = db.query(Train).all()
    disruptions = db.query(Disruption).filter(Disruption.is_active == True).all()
    disruption_dicts = [
        {"speed_cap_kmh": d.speed_cap_kmh, "is_active": d.is_active, "section_name": d.section_name}
        for d in disruptions
    ]

    results = []
    for train in trains:
        train_dict = {
            "train_number": train.train_number,
            "train_name": train.train_name,
            "train_type": train.train_type,
            "priority": train.priority,
            "max_speed": train.max_speed,
            "current_station_code": train.current_station_code,
            "current_speed": train.current_speed,
            "current_delay_min": train.current_delay_min,
            "schedules": [
                {
                    "station_code": s.station_code,
                    "station_name": s.station_name,
                    "distance_km": s.distance_km,
                    "scheduled_arrival": s.scheduled_arrival,
                    "scheduled_departure": s.scheduled_departure,
                    "platform_number": s.platform_number
                }
                for s in train.schedules
            ]
        }
        res = eta_engine.predict_train_etas(train_dict, disruption_dicts)
        results.append(res)

    return results
