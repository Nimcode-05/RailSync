from fastapi import APIRouter, HTTPException, Depends
from typing import List
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.models import Disruption
from app.schemas.disruption import DisruptionResponse, DisruptionCreate

router = APIRouter()

@router.get("/disruptions", response_model=List[DisruptionResponse])
def list_disruptions(active_only: bool = False, db: Session = Depends(get_db)):
    query = db.query(Disruption)
    if active_only:
        query = query.filter(Disruption.is_active == True)
    return query.all()

@router.post("/disruptions", response_model=DisruptionResponse)
def create_disruption(payload: DisruptionCreate, db: Session = Depends(get_db)):
    disruption = Disruption(**payload.model_dump())
    db.add(disruption)
    db.commit()
    db.refresh(disruption)
    return disruption

@router.patch("/disruptions/{disruption_id}/toggle")
def toggle_disruption(disruption_id: int, db: Session = Depends(get_db)):
    disruption = db.query(Disruption).filter(Disruption.id == disruption_id).first()
    if not disruption:
        raise HTTPException(status_code=404, detail="Disruption not found")
    
    disruption.is_active = not disruption.is_active
    db.commit()
    db.refresh(disruption)
    return {"status": "SUCCESS", "id": disruption.id, "is_active": disruption.is_active}
