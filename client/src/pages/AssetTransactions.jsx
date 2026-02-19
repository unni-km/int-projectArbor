import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/NavbarAsset';

const TransactionTable = () => {
  const [transactions, setTransactions] = useState([]);
  const baseURL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axios.get(`${baseURL}/asset/transactions`);
        setTransactions(res.data);
      } catch (error) {
        console.error('Failed to fetch transactions:', error);
      }
    };

    fetchTransactions();
  }, [baseURL]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="bg-white p-6 rounded-2xl shadow-lg max-w-7xl mx-auto mt-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Asset Transactions
        </h2>

        {/* ✅ Wrap the table in a scrollable container */}
        <div className="overflow-x-auto max-h-[75vh] overflow-y-auto rounded-lg border border-gray-200">
          <table className="min-w-full table-auto border-collapse">
            <thead className="bg-gray-100 text-gray-700 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 text-left border">#</th>
                <th className="px-4 py-3 text-left border">Item Name</th>
                <th className="px-4 py-3 text-left border">Asset Code</th>
                <th className="px-4 py-3 text-left border">Employee</th>
                <th className="px-4 py-3 text-left border">Location</th>
                <th className="px-4 py-3 text-left border">Action</th>
                <th className="px-4 py-3 text-left border">Date</th>
                <th className="px-4 py-3 text-left border">Created By</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((txn, index) => (
                <tr
                  key={txn.transaction_id}
                  className={`hover:bg-gray-50 text-sm ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  }`}
                >
                  <td className="px-4 py-2 border">{index + 1}</td>
                  <td className="px-4 py-2 border">{txn.item_name || 'N/A'}</td>
                  <td className="px-4 py-2 border">{txn.AssetCode || 'N/A'}</td>
                  <td className="px-4 py-2 border">{txn.employee_name || 'Not Assigned'}</td>
                  <td className="px-4 py-2 border">{txn.location || 'Not Assigned'}</td>
                  <td className="px-4 py-2 border font-medium text-blue-600">{txn.action}</td>
                  <td className="px-4 py-2 border whitespace-nowrap">
                    {new Date(txn.transaction_date).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 border">{txn.username || 'System'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Optional note for usability */}
        {transactions.length > 10 && (
          <p className="text-gray-500 text-xs mt-2">
            Tip: Scroll horizontally or vertically to view all data.
          </p>
        )}
      </div>
    </div>
  );
};

export default TransactionTable;
