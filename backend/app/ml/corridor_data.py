"""
Standard Indian Railways Corridor Data:
New Delhi (NDLS) -> Prayagraj Jn (PRYJ) via Kanpur Central (CNB)
High Density Trunk Route (Group A Speed 130 km/h)
"""

STATIONS_DATA = [
    {
        "code": "NDLS",
        "name": "New Delhi",
        "km_distance": 0.0,
        "total_platforms": 16,
        "has_loop_line": True,
        "latitude": 28.6415,
        "longitude": 77.2185
    },
    {
        "code": "GZB",
        "name": "Ghaziabad Jn",
        "km_distance": 25.0,
        "total_platforms": 6,
        "has_loop_line": True,
        "latitude": 28.6678,
        "longitude": 77.4328
    },
    {
        "code": "ALJN",
        "name": "Aligarh Jn",
        "km_distance": 131.0,
        "total_platforms": 7,
        "has_loop_line": True,
        "latitude": 27.8974,
        "longitude": 78.0880
    },
    {
        "code": "TDL",
        "name": "Tundla Jn",
        "km_distance": 209.0,
        "total_platforms": 5,
        "has_loop_line": True,
        "latitude": 27.2081,
        "longitude": 78.2415
    },
    {
        "code": "ETW",
        "name": "Etawah Jn",
        "km_distance": 301.0,
        "total_platforms": 5,
        "has_loop_line": True,
        "latitude": 26.7766,
        "longitude": 79.0232
    },
    {
        "code": "CNB",
        "name": "Kanpur Central",
        "km_distance": 440.0,
        "total_platforms": 10,
        "has_loop_line": True,
        "latitude": 26.4547,
        "longitude": 80.3507
    },
    {
        "code": "FTP",
        "name": "Fatehpur",
        "km_distance": 518.0,
        "total_platforms": 4,
        "has_loop_line": True,
        "latitude": 25.9272,
        "longitude": 80.8124
    },
    {
        "code": "PRYJ",
        "name": "Prayagraj Jn",
        "km_distance": 634.0,
        "total_platforms": 10,
        "has_loop_line": True,
        "latitude": 25.4437,
        "longitude": 81.8252
    }
]

