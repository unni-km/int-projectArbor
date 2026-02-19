import React from 'react';

const AddLocation = ({ isOpen, onClose, form, onChange, onSubmit, isEditing }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h3 className="text-xl font-bold mb-4">
          {isEditing ? 'Edit Location' : 'Add Location'}
        </h3>
        <form onSubmit={onSubmit} className="space-y-4">
          <input
            type="text"
            name="LocationName"
            placeholder="Location Name"
            value={form.LocationName}
            onChange={onChange}
            required
            className="w-full border rounded p-2"
          />
          <textarea
            name="Description"
            placeholder="Description"
            value={form.Description}
            onChange={onChange}
            className="w-full border rounded p-2"
          ></textarea>

          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">
              {isEditing ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLocation;
