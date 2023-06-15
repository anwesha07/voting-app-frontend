/* eslint-disable no-underscore-dangle */
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function Candidates() {
  const { id } = useParams();
  const [candidates, setCandidates] = useState([]);
  const [event, setEvent] = useState(null);
  const [hasUserVoted, setHasUserVoted] = useState(false);
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
    const config = {
      headers: {
        'x-token': localStorage.getItem('TOKEN'),
      },
    };
    axios
      .get(`${process.env.REACT_APP_SERVER_URL}/api/voteEvents/${id}`, config)
      .then((res) => {
        console.log(res.data);
        const { candidates: newCandidates, hasVotedUser, ...newEvent } = res.data;
        setCandidates(newCandidates);
        setEvent(newEvent);
        setHasUserVoted(hasVotedUser);
      })
      .catch((err) => {
        console.log(err.response);
        notify('Something went wrong!');
        navigate('/events');
      });
  }, []);

  const voteCandidate = (candidateId) => {
    console.log(candidateId);
    const config = {
      headers: {
        'x-token': localStorage.getItem('TOKEN'),
      },
    };
    axios
      // eslint-disable-next-line no-underscore-dangle
      .post(`${process.env.REACT_APP_SERVER_URL}/api/voteEvents/${event._id}/vote`, { candidate: candidateId }, config)
      .then((res) => {
        console.log(res.data);
        setHasUserVoted(true);
      })
      .catch((error) => {
        console.log(error);
        notify('Sorry! Failed to cast your vote. Try again!');
      });
  };

  if (event === null) return <div className="flex justify-center items-center grow w-full bg-gray-100">Loading...</div>;

  return (
    <div className="flex justify-center items-center grow w-full bg-gray-100">
      <div className="max-w-lg w-full h-[90%] overflow-y-auto flex flex-col justify-start p-6 bg-white shadow p-6 rounded">
        <h1 className="text-2xl font-semibold mb-4">{event.name}</h1>
        <hr className="mb-6" />
        {hasUserVoted ? (
          <div className="text-red-500">You have already voted here!</div>
        ) : (
          <div className="space-y-4">
            {candidates.map((candidate) => (
              <div key={candidate._id} className="bg-white rounded-lg shadow p-4 flex flex-col justify-between">
                <div>
                  <div className="font-medium text-lg">{candidate.name}</div>
                  <div className="text-sm text-gray-500">
                    {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
                    Gender: {candidate.gender}, Age: {candidate.age}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => voteCandidate(candidate._id)}
                  className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 self-end"
                >
                  Vote
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Candidates;
