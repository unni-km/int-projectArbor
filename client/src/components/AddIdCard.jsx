import React, { useState, useEffect } from 'react';
import './AddIdCard.css';

const baseURL = process.env.REACT_APP_API_BASE_URL;

const AddIdCardPopup = ({ onClose, onAdd, editData = null, isEdit = false }) => {
  const [formData, setFormData] = useState({
    card_number: '',
    serial_no: '',
    userid: localStorage.getItem('userid'),
  });

  // Prefill form if editing
  useEffect(() => {
    if (isEdit && editData) {
      setFormData({
        card_number: editData.card_number || '',
        serial_no: editData.serial_no || '',
        userid: localStorage.getItem('userid'),
      });
    }
  }, [isEdit, editData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = isEdit
      ? `${baseURL}/idcard/update/${editData.card_id}`
      : `${baseURL}/idcard/add`;
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        onAdd?.(); // Refresh list
        onClose();
      } else {
        alert(data.error || 'Operation failed');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong!');
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-card">
        <h2>{isEdit ? 'Edit ID Card' : 'Add New ID Card'}</h2>
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label>Card Number</label>
            <input
              type="text"
              name="card_number"
              value={formData.card_number}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Serial Number</label>
            <input
              type="text"
              name="serial_no"
              value={formData.serial_no}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary">
              {isEdit ? 'Update' : 'Add'}
            </button>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddIdCardPopup;
