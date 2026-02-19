import React, { useState } from 'react';
import axios from 'axios';
import './Collect.css';

const baseURL = process.env.REACT_APP_API_BASE_URL;

const CheckoutPopup = ({ visitor, onClose, onCheckoutSuccess }) => {
  const [confirmName, setConfirmName] = useState(false);
  const [confirmIdCard, setConfirmIdCard] = useState(false);
  const [confirmGuests, setConfirmGuests] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isGuestRequired = parseInt(visitor.guest_count) > 0;

  const handleSubmit = async () => {
    if (!confirmName || !confirmIdCard || (isGuestRequired && !confirmGuests)) {
      setError('Please confirm all required fields.');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${baseURL}/visitor/checkout/${visitor.id}`, {
        checkout_time: new Date().toISOString(),
        userid: localStorage.getItem('userid'),
      });
      onCheckoutSuccess();
      onClose();
    } catch (err) {
      setError('Failed to update checkout. Try again.');
      setLoading(false);
    }
  };

  return (
    <div className="checkout-popup-overlay">
      <div className="checkout-popup">
        <h2>Checkout Visitor</h2>

        <div className="confirm-row">
          <span><strong>Name:</strong> {visitor.visitor_name}</span>
          <label className="confirm-label-inline">
            <input
              type="checkbox"
              checked={confirmName}
              onChange={() => {
                setConfirmName(!confirmName);
                setError('');
              }}
            />
            Confirm Name
          </label>
        </div>

        <div className="confirm-row">
          <span><strong>ID Card:</strong> {visitor.card_number}</span>
          <label className="confirm-label-inline">
            <input
              type="checkbox"
              checked={confirmIdCard}
              onChange={() => {
                setConfirmIdCard(!confirmIdCard);
                setError('');
              }}
            />
            Confirm ID Card
          </label>
        </div>

        {isGuestRequired && (
          <div className="confirm-row">
            <span>
              <strong>Guests:</strong> Confirm {visitor.guest_count} guests with {visitor.visitor_name}
            </span>
            <label className="confirm-label-inline">
              <input
                type="checkbox"
                checked={confirmGuests}
                onChange={() => {
                  setConfirmGuests(!confirmGuests);
                  setError('');
                }}
              />
              Confirm Guests
            </label>
          </div>
        )}

        {error && <p className="error-message">{error}</p>}

        <div className="buttons">
          <button onClick={onClose} disabled={loading}>Cancel</button>
          <button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Updating...' : 'Confirm Checkout'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPopup;
