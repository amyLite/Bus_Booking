// src/components/BusSearch.js
import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const BusSearch = ({ token }) => {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [buses, setBuses] = useState([]);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:8000/search_buses',
        { source, destination, date },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setBuses(response.data);
      setError(null);
    } catch (err) {
      console.error('Error searching buses:', err);
      setError('No Buses found for these criteria');
    }
  };

  return (
    <div>
      <h2>Search Buses</h2>
      <form onSubmit={handleSearch}>
        <div>
          <label>Source:</label>
          <input
            type="text"
            value={source}
            onChange={(e) => setSource(e.target.value)}
          />
        </div>
        <div>
          <label>Destination:</label>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
        </div>
        <div>
          <label>Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <button type="submit">Search</button>
      </form>

      {error ? (<p style={{ color: 'red' }}>{error}</p>) : 
      (<ul>
        {buses.map(bus => (
          <li key={bus.bus_id}>
            {bus.bus_name} - {bus.start_time} - Available Seats: {bus.available_seats}
            <p>Stops: {bus.stops.join(', ')}</p>
            <Link to={`/block-seats/${bus.bus_id}`}>Block Seats</Link>
            <hr/>
          </li>
        ))}
      </ul>)}


    </div>
  );
};

export default BusSearch;
