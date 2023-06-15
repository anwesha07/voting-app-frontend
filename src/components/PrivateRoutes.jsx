import React from 'react';
import PropTypes from 'prop-types';
import { Navigate, Link, Outlet } from 'react-router-dom';

function PrivateRoutes(props) {
  const { isLoggedIn, handleLogout } = props;

  return isLoggedIn ? (
    <div className="flex flex-col justify-center items-center w-screen h-screen">
      <nav className="bg-gray-800 py-4 px-6 w-full">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="text-white font-semibold text-xl hover:text-gray-300">
              Online Voting App
            </Link>
          </div>
          <div>
            <button
              type="button"
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
      <Outlet />
    </div>
  ) : (
    <Navigate to="/" />
  );
}

PrivateRoutes.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  handleLogout: PropTypes.func.isRequired,
};

export default PrivateRoutes;