TRAINS_DATA = [
    {
        "train_number": "22436",
        "train_name": "Vande Bharat Express",
        "train_type": "VANDE_BHARAT",
        "priority": 1,
        "max_speed": 130.0,
        "current_station_code": "ETW",
        "next_station_code": "CNB",
        "current_speed": 115.0,
        "current_delay_min": 14.0,
        "status": "DELAYED",
        "current_lat": 26.7766,
        "current_lon": 79.0232,
        "direction": "DOWN",
        "schedules": [
            {"station_code": "NDLS", "station_name": "New Delhi", "stop_sequence": 1, "distance_km": 0.0, "scheduled_arrival": "06:00", "scheduled_departure": "06:00", "platform_number": 16},
            {"station_code": "CNB", "station_name": "Kanpur Central", "stop_sequence": 2, "distance_km": 440.0, "scheduled_arrival": "10:08", "scheduled_departure": "10:10", "platform_number": 1},
            {"station_code": "PRYJ", "station_name": "Prayagraj Jn", "stop_sequence": 3, "distance_km": 634.0, "scheduled_arrival": "12:08", "scheduled_departure": "12:10", "platform_number": 6},
        ]
    },
    {
        "train_number": "12302",
        "train_name": "Howrah Rajdhani Express",
        "train_type": "RAJDHANI",
        "priority": 1,
        "max_speed": 130.0,
        "current_station_code": "TDL",
        "next_station_code": "ETW",
        "current_speed": 125.0,
        "current_delay_min": 22.0,
        "status": "DELAYED",
        "current_lat": 27.2081,
        "current_lon": 78.2415,
        "direction": "DOWN",
        "schedules": [
            {"station_code": "NDLS", "station_name": "New Delhi", "stop_sequence": 1, "distance_km": 0.0, "scheduled_arrival": "16:55", "scheduled_departure": "16:55", "platform_number": 12},
            {"station_code": "CNB", "station_name": "Kanpur Central", "stop_sequence": 2, "distance_km": 440.0, "scheduled_arrival": "21:35", "scheduled_departure": "21:40", "platform_number": 2},
            {"station_code": "PRYJ", "station_name": "Prayagraj Jn", "stop_sequence": 3, "distance_km": 634.0, "scheduled_arrival": "23:43", "scheduled_departure": "23:45", "platform_number": 4},
        ]
    },
    {
        "train_number": "12418",
        "train_name": "Prayagraj Superfast Express",
        "train_type": "EXPRESS",
        "priority": 2,
        "max_speed": 110.0,
        "current_station_code": "ALJN",
        "next_station_code": "TDL",
        "current_speed": 98.0,
        "current_delay_min": 8.0,
        "status": "ON_TIME",
        "current_lat": 27.8974,
        "current_lon": 78.0880,
        "direction": "DOWN",
        "schedules": [
            {"station_code": "NDLS", "station_name": "New Delhi", "stop_sequence": 1, "distance_km": 0.0, "scheduled_arrival": "22:10", "scheduled_departure": "22:10", "platform_number": 14},
            {"station_code": "ALJN", "station_name": "Aligarh Jn", "stop_sequence": 2, "distance_km": 131.0, "scheduled_arrival": "23:55", "scheduled_departure": "23:57", "platform_number": 3},
            {"station_code": "CNB", "station_name": "Kanpur Central", "stop_sequence": 3, "distance_km": 440.0, "scheduled_arrival": "03:50", "scheduled_departure": "03:55", "platform_number": 3},
            {"station_code": "PRYJ", "station_name": "Prayagraj Jn", "stop_sequence": 4, "distance_km": 634.0, "scheduled_arrival": "07:00", "scheduled_departure": "07:00", "platform_number": 1},
        ]
    },
    {
        "train_number": "14218",
        "train_name": "Unchahar Express",
        "train_type": "EXPRESS",
        "priority": 3,
        "max_speed": 100.0,
        "current_station_code": "ETW",
        "next_station_code": "CNB",
        "current_speed": 55.0,
        "current_delay_min": 48.0,
        "status": "SEVERELY_DELAYED",
        "current_lat": 26.6000,
        "current_lon": 79.4000,
        "direction": "DOWN",
        "schedules": [
            {"station_code": "NDLS", "station_name": "New Delhi", "stop_sequence": 1, "distance_km": 0.0, "scheduled_arrival": "21:10", "scheduled_departure": "21:10", "platform_number": 5},
            {"station_code": "ALJN", "station_name": "Aligarh Jn", "stop_sequence": 2, "distance_km": 131.0, "scheduled_arrival": "23:35", "scheduled_departure": "23:40", "platform_number": 2},
            {"station_code": "TDL", "station_name": "Tundla Jn", "stop_sequence": 3, "distance_km": 209.0, "scheduled_arrival": "01:20", "scheduled_departure": "01:25", "platform_number": 3},
            {"station_code": "ETW", "station_name": "Etawah Jn", "stop_sequence": 4, "distance_km": 301.0, "scheduled_arrival": "02:45", "scheduled_departure": "02:50", "platform_number": 2},
            {"station_code": "CNB", "station_name": "Kanpur Central", "stop_sequence": 5, "distance_km": 440.0, "scheduled_arrival": "05:30", "scheduled_departure": "05:35", "platform_number": 5},
            {"station_code": "FTP", "station_name": "Fatehpur", "stop_sequence": 6, "distance_km": 518.0, "scheduled_arrival": "06:48", "scheduled_departure": "06:50", "platform_number": 2},
            {"station_code": "PRYJ", "station_name": "Prayagraj Jn", "stop_sequence": 7, "distance_km": 634.0, "scheduled_arrival": "08:50", "scheduled_departure": "08:50", "platform_number": 7},
        ]
    },
    {
        "train_number": "04183",
        "train_name": "TDL-CNB Passenger Special",
        "train_type": "PASSENGER",
        "priority": 4,
        "max_speed": 75.0,
        "current_station_code": "ETW",
        "next_station_code": "CNB",
        "current_speed": 40.0,
        "current_delay_min": 38.0,
        "status": "DELAYED",
        "current_lat": 26.6500,
        "current_lon": 79.2500,
        "direction": "DOWN",
        "schedules": [
            {"station_code": "TDL", "station_name": "Tundla Jn", "stop_sequence": 1, "distance_km": 209.0, "scheduled_arrival": "04:15", "scheduled_departure": "04:20", "platform_number": 4},
            {"station_code": "ETW", "station_name": "Etawah Jn", "stop_sequence": 2, "distance_km": 301.0, "scheduled_arrival": "06:10", "scheduled_departure": "06:15", "platform_number": 3},
            {"station_code": "CNB", "station_name": "Kanpur Central", "stop_sequence": 3, "distance_km": 440.0, "scheduled_arrival": "09:30", "scheduled_departure": "09:30", "platform_number": 8},
        ]
    },
    {
        "train_number": "BOXN-902",
        "train_name": "Goods Freight Train (Coal Rake)",
        "train_type": "FREIGHT",
        "priority": 5,
        "max_speed": 65.0,
        "current_station_code": "ETW",
        "next_station_code": "CNB",
        "current_speed": 35.0,
        "current_delay_min": 75.0,
        "status": "SEVERELY_DELAYED",
        "current_lat": 26.5500,
        "current_lon": 79.6000,
        "direction": "DOWN",
        "schedules": [
            {"station_code": "TDL", "station_name": "Tundla Jn", "stop_sequence": 1, "distance_km": 209.0, "scheduled_arrival": "02:00", "scheduled_departure": "02:00", "platform_number": 5},
            {"station_code": "ETW", "station_name": "Etawah Jn", "stop_sequence": 2, "distance_km": 301.0, "scheduled_arrival": "04:30", "scheduled_departure": "04:30", "platform_number": 4},
            {"station_code": "CNB", "station_name": "Kanpur Central", "stop_sequence": 3, "distance_km": 440.0, "scheduled_arrival": "08:15", "scheduled_departure": "08:15", "platform_number": 10},
        ]
    }
]

DISRUPTIONS_DATA = [
    {
        "section_name": "ETW-CNB Section (Km 345 - Km 370)",
        "start_station_code": "ETW",
        "end_station_code": "CNB",
        "disruption_type": "HEAVY_RAIN_WATERLOGGING",
        "severity": "HIGH",
        "speed_cap_kmh": 45.0,
        "description": "Continuous torrential rain causing waterlogging up to rail head level. Caution speed order (SR 45 km/h) imposed for all coaching and freight rakes.",
        "is_active": True,
        "lead_time_min": 65
    },
    {
        "section_name": "TDL-ETW Section (Km 240 - Km 260)",
        "start_station_code": "TDL",
        "end_station_code": "ETW",
        "disruption_type": "DENSE_FOG",
        "severity": "MEDIUM",
        "speed_cap_kmh": 60.0,
        "description": "Visibility reduced below 100 meters due to localized dense fog pocket. Fog PASS devices active with modified speed limit.",
        "is_active": True,
        "lead_time_min": 90
    }
]
