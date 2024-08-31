import logo from './logo.svg';
import './App.css';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import BlockSeats from './components/BlockSeats';
import { useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  const saveToken = (userToken) => {
    localStorage.setItem('token', userToken);
    setToken(userToken);
  };

  return (
    <BrowserRouter>
    <div className="App">
  
            {!token ? (
        <Login setToken={saveToken} />
      ) : (
        
      
      <Routes>
            <Route path="/" element={<Dashboard token={token} />} />
            <Route path="/block-seats/:busId" element={<BlockSeats token={token}/>} />
      </Routes>
    )}
    </div>
    </BrowserRouter>
  );
}

export default App;
