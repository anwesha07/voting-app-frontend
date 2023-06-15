/* eslint-disable no-underscore-dangle */
import axios from 'axios';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function VoteEvents(props) {
  const { user } = props;
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  const notify = (message) => {
    toast.error(message, {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  useEffect(() => {
    // fetch the current voting events
    const config = {
      headers: {
        'x-token': localStorage.getItem('TOKEN'),
      },
    };
    axios
      .get(`${process.env.REACT_APP_SERVER_URL}/api/voteEvents/active`, config)
      .then((res) => {
        console.log(res.data);
        setEvents(res.data);
      })
      .catch((err) => {
        console.log(err.response);
        notify('Something went wrong!');
      });
  }, []);

  const voteCandidate = (eventId) => {
    navigate(`/events/${eventId}`);
  };

  return (
    <div className="flex justify-center items-center grow w-full bg-gray-100">
      <div className="max-w-lg w-full h-[90%] overflow-y-auto flex flex-col justify-start p-6 bg-white shadow p-6 rounded">
        {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
        <h1 className="text-2xl font-semibold mb-4">Welcome, {user.userName}</h1>
        <hr className="mb-6" />
        <div className="space-y-4">
          {events.map((event) => (
            <div key={event._id} className="bg-white rounded-lg shadow p-4 flex flex-col justify-between">
              <div className="text-lg font-medium">{event.name}</div>
              <div className="text-gray-500 mt-2">
                {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
                Start Date: {new Date(event.startDate).toLocaleDateString('en-US')}
              </div>
              {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
              <div className="text-gray-500">End Date: {new Date(event.endDate).toLocaleDateString('en-US')}</div>
              <button
                type="button"
                onClick={() => voteCandidate(event._id)}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Vote
              </button>
            </div>
          ))}
          {events.length === 0 ? <div>No voting events to show!</div> : null}
        </div>
      </div>
    </div>
  );
}

VoteEvents.propTypes = {
  user: PropTypes.shape({
    userName: PropTypes.string.isRequired,
  }),
};

VoteEvents.defaultProps = {
  user: {
    userName: 'Guest',
  },
};

export default VoteEvents;
