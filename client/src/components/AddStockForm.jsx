import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const baseURL = process.env.REACT_APP_API_BASE_URL;

const AddStockForm = ({ onStockAdded, closePopup, stockToEdit }) => {
  const [newStock, setNewStock] = useState({
    item_id: '',
    quantity: '',
    unit: '',
    unit_price: '',
    invoice_id: '',
    userid: localStorage.getItem('userid'),
    isasset: '',
  });

  const [items, setItems] = useState([]);
  const [invoices, setInvoices] = useState([]);

  const [visibleInvoices, setVisibleInvoices] = useState(5);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const invoiceDropdownRef = useRef(null);

  useEffect(() => {
    fetch(`${baseURL}/items`)
      .then(res => res.json())
      .then(data => setItems(data))
      .catch(err => console.error('Failed to load items', err));


    fetch(`${baseURL}/invoice`)
      .then(res => res.json())
      .then(data => setInvoices(data))
      .catch(err => console.error('Failed to load invoices', err));
  }, []);

  useEffect(() => {
    if (stockToEdit) {
      setNewStock({
        ...stockToEdit,
        purchase_date: stockToEdit.purchase_date
          ? stockToEdit.purchase_date.split('T')[0] // ✅ ensures correct format
          : '',
        userid: localStorage.getItem('userid'),
      });
    }
  }, [stockToEdit]);

  // Close dropdown if clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        invoiceDropdownRef.current &&
        !invoiceDropdownRef.current.contains(event.target)
      ) {
        setIsInvoiceOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = e => {
    const { name, value } = e.target;

    if (name === 'item_id') {
      const selectedItem = items.find(item => item.id === parseInt(value));
      setNewStock({
        ...newStock,
        item_id: value,
        unit: selectedItem?.unit || '',
        isasset: selectedItem?.asset ?? '',
      });
    } else {
      setNewStock({ ...newStock, [name]: value });
    }
  };

  const handleInvoiceScroll = e => {
    const bottom = e.target.scrollHeight - e.target.scrollTop <= e.target.clientHeight + 1;
    if (bottom && visibleInvoices < invoices.length) {
      setVisibleInvoices(prev => prev + 5);
    }
  };

  const handleAddStock = () => {
    if (!newStock.item_id) {
      toast.error('Please select an item');
      return;
    }
    if (!newStock.quantity || parseFloat(newStock.quantity) <= 0) {
      toast.error('Please enter quantity');
      return;
    }
    if (!newStock.unit_price || parseFloat(newStock.unit_price) <= 0) {
      toast.error('Please enter unit price');
      return;
    }

    const updatedStock = {
      ...newStock,
      quantity: parseFloat(newStock.quantity),
      unit_price: parseFloat(newStock.unit_price),
      userid: localStorage.getItem('userid'),
      invoice_id: newStock.invoice_id || null,
    };

    const method = stockToEdit ? 'PUT' : 'POST';
    const url = stockToEdit
      ? `${baseURL}/inventory/${stockToEdit.id}`
      : `${baseURL}/inventory/add`;

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedStock),
    })
      .then(async res => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Something went wrong');
        }
        toast.success(stockToEdit ? 'Stock updated!' : 'Stock added!');
        onStockAdded();
        closePopup();
      })
      .catch(err => {
        console.error('Error saving stock:', err);
        toast.error('Failed to save stock: ' + err.message);
      });
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content add-stock-form">
        <button className="close-popup" onClick={closePopup}>
          X
        </button>
        <h3>{stockToEdit ? 'Edit Stock' : 'Add Stock'}</h3>

      <select
  name="item_id"
  value={newStock.item_id}
  onChange={handleInputChange}
>
  <option value="">Select Item</option>

  {items
    .slice() // prevent mutating original array
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((item) => (
      <option key={item.id} value={item.id}>
        {item.name}
      </option>
    ))}
</select>


        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={newStock.quantity}
          onChange={handleInputChange}
        />

        <input name="unit" value={newStock.unit} onChange={handleInputChange} disabled />

        <input
          type="number"
          name="unit_price"
          placeholder="Unit Price"
          value={newStock.unit_price}
          onChange={handleInputChange}
        />


        {/* Invoice dropdown */}
        <div className="relative" ref={invoiceDropdownRef} style={{ marginTop: '10px' }}>
          <button
            type="button"
            className="border p-2 rounded w-full text-left bg-white flex justify-between items-center"
            onClick={() => {
              setIsInvoiceOpen(prev => {
                if (!prev) setVisibleInvoices(5);
                return !prev;
              });
            }}
          >
            {newStock.invoice_id
              ? invoices.find(inv => inv.id === parseInt(newStock.invoice_id))?.invoice_no
              : 'Select Invoice'}
            <span>▼</span>
          </button>

          {isInvoiceOpen && (
            <div
              onScroll={handleInvoiceScroll}
              style={{
                border: '1px solid #ccc',
                borderRadius: '8px',
                maxHeight: '150px',
                overflowY: 'auto',
                position: 'absolute',
                width: '100%',
                backgroundColor: 'white',
                zIndex: 10,
              }}
            >
              {invoices.slice(0, visibleInvoices).map(inv => (
                <div
                  key={inv.id}
                  onClick={() => {
                    setNewStock(prev => ({ ...prev, invoice_id: inv.id }));
                    setIsInvoiceOpen(false);
                  }}
                  style={{
                    padding: '8px',
                    cursor: 'pointer',
                    backgroundColor:
                      newStock.invoice_id === inv.id ? '#e0f7fa' : 'white',
                  }}
                >
                  {inv.invoice_no}  ({inv.created_date})
                </div>
              ))}
            </div>
          )}
        </div>

        <button onClick={handleAddStock} style={{ marginTop: '15px' }}>
          {stockToEdit ? 'Update Stock' : 'Add Stock'}
        </button>
      </div>
    </div>
  );
};

export default AddStockForm;
