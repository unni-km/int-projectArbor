import React, { useState,useEffect } from 'react';
import './QuantityPrompt.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const QuantityPrompt = ({ items = [], onConfirm, onCancel }) => {
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
  const initialQuantities = {};
  items.forEach(item => {
    initialQuantities[item.id] = item.quantity;
  });
  setQuantities(initialQuantities);
}, [items]);

  const handleInputChange = (id, value) => {
    setQuantities(prev => ({
      ...prev,
      [id]: parseFloat(value)
    }));
  };

  const handleConfirm = () => {
    const invalid = items.find(item => {
      const qty = quantities[item.id];
      return !qty || qty <= 0 || qty > item.quantity;
    });

    if (invalid) {
      toast.error(`Invalid quantity for "${invalid.item_name}". Must be between 1 and ${invalid.quantity}`);
      return;
    }

    onConfirm(quantities);
  };

  return (
    <div className="quantity-prompt">
      <div className="popup-overlay">
        <div className="popup-content">
          <h3>Enter Quantities to Transfer</h3>
          {items.map(item => (
            <div key={item.id} className="quantity-row">
              <span>{item.item_name} (Available: {item.quantity}{item.unit})</span>
              <input
                 type="number"
                 min="1"
               max={item.quantity}
                 value={quantities[item.id] || ''}
                onChange={e => handleInputChange(item.id, e.target.value)}
/>

            </div>
          ))}
          <div className="button-group">
            <button onClick={handleConfirm}>Confirm</button>
            <button  onClick={onCancel}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};


export default QuantityPrompt;
