import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { FaTimes } from "react-icons/fa";

const AssetVerificationHistory = ({ asset, onClose }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const baseURL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    fetch(`${baseURL}/asset/verification-history/${asset.AssetID}`)
      .then(res => res.json())
      .then(data => setHistory(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [asset.AssetID, baseURL]);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-gray-50 w-full max-w-2xl rounded-xl shadow-xl p-6 relative max-h-[85vh] overflow-y-auto">

        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500 hover:text-red-600"
        >
          <FaTimes />
        </button>

        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Verification History – {asset.AssetCode}
        </h2>
        

        {loading ? (
          <p className="text-gray-500">Loading history...</p>
        ) : history.length === 0 ? (
          <p className="text-gray-500">No verification history found.</p>
        ) : (
          <div className="space-y-4">
            {history.map((v, index) => {
  const verifiedAt = dayjs(v.verified_at);
  const expiryDate = verifiedAt.add(6, "month");
  const isExpired = expiryDate.isBefore(dayjs());

  return (
    <div
      key={index}
      className="border rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition"
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <p className="font-semibold text-gray-800">
            {v.verified_by_name || "System"}
          </p>
          <p className="text-xs text-gray-500">
            {verifiedAt.format("DD MMM YYYY, HH:mm")}
          </p>
        </div>

        <div className="flex flex-col items-end gap-1">
          {/* Verification status */}
          <span
            className={`text-xs px-2 py-1 rounded-full font-medium
              ${v.is_unverify === 1
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"}
            `}
          >
            {v.is_unverify === 1 ? "Unverified" : "Verified"}
          </span>
        </div>
      </div>

      {/* Expiry info */}
      <div className="mt-3 text-sm text-gray-700">
        <p>
          <strong>Expiry Date:</strong>{" "}
          {expiryDate.format("DD MMM YYYY")}
        </p>
      </div>

      {/* Notes */}
      {v.notes && (
        <div className="mt-3 bg-gray-50 border-l-4 border-blue-400 p-3 rounded text-sm text-gray-700">
          <strong>Notes:</strong> {v.notes}
        </div>
      )}
    </div>
  );
})}

          </div>
        )}
      </div>
    </div>
  );
};

export default AssetVerificationHistory;
