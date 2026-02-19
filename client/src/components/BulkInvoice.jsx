import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";

const baseURL = process.env.REACT_APP_API_BASE_URL;

const BulkInvoiceUpdate = ({ selectedItems, onUpdated, closePopup }) => {
  const [invoices, setInvoices] = useState([]);
  const [invoiceId, setInvoiceId] = useState(null);
  const [visibleInvoices, setVisibleInvoices] = useState(5);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const invoiceDropdownRef = useRef(null);

  useEffect(() => {
    fetch(`${baseURL}/invoice`)
      .then((res) => res.json())
      .then((data) => setInvoices(data))
      .catch((err) => console.error("Failed to load invoices", err));
  }, []);

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
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInvoiceScroll = (e) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop <= e.target.clientHeight + 1;
    if (bottom && visibleInvoices < invoices.length) {
      setVisibleInvoices((prev) => prev + 5);
    }
  };

  const handleSubmit = async () => {
    if (!invoiceId) {
      toast.error("Please select an invoice");
      return;
    }

    try {
      const res = await fetch(`${baseURL}/invoice/bulk-update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inventoryIds: selectedItems,
          invoice_id: invoiceId,
        }),
      });

      if (res.ok) {
        toast.success("Invoice updated for selected items!");
        onUpdated();
        closePopup();
      } else {
        const error = await res.json();
        throw new Error(error.error || "Update failed");
      }
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Error updating invoice");
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content add-stock-form">
        <button className="close-popup" onClick={closePopup}>
          X
        </button>
        <h3>Update Invoice for Selected Items</h3>

        {/* ✅ Invoice Dropdown Only */}
        <div className="relative" ref={invoiceDropdownRef} style={{ marginBottom: "15px" }}>
          <button
            type="button"
            className="border p-2 rounded w-full text-left bg-white flex justify-between items-center"
            onClick={() => {
              setIsInvoiceOpen((prev) => {
                if (!prev) setVisibleInvoices(5);
                return !prev;
              });
            }}
          >
            {invoiceId
              ? invoices.find((inv) => inv.id === parseInt(invoiceId))?.invoice_no
              : "Select Invoice"}
            <span>▼</span>
          </button>

          {isInvoiceOpen && (
            <div
              onScroll={handleInvoiceScroll}
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                maxHeight: "150px",
                overflowY: "auto",
                position: "absolute",
                width: "100%",
                backgroundColor: "white",
                zIndex: 10,
              }}
            >
              {invoices.slice(0, visibleInvoices).map((inv) => (
                <div
                  key={inv.id}
                  onClick={() => {
                    setInvoiceId(inv.id);
                    setIsInvoiceOpen(false);
                  }}
                  style={{
                    padding: "8px",
                    cursor: "pointer",
                    backgroundColor: invoiceId === inv.id ? "#e0f7fa" : "white",
                  }}
                >
                  {inv.invoice_no}  ({inv.created_date})
                </div>
              ))}
            </div>
          )}
        </div>

        <button onClick={handleSubmit}>Update Invoice</button>
      </div>
    </div>
  );
};

export default BulkInvoiceUpdate;
