from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.models import Train, Station
from app.schemas.prediction import PropagationResponse
from app.ml.propagation_engine import propagation_engine

router = APIRouter()

@router.get("/propagation/{train_number}", response_model=PropagationResponse)
def get_train_delay_propagation(train_number: str, db: Session = Depends(get_db)):
    train = db.query(Train).filter(Train.train_number == train_number).first()
    if not train:
        raise HTTPException(status_code=404, detail=f"Train {train_number} not found")

    all_trains = db.query(Train).all()
    stations = db.query(Station).all()
    stations_map = {s.code: {"km_distance": s.km_distance, "name": s.name} for s in stations}

    trains_list = [
        {
            "train_number": t.train_number,
            "train_name": t.train_name,
            "train_type": t.train_type,
            "priority": t.priority,
            "max_speed": t.max_speed,
            "current_station_code": t.current_station_code,
            "next_station_code": t.next_station_code,
            "current_speed": t.current_speed,
            "current_delay_min": t.current_delay_min,
            "direction": t.direction
        }
        for t in all_trains
    ]

    result = propagation_engine.compute_network_propagation(
        source_train_number=train_number,
        trains_list=trains_list,
        stations_map=stations_map
    )
    return result

@router.get("/propagation", response_model=PropagationResponse)
def get_most_critical_propagation(db: Session = Depends(get_db)):
    # Find the train causing the maximum delay impact
    all_trains = db.query(Train).order_by(Train.current_delay_min.desc()).all()
    if not all_trains:
        raise HTTPException(status_code=404, detail="No trains available")
    
    top_delayed_train = all_trains[0].train_number
    return get_train_delay_propagation(top_delayed_train, db)
