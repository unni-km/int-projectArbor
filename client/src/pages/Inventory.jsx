import React, { useEffect, useState } from 'react';
import './Inventory.css'; 
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import AddStockForm from '../components/AddStockForm';
import QuantityPrompt from '../components/QuantityPrompt';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { FiDownload } from "react-icons/fi";
import AddItem from '../components/Additem'; // adjust path as needed
import AddVendors from '../components/Addvendors'; // adjust path as needed
import AddInvoice from '../components/Addinvoice';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import BulkInvoiceUpdate from '../components/BulkInvoice';
import InventoryReportPopup from './InventoryReport';




const baseURL = process.env.REACT_APP_API_BASE_URL;
const Inventory = () => {
    const [inventory, setInventory] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [selectedItems, setSelectedItems] = useState([]);
    const [showQuantityPrompt, setShowQuantityPrompt] = useState(false);
    const [showAddItemForm, setShowAddItemForm] = useState(false);
    const [showAddVendorForm, setShowAddVendorForm] = useState(false);
    const [showAddInvoiceForm, setshowAddInvoiceForm] = useState(false);
    const [showBulkInvoiceForm, setShowBulkInvoiceForm] = useState(false);
    const [showInventoryReport, setShowInventoryReport] = useState(false);
    const role = parseInt(localStorage.getItem('roleid'), 10);
    dayjs.extend(utc);
    // Define openPopup function here
    const openPopup = () => setShowPopup(true); // Open the popup
  
    const navigate = useNavigate();

    useEffect(() => {
      const userId = localStorage.getItem('userid');
  
      if (!userId) {
        // Redirect to login if user is not authenticated
        navigate('/');
      } else {
        // Fetch inventory if authenticated
        fetch(`${baseURL}/inventory`)
          .then(res => res.json())
          .then(data => setInventory(data))
          .catch(err => console.error('Failed to fetch inventory', err));
      }
    }, [navigate]);
  
  
    const fetchInventory = () => {
      fetch(`${baseURL}/inventory`)
        .then(res => res.json())
        .then(data => setInventory(data))
        .catch(err => console.error('Failed to fetch inventory', err));
    };
    const handleEdit = (item) => {
        setEditingItem(item);
        setShowPopup(true);
      };

const handleDelete = (id) => {
  confirmAlert({
    title: 'Confirm Delete',
    message: 'Are you sure you want to delete this item?',
    buttons: [
      {
        label: 'Yes',
        onClick: () => {
          fetch(`${baseURL}/inventory/${id}`, {
            method: 'DELETE',
          })
            .then(res => {
              if (res.ok) {
                toast.success('Item deleted');
                fetchInventory();
              } else {
                toast.error('Failed to delete item');
              }
            })
            .catch(err => {
              console.error('Error deleting item:', err);
              toast.error('Something went wrong!');
            });
        }
      },
      {
        label: 'No',
        onClick: () => {
          // Optional: toast.info('Delete cancelled');
        }
      }
    ]
  });
};

    

    
    const handleCheckboxChange = (id) => {
      setSelectedItems(prev =>
        prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
      );
    };
  
   const handleMoveToPantry = () => {
  if (selectedItems.length === 0) {
    toast.error('Please select at least one item to move.');
    return;
  }

  setShowQuantityPrompt(true);
};

  
    const moveItemsToPantry = async (quantityMap = {}) => {
  const userId = localStorage.getItem('userid');
  const inventoryIds = Object.keys(quantityMap).map(id => parseInt(id, 10)); // safer
   const roleid = parseInt(localStorage.getItem('roleid'), 10);
   console.log("roleid from localStorage:", roleid);
  if (inventoryIds.length === 0) {
    toast.error('No quantities provided');
    return;
  }

  const payload = {
    inventoryIds: inventoryIds,
    userId: userId,
    quantityMap: quantityMap,
    roleid:roleid

  };
console.log("Payload being sent:",payload);
  try {
    const res = await fetch(`${baseURL}/inventory/move-to-pantry`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      const data = await res.json();
       toast.success(data.message);
      fetchInventory();
      setSelectedItems([]);
    } else {
      const errorData = await res.json();
     toast.error(errorData.message || "Error occurred");
    }
  } catch (error) {
    console.error('Move error:', error);
    toast.error('Something went wrong');
  }
};

const canEditOrDelete = (item) => {
  const roleid = parseInt(localStorage.getItem('roleid'), 10);

  // Admin (role 40) can always edit/delete
  if (roleid === 40) return true;

  // For normal users: allow only if within 1 hour of creation
  const createdAt = dayjs.utc(item.created_at);
  const now = dayjs.utc();
  const diffInMinutes = now.diff(createdAt, 'minute');

  return diffInMinutes <= 60; // true if within 1 hour
};

      
  
    return (
      <div>
        <Navbar />
        <ToastContainer 
      position="top-center" 
      autoClose={3000} 
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
    />
    
        <div className="inventory-container">
          <div className="left-controls">
            {role === 40 && (
              <>
                <button className="control-button" onClick={() => setShowAddItemForm(true)}>Add Item</button>
                <button className="control-button" onClick={() => setShowAddVendorForm(true)}>Add Vendor</button>
                <button
  className="control-button"
  onClick={() => setShowInventoryReport(true)}
>
  Inventory Report
</button>
              </>
            )}
          </div>
        <h2>Inventory Details</h2>
    
<div className="inventory-controls">

        <button className="control-button" onClick={() => setshowAddInvoiceForm(true)}>Add Invoice</button>

  <button className="control-button" onClick={openPopup}>Add Stock</button>
  <button 
    className="control-button" 
    onClick={handleMoveToPantry} 
    disabled={selectedItems.length === 0}
  >
    Move Items
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


  <input
    type="text"
    placeholder="Search by item, vendor or invoice no"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="search-input"
  />
</div>

          
          {/* Inventory Table */}
          <table className="inventory-table">
            <thead>
              <tr>
                <th></th>
                <th>ID</th>
                <th>Item</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Vendor</th>
                <th>Created At</th>
                <th>User</th>
                <th>Invoice No</th>
                <th>Invoice</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
            {inventory
  .filter(item =>
    item.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.vendor_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.invoice_no?.toLowerCase().includes(searchTerm.toLowerCase())
  )
  .map(item => (

                <tr key={item.id}>
                   <td>
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => handleCheckboxChange(item.id)}
                    />
                  </td>
                  <td>{item.id}</td>
                  <td>{item.item_name}</td>
                  <td>{item.quantity}{item.unit}</td>
                  <td>{item.unit_price}</td>
                  <td>{item.vendor_name}</td>
                  <td>{dayjs.utc(item.created_at).format('DD MMM YYYY, hh:mm A')}</td>
                  <td>{item.user_name}</td>
                  <td>{item.invoice_no}</td>
                  <td>
{item.id ? (
  <a
    href={`${baseURL}/invoice/download/${item.invoice_id}`}
    target="_blank"
    rel="noopener noreferrer"
    style={{ color: '#007bff', textDecoration: 'none' }}
  >
    <FiDownload
      style={{
        marginRight: '8px',
        marginLeft: '15px',
        color: '#007bff',
        fontSize: '18px',
        cursor: 'pointer',
        transition: 'transform 0.2s ease, color 0.2s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.2)';
        e.currentTarget.style.color = '#0056b3';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.color = '#007bff';
      }}
    />
  </a>
) : (
  'No file'
)}

</td>
                  
  <td style={{ display: 'inline-flex' }}>
  <FaEdit
    className={`icon edit-icon ${!canEditOrDelete(item) ? 'disabled-icon' : ''}`}
    onClick={() => canEditOrDelete(item) && handleEdit(item)}
    title={canEditOrDelete(item) ? "Edit" : "Edit disabled"}
    style={{ cursor: canEditOrDelete(item) ? 'pointer' : 'not-allowed' }}
  />
  <FaTrash
    className={`icon delete-icon ${!canEditOrDelete(item) ? 'disabled-icon' : ''}`}
    onClick={() => canEditOrDelete(item) && handleDelete(item.id)}
    title={canEditOrDelete(item) ? "Delete" : "Delete disabled"}
    style={{ cursor: canEditOrDelete(item) ? 'pointer' : 'not-allowed', marginLeft: "8px" }}
  />
</td>
 
                </tr>
              ))}
            </tbody>
          </table>
  
          {/* Show Popup if showPopup state is true */}
          {showPopup && (
            <AddStockForm
              onStockAdded={fetchInventory}
              closePopup={() => {
                setShowPopup(false);
                setEditingItem(null);
              }}
              stockToEdit={editingItem}
            />
          )}
        </div>
  
        {/* Show Quantity Prompt if it's triggered */}
{showQuantityPrompt && (
  <QuantityPrompt
    items={inventory.filter(item => selectedItems.includes(item.id))} // ✅ send actual item details
    onConfirm={(quantityMap) => {
      moveItemsToPantry(quantityMap);
      setShowQuantityPrompt(false);
    }}
    onCancel={() => {
      setShowQuantityPrompt(false);
    }}
  />
)}



        {showAddItemForm && (
  <AddItem
    onItemAdded={() => {
      setShowAddItemForm(false);
      fetchInventory(); 
    }}
    closePopup={() => setShowAddItemForm(false)}
  />
)}

{showAddVendorForm && (
  <AddVendors
    onVendorAdded={() => {
      setShowAddVendorForm(false);
      fetchInventory(); 
    }}
    closePopup={() => setShowAddVendorForm(false)}
  />
)}
{showAddInvoiceForm && (
  <AddInvoice
    onInvoiceAdded={() => {
      setshowAddInvoiceForm(false);
      fetchInventory(); 
    }}
    closePopup={() => setshowAddInvoiceForm(false)}
  />
)}
{showBulkInvoiceForm && (
  <BulkInvoiceUpdate
    selectedItems={selectedItems}
    onUpdated={() => {
      setShowBulkInvoiceForm(false);
      fetchInventory();
      setSelectedItems([]); // clear selection
    }}
    closePopup={() => setShowBulkInvoiceForm(false)}
  />
)}

{showInventoryReport && (
  <InventoryReportPopup
    closePopup={() => setShowInventoryReport(false)}
  />
)}

      </div>
    );
  };
  
  export default Inventory;  
