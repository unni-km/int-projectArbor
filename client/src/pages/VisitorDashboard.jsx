import React, { useState } from 'react';
import IdCardList from '../components/IdCardList';
import ActiveVisitors from './Visitor';
import VisitorLog from './VisitorLog';
import { AiFillHome } from "react-icons/ai";
import { FaIdCard, FaClipboardList } from "react-icons/fa";
import Navbar from '../components/VisitorNav';
import { ToastContainer } from 'react-toastify';

const VisitorDashboard = () => {
  const [view, setView] = useState('active');
  const role = parseInt(localStorage.getItem('roleid'), 10);

  const menuItems = [
    { key: 'active', label: 'Dashboard', icon: <AiFillHome size={20} /> },
    ...(role === 40 ? [{ key: 'idcard', label: 'ID Card', icon: <FaIdCard size={20} /> }] : []),
    { key: 'log', label: 'Visitor Log', icon: <FaClipboardList size={20} /> }
  ];

  return (
    <div className="flex flex-col min-h-screen w-screen font-sans bg-[#eef2f7] text-gray-800">
      <Navbar />

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

      {/* Body */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <nav className="fixed top-[56px] left-0 bg-white text-gray-700 w-64 h-screen p-6 shadow-lg flex flex-col gap-6 font-semibold overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
          <ul className="space-y-4">
            {menuItems.map((item) => (
              <li
                key={item.key}
                className={`p-3 rounded-xl flex items-center gap-3 text-lg cursor-pointer transition-all duration-200 ${
                  view === item.key
                    ? 'bg-[#56a802] text-white shadow-md'
                    : 'hover:bg-[#56a802] hover:text-white'
                }`}
                onClick={() => setView(item.key)}
              >
                {item.icon} {item.label}
              </li>
            ))}
          </ul>
        </nav>

        {/* Main Content */}
        <main className="flex-1 ml-64 p-6 md:p-10 bg-[#f9fafb] overflow-y-auto rounded-r-lg shadow-inner scroll-smooth">
          {view === 'active' && <ActiveVisitors />}
          {view === 'idcard' && (
            <>
              <h2 className="text-2xl font-bold mb-6">ID Card List</h2>
              <IdCardList />
            </>
          )}
          {view === 'log' && <VisitorLog />}
        </main>
      </div>
    </div>
  );
};

export default VisitorDashboard;
