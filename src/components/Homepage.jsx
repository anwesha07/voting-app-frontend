/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

import Register from './Register';
import Login from './Login';

function Homepage(props) {
  const { setUser, setIsLoggedIn, isLoggedIn } = props;
  const navigate = useNavigate();

  const [userRegistered, setUserRegistered] = useState(false);

  useEffect(() => {
    if (isLoggedIn) navigate('/events');
  }, [isLoggedIn]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      {!userRegistered ? (
        <Register setUserRegistered={setUserRegistered} setUser={setUser} setIsLoggedIn={setIsLoggedIn} />
      ) : (
        <Login setUserRegistered={setUserRegistered} setUser={setUser} setIsLoggedIn={setIsLoggedIn} />
      )}
    </div>
  );
}

Homepage.propTypes = {
  setUser: PropTypes.func.isRequired,
  setIsLoggedIn: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
};

export default Homepage;
