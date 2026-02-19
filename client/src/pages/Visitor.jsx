import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Visitor.css'; 
import EnrollVisitorPopup from '../components/EnrollVisitor';
import CheckoutPopup from '../components/Collect';
import { FiUserPlus } from "react-icons/fi";

const baseURL = process.env.REACT_APP_API_BASE_URL;
const ActiveVisitors = () => {
  const [visitors, setVisitors] = useState([]);
  const [showEnrollPopup, setShowEnrollPopup] = useState(false);
  const [checkoutVisitor, setCheckoutVisitor] = useState(null);

  useEffect(() => {
    fetchActiveVisitors();
  }, []);

  const fetchActiveVisitors = async () => {
    try {
      const res = await axios.get(`${baseURL}/visitor/active-visitors`);
      setVisitors(res.data);
    } catch (error) {
      console.error("Error fetching visitors:", error);
    }
  };

  const handleEnrollClick = () => {
    setShowEnrollPopup(true);
  };

  const handleClosePopup = () => {
    setShowEnrollPopup(false);
    fetchActiveVisitors(); 
  };

  const handleCheckoutClick = (visitor) => {
    setCheckoutVisitor(visitor);
  };

  const handleCloseCheckout = () => {
    setCheckoutVisitor(null);
    fetchActiveVisitors();
  };

  return (
    <div className="active-visitors-container">
      <div className="header">
        <h2>Active Visitors</h2>
        <button className="enroll-button" onClick={handleEnrollClick}> <FiUserPlus /> Enroll Visitor</button>
      </div>

      <table className="visitor-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Name</th>
            <th>Purpose</th>
            <th>Time In</th>
            <th>Card ID</th>
            <th>Admitted By</th>
            <th>Action</th>
          </tr>
        </thead>
       <tbody>
  {visitors.length === 0 ? (
    <tr>
      <td colSpan="7" style={{ textAlign: 'center', padding: '1rem', color: '#666' }}>
        <strong>No active visitors</strong>
      </td>
    </tr>
  ) : (
    visitors.map(visitor => (
      <tr key={visitor.id}>
        <td>{visitor.visited_date}</td>
        <td>{visitor.visitor_name}</td>
        <td>{visitor.purpose_of_visit}</td>
        <td>{visitor.time_in}</td>
        <td>{visitor.card_number}</td>
        <td>{visitor.security_username}</td>
        <td>
          <button 
            className="collect-button" 
            onClick={() => handleCheckoutClick(visitor)}
          >
            Checkout
          </button>
        </td>
      </tr>
    ))
  )}
</tbody>

      </table>

      {showEnrollPopup && (
        <EnrollVisitorPopup onClose={handleClosePopup} />
      )}

      {checkoutVisitor && (
        <CheckoutPopup 
          visitor={checkoutVisitor} 
          onClose={handleCloseCheckout} 
          onCheckoutSuccess={fetchActiveVisitors}
        />
      )}
    </div>
  );
};

export default ActiveVisitors;
