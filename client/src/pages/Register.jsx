import React, { useState, useEffect } from "react";
import axios from "axios";
import './register.css';
import { toast } from 'react-toastify';

const baseURL = process.env.REACT_APP_API_BASE_URL;

const AddUserModal = ({ onClose, onUserAdded, user }) => {
 const [form, setForm] = useState({
  username: '',
  password: '',
  confirmPassword: '',
  role: '', 
});

  const [error, setError] = useState("");
  const [roleList, setroleList] = useState([]);

  useEffect(() => {
    fetch(`${baseURL}/login/roles`)
      .then((res) => res.json())
      .then((data) => setroleList(data))
      .catch((err) => console.error("Error loading items:", err));
  }, []);

  // Initialize form for edit mode
useEffect(() => {
  if (user) {
    setForm({
      username: user.username || '',
      password: '',
      confirmPassword: '',
      role: user.role_id, // FIX: use ID from DB
    });
  }
}, [user]);


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password, confirmPassword, role } = form;

    if (!username || !role) {
      setError("Username and role are required.");
      return;
    }

    if (!user && (!password || !confirmPassword)) {
      setError("Password and confirm password are required.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

   const role_id = form.role;


    try {
      if (user) {
        // Edit user
        await axios.put(`${baseURL}/login/${user.id}/update`, {
          username,
          ...(password ? { password } : {}), // only send password if entered
          role_id,
        });
        toast.success("User updated successfully!");
      } else {
        // Create user
      await axios.post(`${baseURL}/login/register`, {
  username,
  password,
  role_id: form.role,
});

        toast.success("User created successfully!");
      }

      onUserAdded();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || 'Operation failed');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{user ? 'Edit User' : 'Create User'}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Username"
            required
          />

          {/* Show password only for new user or if admin wants to change it */}
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder={user ? "New Password (leave blank to keep current)" : "Password"}
          />
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder={user ? "Confirm New Password" : "Confirm Password"}
          />

                 <select
  name="role"
  value={form.role}
  onChange={handleChange}
  className="w-full p-2 border rounded-lg"
>
  <option value="">Select role</option>
  {roleList.map((it) => (
    <option key={it.id} value={it.id}>
      {it.role}
    </option>
  ))}
</select>

          {error && <div className="error-message">{error}</div>}

          <div className="button-group">
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit">{user ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;
