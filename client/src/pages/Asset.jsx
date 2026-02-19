import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/NavbarAsset';
import AddAsset from '../components/AddAsset';
import Additem from '../components/Additem';
import AddInvoice from '../components/Addinvoice';
import AddVendors from '../components/Addvendors';
import AssetAuditLog from './AssetAuditLog';
import VerifyAsset from './VerifyAsset';

import { FaEdit, FaSearch, FaPlus, FaFileExcel, FaEye,FaDatabase, FaQrcode,FaBarcode   } from 'react-icons/fa';
import { IoMdArchive } from "react-icons/io";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { ToastContainer, toast } from 'react-toastify';
import { FiDownload } from 'react-icons/fi';
import * as XLSX from 'xlsx-js-style';
import BulkInvoiceUpdateAsset from '../components/BulkInvoiceAsset';
import BulkBarcodePrint from '../components/BulkBarcodePrint';
import AssetVerificationHistory from './AssetVerificationHistory';
const AssetList = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [editAsset, setEditAsset] = useState(null);
  const [showAddInvoice, setShowAddInvoice] = useState(false);
  const [showAddVendorForm, setShowAddVendorForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewAsset, setViewAsset] = useState(null); // 👁 NEW for View Asset modal
  const [auditAssetId, setAuditAssetId] = useState(null);
  const [showVerifyAsset, setShowVerifyAsset] = useState(false);
  const [verificationFilter, setVerificationFilter] = useState(null); 
   const [assignedFilter, setAssignedFilter] = useState(null); 
    const [selectedItems, setSelectedItems] = useState([]);
     const [showBulkInvoiceForm, setShowBulkInvoiceForm] = useState(false);
     const [showBulkBarcode, setShowBulkBarcode] = useState(false);
     const [verificationAsset, setVerificationAsset] = useState(null);



  const baseURL = process.env.REACT_APP_API_BASE_URL;

  const fetchAssets = useCallback(() => {
    setLoading(true);
    fetch(`${baseURL}/asset`)
      .then((res) => res.json())
      .then((data) => setAssets(data))
      .catch((err) => console.error('Failed to load assets', err))
      .finally(() => setLoading(false));
  }, [baseURL]);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  const handleEdit = (asset) => {
    setEditAsset(asset);
    setShowAddModal(true);
  };

