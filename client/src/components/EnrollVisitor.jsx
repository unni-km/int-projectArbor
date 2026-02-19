import React, { useEffect, useState } from 'react';
import './EnrollVisitor.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const baseURL = process.env.REACT_APP_API_BASE_URL;
const EnrollVisitorPopup = ({ onClose }) => {
  const [formData, setFormData] = useState({
    visitor_name: '',
    company_name: '',
    contact_no: '',
    purpose_of_visit: '',
    guest_count: '1',
    remarks: '',
    card_id: '',
    userid: localStorage.getItem('userid'),
  });

  const [idCards, setIdCards] = useState([]);

  useEffect(() => {
    fetchAvailableCards();
  }, []);

  const fetchAvailableCards = async () => {
    try {
      const res = await fetch(`${baseURL}/idcard/cards`);
      const data = await res.json();
      setIdCards(data);
    } catch (err) {
      console.error("Failed to fetch ID cards:", err);
    }
  };

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const { visitor_name, contact_no, card_id } = formData;

    // Simple validation
    if (!visitor_name.trim()) {
      toast.error('Visitor name is required');
      return;
    }

    if (!/^\d{10}$/.test(contact_no)) {
      toast.error('Contact number must be exactly 10 digits');
      return;
    }

    if (!card_id) {
      toast.error('Please select an ID card');
      return;
    }

    try {
      const res = await fetch(`${baseURL}/visitor/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await res.json();
      if (res.ok) {
        toast.success(result.message || 'Visitor enrolled successfully');
        onClose();
      } else {
        toast.error(result.message || 'Enrollment failed');
      }
    } catch (err) {
      toast.error('Something went wrong');
    }
  };

  return (
    <div className="popup-backdrop">
      <div className="popup-box">
        <h2>Enroll Visitor</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Visitor Name *</label>
            <input type="text" name="visitor_name" onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Company Name</label>
            <input type="text" name="company_name" onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Contact No *</label>
            <input type="text" name="contact_no" onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Purpose of Visit</label>
            <input type="text" name="purpose_of_visit" onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Guest Count</label>
            <input type="number" name="guest_count" value={formData.guest_count} onChange={handleChange} min="1" />
          </div>

          <div className="form-group">
            <label>Remarks</label>
            <input type="text" name="remarks" onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Issue ID Card *</label>
            <select name="card_id" value={formData.card_id} onChange={handleChange} required>
              <option value="">-- Select Card --</option>
              {idCards.map(card => (
                <option key={card.card_id} value={card.card_id}>
                  {card.card_number}
                </option>
              ))}
            </select>
          </div>

          <div className="popup-actions">
            <button type="submit" className="submit-btn">Submit</button>
            <button type="button" onClick={onClose} className="cancel-btn">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EnrollVisitorPopup;
