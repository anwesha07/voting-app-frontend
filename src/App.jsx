import { Route, Routes } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PrivateRoutes from './components/PrivateRoutes';
import Homepage from './components/Homepage';
import VoteEvents from './components/VoteEvents';
import Candidates from './components/Candidates';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // verify user login
    const TOKEN = localStorage.getItem('TOKEN');
    const config = {
      headers: {
        'x-token': TOKEN,
      },
    };
    axios
      .post(`${process.env.REACT_APP_SERVER_URL}/api/auth/verify`, {}, config)
      .then((res) => {
        const { isLoggedIn: status, ...newUser } = res.data;
        setIsLoggedIn(status);
        setUser(newUser);
      })
      .catch((error) => {
        console.log(error);
        setIsLoggedIn(false);
        setUser(null);
        localStorage.removeItem('TOKEN');
      });
  }, []);

  const handleLogout = () => {
    const TOKEN = localStorage.getItem('TOKEN');
    const config = {
      headers: {
        'x-token': TOKEN,
      },
    };
    axios
      .post(`${process.env.REACT_APP_SERVER_URL}/api/auth/logout`, {}, config)
      .then(() => {
        setIsLoggedIn(false);
        localStorage.removeItem('TOKEN');
        setUser(null);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  if (isLoggedIn === null) {
    return <div className="flex justify-center grow items-center h-screen bg-gray-100">Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={<Homepage setUser={setUser} setIsLoggedIn={setIsLoggedIn} isLoggedIn={isLoggedIn} />} />
      {/* eslint-disable-next-line max-len */}
      <Route element={<PrivateRoutes isLoggedIn={isLoggedIn} user={user} handleLogout={handleLogout} />}>
        <Route path="/events" element={<VoteEvents user={user} />} />
        <Route path="/events/:id" element={<Candidates user={user} />} />
      </Route>
    </Routes>
  );
}

export default App;
