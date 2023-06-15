import axios from 'axios';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

function Register(props) {
  const { setUser, setIsLoggedIn, setUserRegistered } = props;

  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    aadhaar: '',
    password: '',
    confirmPassword: '',
  });

  const [formErrors, setFormErrors] = useState({
    userNameError: '',
    emailError: '',
    aadhaarError: '',
    passwordError: '',
    confirmPasswordError: '',
  });

  const notify = (message) => {
    toast.error(message, {
      position: 'top-center',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const handleChange = (event) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [event.target.name]: event.target.value,
    }));
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const isValidAadhaar = (aadhaar) => {
    const regex = /^\d{12}$/;
    return regex.test(aadhaar);
  };

  const isFormFilled = () => {
    let formFilled = true;
    Object.keys(formData).forEach((field) => {
      if (!formData[field]) {
        formFilled = false;
      }
    });
    return formFilled;
  };

  const validateForm = () => {
    const errors = {};

    if (formData.userName.length < 3 || formData.userName.length > 30) {
      errors.userNameError = 'Username should be between 3 to 30 characters long!';
    }

    if (!isValidEmail(formData.email)) {
      errors.emailError = 'Invalid email';
    }
    if (!isValidAadhaar(formData.aadhaar)) {
      errors.aadhaarError = 'Invalid Aadhaar ID';
    }
    if (formData.password.length < 8) {
      errors.passwordError = 'Password should be at least 8 characters long';
    }
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPasswordError = 'Passwords do not match';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // validate fields entered
    const isFormValid = validateForm();
    if (isFormValid) {
      console.log(formData);
      axios
        .post(`${process.env.REACT_APP_SERVER_URL}/api/auth/register`, formData)
        .then((res) => {
          console.log(res.data);
          const { token, ...newUser } = res.data;
          localStorage.setItem('TOKEN', token);
          setUser(newUser);
          console.log(newUser);
          setIsLoggedIn(true);
        })
        .catch((err) => {
          if (!err.response) notify('Something went wrong!');
          else if (err.response.status === 400) notify(err.response.data.message);
          else if (err.response.status === 409) notify('User already exists!');
          else notify('Something went wrong!');
        });
    }
  };

  return (
    <div className="max-w-[500px] w-full mx-auto bg-white shadow p-6 rounded flex flex-col justify-center">
      <h2 className="text-xl font-semibold mb-4">Register yourself to vote!</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="userName" className="block mb-2 font-medium">
            Username:
            <input
              type="text"
              id="userName"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 rounded"
            />
          </label>
          {formErrors.userNameError && <div className="text-red-500 mt-1">{formErrors.userNameError}</div>}
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block mb-2 font-medium">
            Email:
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 rounded"
            />
          </label>
          {formErrors.emailError && <div className="text-red-500 mt-1">{formErrors.emailError}</div>}
        </div>
        <div className="mb-4">
          <label htmlFor="aadhaar" className="block mb-2 font-medium">
            Aadhaar Number:
            <input
              type="text"
              id="aadhaar"
              name="aadhaar"
              value={formData.aadhaar}
              onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 rounded"
            />
          </label>
          {formErrors.aadhaarError && <div className="text-red-500 mt-1">{formErrors.aadhaarError}</div>}
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block mb-2 font-medium">
            Password:
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 rounded"
            />
          </label>
          {formErrors.passwordError && <div className="text-red-500 mt-1">{formErrors.passwordError}</div>}
        </div>
        <div className="mb-4">
          <label htmlFor="confirmPassword" className="block mb-2 font-medium">
            Confirm Password:
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 rounded"
            />
          </label>
          {formErrors.confirmPasswordError && (
            <div className="text-red-500 mt-1">{formErrors.confirmPasswordError}</div>
          )}
        </div>
        <button
          type="submit"
          disabled={!isFormFilled()}
          className={`w-full bg-blue-500 text-white py-2 px-4 rounded ${
            isFormFilled() ? 'cursor-pointer' : 'cursor-not-allowed'
          }`}
        >
          Register
        </button>
      </form>
      <button type="button" className="text-blue-500 mt-2 cursor-pointer" onClick={() => setUserRegistered(true)}>
        Already registered? Login here
      </button>
    </div>
  );
}

Register.propTypes = {
  setUser: PropTypes.func.isRequired,
  setIsLoggedIn: PropTypes.func.isRequired,
  setUserRegistered: PropTypes.func.isRequired,
};

export default Register;
