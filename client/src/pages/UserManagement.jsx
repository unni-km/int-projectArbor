import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddUserModal from './Register';
import { ToastContainer } from 'react-toastify';
import Navbar from '../components/NavBarUser';
import { FiEdit, FiPlus, FiUser, FiCalendar } from 'react-icons/fi';

const baseURL = process.env.REACT_APP_API_BASE_URL;

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [leaveRecords, setLeaveRecords] = useState([]);
  const [showAddUser, setShowAddUser] = useState(false);
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
    <div className="h-screen flex flex-col bg-gray-50">
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

      {/* Scrollable Content Wrapper */}
      <div className="flex-1 overflow-hidden px-4 sm:px-6 pb-6 pt-4">
        <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 h-full flex flex-col">

          {/* 🔹 Sticky Tabs */}
          <div className="sticky top-0 z-30 bg-white border-b border-gray-200 px-6 pt-2 rounded-t-xl">
            <div className="flex space-x-6">
              <button
                className={`flex items-center gap-2 pb-3 font-medium text-sm transition-all duration-200 border-b-2 ${
                  activeTab === 'users'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('users')}
              >
                <FiUser size={18} /> Users
              </button>

              <button
                className={`flex items-center gap-2 pb-3 font-medium text-sm transition-all duration-200 border-b-2 ${
                  activeTab === 'leaves'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('leaves')}
              >
                <FiCalendar size={18} /> Leave Records
              </button>
            </div>
          </div>

          {/* 🔹 Scrollable Section */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-white rounded-b-xl">

            {/* ================= USERS TAB ================= */}
            {activeTab === 'users' && (
              <div className="flex flex-col h-full">
                {/* Sticky Heading */}
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800">
                    User Management
                  </h2>
                  <button
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm text-sm sm:text-base"
                    onClick={() => setShowAddUser(true)}
                  >
                    <FiPlus size={18} /> Add User
                  </button>
                </div>

                <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm w-full">
                  <table className="w-full text-left whitespace-nowrap border-collapse">
                    <thead className="bg-[#6caa32d7] text-white">
                      <tr>
                        <th className="p-4 font-semibold text-sm">#</th>
                        <th className="p-4 font-semibold text-sm">Username</th>
                        <th className="p-4 font-semibold text-sm">Role</th>
                        <th className="p-4 font-semibold text-sm">Start Date</th>
                        <th className="p-4 font-semibold text-sm text-center">Active</th>
                        <th className="p-4 font-semibold text-sm text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {users.length > 0 ? (
                        users.map((u, i) => (
                          <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                            <td className="p-4 text-gray-500">{i + 1}</td>
                            <td className="p-4 font-medium text-gray-900">{u.username}</td>
                            <td className="p-4">
                              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold tracking-wide">
                                {u.role_name}
                              </span>
                            </td>
                            <td className="p-4 text-gray-500">
                              {u.start_date
                                ? new Date(u.start_date).toLocaleDateString()
                                : '-'}
                            </td>
                            <td className="p-4 text-center">
                              <label className="relative inline-flex items-center cursor-pointer justify-center">
                                <input
                                  type="checkbox"
                                  className="sr-only peer"
                                  checked={u.is_active === 1}
                                  onChange={() => toggleUserStatus(u.id, u.is_active)}
                                />
                                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                              </label>
                            </td>
                            <td className="p-4 text-center">
                              <button
                                className="text-gray-400 hover:text-blue-600 transition-colors p-2 rounded-md hover:bg-blue-50 inline-flex"
                                onClick={() => setShowAddUser(u)}
                                title="Edit User"
                              >
                                <FiEdit size={18} />
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="p-8 text-center text-gray-500 bg-gray-50">
                            No users found. Click "Add User" to get started.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ================= LEAVES TAB ================= */}
            {activeTab === 'leaves' && (
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800">
                    Leave Records
                  </h2>
                </div>

                <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm w-full">
                  <table className="w-full text-left whitespace-nowrap border-collapse">
                    <thead className="bg-[#6caa32d7] text-white">
                      <tr>
                        <th className="p-4 font-semibold text-sm">#</th>
                        <th className="p-4 font-semibold text-sm">Username</th>
                        <th className="p-4 font-semibold text-sm">Leave Start</th>
                        <th className="p-4 font-semibold text-sm">Leave End</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {leaveRecords.length > 0 ? (
                        leaveRecords.map((lr, i) => (
                          <tr key={lr.id} className="hover:bg-gray-50 transition-colors">
                            <td className="p-4 text-gray-500">{i + 1}</td>
                            <td className="p-4 font-medium text-gray-900">{lr.username}</td>
                            <td className="p-4 text-gray-600">{lr.leave_start_date}</td>
                            <td className="p-4 text-gray-600">{lr.leave_end_date}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="p-8 text-center text-gray-500 bg-gray-50">
                            No leave records found at this time.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Modal */}
            {showAddUser && (
              <AddUserModal
                onClose={() => setShowAddUser(false)}
                onUserAdded={handleUserAdded}
                user={showAddUser && showAddUser.id ? showAddUser : null}
              />
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;