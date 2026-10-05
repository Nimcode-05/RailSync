import numpy as np
import pandas as pd
from datetime import datetime, timedelta
from typing import Dict, List, Any
from sklearn.ensemble import HistGradientBoostingRegressor
from sklearn.metrics import mean_absolute_error, root_mean_squared_error, r2_score

class DynamicETAEngine:
    def __init__(self):
        self.model = HistGradientBoostingRegressor(
            max_iter=150,
            learning_rate=0.08,
            max_depth=6,
            random_state=42
        )
        self.is_trained = False
        self.metrics: Dict[str, float] = {}
        self._train_initial_model()

    def _generate_synthetic_historical_data(self, n_samples: int = 4000) -> pd.DataFrame:
        """
        Generates realistic historical Indian Railways train traversal records
        reflecting delay propagation, track speed limits, weather restrictions,
        and priority precedence.
        """
        np.random.seed(42)
        
        distance_km = np.random.uniform(15.0, 450.0, n_samples)
        current_delay_min = np.random.exponential(scale=20.0, size=n_samples)
        current_delay_min = np.clip(current_delay_min, 0.0, 180.0)
        
        train_priority = np.random.choice([1, 2, 3, 4, 5], size=n_samples, p=[0.25, 0.25, 0.25, 0.15, 0.10])
        
        # Max speed based on priority
        base_max_speed = np.where(train_priority == 1, 130.0,
                         np.where(train_priority == 2, 110.0,
                         np.where(train_priority == 3, 100.0,
                         np.where(train_priority == 4, 75.0, 65.0))))
        
        current_speed_kmh = base_max_speed * np.random.uniform(0.55, 1.0, n_samples)
        weather_speed_cap = np.random.choice([130.0, 90.0, 60.0, 45.0], size=n_samples, p=[0.70, 0.15, 0.10, 0.05])
        congestion_index = np.random.uniform(0.1, 1.0, n_samples) # 1.0 = heavy section saturation
        hour_of_day = np.random.randint(0, 24, n_samples)
        
        # True physics-inspired incremental delay calculation
        effective_speed = np.minimum(current_speed_kmh, weather_speed_cap)
        nominal_time_min = (distance_km / np.maximum(base_max_speed, 40.0)) * 60.0
        actual_running_time_min = (distance_km / np.maximum(effective_speed, 25.0)) * 60.0
        
        # Priority 1 trains recover slightly if delayed; low priority suffer secondary halts
        priority_recovery_factor = (3 - train_priority) * 1.5
        
        weather_penalty = np.where(weather_speed_cap < 100.0, (100.0 - weather_speed_cap) * 0.25 * (distance_km / 100.0), 0.0)
        congestion_penalty = congestion_index * 12.0 * (distance_km / 150.0)
        
        incremental_delay = (actual_running_time_min - nominal_time_min) + weather_penalty + congestion_penalty - priority_recovery_factor
        incremental_delay += np.random.normal(0, 2.5, n_samples)
        incremental_delay = np.maximum(incremental_delay, -10.0) # cannot recover more than 10 min buffer
        
        df = pd.DataFrame({
            "distance_km": distance_km,
            "current_delay_min": current_delay_min,
            "current_speed_kmh": current_speed_kmh,
            "max_speed_kmh": base_max_speed,
            "train_priority": train_priority,
            "weather_speed_cap": weather_speed_cap,
            "congestion_index": congestion_index,
            "hour_of_day": hour_of_day,
            "incremental_delay_min": incremental_delay
        })
        return df

    def _train_initial_model(self):
        data = self._generate_synthetic_historical_data()
        feature_cols = [
            "distance_km", "current_delay_min", "current_speed_kmh", 
            "max_speed_kmh", "train_priority", "weather_speed_cap",
            "congestion_index", "hour_of_day"
        ]
        X = data[feature_cols]
        y = data["incremental_delay_min"]
        
        train_size = int(0.8 * len(data))
        X_train, X_test = X.iloc[:train_size], X.iloc[train_size:]
        y_train, y_test = y.iloc[:train_size], y.iloc[train_size:]
        
        self.model.fit(X_train, y_train)
        y_pred = self.model.predict(X_test)
        
        self.metrics = {
            "mae_minutes": round(float(mean_absolute_error(y_test, y_pred)), 2),
            "rmse_minutes": round(float(root_mean_squared_error(y_test, y_pred)), 2),
            "r2_score": round(float(r2_score(y_test, y_pred)), 3),
            "training_samples": len(data),
            "algorithm": "HistGradientBoostingRegressor (Gradient Boosted Decision Trees)"
        }
        self.is_trained = True

    def predict_train_etas(
        self,
        train_info: Dict[str, Any],
        active_disruptions: List[Dict[str, Any]],
        current_time_str: str = "08:30"
    ) -> Dict[str, Any]:
        """
        Computes dynamic ETA for each downstream station of a train
        accounting for current speed, section weather orders, and track capacity.
        """
        schedules = train_info.get("schedules", [])
        current_delay = float(train_info.get("current_delay_min", 0.0))
        current_speed = float(train_info.get("current_speed", 80.0))
        max_speed = float(train_info.get("max_speed", 110.0))
        priority = int(train_info.get("priority", 3))
        
        # Calculate minimum active weather speed cap if train is traversing affected section
        weather_cap = 130.0
        for d in active_disruptions:
            if d.get("is_active", True):
                weather_cap = min(weather_cap, float(d.get("speed_cap_kmh", 130.0)))
        
        station_results = []
        accumulated_delay = current_delay
        
        # Base station distance from source
        first_km = schedules[0]["distance_km"] if schedules else 0.0
        current_km = first_km
        
        now = datetime.strptime(current_time_str, "%H:%M")
        
        for idx, stop in enumerate(schedules):
            stop_km = float(stop.get("distance_km", 0.0))
            leg_distance = max(stop_km - current_km, 0.0)
            
            # Predict incremental delay for this leg using trained ML model
            feature_vector = pd.DataFrame([{
                "distance_km": leg_distance,
                "current_delay_min": accumulated_delay,
                "current_speed_kmh": current_speed,
                "max_speed_kmh": max_speed,
                "train_priority": priority,
                "weather_speed_cap": weather_cap,
                "congestion_index": 0.55, # nominal daytime corridor density
                "hour_of_day": now.hour
            }])
            
            incremental = float(self.model.predict(feature_vector)[0])
            accumulated_delay = max(accumulated_delay + incremental, 0.0)
            
            # Scheduled time parse
            sched_str = stop.get("scheduled_arrival", "00:00")
            sched_dt = datetime.strptime(sched_str, "%H:%M")
            
            # Dynamic predicted ETA = Scheduled Arrival + Accumulated True Delay
            predicted_dt = sched_dt + timedelta(minutes=accumulated_delay)
            predicted_eta_str = predicted_dt.strftime("%H:%M")
            
            # Impact breakdown
            weather_impact = round(max((100.0 - weather_cap) * 0.15 * (leg_distance / 100.0), 0.0), 1)
            congestion_impact = round(max(accumulated_delay - current_delay - weather_impact, 0.0), 1)
            
            station_results.append({
                "station_code": stop.get("station_code"),
                "station_name": stop.get("station_name"),
                "distance_km": stop_km,
                "scheduled_arrival": sched_str,
                "predicted_eta": predicted_eta_str,
                "predicted_delay_min": round(accumulated_delay, 1),
                "confidence_interval_min": self.metrics.get("mae_minutes", 2.1),
                "weather_impact_delay_min": weather_impact,
                "congestion_impact_delay_min": congestion_impact
            })
            
            current_km = stop_km

        return {
            "train_number": train_info.get("train_number"),
            "train_name": train_info.get("train_name"),
            "train_type": train_info.get("train_type"),
            "current_station_code": train_info.get("current_station_code"),
            "current_speed_kmh": current_speed,
            "current_delay_min": current_delay,
            "status": "SEVERELY_DELAYED" if current_delay > 45 else ("DELAYED" if current_delay > 10 else "ON_TIME"),
            "station_etas": station_results,
            "model_metadata": {
                "engine": "HistGradientBoostingRegressor",
                "mae": f"{self.metrics.get('mae_minutes')} minutes",
                "rmse": f"{self.metrics.get('rmse_minutes')} minutes",
                "r2_accuracy": f"{self.metrics.get('r2_score') * 100:.1f}%",
                "active_weather_cap": f"{weather_cap} km/h"
            }
        }

eta_engine = DynamicETAEngine()
