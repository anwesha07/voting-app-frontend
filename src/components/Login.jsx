import axios from 'axios';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

function Login(props) {
  const { setUser, setIsLoggedIn, setUserRegistered } = props;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formErrors, setFormErrors] = useState({
    emailError: '',
    passwordError: '',
  });

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const isValidEmail = (e) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(e);
  };

  const validateForm = () => {
    const errors = {};
    if (!isValidEmail(email)) {
      errors.emailError = 'Invalid email';
    } else {
      errors.emailError = '';
    }
    if (password.length < 8) {
      errors.passwordError = 'Password should be at least 8 characters long';
    } else {
      errors.passwordError = '';
    }

    setFormErrors(errors);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    validateForm();
    // Perform API call or further validation here
    // Replace the API_URL with your actual API endpoint
    const data = {
      email,
      password,
    };
    // console.log(data);
    axios
      .post(`${process.env.REACT_APP_SERVER_URL}/api/auth/login`, data)
      .then((res) => {
        const { token, ...newUser } = res.data;
        localStorage.setItem('TOKEN', token);
        setUser(newUser);
        setIsLoggedIn(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="max-w-[500px] w-full mx-auto bg-white shadow p-6 rounded flex flex-col justify-center">
      <h2 className="text-xl font-semibold mb-4">Login to vote now!</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block mb-2 font-medium">
            Email:
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleEmailChange}
              className="w-full border border-gray-300 px-3 py-2 rounded"
              required
            />
          </label>
          {formErrors.emailError && <div className="text-red-500 mt-1">{formErrors.emailError}</div>}
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block mb-2 font-medium">
            Password:
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={handlePasswordChange}
              className="w-full border border-gray-300 px-3 py-2 rounded"
              required
            />
          </label>
          {formErrors.passwordError && <div className="text-red-500 mt-1">{formErrors.passwordError}</div>}
        </div>
        <button
          type="submit"
          disabled={!(email && password)}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded cursor-pointer disabled:cursor-not-allowed"
        >
          Login
        </button>
      </form>
      <button type="button" className="text-blue-500 mt-2 cursor-pointer" onClick={() => setUserRegistered(false)}>
        Not registered? Register here
      </button>
    </div>
  );
}

Login.propTypes = {
  setUser: PropTypes.func.isRequired,
  setIsLoggedIn: PropTypes.func.isRequired,
  setUserRegistered: PropTypes.func.isRequired,
};

export default Login;
