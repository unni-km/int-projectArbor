import React, { useState, useEffect } from 'react';
import AddStaff from '../components/AddStaff';
import Navbar from '../components/NavbarAsset';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

const baseURL = process.env.REACT_APP_API_BASE_URL;

const StaffPage = () => {
  const [staff, setStaff] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ StaffID: '', Name: '', Team: '', Location: '', PictureURL: '' });
  const [imageFile, setImageFile] = useState(null);
  const [expandedStaffId, setExpandedStaffId] = useState(null);
  const [assignedAssets, setAssignedAssets] = useState({});

  useEffect(() => {
    let isMounted = true;
    fetchStaff(isMounted);
    return () => { isMounted = false };
  }, []);

  const fetchStaff = async (isMounted = true) => {
    try {
      const res = await fetch(`${baseURL}/staff`);
      const data = await res.json();
      if (isMounted) {
        setStaff(data);
        setFilteredStaff(data);
        const assetData = {};
        for (const s of data) {
          const res2 = await fetch(`${baseURL}/staff/${s.StaffID}/assets`);
          const assets = await res2.json();
          assetData[s.StaffID] = assets;
        }
        setAssignedAssets(assetData);
      }
    } catch (err) {
      console.error("Error fetching staff:", err);
    }
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const isEdit = staff.some(s => s.StaffID === form.StaffID && form.StaffID !== '');
    const method = isEdit ? 'PUT' : 'POST';
    const url = isEdit ? `${baseURL}/staff/update/${form.StaffID}` : `${baseURL}/staff/add`;

    const formData = new FormData();
    formData.append("StaffID", form.StaffID);
    formData.append("Name", form.Name);
    formData.append("Team", form.Team);
    formData.append("Location", form.Location);
    if (imageFile) formData.append("image", imageFile);

    try {
      await fetch(url, { method, body: formData });
      fetchStaff();
      setForm({ StaffID: '', Name: '', Team: '', Location: '', PictureURL: '' });
      setImageFile(null);
      setModalOpen(false);
    } catch (err) {
      console.error("Error submitting form:", err);
    }
  };

  const handleEdit = s => {
    setForm(s);
    setIsEditing(true);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setForm({ StaffID: '', Name: '', Team: '', Location: '', PictureURL: '' });
    setIsEditing(false);
    setModalOpen(true);
  };

  const handleDelete = staffId => {
    confirmAlert({
      title: 'Confirm Delete',
      message: 'Are you sure you want to delete this staff member?',
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            try {
              await fetch(`${baseURL}/staff/delete/${staffId}`, { method: 'DELETE' });
              fetchStaff();
            } catch (err) {
              console.error(err);
            }
          }
        },
        { label: 'No' }
      ]
    });
  };

  const toggleExpand = async staffId => {
    if (expandedStaffId === staffId) return setExpandedStaffId(null);
    setExpandedStaffId(staffId);
    try {
      const res = await fetch(`${baseURL}/staff/${staffId}/assets`);
      const data = await res.json();
      setAssignedAssets(prev => ({ ...prev, [staffId]: data }));
    } catch (err) {
      console.error("Error fetching assets:", err);
    }
  };

  const handleUnassign = (assetId, staffId) => {
    confirmAlert({
      title: 'Confirm Unassign',
      message: 'Are you sure you want to unassign this asset?',
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            await fetch(`${baseURL}/staff/unassign/${assetId}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ userid: localStorage.getItem('userid') })
            });
            toggleExpand(staffId);
          }
        },
        { label: 'No' }
      ]
    });
  };

  const hasNoAssets = (staffId) => {
    const assets = assignedAssets[staffId];
    return !assets || assets.length === 0;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      {/* Header */}
      <div className="w-full bg-white shadow-sm border-b border-gray-200 px-8 py-3 flex items-center justify-between sticky top-0 z-20">
        <h2 className="text-2xl font-semibold text-gray-800">Staff List</h2>
        <button
          onClick={handleAdd}
          className="bg-green-600 text-white px-5 py-2 rounded-md hover:bg-green-700 transition"
        >
          + Add Staff
        </button>
      </div>

      {/* Search & Table Section */}
      <div className="flex-1 p-6 max-w-7xl mx-auto w-full overflow-hidden">
        {/* Search */}
        <div className="mb-4 bg-white p-4 rounded shadow border border-gray-200 flex gap-4">
          <input
            type="text"
            placeholder="Search by Name, Team, or ID"
            className="border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none flex-1"
            onChange={e => {
              const val = e.target.value.toLowerCase();
              setFilteredStaff(staff.filter(s =>
                s.Name.toLowerCase().includes(val) ||
                s.Team.toLowerCase().includes(val) ||
                s.StaffID.toString().includes(val)
              ));
            }}
          />
        </div>

        {/* Table */}
        <div className="relative bg-white shadow-md rounded-lg border border-gray-200 max-h-[75vh] overflow-y-auto overflow-x-auto">
          <table className="min-w-full border-collapse text-sm">
            <thead className="bg-gray-100 text-gray-700 sticky top-0 z-10">
              <tr>
                {["#", "Staff ID", "Name", "Team", "Location", "Assets", "Actions"].map(header => (
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
              {filteredStaff.length > 0 ? (
                filteredStaff.map((s, idx) => {
                  const isNoAsset = hasNoAssets(s.StaffID);
                  return (
                    <React.Fragment key={s.StaffID}>
                      <tr
                        className={`hover:bg-gray-50 ${
                          isNoAsset
                            ? 'bg-red-50 hover:bg-red-100'
                            : idx % 2 === 0
                            ? 'bg-white'
                            : 'bg-gray-50'
                        }`}
                      >
                        <td className="px-4 py-2 border-b text-center">{idx + 1}</td>
                        <td className="px-4 py-2 border-b text-center">{s.StaffID}</td>
                        <td className="px-4 py-2 border-b text-left">{s.Name}</td>
                        <td className="px-4 py-2 border-b text-left">{s.Team}</td>
                        <td className="px-4 py-2 border-b text-left">{s.Description || s.Location}</td>
                        <td className="px-4 py-2 border-b text-center">
                          <button
                            onClick={() => toggleExpand(s.StaffID)}
                            className="bg-gray-200 px-2 py-1 rounded hover:bg-gray-300 text-xs whitespace-nowrap"
                          >
                            {expandedStaffId === s.StaffID ? "Hide" : "Show"} Assets
                          </button>
                        </td>
                        <td className="px-4 py-2 border-b text-center whitespace-nowrap">
                          <div className="flex gap-1 justify-center">
                            <button
                              onClick={() => handleEdit(s)}
                              className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 text-xs"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(s.StaffID)}
                              className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-xs"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>

                      {expandedStaffId === s.StaffID && (
                        <tr>
                          <td colSpan={7} className="px-4 py-2 border-b bg-gray-50">
                            {assignedAssets[s.StaffID]?.length > 0 ? (
                              <ul className="space-y-1">
                                {assignedAssets[s.StaffID].map(asset => (
                                  <li
                                    key={asset.AssetID}
                                    className="flex justify-between items-center bg-white p-2 rounded shadow-sm"
                                  >
                                    <span>
                                      {asset.AssetCode} - {asset.item_name} (SN:{" "}
                                      {asset.SerialNumber || "N/A"})
                                    </span>
                                    <button
                                      onClick={() => handleUnassign(asset.AssetID, s.StaffID)}
                                      className="text-red-500 hover:text-red-700 text-xs"
                                    >
                                      Unassign
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <div className="text-center text-gray-500 text-sm">
                                No assets mapped
                              </div>
                            )}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-gray-500">
                    No staff found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Add/Edit Modal */}
        <AddStaff
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          form={form}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onImageUpload={setImageFile}
          isEditing={isEditing}
        />
      </div>
    </div>
  );
};

export default StaffPage;
