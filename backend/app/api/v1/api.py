from fastapi import APIRouter
from app.api.v1 import trains, eta, propagation, disruptions, recovery

api_router = APIRouter()
api_router.include_router(trains.router, tags=["Corridor & Trains"])
api_router.include_router(eta.router, tags=["Dynamic ETA Engine"])
api_router.include_router(propagation.router, tags=["Delay Propagation Engine"])
api_router.include_router(disruptions.router, tags=["Disruption Awareness"])
api_router.include_router(recovery.router, tags=["Recovery Simulation & Optimization"])
