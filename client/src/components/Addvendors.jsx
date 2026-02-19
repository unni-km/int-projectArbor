import React, { useState } from 'react';
import { toast } from 'react-toastify';

const baseURL = process.env.REACT_APP_API_BASE_URL;
const AddVendors = ({ onVendorAdded, closePopup,defaultValues = {} }) => {
  const [vendor, setVendor] = useState({
    name: '',
    contact: '',
    email: '',
    asset: defaultValues.asset || 0,
  });

  const handleChange = (e) => {
    setVendor({ ...vendor, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    const { name, contact, email } = vendor;

    // Simple validation
    if (!name.trim()) {
      toast.error('Vendor name is required');
      return;
    }

    if (!/^\d{10}$/.test(contact)) {
      toast.error('Contact number must be exactly 10 digits');
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      toast.error('Enter a valid email address');
      return;
    }

    fetch(`${baseURL}/vendors/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vendor),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Something went wrong');
        }

        toast.success('Vendor added');
        onVendorAdded();
      })
      .catch((err) => {
        toast.error(err.message || 'Failed to add vendor');
      });
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content add-stock-form">
        <button className="close-popup" onClick={closePopup}>X</button>
        <h3>Add Vendor</h3>

        <input
          type="text"
          name="name"
          placeholder="Vendor Name"
          value={vendor.name}
          onChange={handleChange}
        />

        <input
          type="text"
          name="contact"
          placeholder="Contact Number"
          value={vendor.contact}
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={vendor.email}
          onChange={handleChange}
        />

        <button onClick={handleSubmit}>Add Vendor</button>
      </div>
    </div>
  );
};

export default AddVendors;
