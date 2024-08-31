// src/components/BlockSeats.js
import React, { useState } from 'react';
import axios from 'axios';  // Import Axios instance
import { useParams } from 'react-router-dom';

const BlockSeats = ({ token }) => {
  const { busId } = useParams();
  const [pickupPoint, setPickupPoint] = useState('');
  const [seatNumbers, setSeatNumbers] = useState('');
  const [blockingId, setBlockingId] = useState('');
  const [bookingId, setBookingId] = useState('');
  const [message, setMessage] = useState('');
  const [seatsBlocked, setSeatsBlocked] = useState('');
  const [error, setError] = useState('');

  const handleBlockSeats = async (e) => {
    e.preventDefault();
    // const seatNumbersArray = seatNumbers.split(',').map(num => num.trim());

    try {
      const response = await axios.post('http://localhost:8000/block_seats', 
      {
        bus_id: busId,
        pickup_point: pickupPoint,
        seat_numbers: seatNumbers,
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      console.log("Responses: ", response)
      setBlockingId(response.data.blocking_id);
      setMessage(response.data.message);
      setSeatsBlocked(response.data.seats_blocked)
      setError('');
    } catch (err) {
      console.error('Error blocking seats:', err);
      setError('Failed to block seats. Please try again.');
      setMessage('');
    }
  };

  const handleBookTicket = async () => {
    try {
      const response = await axios.post('http://localhost:8000/book_ticket', {
        blocking_id: blockingId,
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setBookingId(response.data.booking_id);
      setMessage(response.data.message);
      setError('');
    } catch (err) {
      console.error('Error booking ticket:', err);
      setError('Failed to book ticket. Please try again.');
      setMessage('');
    }
  };

  return (
    <div>
      <h2>Block Seats for Bus Id {busId}</h2>
      <form onSubmit={handleBlockSeats}>
        <div>
          <label>Pickup Point:</label>
          <input
            type="text"
            value={pickupPoint}
            onChange={(e) => setPickupPoint(e.target.value)}
          />
        </div>
        <div>
          <label>Seat Numbers (comma separated):</label>
          <input
            type="text"
            value={seatNumbers}
            onChange={(e) => setSeatNumbers(e.target.value)}
          />
        </div>
        {!bookingId && <button type="submit">Block Seats</button>}
        
      </form>
      {seatsBlocked && <p>Blocked Seats: {seatsBlocked}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
        <hr/>

        {message && <p>{message}</p>}
      {blockingId && (
        <div>
        {!bookingId &&
        <>
          <p>Blocking ID generated</p>
          <button onClick={handleBookTicket}>Book Ticket</button>
          </>
        }
        </div>
      )}
      
      {bookingId && 
      <>
    <h3>Booking confirmed</h3>
      <p>Booking ID: {bookingId}</p>
      <p>Bus Id: {busId}</p>
      <p>Pickup point: {pickupPoint}</p>
      <p>Seat Numbers: {seatNumbers}</p>
      </>
    }
      
      {error && <p style={{ color: 'red' }}>{error}</p>}

    </div>
  );
};

export default BlockSeats;
