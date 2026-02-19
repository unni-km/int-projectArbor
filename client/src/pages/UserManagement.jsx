import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddUserModal from './Register';
import { ToastContainer } from 'react-toastify';
import Navbar from '../components/NavBarUser';
import { FiEdit } from 'react-icons/fi';

const baseURL = process.env.REACT_APP_API_BASE_URL;

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [leaveRecords, setLeaveRecords] = useState([]);
  const [showAddUser, setShowAddUser] = useState(false); // can be boolean or user object
  const [activeTab, setActiveTab] = useState('users');

  useEffect(() => {
    fetchUsers();
    fetchLeaveRecords();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${baseURL}/login/users`);
      setUsers(res.data);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const fetchLeaveRecords = async () => {
    try {
      const res = await axios.get(`${baseURL}/login/leaves`);
      setLeaveRecords(res.data);
    } catch (err) {
      console.error('Error fetching leave records:', err);
    }
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      await axios.put(`${baseURL}/login/${userId}/toggle`, {
        is_active: currentStatus ? 0 : 1
      });
      fetchUsers();
      fetchLeaveRecords();
    } catch (err) {
      console.error('Error toggling user status:', err);
    }
  };

  const handleUserAdded = () => {
    setShowAddUser(false);
    fetchUsers();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Navbar />

      <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className="flex border-b mb-6">
          <div
            className={`px-4 py-2 cursor-pointer font-medium rounded-t-lg ${activeTab === 'users' ? 'bg-white border border-b-0 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
            onClick={() => setActiveTab('users')}
          >
            Users
          </div>
          <div
            className={`px-4 py-2 cursor-pointer font-medium rounded-t-lg ml-2 ${activeTab === 'leaves' ? 'bg-white border border-b-0 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
            onClick={() => setActiveTab('leaves')}
          >
            Leave Records
          </div>
        </div>

        <div className="p-4 border rounded-b-lg">
          {activeTab === 'users' && (
            <>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">User Management</h2>
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                  onClick={() => setShowAddUser(true)}
                >
                  + Add User
                </button>
              </div>

              <div className="overflow-x-auto border rounded-md">
                <table className="w-full min-w-[600px] text-center">
                  <thead className="bg-[#6caa32d7] text-white">
                    <tr>
                      <th className="p-3">#</th>
                      <th className="p-3">Username</th>
                      <th className="p-3">Role</th>
                      <th className="p-3">Start Date</th>
                      <th className="p-3">Active</th>
                      <th className="p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u, i) => (
                      <tr key={u.id} className="hover:bg-gray-100">
                        <td className="p-3">{i + 1}</td>
                        <td className="p-3">{u.username}</td>
                        <td className="p-3">{u.role_name}</td>
                        <td className="p-3">{u.start_date ? new Date(u.start_date).toLocaleDateString() : '-'}</td>
                        <td className="p-3">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={u.is_active === 1}
                              onChange={() => toggleUserStatus(u.id, u.is_active)}
                            />
                            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-500 rounded-full peer peer-checked:bg-[#28a745] transition-all duration-300"></div>
                            <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full peer-checked:translate-x-5 transition-all duration-300"></div>
                          </label>
                        </td>
                        <td className="p-3">
                          <button
                            className="text-blue-600 hover:underline"
                            onClick={() => setShowAddUser(u)}
                          >
                           <FiEdit size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {activeTab === 'leaves' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Leave Records</h2>
              <div className="overflow-x-auto border rounded-md">
                <table className="w-full min-w-[600px] text-center">
                  <thead className="bg-[#6caa32d7] text-white">
                    <tr>
                      <th className="p-3">#</th>
                      <th className="p-3">Username</th>
                      <th className="p-3">Leave Start</th>
                      <th className="p-3">Leave End</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaveRecords.map((lr, i) => (
                      <tr key={lr.id} className="hover:bg-gray-100">
                        <td className="p-3">{i + 1}</td>
                        <td className="p-3">{lr.username}</td>
                        <td className="p-3">{lr.leave_start_date}</td>
                        <td className="p-3">{lr.leave_end_date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {showAddUser && (
            <AddUserModal
              onClose={() => setShowAddUser(false)}
              onUserAdded={handleUserAdded}
              user={showAddUser && showAddUser.id ? showAddUser : null} // pass user for edit
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
