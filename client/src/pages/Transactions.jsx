import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import Navbar from "../components/Navbar";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const baseURL = process.env.REACT_APP_API_BASE_URL;
function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortField, setSortField] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [startDate, setStartDate] = useState(""); // For date range filter
  const [endDate, setEndDate] = useState("");

  const selectedRows = transactions.filter(tx => selectedIds.includes(tx.id));
  dayjs.extend(utc);
  dayjs.extend(isSameOrAfter);
 dayjs.extend(isSameOrBefore);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${baseURL}/transactions`);
      setTransactions(res.data);
    } catch (err) {
      console.error("Error fetching transactions:", err);
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleMoveBack = async () => {
    const currentUserId = localStorage.getItem('userid');
    try {
      await axios.post(`${baseURL}/transactions/move`, {
        transactionIds: selectedIds,
        userId: currentUserId,
      });
      toast.success("Items moved back to inventory!");
      setSelectedIds([]);
      fetchData();
    } catch (err) {
      toast.error("Error moving back");
      console.error("Error moving back:", err);
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(prev => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // Filter transactions by status
  const filteredByStatus = transactions.filter(tx =>
    statusFilter === "All" ? true : tx.status === statusFilter
  );

  // Further filter by date range if selected
  const filteredByDate = filteredByStatus.filter(tx => {
    const txDate = dayjs.utc(tx.transaction_date);
    const start = startDate ? dayjs.utc(startDate) : null;
    const end = endDate ? dayjs.utc(endDate).endOf('day') : null;

    return (
      (!start || txDate.isSameOrAfter(start)) &&
      (!end || txDate.isSameOrBefore(end))
    );
  });

  const sortedTransactions = [...filteredByDate].sort((a, b) => {
    let aVal, bVal;
    if (sortField === "date") {
      aVal = new Date(a.transaction_date);
      bVal = new Date(b.transaction_date);
    } else if (sortField === "status") {
      aVal = a.status.toLowerCase();
      bVal = b.status.toLowerCase();
    }
    if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
    if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <div>
      <Navbar />
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="inventory-container">
        <div className="top-right-buttons">
          <button
            className="control-button"
            onClick={handleMoveBack}
            disabled={
              selectedRows.length === 0 ||
              selectedRows.some(row => row.transaction_type === "MOVE_BACK_TO_INVENTORY")
            }
          >
            Move to Inventory
          </button>
        </div>

        {selectedRows.some(row => row.transaction_type === "MOVE_BACK_TO_INVENTORY") && (
          <p style={{ color: 'red', marginTop: '8px' }}>
            Cannot move items that are already marked as "Moved Back to Inventory".
          </p>
        )}

        <h2>Pantry Transactions</h2>

        {/* Filters */}
        <div style={{ marginBottom: '12px' }}>
          <label style={{ marginRight: '10px' }}><strong>Status:</strong>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ marginLeft: '6px' }}
            >
              <option value="All">All</option>
              <option value="pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </label>

          <label style={{ marginRight: '10px' }}><strong>Start Date:</strong>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={{ marginLeft: '6px' }}
            />
          </label>

          <label><strong>End Date:</strong>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              style={{ marginLeft: '6px' }}
            />
          </label>
        </div>

        {/* Table */}
        <table className="inventory-table">
          <thead>
            <tr>
              <th>Select</th>
              <th>ID</th>
              <th>Item</th>
              <th>User</th>
              <th>Type</th>
              <th>Quantity</th>
              <th>
                Status
              </th>
              <th
                style={{ cursor: "pointer" }}
                onClick={() => handleSort("date")}
              >
                Date {sortField === "date" ? (sortOrder === "asc" ? "🔼" : "🔽") : ""}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedTransactions.map((tx) => (
              <tr key={tx.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(tx.id)}
                    onChange={() => toggleSelect(tx.id)}
                  />
                </td>
                <td>{tx.id}</td>
                <td>{tx.item_name}</td>
                <td>{tx.user_name}</td>
                <td>{tx.transaction_type}</td>
                <td>{tx.quantity}</td>
                <td>{tx.status}</td>
                <td>{dayjs.utc(tx.transaction_date).format('DD MMM YYYY, hh:mm A')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Transactions;
