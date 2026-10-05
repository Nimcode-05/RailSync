from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.models import Train, Disruption, RecoveryAction
from app.schemas.recommendation import SimulationResult
from app.services.optimizer import optimizer_service

router = APIRouter()

@router.get("/recovery/simulate", response_model=SimulationResult)
def simulate_recovery_strategies(db: Session = Depends(get_db)):
    trains = db.query(Train).all()
    disruptions = db.query(Disruption).filter(Disruption.is_active == True).all()

    trains_list = [
        {
            "train_number": t.train_number,
            "train_name": t.train_name,
            "train_type": t.train_type,
            "priority": t.priority,
            "max_speed": t.max_speed,
            "current_station_code": t.current_station_code,
            "current_speed": t.current_speed,
            "current_delay_min": t.current_delay_min,
            "direction": t.direction
        }
        for t in trains
    ]

    disruptions_list = [
        {
            "section_name": d.section_name,
            "speed_cap_kmh": d.speed_cap_kmh,
            "disruption_type": d.disruption_type
        }
        for d in disruptions
    ]

    result = optimizer_service.run_optimization(trains_list, disruptions_list)
    return result

@router.post("/recovery/approve/{option_id}")
def approve_recovery_action(option_id: str, db: Session = Depends(get_db)):
    # Apply operational action in database
    if option_id == "REC-OPT-01":
        # Loop Line Precedence Overtake at Etawah
        # Give Vande Bharat (22436) and Rajdhani (12302) full green; drop their delays
        vb = db.query(Train).filter(Train.train_number == "22436").first()
        raj = db.query(Train).filter(Train.train_number == "12302").first()
        freight = db.query(Train).filter(Train.train_number == "BOXN-902").first()
        
        if vb:
            vb.current_delay_min = max(vb.current_delay_min - 10.0, 2.0)
            vb.status = "ON_TIME"
        if raj:
            raj.current_delay_min = max(raj.current_delay_min - 14.0, 5.0)
            raj.status = "ON_TIME"
        if freight:
            freight.status = "HELD_AT_LOOP"
            freight.current_delay_min += 8.0 # absorbed loop line wait
        
        db.commit()
        return {
            "status": "APPROVED",
            "message": "Regulatory Loop Line Overtake order executed. Main line cleared for High Priority rakes.",
            "option_id": option_id
        }

    return {"status": "SUCCESS", "message": f"Action {option_id} acknowledged and logged."}
