from datetime import datetime

# Dummy database
buses = [
    {
        "bus_id": 1,
        "bus_name": "City Express",
        "source": "Delhi",
        "destination": "Agra",
        "start_time": "09:00",
        "stops": ["Delhi", "Noida", "Merut", "Agra"],
        "date": "2024-09-01",
        "available_seats": 30,
        "seats": {
            "Delhi": list(range(1, 11)),
            "Noida": list(range(11, 21)),
            "Merut": list(range(21, 26)),
            "Agra": list(range(26, 31))
        }
    },
    {
        "bus_id": 2,
        "bus_name": "State Shuttle",
        "source": "Gurgaon",
        "destination": "Chandigarh",
        "start_time": "10:00",
        "stops": ["Gurgaon", "Delhi", "Ambala", "Chandigarh"],
        "date": "2024-09-01",
        "available_seats": 30,
        "seats": {
            "Gurgaon": list(range(1, 11)),
            "Delhi": list(range(11, 21)),
            "Ambala": list(range(21, 26)),
            "Chandigarh": list(range(26, 31))
        }
    },
        {
        "bus_id": 3,
        "bus_name": "Red Bus",
        "source": "Delhi",
        "destination": "Agra",
        "start_time": "12:00",
        "stops": ["Delhi", "Noida", "Merut", "Lucknow",  "Agra"],
        "date": "2024-09-01",
        "available_seats": 40,
        "seats": {
            "Delhi": list(range(1, 11)),
            "Noida": list(range(11, 21)),
            "Merut": list(range(21, 26)),
            "Lucknow": list(range(26, 31)),
            "Agra": list(range(31, 41))
        }
    },
    # Add more buses as needed
]
