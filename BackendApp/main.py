from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta
from fastapi.middleware.cors import CORSMiddleware
from auth import create_access_token, get_current_user, verify_password, get_password_hash,ACCESS_TOKEN_EXPIRE_MINUTES
from pydantic import BaseModel
from dummy_db import buses
import uuid
import datetime

app = FastAPI()

# Placeholder for user storage
# Replace this with your database connection and user retrieval logic
fake_users_db = {
    "user@example.com": {
        "email": "user@example.com",
        "hashed_password": "password123",
    }
}

blocked_seats = {}
bookings = {}

class BlockSeatsRequest(BaseModel):
    bus_id: int
    pickup_point: str
    seat_numbers: str

class User(BaseModel):
    user_id: str

class BookTicketRequest(BaseModel):
    blocking_id: str


class BusSearchRequest(BaseModel):
    source: str
    destination: str
    date: str  # Format: YYYY-MM-DD

class BusSearchResponse(BaseModel):
    bus_id: int
    bus_name: str
    start_time: str
    available_seats: int
    stops: list[str]

# User model
class UserInDB:
    email: str
    hashed_password: str

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



@app.post("/token")
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = fake_users_db.get(form_data.username)
    hashed_password = get_password_hash(user["hashed_password"])
    if not user or not verify_password(form_data.password, hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["email"]}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me")
async def read_users_me(current_user: dict = Depends(get_current_user)):
    return current_user

@app.post("/search_buses", response_model=list[BusSearchResponse])
async def search_buses(request: BusSearchRequest, current_user: str = Depends(get_current_user)):
    matching_buses = []
    for bus in buses:
        if (bus["source"].lower() == request.source.lower() and
                bus["destination"].lower() == request.destination.lower() and
                bus["date"] == request.date):
            matching_buses.append(BusSearchResponse(
                bus_id=bus["bus_id"],
                bus_name=bus["bus_name"],
                start_time=bus["start_time"],
                available_seats=bus["available_seats"],
                stops=bus["stops"],
            ))
    
    if not matching_buses:
        raise HTTPException(status_code=404, detail="No buses found for the given criteria.")
    
    return matching_buses

@app.post("/block_seats")
async def block_seats(request: BlockSeatsRequest, current_user: str = Depends(get_current_user)):
    # Find the bus
    bus = next((bus for bus in buses if bus["bus_id"] == request.bus_id), None)
    if not bus:
        raise HTTPException(status_code=404, detail="Bus not found")
    
    # Check if the pickup point is valid
    pick_points = {}
    for key, values in bus["seats"].items():
        pick_points[key.lower()] = bus["seats"][key]
    if request.pickup_point.lower() not in pick_points:
        raise HTTPException(status_code=400, detail="Invalid pickup point")
    
    # Check if requested seats are available
    available_seats = set(pick_points[request.pickup_point.lower()])

    seats_list = request.seat_numbers.split(",")
    seats_list = [item.strip() for item in seats_list]
    seats_list = [int(item) for item in seats_list]
    requested_seats = set(seats_list)
    
    if not requested_seats.issubset(available_seats):
            return {
        "message": "Some seats are not available",
        "available_seats":[seats for seats in available_seats ]
    }
    
    # Block seats
    bus["seats"][request.pickup_point] = list(available_seats - requested_seats)
    blocking_id = str(uuid.uuid4())
    blocked_seats[blocking_id] = {
        "bus_id": request.bus_id,
        "pickup_point": request.pickup_point,
        "seat_numbers": request.seat_numbers
    }
    
    return {
        "blocking_id": blocking_id,
        "message": "Seats successfully blocked",
        "seats_blocked":blocked_seats[blocking_id]["seat_numbers"]
    }  


@app.post("/book_ticket")
async def book_ticket(request: BookTicketRequest, current_user: str = Depends(get_current_user)):
    booking_id = str(uuid.uuid4())  # Generate a unique booking ID

    # check if the blocking ID exists and is valid
    # we're assuming that any blocking ID is valid
    if not request.blocking_id:
        return {"message": "Please select seats before booking"}
    
    # Save the booking in the dummy database
    bookings[current_user["email"]] = {
        "user":current_user["email"],
        "booking_id":booking_id,
        "booked_on":datetime.datetime.now(),
        "blocked_seats":blocked_seats[request.blocking_id]["seat_numbers"]
    }
    
    return {"message": "Ticket booked successfully", 
    'details':bookings[current_user["email"]]}

@app.get("/booking_history")
async def get_booking_history(user_id: str = Depends(get_current_user)):
    user_bookings = bookings.get(user_id["email"])
    
    if not user_bookings:
        raise HTTPException(status_code=404, detail="No booking history found for this user")
    
    return user_bookings
