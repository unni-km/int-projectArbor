import './RequestForm.css'; // 👈 import the shared stylesheet
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

const baseURL = process.env.REACT_APP_API_BASE_URL;
function ApproveTransaction() {
  const { id } = useParams();
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');

  const handleApprove = async (e) => {
    e.preventDefault();
    setStatus('Processing...');

    try {
      const res = await fetch(`${baseURL}/transactions/${id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      setStatus(res.ok ? '✅ Request approved!' : `❌ ${data.error}`);
    } catch (err) {
      setStatus('❌ Server error.');
    }
  };

  return (
    <div className="request-container">
      <h2 className="request-title">Approve Pantry Request</h2>
      <form onSubmit={handleApprove} className="request-form">
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
          style={{ backgroundColor: '#28a745' }}
        >
          ✅ Approve
        </button>
      </form>
      {status && <p className="request-status">{status}</p>}
    </div>
  );
}

export default ApproveTransaction;