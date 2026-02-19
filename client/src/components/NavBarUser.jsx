import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';
import { FaHome } from 'react-icons/fa';

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    navigate('/');
  };

  return (
    <nav className="navbar">
      {/* Home on the left */}
      <div className="nav-left">
        <FaHome
          className="nav-icon"
          onClick={() => navigate('/homepage')}
          title="Home"
        />
      </div>

      <div className="nav-center">
        <h1 className="nav-title" style={{ marginBottom: '11px' }}>User Management</h1>
      </div>

      {/* Others on the right */}
      <div className="nav-right">
        <span onClick={handleLogout}>Logout</span>
      </div>
    </nav>
  );
}

export default Navbar;
