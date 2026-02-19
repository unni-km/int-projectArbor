import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const baseURL = process.env.REACT_APP_API_BASE_URL;

const AddInvoice = ({ onInvoiceAdded, closePopup, defaultValues = {} }) => {
  const [invoiceNo, setInvoiceNo] = useState('');
  const [invoiceFile, setInvoiceFile] = useState(null);
  const [vendors, setVendors] = useState([]);
  const [vendorId, setVendorId] = useState('');
  const [createdDate, setCreatedDate] = useState('');
   const [amount, setAmount] = useState('');

  useEffect(() => {
    fetch(`${baseURL}/vendors`)
      .then((res) => res.json())
      .then((data) => {
        // ✅ filter vendors based on defaultValues.asset
        const filtered = data.filter((vendor) => vendor.asset === (defaultValues.asset ?? 0));
        setVendors(filtered);
      })
      .catch((err) => console.error('Failed to load vendors', err));
  }, [defaultValues.asset]);

  const handleSubmit = async () => {
    if (!invoiceNo || !invoiceFile || !vendorId || !createdDate) {
      toast.error('All fields are required');
      return;
    }

    const formData = new FormData();
    formData.append('invoice_no', invoiceNo);
    formData.append('invoice_amount', amount);
    formData.append('invoice_file', invoiceFile);
    formData.append('vendor_id', vendorId);
    formData.append('created_date', createdDate);
    formData.append('asset', defaultValues.asset || 0);

    try {
      const res = await fetch(`${baseURL}/invoice/add`, {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        toast.success('Invoice uploaded!');
        onInvoiceAdded();
        closePopup();
      } else {
        const error = await res.json();
        throw new Error(error.error || 'Upload failed');
      }
    } catch (err) {
      console.error('Upload error:', err);
      toast.error('Error uploading invoice');
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content add-stock-form">
        <button className="close-popup" onClick={closePopup}>
          X
        </button>
        <h3>Add Invoice</h3>

        <input
          type="text"
          placeholder="Invoice Number"
          value={invoiceNo}
          onChange={(e) => setInvoiceNo(e.target.value)}
        />
     <input
          type="text"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <select
          name="vendor_id"
          value={vendorId}
          onChange={(e) => setVendorId(e.target.value)}
        >
          <option value="">Select Vendor</option>
          {vendors.map((vendor) => (
            <option key={vendor.id} value={vendor.id}>
              {vendor.name}
            </option>
          ))}
        </select>

        <input
          type="date"
          name="created_date"
          value={createdDate}
          onChange={(e) => setCreatedDate(e.target.value)}
          style={{
            display: 'block',
            width: '100%',
            padding: '8px',
            marginTop: '10px',
          }}
        />

        <input
          type="file"
          accept=".pdf,.jpeg,.jpg"
          onChange={(e) => setInvoiceFile(e.target.files[0])}
        />

        <button onClick={handleSubmit}>Upload Invoice</button>
      </div>
    </div>
  );
};

export default AddInvoice;
