import React, { useRef, useState, useEffect } from 'react';

const AddStaff = ({ isOpen, onClose, form, onChange, onSubmit, onImageUpload, isEditing }) => {
  const fileInputRef = useRef(null);
  const [locations, setLocations] = useState([]);
  const baseURL = process.env.REACT_APP_API_BASE_URL;

  // ✅ Hooks must come before any conditional returns
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await fetch(`${baseURL}/locations`);
        const data = await res.json();
        setLocations(data);
      } catch (err) {
        console.error('Failed to load locations', err);
      }
    };
    fetchLocations();
  }, [baseURL]);

  // ❌ Moved after hooks
  if (!isOpen) return null;

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      await onImageUpload(file); // Delegate to parent component
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg overflow-y-auto max-h-[90vh]">
        <h2 className="text-xl font-bold mb-4">{isEditing ? 'Edit Staff' : 'Add Staff'}</h2>

        <form onSubmit={onSubmit} className="space-y-4">
          <input
            name="StaffID"
            placeholder="StaffID"
            value={form.StaffID}
            onChange={onChange}
            className="w-full border p-2 rounded"
            required
            disabled={isEditing}
          />
          <input
            name="Name"
            placeholder="Name"
            value={form.Name}
            onChange={onChange}
            className="w-full border p-2 rounded"
            required
          />
          <input
            name="Team"
            placeholder="Team"
            value={form.Team}
            onChange={onChange}
            className="w-full border p-2 rounded"
          />

          {/* ✅ Location Dropdown */}
          <div>
            <label className="block mb-1 font-medium">Location</label>
            <select
              name="Location"
              value={form.Location}
              onChange={onChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            >
              <option value="">Select Location</option>
              {locations.map((loc) => (
                <option key={loc.LocationID} value={loc.LocationID}>
                  {loc.Description}
                </option>
              ))}
            </select>
          </div>

          {/* Profile Picture Upload */}
          <div>
            <label className="block font-medium mb-1">Profile Picture</label>
            {form.PictureURL && (
              <img
                src={form.PictureURL ? `${baseURL}/${form.PictureURL}` : '/default-avatar.png'}
                alt="Preview"
                className="w-24 h-24 rounded-full object-cover mb-2"
              />
            )}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                         file:rounded-full file:border-0
                         file:text-sm file:font-semibold
                         file:bg-blue-50 file:text-blue-700
                         hover:file:bg-blue-100"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`${
                isEditing ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-blue-600 hover:bg-blue-700'
              } text-white px-4 py-2 rounded`}
            >
              {isEditing ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStaff;
