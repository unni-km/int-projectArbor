import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBoxes, FaUsers, FaUserShield, FaHands } from 'react-icons/fa';
import HomeNavbar from '../components/NavBarHomePage';
import { GiPayMoney  } from "react-icons/gi";


const HomePage = () => {
  const navigate = useNavigate();
  const role = parseInt(localStorage.getItem('roleid'), 10);
  const [greeting, setGreeting] = useState('Welcome');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-tr from-blue-100 to-blue-50 p-4 md:p-10 font-sans">
      <HomeNavbar />

      <div className="flex flex-1 justify-center items-center">
        <div className="backdrop-blur-lg bg-white/60 rounded-2xl shadow-xl p-6 sm:p-10 w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl text-center animate-fade-in">
          <img src="/images/Arborimg.png" alt="Arbor Logo" className="w-20 sm:w-24 md:w-28 mb-5 animate-spin-slow mx-auto" />
          <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-slate-900">{greeting},</h1>
          <h2 className="text-lg sm:text-xl md:text-2xl font-medium text-blue-800 mt-1">Welcome to Arbor India Management System</h2>
          <p className="text-sm sm:text-base text-slate-700 mb-6 mt-3">Choose a module to get started</p>

          <div className="flex flex-wrap justify-center gap-4 mt-4">
            <button
              onClick={() => navigate('/home')}
              className="flex items-center justify-center w-64 h-16 text-base sm:text-lg font-bold bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl shadow-md hover:scale-105 hover:shadow-lg transition transform duration-200"
            >
              <FaBoxes className="mr-3 text-lg" /> Inventory Management
            </button>

            <button
              onClick={() => navigate('/visitor')}
              className="flex items-center justify-center w-64 h-16 text-base sm:text-lg font-bold bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl shadow-md hover:scale-105 hover:shadow-lg transition transform duration-200"
            >
              <FaUsers className="mr-3 text-lg" /> Visitor Management
            </button>

            {role === 40 && (
              <button
                onClick={() => navigate('/assethome')}
                className="flex items-center justify-center w-64 h-16 text-base sm:text-lg font-bold bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl shadow-md hover:scale-105 hover:shadow-lg transition transform duration-200"
              >
                <FaHands className="mr-3 text-lg" /> Asset Management
              </button>
            )}
{[40, 43, 44, 45, 46, 47].includes(role) && (
  <button onClick={() => navigate('/expense')}   className="flex items-center justify-center w-64 h-16 text-base sm:text-lg font-bold bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl shadow-md hover:scale-105 hover:shadow-lg transition transform duration-200"
  >

    <GiPayMoney className="mr-3 text-lg" /> Expense Management
  </button>
)}

            {role === 40 && (
              <button
                onClick={() => navigate('/users')}
                className="flex items-center justify-center w-64 h-16 text-base sm:text-lg font-bold bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl shadow-md hover:scale-105 hover:shadow-lg transition transform duration-200"
              >
                <FaUserShield className="mr-3 text-lg" /> User Management
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
