Bus Ticket Booking System
Overview
This project is a web-based bus ticket booking system that allows users to search for available buses, block seats, and book tickets. The application is built using FastAPI for the backend and React.js for the frontend. The system also includes JWT-based authentication to ensure that only authorized users can interact with the APIs.

Features
User Authentication: Users can register, log in, and access protected routes using JWT tokens.
Bus Search: Users can search for buses between a source and destination on a specified date.
Seat Blocking: Users can block specific seats on a bus before booking.
Ticket Booking: Users can confirm their booking by selecting the blocked seats.
Booking History: Users can view their past bookings.
Technology Stack
Backend: FastAPI, Python
Frontend: React.js, Axios
Database: MongoDB (simulated using a dictionary in this example)
Authentication: JWT (JSON Web Tokens)

Setup Instructions
Backend (FastAPI)
Clone the repository:

bash
git clone https://github.com/amyLite/Bus_Booking.git
cd BackendApp


Create a virtual environment:

bash
python3 -m venv venv
source venv/bin/activate


Install dependencies:

bash
pip install -r requirements.txt


Run the FastAPI server:

bash
uvicorn main:app --reload
The backend should now be running at http://127.0.0.1:8000.




Frontend (React.js)
Navigate to the frontend directory:

bash

cd frontendapp
Install dependencies:

bash
npm install

Start the React app:
npm start

