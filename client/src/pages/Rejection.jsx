import './RequestForm.css';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

const baseURL = process.env.REACT_APP_API_BASE_URL;
function RejectRequest() {
  const { id } = useParams();
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');

  const handleReject = async (e) => {
    e.preventDefault();
    setStatus('Processing...');

    try {
      const res = await fetch(`${baseURL}/transactions/reject/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      setStatus(res.ok ? '❌ Request rejected successfully.' : `❌ ${data.error}`);
    } catch (err) {
      setStatus('❌ Server error.');
    }
  };

  return (
    <div className="request-container">
      <h2 className="request-title">Reject Pantry Request</h2>
      <form onSubmit={handleReject} className="request-form">
        <input
          type="password"
          placeholder="Admin Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="request-input"
          required
        />
        <button
          type="submit"
          className="request-button"
          style={{ backgroundColor: '#dc3545' }}
        >
          ❌ Reject
        </button>
      </form>
      {status && <p className="request-status">{status}</p>}
    </div>
  );
}

export default RejectRequest;
