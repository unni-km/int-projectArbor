import React, { useState, useEffect } from 'react';
import Navbar from '../components/NavbarAsset';
import AddLocation from '../components/AddLocation';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

const baseURL = process.env.REACT_APP_API_BASE_URL;

const LocationPage = () => {
  const [locations, setLocations] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [form, setForm] = useState({ LocationID: '', LocationName: '', Description: '' });
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [expandedLocationId, setExpandedLocationId] = useState(null);
  const [mappedAssets, setMappedAssets] = useState({});

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const res = await fetch(`${baseURL}/locations`);
      const data = await res.json();
      setLocations(data);
      setFilteredLocations(data);
    } catch (err) {
      console.error('Error fetching locations:', err);
    }
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const isEdit = locations.some(l => l.LocationID === form.LocationID && form.LocationID !== '');
    const method = isEdit ? 'PUT' : 'POST';
    const url = isEdit
      ? `${baseURL}/locations/update/${form.LocationID}`
      : `${baseURL}/locations/add`;

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const updatedLocation = await res.json();
      if (isEdit) {
        setLocations(prev =>
          prev.map(l => (l.LocationID === form.LocationID ? updatedLocation : l))
        );
      } else {
        setLocations(prev => [...prev, updatedLocation]);
      }
      setFilteredLocations(prev =>
        isEdit
          ? prev.map(l => (l.LocationID === form.LocationID ? updatedLocation : l))
          : [...prev, updatedLocation]
      );
      setForm({ LocationID: '', LocationName: '', Description: '' });
      setModalOpen(false);
      setIsEditing(false);
    } catch (err) {
      console.error('Error submitting location:', err);
    }
  };

  const handleAdd = () => {
    setForm({ LocationID: '', LocationName: '', Description: '' });
    setIsEditing(false);
    setModalOpen(true);
  };

  const handleEdit = loc => {
    setForm(loc);
    setIsEditing(true);
    setModalOpen(true);
  };

  const handleDelete = locationId => {
    confirmAlert({
      title: 'Confirm Delete',
      message: 'Are you sure you want to delete this location?',
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            try {
              await fetch(`${baseURL}/locations/delete/${locationId}`, { method: 'DELETE' });
              setLocations(prev => prev.filter(l => l.LocationID !== locationId));
              setFilteredLocations(prev => prev.filter(l => l.LocationID !== locationId));
            } catch (err) {
              console.error(err);
            }
          },
        },
        { label: 'No' },
      ],
    });
  };

  const toggleExpand = async locationId => {
    if (expandedLocationId === locationId) return setExpandedLocationId(null);
    setExpandedLocationId(locationId);
    try {
      const res = await fetch(`${baseURL}/locations/${locationId}/assets`);
      const data = await res.json();
      setMappedAssets(prev => ({ ...prev, [locationId]: data }));
    } catch (err) {
      console.error('Error fetching location assets:', err);
    }
  };

  const handleUnassign = (assetId, locationId) => {
    confirmAlert({
      title: 'Confirm Unassign',
      message: 'Are you sure you want to unassign this asset from the location?',
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            try {
              await fetch(`${baseURL}/locations/unassign/${assetId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userid: localStorage.getItem('userid') }),
              });
              toggleExpand(locationId);
            } catch (err) {
              console.error(err);
            }
          },
        },
        { label: 'No' },
      ],
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      {/* Header */}
      <div className="w-full bg-white shadow-sm border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-20">
        <h2 className="text-2xl font-semibold text-gray-800">Locations</h2>
        <button
          onClick={handleAdd}
          className="bg-green-600 text-white px-5 py-2 rounded-md hover:bg-green-700 transition"
        >
          + Add Location
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-6 max-w-7xl mx-auto w-full overflow-hidden">
        {/* Search */}
        <div className="mb-4 bg-white p-4 rounded shadow border border-gray-200 flex gap-4">
          <input
            type="text"
            placeholder="Search by Name or ID"
            className="border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none flex-1"
            onChange={e => {
              const val = e.target.value.toLowerCase();
              setFilteredLocations(
                locations.filter(
                  l =>
                    l.LocationName.toLowerCase().includes(val) ||
                    l.LocationID.toString().includes(val)
                )
              );
            }}
          />
        </div>

        {/* Table Container */}
        <div className="relative bg-white shadow-md rounded-lg border border-gray-200 max-h-[75vh] overflow-y-auto overflow-x-auto">
          <table className="min-w-full border-collapse text-sm">
            <thead className="bg-gray-100 text-gray-700 sticky top-0 z-10">
              <tr>
                {['#', 'Location ID', 'Name', 'Assets', 'Actions'].map(header => (
                  <th
                    key={header}
                    className="px-4 py-2 text-left border-b border-gray-300 font-semibold whitespace-nowrap"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredLocations.length > 0 ? (
                filteredLocations.map((loc, idx) => (
                  <React.Fragment key={loc.LocationID}>
                    <tr
                      className={`text-sm hover:bg-gray-50 ${
                        idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      }`}
                    >
                      <td className="px-4 py-2 border-b text-center">{idx + 1}</td>
                      <td className="px-4 py-2 border-b text-center">{loc.LocationID}</td>
                      <td className="px-4 py-2 border-b text-left">{loc.Description}</td>
                      <td className="px-4 py-2 border-b text-center whitespace-nowrap">
                        <button
                          onClick={() => toggleExpand(loc.LocationID)}
                          className="bg-gray-200 px-2 py-1 rounded hover:bg-gray-300 text-xs"
                        >
                          {expandedLocationId === loc.LocationID ? 'Hide' : 'Show'} Assets
                        </button>
                      </td>
                      <td className="px-4 py-2 border-b text-center whitespace-nowrap">
                        <div className="flex gap-1 justify-center">
                          <button
                            onClick={() => handleEdit(loc)}
                            className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 text-xs"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(loc.LocationID)}
                            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-xs"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Expanded Assets */}
                    {expandedLocationId === loc.LocationID && (
                      <tr>
                        <td colSpan={6} className="px-4 py-2 border-b bg-gray-50">
                          {mappedAssets[loc.LocationID]?.length > 0 ? (
                            <ul className="space-y-1">
                              {mappedAssets[loc.LocationID].map(asset => (
                                <li
                                  key={asset.AssetID}
                                  className="flex justify-between items-center bg-white p-2 rounded shadow-sm"
                                >
                                  <span>
                                    {asset.AssetCode} - {asset.item_name} (SN:{' '}
                                    {asset.SerialNumber || 'N/A'})
                                  </span>
                                  <button
                                    onClick={() =>
                                      handleUnassign(asset.AssetID, loc.LocationID)
                                    }
                                    className="text-red-500 hover:text-red-700 text-xs"
                                  >
                                    Unassign
                                  </button>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <div className="text-center text-gray-500 text-sm">
                              No assets mapped.
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-gray-500">
                    No locations found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <AddLocation
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          form={form}
          onChange={handleChange}
          onSubmit={handleSubmit}
          isEditing={isEditing}
        />
      </div>
    </div>
  );
};

export default LocationPage;