const handleDelete = (assetId) => {
   const userId = localStorage.getItem("userid");

  confirmAlert({
    title: 'Confirm Archive',
    message: 'Are you sure you want to archive this asset?',
    buttons: [
      {
        label: 'Yes',
        onClick: () => {
          fetch(`${baseURL}/asset/delete/${assetId}`, {
            method: 'DELETE',
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ userId })  // <-- SENT TO BACKEND
          })
            .then((res) => {
              if (res.ok) {
                toast.success('Asset archive successfully');
                fetchAssets();
              } else toast.error('Failed to delete asset');
            })
            .catch((err) => {
              console.error('Error deleting asset:', err);
              toast.error('Something went wrong!');
            });
        },
      },
      { label: 'No', onClick: () => toast.info('Deletion cancelled') },
    ],
  });
};

 const filteredAssets = assets.filter((asset) => {
  const query = searchQuery.toLowerCase();

  const matchesSearch =
    asset.AssetCode?.toLowerCase().includes(query) ||
    asset.item_name?.toLowerCase().includes(query) ||
    asset.staff_name?.toLowerCase().includes(query) ||
    asset.LocationCode?.toLowerCase().includes(query) ||
    asset.model?.toLowerCase().includes(query) ||
    asset.invoice_no?.toLowerCase().includes(query);

  // Verification filter
  let matchesVerification = true;
  if (verificationFilter === "verified") {
    matchesVerification = asset.is_unverified === 0;
  } else if (verificationFilter === "unverified") {
    matchesVerification = asset.is_unverified === 1;
  }

  // Assigned filter
  let matchesAssigned = true;
  if (assignedFilter === "assigned") {
    matchesAssigned = !!asset.staff_name;
  } else if (assignedFilter === "unassigned") {
    matchesAssigned = !asset.staff_name;
  }

  return matchesSearch && matchesVerification && matchesAssigned;
});


  const handleExportToExcel = () => {
    if (filteredAssets.length === 0) {
      toast.info('No data to export');
      return;
    }

    const worksheetData = filteredAssets.map((asset) => ({
      'Item Name': asset.item_name || '',
      Description: asset.Description || '',
      'Asset Code': asset.AssetCode || '',
      'Assigned To': asset.staff_name || '',
      'Serial Number': asset.SerialNumber || '',
      'ID No': asset.ID_No || '',
      'Purchase Date': asset.PurchaseDate
        ? new Date(asset.PurchaseDate).toLocaleDateString('en-GB').replace(/\//g, '-')
        : '',
      'Location Name': asset.LocationName || asset.LocationCode || '',
      'WiFi MAC Address': asset.wifi_mac_address || '',
      'Ethernet MAC Address': asset.ethernet_mac_address || '',
      'Verified on' : asset.last_verified_at
        ? new Date(asset.last_verified_at).toLocaleDateString('en-GB').replace(/\//g, '-')
        : '',
        'Verified by':asset.username,
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const headerStyle = {
      font: { bold: true, color: { rgb: 'FFFFFF' } },
      fill: { fgColor: { rgb: '4F81BD' } },
      alignment: { horizontal: 'center', vertical: 'center' },
    };

    const range = XLSX.utils.decode_range(worksheet['!ref']);
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C });
      if (worksheet[cellAddress]) worksheet[cellAddress].s = headerStyle;
    }

    worksheet['!cols'] = Object.keys(worksheetData[0]).map(() => ({ wch: 20 }));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Assets Report');
    XLSX.writeFile(workbook, `Asset_Report_${new Date().toISOString().slice(0, 10)}.xlsx`);
    toast.success('Report downloaded successfully');
  };

const toggleVerificationFilter = () => {
  setVerificationFilter(prev =>
    prev === null ? "verified" :
    prev === "verified" ? "unverified" :
    null
  );
};

const toggleAssignedFilter = () => {
  setAssignedFilter(prev =>
    prev === null ? "assigned" :
    prev === "assigned" ? "unassigned" :
    null
  );
};

 const handleCheckboxChange = (id) => {
      setSelectedItems(prev =>
        prev.includes(id) ? prev.filter(AssetID => AssetID !== id) : [...prev, id]
      );
    };


  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <ToastContainer position="top-center" autoClose={3000} theme="light" />

      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
          <h2 className="text-3xl font-bold text-gray-800">Asset List</h2>
          <div className="relative w-full md:w-1/3">
            <FaSearch className="absolute top-3 left-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search by asset code, item, or staff..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <p className="text-gray-500 text-sm mt-1 text-right">
          {filteredAssets.length} asset{filteredAssets.length !== 1 ? 's' : ''} found
</p>

          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap gap-3 justify-start mb-6 bg-white p-4 rounded-lg shadow-md border border-gray-200">
          <button onClick={() => setShowAddVendorForm(true)} className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2 transition">
            <FaPlus /> Add Vendor
          </button>
          <button onClick={() => setShowAddInvoice(true)} className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 flex items-center gap-2 transition">
            <FaPlus /> Add Invoice
          </button>
          <button onClick={() => setShowAddItemModal(true)} className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 flex items-center gap-2 transition">
            <FaPlus /> Add Item
          </button>
          <button onClick={() => { setEditAsset(null); setShowAddModal(true); }} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition">
            <FaPlus /> Add Asset
          </button>
          <button onClick={handleExportToExcel} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2 transition">
            <FaFileExcel /> Download Report
          </button>
          <button
            onClick={() => setShowVerifyAsset(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2 transition"
          >
            <FaQrcode /> Verify Assets
          </button>
<button
  onClick={() => {
    if (selectedItems.length === 0) {
      toast.error("Please select at least one asset!");
      return;
    }
    setShowBulkBarcode(true);
  }}
  className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 flex items-center gap-2 transition"
>
  <FaBarcode /> Print Barcodes
</button>


            <button
            className="control-button"
            onClick={() => {
              if (selectedItems.length === 0) {
                toast.error("Please select at least one item to update invoice.");
                return;
              }
              setShowBulkInvoiceForm(true);
            }}
            disabled={selectedItems.length === 0}
          >
            Update Invoice
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border border-gray-200 rounded-xl shadow bg-white">
          <div className="max-h-[65vh] overflow-y-auto">
            <table className="min-w-full text-sm text-left text-gray-700">
              <thead className="bg-gray-100 sticky top-0 z-10">
                <tr>
                 <th className="p-3 border text-center">
                    <input type="checkbox" disabled className="opacity-0" />
                               </th>
                  <th className="p-3 border">Asset Code</th>
                  <th className="p-3 border">Item</th>
                  <th className="p-3 border">Model</th>
                  <th className="p-3 border">Serial Number</th>
                  <th className="p-3 border">Location</th>
        <th
  className="p-3 border cursor-pointer select-none"
  onClick={toggleAssignedFilter}
>
  Assigned To
  {assignedFilter === "assigned" && " ▲"}
  {assignedFilter === "unassigned" && " ▼"}
</th>

                  <th className="p-3 border">Invoice No</th>
                  <th className="p-3 border">Invoice</th>
        <th
  className="p-3 border cursor-pointer select-none"
  onClick={toggleVerificationFilter}
>
  Verification
  {verificationFilter === "verified" && " ▲"}
  {verificationFilter === "unverified" && " ▼"}
</th>

                  <th className="p-3 border text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td className="p-3 border">Loading...</td></tr>
                ) : filteredAssets.length > 0 ? (
                  filteredAssets.map((asset) => (
                    <tr key={asset.AssetID} className="hover:bg-gray-50">
                        <td className="p-3 border text-center">
                    <input
                      type="checkbox"
                      className="w-4 h-4 cursor-pointer"
                      checked={selectedItems.includes(asset.AssetID)}
                      onChange={() => handleCheckboxChange(asset.AssetID)}
                    />
                  </td>
                      <td className="p-3 border">{asset.AssetCode}</td>
                      <td className="p-3 border">{asset.item_name}</td>
                      <td className="p-3 border">{asset.model || '-'}</td>
                      <td className="p-3 border">{asset.SerialNumber || '-'}</td>
                      <td className="p-3 border">{asset.LocationCode || '-'}</td>
                      <td className="p-3 border">{asset.staff_name || '-'}</td>
                      <td className="p-3 border">{asset.invoice_no || '-'}</td>
                      <td className="p-3 border text-center">
                        {asset.InvoiceID ? (
                         <a
  href={`${baseURL}/invoice/download/${asset.InvoiceID}`}
  target="_blank"
  rel="noopener noreferrer"
>
  <FiDownload className="text-blue-600 hover:text-blue-800 text-lg" />
</a>

                        ) : ('No file')}
                      </td>
<td className="p-3 border text-center">

  <button
  onClick={() => setVerificationAsset(asset)}
  className={`text-xs px-3 py-1 rounded-full font-medium transition
    ${asset.is_unverified === 1
      ? "bg-red-100 text-red-700 hover:bg-red-200"
      : "bg-green-100 text-green-700 hover:bg-green-200"}
  `}
>
  {asset.is_unverified === 1 ? "Unverified" : "Verified"}
</button>


</td>


                      <td className="p-3 border text-center">
                        <div className="flex justify-center gap-2">
                          <button onClick={() => setViewAsset(asset)} className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded shadow" title="View"><FaEye /></button>
                          <button onClick={() => handleEdit(asset)} className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded shadow" title="Edit"><FaEdit /></button>
                          <button
  className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded shadow"
  onClick={() => setAuditAssetId(asset.AssetID)}
  title="View Audit Log"
>
  <FaDatabase />
</button>
<button
  onClick={() => window.open(
    `${baseURL}/barcode/bycode?code=${encodeURIComponent(asset.AssetCode)}`, 
    "_blank"
  )}

  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded shadow"
>
 <FaBarcode/>
</button>

 <button onClick={() => handleDelete(asset.AssetID)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded shadow" title="Archive"><IoMdArchive /></button>

                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="9" className="text-center p-6 text-gray-500">No assets found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 👁 View Asset Modal */}
      {viewAsset && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-2xl relative overflow-y-auto max-h-[90vh] shadow-lg">
            <button onClick={() => setViewAsset(null)} className="absolute top-2 right-4 text-gray-600 hover:text-red-600 text-2xl">&times;</button>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Asset Details</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <p><strong>Asset ID:</strong> {viewAsset.AssetID}</p>
              <p><strong>Item Name:</strong> {viewAsset.item_name}</p>
              <p><strong>Asset Code:</strong> {viewAsset.AssetCode}</p>
              <p><strong>Serial Number:</strong> {viewAsset.SerialNumber}</p>
              <p><strong>Description:</strong> {viewAsset.Description}</p>
              <p><strong>Assigned To:</strong> {viewAsset.staff_name}</p>
              <p><strong>Location:</strong> {viewAsset.LocationCode}</p>
              <p><strong>Purchase Date:</strong> {viewAsset.PurchaseDate ? new Date(viewAsset.PurchaseDate).toLocaleDateString() : '-'}</p>
              <p><strong>WiFi MAC:</strong> {viewAsset.wifi_mac_address}</p>
              <p><strong>Ethernet MAC:</strong> {viewAsset.ethernet_mac_address}</p>
              <p><strong>Invoice No:</strong> {viewAsset.invoice_no}</p>
            </div>
            {viewAsset.invoice_file_path && (
              <div className="mt-4">
                <a href={`${baseURL}/${viewAsset.invoice_file_path}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  View Invoice File
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add/Edit/Other Modals */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-3xl relative shadow-lg overflow-y-auto max-h-[90vh]">
            <button onClick={() => setShowAddModal(false)} className="absolute top-2 right-4 text-gray-600 hover:text-red-600 text-2xl">&times;</button>
            <AddAsset
              onClose={() => {
                setShowAddModal(false);
                setEditAsset(null);
                fetchAssets();
              }}
              existingAsset={editAsset}
            />
          </div>
        </div>
      )}

      {showAddItemModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md relative shadow-lg overflow-y-auto max-h-[90vh]">
            <button onClick={() => setShowAddItemModal(false)} className="absolute top-2 right-4 text-gray-600 hover:text-red-600 text-2xl">&times;</button>
            <Additem
              onItemAdded={() => {
                setShowAddItemModal(false);
                fetchAssets();
              }}
              closePopup={() => setShowAddItemModal(false)}
            />
          </div>
        </div>
      )}

      {showAddInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md relative shadow-lg overflow-y-auto max-h-[90vh]">
            <button onClick={() => setShowAddInvoice(false)} className="absolute top-2 right-4 text-gray-600 hover:text-red-600 text-2xl">&times;</button>
            <AddInvoice
              onInvoiceAdded={() => {
                setShowAddInvoice(false);
                fetchAssets();
              }}
              closePopup={() => setShowAddInvoice(false)}
              defaultValues={{ asset: 1 }}
            />
          </div>
        </div>
      )}

      {showAddVendorForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md relative shadow-lg overflow-y-auto max-h-[90vh]">
            <button onClick={() => setShowAddVendorForm(false)} className="absolute top-2 right-4 text-gray-600 hover:text-red-600 text-2xl">&times;</button>
            <AddVendors
              onVendorAdded={() => {
                setShowAddVendorForm(false);
                fetchAssets();
              }}
              closePopup={() => setShowAddVendorForm(false)}
              defaultValues={{ asset: 1 }}
            />
          </div>
        </div>
      )}

       {showVerifyAsset && (
  <VerifyAsset
    onClose={() => {
      setShowVerifyAsset(false);
      fetchAssets();
    }}
  />
)}

      {auditAssetId && (
  <AssetAuditLog
    assetId={auditAssetId}
    onClose={() => setAuditAssetId(null)}
  />
)}
{showBulkInvoiceForm && (
  <BulkInvoiceUpdateAsset
    selectedItems={selectedItems}
    onUpdated={() => {
      setShowBulkInvoiceForm(false);
      fetchAssets();
      setSelectedItems([]); // clear selection
    }}
    closePopup={() => setShowBulkInvoiceForm(false)}
  />
)}
{showBulkBarcode && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded-xl w-full max-w-5xl relative shadow-lg overflow-y-auto max-h-[90vh]">
      <BulkBarcodePrint
        assets={assets.filter(a => selectedItems.includes(a.AssetID))}
        baseURL={baseURL}
        onClose={() => setShowBulkBarcode(false)}
      />
    </div>
  </div>
)}

{verificationAsset && (
  <AssetVerificationHistory
    asset={verificationAsset}
    onClose={() => setVerificationAsset(null)}
  />
)}


    </div>
  );
};

export default AssetList;
