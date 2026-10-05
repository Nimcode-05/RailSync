from fastapi import APIRouter, HTTPException, Depends
from typing import List
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.models import Train, Station, Schedule
from app.schemas.train import TrainResponse, StationResponse

router = APIRouter()

@router.get("/stations", response_model=List[StationResponse])
def get_corridor_stations(db: Session = Depends(get_db)):
    stations = db.query(Station).order_by(Station.km_distance.asc()).all()
    return stations

@router.get("/trains", response_model=List[TrainResponse])
def list_trains(db: Session = Depends(get_db)):
    trains = db.query(Train).all()
    return trains

@router.get("/trains/{train_number}", response_model=TrainResponse)
def get_train_details(train_number: str, db: Session = Depends(get_db)):
    train = db.query(Train).filter(Train.train_number == train_number).first()
    if not train:
        raise HTTPException(status_code=404, detail=f"Train {train_number} not found")
    return train

@router.post("/trains/{train_number}/update")
def update_train_status(
    train_number: str,
    speed: float = None,
    delay_min: float = None,
    current_station: str = None,
    db: Session = Depends(get_db)
):
    train = db.query(Train).filter(Train.train_number == train_number).first()
    if not train:
        raise HTTPException(status_code=404, detail=f"Train {train_number} not found")
    
    if speed is not None:
        train.current_speed = speed
    if delay_min is not None:
        train.current_delay_min = delay_min
        if delay_min > 45:
            train.status = "SEVERELY_DELAYED"
        elif delay_min > 10:
            train.status = "DELAYED"
        else:
            train.status = "ON_TIME"
    if current_station is not None:
        train.current_station_code = current_station

    db.commit()
    db.refresh(train)
    return {"status": "SUCCESS", "message": f"Updated train {train_number}", "train": train.train_number, "delay": train.current_delay_min}
