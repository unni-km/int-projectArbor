import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import BackButton from './BackButton';

function Navbar() {
  const navigate = useNavigate();
  const role = parseInt(localStorage.getItem('roleid'), 10);
  const username = localStorage.getItem('username');

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav
      className="
        fixed top-0 left-0 right-0 z-50
        h-[60px]
        bg-[#66bb6a]
        flex items-center justify-between
        px-6
        shadow-md
      "
    >
      {/* Left */}
      <div className="flex items-center gap-3">
        <BackButton />
        <FaHome
          className="
            text-white text-xl cursor-pointer
            hover:text-[#00110e]
            transition
          "
          onClick={() => navigate('/homepage')}
          title="Home"
        />
      </div>

      {/* Center */}
      <div className="absolute left-1/2 top-4 -translate-x-1/2 hidden md:block">
        <h1 className="text-white text-lg font-semibold tracking-wide">
          Inventory Management
        </h1>
      </div>

      {/* Right */}
      <div className="flex items-center gap-6 relative" ref={dropdownRef}>
        {role === 40 && (
          <span
            onClick={() => navigate('/home')}
            className="text-white font-semibold cursor-pointer hover:text-[#00110e]"
          >
            Home
          </span>
        )}

        <span
          onClick={() => navigate('/inventory')}
          className="text-white font-semibold cursor-pointer hover:text-[#00110e]"
        >
          Inventory
        </span>

        <span
          onClick={() => navigate('/transactions')}
          className="text-white font-semibold cursor-pointer hover:text-[#00110e]"
        >
          Transactions
        </span>

        {/* User dropdown */}
        {username && (
          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="
                flex items-center gap-2
                bg-white/20
                px-3 py-1.5
                rounded-full
                text-white
                hover:bg-white/30
                transition
              "
            >
              <FaUserCircle className="text-lg" />
              <span className="text-sm font-medium">{username}</span>
            </button>

            {open && (
              <div
                className="
                  absolute right-0 mt-2 w-40
                  bg-white
                  rounded-lg
                  shadow-lg
                  overflow-hidden
                  z-50
                "
              >
                <button
                  onClick={handleLogout}
                  className="
                    w-full flex items-center gap-2
                    px-4 py-2 text-sm
                    text-gray-700
                    hover:bg-red-50 hover:text-red-600
                    transition
                  "
                >
                  <FaSignOutAlt />
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
