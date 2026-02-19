import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddAsset = ({ onClose, existingAsset = null }) => {
  const [items, setItems] = useState([]);
  const [assetTypes, setAssetTypes] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [locations, setLocations] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [model, setModel] = useState([]);


  const [visibleInvoices, setVisibleInvoices] = useState(5);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const invoiceDropdownRef = useRef(null);

  const [formData, setFormData] = useState({
    itemId: '',
    modelId: "",
    assetTypeId: '',
    serialNo: '',
    idno: '',
    installedDate: '',
    wifiMacAddress: '',
    ethernetMacAddress: '',
    assignedTo: '',
    locationId: '',
    invoiceId: '',
    description: '',
    userid: localStorage.getItem('userid'),
  });

  const baseURL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const [itemsRes, typesRes, staffRes, locationsRes, invoicesRes,modelRes] = await Promise.all([
          fetch(`${baseURL}/asset/items`).then(res => res.json()),
          fetch(`${baseURL}/asset/assettypes`).then(res => res.json()),
          fetch(`${baseURL}/staff`).then(res => res.json()),
          fetch(`${baseURL}/locations`).then(res => res.json()),
          fetch(`${baseURL}/invoice`).then(res => res.json()),
           fetch(`${baseURL}/items/model`).then(res => res.json()),
        ]);
        setItems(itemsRes);
        setAssetTypes(typesRes);
        setStaffList(staffRes);
        setLocations(locationsRes);
        setInvoices(invoicesRes);
        setModel(modelRes);
      } catch (err) {
        console.error('Failed to load dropdown data', err);
      }
    };
    fetchDropdowns();
  }, [baseURL]);

  useEffect(() => {
    if (existingAsset) {
      setFormData({
        itemId: existingAsset.item_id || '',
        modelId: existingAsset.model_id || "",
        assetTypeId: existingAsset.TypeID || '',
        assetTagId: existingAsset.AssetCode || '',
        serialNo: existingAsset.SerialNumber || '',
        idno: existingAsset.ID_No || '',
        installedDate: existingAsset.PurchaseDate?.split('T')[0] || '',
        wifiMacAddress: existingAsset.wifi_mac_address || '',
        ethernetMacAddress: existingAsset.ethernet_mac_address || '',
        assignedTo: existingAsset.AssignedTo || '',
        locationId: existingAsset.LocationID || '',
        invoiceId: existingAsset.InvoiceID || '',
        description: existingAsset.Description || '',
        userid: localStorage.getItem('userid'),
      });
    }
  }, [existingAsset]);

  // close invoice dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (invoiceDropdownRef.current && !invoiceDropdownRef.current.contains(event.target)) {
        setIsInvoiceOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

 const handleChange = (e) => {
  const { name, value } = e.target;

  // Reset model if item changes
  if (name === "itemId") {
    setFormData(prev => ({
      ...prev,
      itemId: value,
      modelId: ""  // RESET model on item change
    }));
    return;
  }

  setFormData(prev => ({ ...prev, [name]: value }));
};


  const handleInvoiceScroll = (e) => {
    const bottom = e.target.scrollHeight - e.target.scrollTop <= e.target.clientHeight + 1;
    if (bottom && visibleInvoices < invoices.length) {
      setVisibleInvoices(prev => prev + 5);
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    // FRONTEND FIX — Convert empty strings to null
    const cleanPayload = {
      ...formData,
      itemId: formData.itemId || null,
      modelId: formData.modelId || null,
      assetTypeId: formData.assetTypeId || null,
      serialNo: formData.serialNo || null,
      idno: formData.idno || null,
      installedDate: formData.installedDate || null, // DATE FIX
      wifiMacAddress: formData.wifiMacAddress || null,
      ethernetMacAddress: formData.ethernetMacAddress || null,
      assignedTo: formData.assignedTo || null, // INT FIX
      locationId: formData.locationId || null, // INT FIX
      invoiceId: formData.invoiceId || null, // INT FIX
      description: formData.description || null,
      userid: formData.userid || null
    };

    if (existingAsset) {
      await axios.put(`${baseURL}/asset/update/${existingAsset.AssetID}`, cleanPayload);
      toast.success('Asset updated successfully!');
    } else {
      await axios.post(`${baseURL}/asset/add`, cleanPayload);
      toast.success('Asset added successfully!');
    }

    onClose();
  } catch (error) {
    console.error('Error saving asset:', error);
    toast.error('Failed to save asset');
  }
};
const filteredModels = model.filter(m => m.item_id === Number(formData.itemId));



  return (
    <div className="p-8 bg-white rounded-3xl shadow-2xl relative max-h-[90vh] w-full max-w-4xl overflow-y-auto transition-all duration-300 ease-in-out">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 bg-red-500 text-white rounded-full w-9 h-9 flex items-center justify-center text-xl hover:bg-red-600 transition duration-200"
        title="Close"
      >
        &times;
      </button>

      {/* Title */}
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800 tracking-tight">
        {existingAsset ? 'Edit Asset' : 'Add New Asset'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Asset Info Section */}
        <Section title="Asset Information">
          <div className="space-y-5">
            {/* ✅ Disable these fields when editing */}
            <RowField
              label={existingAsset ? 'Item' : 'Select Item'} // ✅ Dynamic label
              name="itemId"
              type="dropdown"
              value={formData.itemId}
              options={items}
              optionValue="id"
              optionLabel="name"
              onChange={handleChange}
              required
              disabled={!!existingAsset} // ✅ Disable when editing
            />
<RowField
  label="Select Model"
  name="modelId"
  type="dropdown"
  value={formData.modelId}
  options={filteredModels}
  optionValue="id"
  optionLabel="model"
  onChange={handleChange}
  required
  disabled={!!existingAsset}
/>


            <RowField
              label={existingAsset ? 'Asset Type' : 'Select Asset Type'} // ✅ Dynamic label
              name="assetTypeId"
              type="dropdown"
              value={formData.assetTypeId}
              options={assetTypes}
              optionValue="TypeID"
              optionLabel="Description"
              onChange={handleChange}
              required
              disabled={!!existingAsset} // ✅ Disable when editing
            />
          </div>
        </Section>

        {/* Asset Details Section */}
        <Section title="Asset Details">
          <div className="space-y-5">
            <RowField label="Serial Number" name="serialNo" value={formData.serialNo} onChange={handleChange} />
            <RowField label="ID Number" name="idno" value={formData.idno} onChange={handleChange} />
            <RowField label="Delivered Date" name="installedDate" type="date" value={formData.installedDate} onChange={handleChange} />
            <RowField label="WiFi MAC Address" name="wifiMacAddress" value={formData.wifiMacAddress} onChange={handleChange} />
            <RowField label="Ethernet MAC Address" name="ethernetMacAddress" value={formData.ethernetMacAddress} onChange={handleChange} />

            {/* Invoice Dropdown */}
            <div className="flex flex-col md:flex-row md:items-center md:space-x-6">
              <label className="w-full md:w-1/3 text-gray-700 font-medium text-left mb-2 md:mb-0">
                Select Invoice
              </label>
              <div className="relative w-full md:w-2/3" ref={invoiceDropdownRef}>
                <button
                  type="button"
                  onClick={() => {
                    setIsInvoiceOpen(prev => {
                      if (!prev) setVisibleInvoices(5);
                      return !prev;
                    });
                  }}
                  className="border border-gray-300 p-3 rounded-lg w-full text-left bg-white flex justify-between items-center hover:border-blue-400 transition disabled:bg-gray-100 disabled:text-gray-500"

                >
                  {formData.invoiceId
                    ? invoices.find(inv => inv.id === parseInt(formData.invoiceId))?.invoice_no
                    : 'Select Invoice'}
                  <span className="ml-2">▼</span>
                </button>

                {isInvoiceOpen && (
                  <div
                    onScroll={handleInvoiceScroll}
                    className="absolute w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-48 overflow-y-auto z-10 shadow-md"
                  >
                    {invoices.slice(0, visibleInvoices).map(inv => (
                      <div
                        key={inv.id}
                        onClick={() => {
                          setFormData(prev => ({ ...prev, invoiceId: inv.id }));
                          setIsInvoiceOpen(false);
                        }}
                        className={`p-2 cursor-pointer hover:bg-blue-100 ${
                          formData.invoiceId === inv.id ? 'bg-blue-50 font-semibold' : ''
                        }`}
                      >
                        {inv.invoice_no} ({inv.created_date})
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <RowField
              label="Assign to Staff"
              name="assignedTo"
              type="dropdown"
              value={formData.assignedTo}
              options={staffList}
              optionValue="StaffID"
              optionLabel="Name"
              onChange={handleChange}
            />
            <RowField
              label="Select Location"
              name="locationId"
              type="dropdown"
              value={formData.locationId}
              options={locations}
              optionValue="LocationID"
              optionLabel="Description"
              onChange={handleChange}
            />
            <RowField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter a short description..."
            />
          </div>
        </Section>

        {/* Submit Button */}
        <div className="flex justify-end border-t pt-5 mt-8">
          <button
            type="submit"
            className="bg-green-600 text-white px-10 py-3 rounded-xl hover:bg-green-700 active:scale-95 shadow-md transition-all duration-150 ease-in-out"
          >
            {existingAsset ? 'Update Asset' : 'Save Asset'}
          </button>
        </div>
      </form>
    </div>
  );
};

/* --------------------------- */
/* Reusable Subcomponents      */
/* --------------------------- */

const Section = ({ title, children }) => (
  <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 shadow-inner">
    <h3 className="text-xl font-semibold text-gray-800 mb-5 border-b pb-2 text-left">{title}</h3>
    {children}
  </div>
);

const RowField = ({
  label,
  name,
  value,
  onChange,
  type = 'text',
  options = [],
  optionValue,
  optionLabel,
  required = false,
  placeholder = '',
  disabled = false, // ✅ Added disabled support
}) => (
  <div className="flex flex-col md:flex-row md:items-center md:space-x-6">
    <label className="w-full md:w-1/3 text-gray-700 font-medium text-left mb-2 md:mb-0">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    <div className="w-full md:w-2/3">
      {type === 'dropdown' ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:bg-gray-100 disabled:text-gray-500"
        >
          <option value="">Select</option>
          {options.map(opt => (
            <option key={opt[optionValue]} value={opt[optionValue]}>
              {opt[optionLabel]}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition placeholder-gray-400 disabled:bg-gray-100 disabled:text-gray-500"
        />
      )}
    </div>
  </div>
);

export default AddAsset;
