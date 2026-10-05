from typing import List, Dict, Any

class DelayPropagationEngine:
    def __init__(self, min_headway_min: float = 6.0, platform_buffer_min: float = 12.0):
        self.min_headway_min = min_headway_min
        self.platform_buffer_min = platform_buffer_min

    def compute_network_propagation(
        self,
        source_train_number: str,
        trains_list: List[Dict[str, Any]],
        stations_map: Dict[str, Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        Simulates how a primary delay in source_train cascades into following trains
        due to shared track block headway and junction platform occupancy.
        """
        source_train = next((t for t in trains_list if t["train_number"] == source_train_number), None)
        if not source_train:
            return {
                "source_train_number": source_train_number,
                "source_delay_min": 0.0,
                "total_network_knockon_delay_min": 0.0,
                "affected_trains_count": 0,
                "affected_trains": [],
                "congested_sections": [],
                "critical_junction_bottlenecks": [],
                "system_risk_index": "GREEN - STABLE"
            }

        source_delay = float(source_train.get("current_delay_min", 0.0))
        source_station = source_train.get("current_station_code", "NDLS")
        source_km = stations_map.get(source_station, {}).get("km_distance", 300.0)

        affected_trains = []
        congested_sections = set()
        critical_junctions = set()
        total_knockon_delay = 0.0

        for train in trains_list:
            if train["train_number"] == source_train_number:
                continue

            t_station = train.get("current_station_code", "NDLS")
            t_km = stations_map.get(t_station, {}).get("km_distance", 0.0)
            t_priority = int(train.get("priority", 3))
            t_orig_delay = float(train.get("current_delay_min", 0.0))
            t_speed = float(train.get("current_speed", 80.0))

            knock_on = 0.0
            conflict_loc = ""
            conflict_cause = ""
            risk_level = "LOW"

            # Case 1: Trailing train on the same downstream direction behind the delayed train
            if t_km <= source_km and train.get("direction") == source_train.get("direction"):
                distance_gap = source_km - t_km
                
                # If within 150 km behind a heavily delayed/slow train
                if distance_gap < 160.0:
                    section_name = f"{t_station} -> {train.get('next_station_code', 'CNB')}"
                    congested_sections.add(section_name)
                    
                    # High priority trains suffer worse knock-on if stuck behind slow train
                    speed_differential = max(float(train.get("max_speed", 100.0)) - float(source_train.get("current_speed", 40.0)), 0.0)
                    
                    # Headway compression penalty
                    raw_knockon = (source_delay * 0.45) + (speed_differential * 0.20) - (distance_gap * 0.08)
                    knock_on = max(round(raw_knockon, 1), 0.0)

                    if knock_on > 20.0:
                        risk_level = "CRITICAL"
                        conflict_cause = "HEADWAY_VIOLATION_BLOCK (Following train forced to crawl behind delayed rake)"
                        conflict_loc = f"{source_station} Outer Block Section"
                    elif knock_on > 8.0:
                        risk_level = "HIGH"
                        conflict_cause = "SIGNAL_ASPECT_RESTRICTION (Yellow/Double-Yellow warning aspects)"
                        conflict_loc = f"Section between {t_station} and {source_station}"
                    elif knock_on > 0:
                        risk_level = "MEDIUM"
                        conflict_cause = "HEADWAY_BUFFER_COMPRESSION"
                        conflict_loc = f"{t_station} Junction Approach"

            # Case 2: Platform conflict at major junction (e.g., Kanpur Central CNB or Prayagraj PRYJ)
            junction_code = "CNB"
            if t_km < 440.0 and source_km >= 300.0 and source_delay > 25.0:
                # Platform occupancy clash
                platform_knockon = round(source_delay * 0.25, 1)
                if platform_knockon > knock_on:
                    knock_on = platform_knockon
                    conflict_loc = f"{junction_code} (Kanpur Central) Station Throat"
                    conflict_cause = "PLATFORM_OCCUPANCY_CONFLICT (Delayed rake holding common platform/loop line)"
                    risk_level = "HIGH"
                critical_junctions.add(junction_code)

            if knock_on > 0.0:
                total_knockon_delay += knock_on
                affected_trains.append({
                    "train_number": train["train_number"],
                    "train_name": train["train_name"],
                    "train_type": train["train_type"],
                    "priority": t_priority,
                    "original_delay_min": t_orig_delay,
                    "knock_on_delay_min": knock_on,
                    "total_projected_delay_min": round(t_orig_delay + knock_on, 1),
                    "conflict_location": conflict_loc or f"{source_station} Block",
                    "conflict_cause": conflict_cause or "NETWORK_HEADWAY_CROWDING",
                    "risk_level": risk_level
                })

        # Sort affected trains by projected delay descending
        affected_trains.sort(key=lambda x: x["knock_on_delay_min"], reverse=True)

        # Network risk index
        if total_knockon_delay > 50.0:
            risk_index = "RED - HIGH CASCADE RISK"
        elif total_knockon_delay > 15.0:
            risk_index = "YELLOW - MODERATE RISK"
        else:
            risk_index = "GREEN - STABLE"

        return {
            "source_train_number": source_train_number,
            "source_delay_min": source_delay,
            "total_network_knockon_delay_min": round(total_knockon_delay, 1),
            "affected_trains_count": len(affected_trains),
            "affected_trains": affected_trains,
            "congested_sections": list(congested_sections),
            "critical_junction_bottlenecks": list(critical_junctions),
            "system_risk_index": risk_index
        }

propagation_engine = DelayPropagationEngine()
