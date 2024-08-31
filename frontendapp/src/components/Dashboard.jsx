import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BusSearch from './BusSearch';

const Dashboard = ({ token }) => {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [bookingHistory, setBookingHistory] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('http://localhost:8000/users/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setUser(response.data);
        setEmail(response.data.email)
        
        if (response.data === null) {
            localStorage.removeItem('token');
        }

      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };

  const fetchBookingHistory = async () => {
    try {
      const response = await axios.post('http://localhost:8000/booking_history',
      {"user_id":email},
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      console.log("Resposes:", bookingHistory)
      setBookingHistory(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching booking history:', err);
      setError('No Bookings found for this user');
    }
  };

  return (
    <div>
      <h2>Dashboard</h2>
      {user ? (
        <div>
          <p>Welcome, {user.email}!</p>
          <button onClick={fetchBookingHistory}>History</button>
          <br/>
          {bookingHistory &&     
            <div>
            <h2>Booking History</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <ul>
                {bookingHistory.map((booking) => (
                <li key={booking.booking_id}>
                    <p>User name: {booking.user}</p>
                    <p>Booking ID: {booking.booking_id}</p>
                    <p>Booked On: {booking.booked_on}</p>
                    <p>Seat Numbers: {booking.blocked_seats}</p>
                </li>
                ))}
            </ul>
            </div>
        }
          <br/>
          <hr/>
          <BusSearch token={token}/>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Dashboard;
