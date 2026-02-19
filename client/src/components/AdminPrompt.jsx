import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import './AdminApproval.css';
import { toast } from 'react-toastify';

const baseURL = process.env.REACT_APP_API_BASE_URL;
const AdminApproval = ({ onClose }) => {
  const [pendingTransactions, setPendingTransactions] = useState([]);
  const [closing, setClosing] = useState(false);



 const handleClose = useCallback(() => {
  setClosing(true);
  setTimeout(() => {
    onClose();
  }, 300);
}, [onClose]);

const fetchPending = useCallback(async () => {
  try {
    const res = await axios.get(`${baseURL}/transactions/pendinglist`);
    setPendingTransactions(res.data);

    if (res.data.length === 0) {
      handleClose();
    }
  } catch (err) {
    toast.error('Failed to fetch pending transactions');
  }
}, [handleClose]);

  useEffect(() => {
    fetchPending();
  }, [fetchPending]);

 

  const handleAction = async (id, action) => {
    try {
      const endpoint =
        action === 'approve'
          ? `${baseURL}/transactions/approve`
          : `${baseURL}/transactions/reject`;

      const adminId = localStorage.getItem('userid');
      await axios.post(endpoint, { id, approved_by: adminId });

      toast.success(`Transaction ${action}d successfully!`);
      await fetchPending();
    } catch (err) {
      toast.error(`Failed to ${action} transaction`);
    }
  };

  return (
    <div className="popup-overlay">
      <div className={`popup-content popup-container ${closing ? 'fade-out' : ''}`}>
        <h3>Pending Transactions</h3>
        {pendingTransactions.length === 0 ? (
          <p>No pending transactions</p>
        ) : (
          pendingTransactions.map((item) => (
            <div className="pending-row" key={item.id}>
              <span>{item.item_name} (Qty: {item.quantity}) (by {item.requested_by})</span>
              <div>
                <button onClick={() => handleAction(item.id, 'approve')}>Approve</button>
                <button onClick={() => handleAction(item.id, 'reject')}>Reject</button>
              </div>
            </div>
          ))
        )}
        <button className="cancel" onClick={handleClose}>Close</button>
      </div>
    </div>
  );
};

export default AdminApproval;






