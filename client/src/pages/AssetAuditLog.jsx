import React, { useEffect, useState } from 'react';
import { FaClock, FaUser, FaExchangeAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

const baseURL = process.env.REACT_APP_API_BASE_URL;

const AssetAuditLog = ({ assetId, onClose }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuditLogs = async () => {
      try {
        const res = await fetch(`${baseURL}/asset/audit/${assetId}`);
        if (!res.ok) throw new Error('Failed to fetch audit logs');
        const data = await res.json();
        setLogs(data);
      } catch (err) {
        console.error('Error loading audit logs:', err);
        toast.error('Failed to load audit history');
      } finally {
        setLoading(false);
      }
    };

    if (assetId) fetchAuditLogs();
  }, [assetId]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto relative p-6">
        {/* ❌ Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-600 hover:text-red-600 text-2xl"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Asset Audit Log
        </h2>

        {loading ? (
          <div className="text-center text-gray-500 py-10">
            Loading audit history...
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            No audit history found for this asset.
          </div>
        ) : (
          <div className="space-y-6">
            {logs.map((log, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition bg-white"
              >
                {/* Header Row */}
                <div className="flex flex-wrap justify-between items-center mb-4 border-b pb-2">
                  <div className="flex items-center gap-2 text-gray-700">
                    <FaClock className="text-gray-500" />
                    <span className="font-medium">
                      {dayjs(log.changed_at).format('DD MMM YYYY, HH:mm')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <FaUser className="text-gray-500" />
                    <span>
                      <strong>Changed By:</strong>{' '}
                      {log.changed_by || 'Unknown User'}
                    </span>
                  </div>
                </div>

                {/* Changed Fields */}
                <div className="overflow-x-auto">
                  {Array.isArray(log.changed_fields) ? (
                    <table className="min-w-full border border-gray-100 rounded-lg text-sm text-gray-700">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="p-3 border">Field</th>
                          <th className="p-3 border">Old Value</th>
                          <th className="p-3 border text-center">
                            <FaExchangeAlt className="inline text-gray-500" /> Change
                          </th>
                          <th className="p-3 border">New Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        {log.changed_fields.map((field, i) => (
                          <tr
                            key={i}
                            className="hover:bg-gray-50 transition-all"
                          >
                            <td className="p-3 border font-semibold text-gray-800">
                              {formatFieldName(field.field)}
                            </td>
                            <td className="p-3 border text-red-600">
                              {field.old_value === '' ? '-' : field.old_value}
                            </td>
                            <td className="p-3 border text-center text-gray-500">
                              →
                            </td>
                            <td className="p-3 border text-green-600">
                              {field.new_value === '' ? '-' : field.new_value}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="text-gray-500 italic">
                      {log.changed_fields}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/* 🔠 Helper: Format database field names for display */
const formatFieldName = (field) => {
  const map = {
    AssetCode: 'Asset Code',
    item_id: 'Item',
    TypeID: 'Asset Type',
    SerialNumber: 'Serial Number',
    ID_No: 'ID Number',
    PurchaseDate: 'Purchase Date',
    wifi_mac_address: 'WiFi MAC Address',
    ethernet_mac_address: 'Ethernet MAC Address',
    AssignedTo: 'Assigned To',
    LocationID: 'Location',
    Description: 'Description',
    InvoiceID: 'Invoice',
  };

  return map[field] || field;
};

export default AssetAuditLog;
