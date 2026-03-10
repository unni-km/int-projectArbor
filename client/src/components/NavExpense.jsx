import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';

function Navbar() {
  const navigate = useNavigate();
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
        h-16 = 64px
        bg-[#66bb6a]
        flex items-center justify-between
        px-6
        shadow-md
      "
    >
      {/* Left */}
      <div className="flex items-center gap-3">
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
          Purchase Management
        </h1>
      </div>

      {/* Right */}
      <div className="relative" ref={dropdownRef}>
        {username && (
          <>
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
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
