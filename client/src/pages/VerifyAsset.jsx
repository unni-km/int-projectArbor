import React, { useState, useRef,useEffect } from "react";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { FaCheckCircle, FaTimesCircle, FaBarcode, FaTimes, FaUndo } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const baseURL = process.env.REACT_APP_API_BASE_URL;

const VerifyAsset = ({ onClose }) => {
  const [scanCode, setScanCode] = useState("");
  const [assetDetails, setAssetDetails] = useState(null);
  const [verifiedAsset, setVerifiedAsset] = useState(null);
  const inputRef = useRef(null);
  const resultRef = useRef(null);
  const [notes, setNotes] = useState("");
const [savingNote, setSavingNote] = useState(false);


useEffect(() => {
  if (verifiedAsset) {
    resultRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }
}, [verifiedAsset]);

  // 🔹 Fetch asset details
  const fetchAssetDetails = async (code) => {
    try {
      const response = await fetch(`${baseURL}/asset/by-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        setAssetDetails(null);
        return;
      }

      const data = await response.json();
      setAssetDetails(data);
    } catch (err) {
      console.error("Error fetching asset details:", err);
      setAssetDetails(null);
    }
  };

  // 🔹 Handle typing / scanning
  const handleScanChange = (e) => {
    const value = e.target.value;
    setScanCode(value);

    if (value.trim().length >= 3) {
      clearTimeout(window._scanTimeout);
      window._scanTimeout = setTimeout(() => fetchAssetDetails(value.trim()), 300);
    } else {
      setAssetDetails(null);
    }
  };

  // 🔹 Verify Asset
  const handleScanSubmit = async (e) => {
    e.preventDefault();
    if (!scanCode.trim()) return;

    try {
      const userId = localStorage.getItem("userid");

      const response = await fetch(`${baseURL}/asset/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: scanCode,
          verified_by: userId,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(`✅ Asset ${scanCode} verified successfully`);
        setNotes("");
        setVerifiedAsset({
          code: scanCode,
          verifiedAt: dayjs().format("DD MMM YYYY, HH:mm"),
          status: "success",
        });
      } else {
        toast.error(result.message || "Asset not found");
        setVerifiedAsset({
          code: scanCode,
          verifiedAt: dayjs().format("DD MMM YYYY, HH:mm"),
          status: "error",
        });
      }

      setScanCode("");
      setAssetDetails(null);
      inputRef.current.focus();
    } catch (err) {
      console.error("Error verifying asset:", err);
      toast.error("Failed to verify asset");
    }
  };

  // 🔹 Unverify Asset
  const handleUnverify = async () => {
    try {
      const userId = localStorage.getItem("userid");

      const response = await fetch(`${baseURL}/asset/unverify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: verifiedAsset.code,
          unverified_by: userId,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.info(`⚠️ Asset ${verifiedAsset.code} marked as unverified`);
        setVerifiedAsset({
          ...verifiedAsset,
          status: "unverified",
          verifiedAt: dayjs().format("DD MMM YYYY, HH:mm"),
        });
      } else {
        toast.error(result.message || "Failed to unverify asset");
      }
    } catch (err) {
      console.error("Error unverifying asset:", err);
      toast.error("Error while unverifying asset");
    }
  };

const handleSaveNote = async () => {
  if (!notes.trim()) {
    toast.info("Note is empty, nothing to save");
    return;
  }

  try {
    setSavingNote(true);
    const userId = localStorage.getItem("userid");

    const response = await fetch(`${baseURL}/asset/add-note`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: verifiedAsset.code,
        note: notes.trim(),
        created_by: userId,
      }),
    });

    const result = await response.json();

    if (response.ok) {
      toast.success("📝 Note saved successfully");
      setNotes("");
    } else {
      toast.error(result.message || "Failed to save note");
    }
  } catch (err) {
    console.error("Save note error:", err);
    toast.error("Error while saving note");
  } finally {
    setSavingNote(false);
  }
};


  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="
  relative
  bg-white
  shadow-2xl
  rounded-2xl
  w-full
  max-w-lg
  border
  border-gray-100
  p-6 md:p-8
  max-h-[90vh]
  overflow-y-auto
"

        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
          >
            <FaTimes className="text-lg" />
          </button>

          {/* Header */}
          <div className="flex flex-col items-center mb-6">
            <FaBarcode className="text-blue-600 text-5xl mb-2" />
            <h1 className="text-2xl font-semibold text-gray-800">
              Verify Asset
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Scan or type the asset QR / Serial code
            </p>
          </div>

          {/* Input Field */}
          <form onSubmit={handleScanSubmit}>
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={scanCode}
                onChange={handleScanChange}
                placeholder=" "
                className="peer w-full border border-gray-300 rounded-xl px-4 py-3 text-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow shadow-sm"
                autoFocus
              />
              <label
                className="absolute left-4 top-3.5 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-0 peer-focus:text-xs peer-focus:text-blue-600 bg-white px-1"
              >
                Asset Code
              </label>
            </div>
          </form>

          {/* Asset Details */}
          <AnimatePresence>
            {assetDetails && (
              <motion.div
                key="asset-details"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-gray-700"
              >
                <h3 className="text-blue-700 font-semibold mb-2">
                  Asset Information
                </h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  <p><strong>Item:</strong> {assetDetails.item_name || "—"}</p>
                  <p><strong>Code:</strong> {assetDetails.AssetCode || "—"}</p>
                  <p><strong>Assigned To:</strong> {assetDetails.staff_name || "Unassigned"}</p>
                  <p><strong>Location:</strong> {assetDetails.LocationCode || "—"}</p>
                  <p className="col-span-2"><strong>Description:</strong> {assetDetails.Description || "—"}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Verification Result */}
          <AnimatePresence>
            {verifiedAsset && (
              <motion.div
                key="verification-result"
                ref={resultRef}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className={`mt-6 p-5 rounded-xl border text-center shadow-md ${
                  verifiedAsset.status === "success"
                    ? "bg-green-50 border-green-300 text-green-700"
                    : verifiedAsset.status === "unverified"
                    ? "bg-yellow-50 border-yellow-300 text-yellow-700"
                    : "bg-red-50 border-red-300 text-red-700"
                }`}
              >
                <div className="flex flex-col items-center">
                  {verifiedAsset.status === "success" ? (
                    <FaCheckCircle className="text-green-600 text-4xl mb-1" />
                  ) : verifiedAsset.status === "unverified" ? (
                    <FaUndo className="text-yellow-600 text-4xl mb-1" />
                  ) : (
                    <FaTimesCircle className="text-red-600 text-4xl mb-1" />
                  )}
                  <h3 className="font-semibold text-lg">
                    {verifiedAsset.status === "success"
                      ? "Asset Verified Successfully"
                      : verifiedAsset.status === "unverified"
                      ? "Asset Marked as Unverified"
                      : "Asset Not Found"}
                  </h3>
                  <p className="text-sm mt-1">
                    <strong>Code:</strong> {verifiedAsset.code}
                  </p>
                  <p className="text-sm">
                    <strong>Time:</strong> {verifiedAsset.verifiedAt}
                  </p>
                </div>

                {/* 🟡 Unverify Button */}
                {verifiedAsset.status === "success" && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleUnverify}
                    className="mt-4 px-5 py-2 bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-medium rounded-lg transition-all shadow"
                  >
                    <FaUndo className="inline mr-2 mb-0.5" />
                    Unverify Asset
                  </motion.button>
                )}
                {verifiedAsset.status === "success" && (
  <div className="mt-4 text-left w-full">
    <label className="text-sm font-medium text-gray-700">
      Notes (optional)
    </label>

    <textarea
      value={notes}
      onChange={(e) => setNotes(e.target.value)}
      rows={3}
      placeholder="Add any verification notes (optional)"
      className="
        mt-1 w-full rounded-lg border border-gray-300
        px-3 py-2 text-sm
        focus:ring-2 focus:ring-blue-500 focus:outline-none
        resize-none
      "
    />

    <div className="flex justify-end mt-2">
      <button
        onClick={handleSaveNote}
        disabled={savingNote}
        className="
          px-4 py-1.5 text-sm font-medium rounded-lg
          bg-blue-600 text-white hover:bg-blue-700
          disabled:opacity-50 disabled:cursor-not-allowed
        "
      >
        {savingNote ? "Saving..." : "Save Note"}
      </button>
    </div>
  </div>
)}

              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default VerifyAsset;
