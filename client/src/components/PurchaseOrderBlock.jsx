import React from "react";
import { FaFilePdf, FaCalculator, FaMinus, FaPlus, FaReceipt } from "react-icons/fa";
import generatePOPdf from "./generatePOPdf";

// Helper for currency formatting
const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);

export default function PurchaseOrderBlock({
  request,
  vendors,
  poItems,
  setPoItems, // Needed to update state
  poTerms,
  setPoTerms,
  poTd,
  canDEEditPO,
  canDMReviewPO,
  canCHReapprovePO,
  isQuantityModified,
  sendToDM,
  approvePOByDM,
  reapprovePOByCH,
  sendToCH,
  isEffectiveQuantityChanged,
    rejectingStage,
  setRejectingStage,
  rejectReason,
  setRejectReason,
  rejectStage
}) {
  const vendor = vendors.find((v) => v.id === request.selected_vendor_id);

  // --- HANDLERS ---
  const handleQuantityChange = (index, delta) => {
    setPoItems((prev) =>
      prev.map((item, i) => {
        if (i !== index) return item;
        const newQty = Math.max(1, Number(item.quantity) + delta);
        return { ...item, quantity: newQty };
      })
    );
  };

  const handleInputChange = (index, value) => {
    const val = parseInt(value, 10);
    if (isNaN(val) || val < 1) return;
    setPoItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, quantity: val } : item))
    );
  };

  // --- CALCULATIONS ---
  const calculateTotals = () => {
    let subTotal = 0;
    let totalTax = 0;

    poItems.forEach((item) => {
      const qty = Number(item.quantity || 0);
      const price = Number(item.unit_price || 0);
      // Use item-specific GST rate, default to 0 if null
      const gstRate = item.gst_rate ? Number(item.gst_rate) : 0;

      const lineBase = qty * price;
      const lineTax = lineBase * (gstRate / 100);

      subTotal += lineBase;
      totalTax += lineTax;
    });

    return { subTotal, totalTax, grandTotal: subTotal + totalTax };
  };

  const { subTotal, totalTax, grandTotal } = calculateTotals();

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* HEADER */}
      <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FaReceipt className="text-gray-400" />
          <h3 className="text-lg font-bold text-gray-800">Purchase Order</h3>
        </div>
        {vendor && (
          <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-bold uppercase tracking-wider rounded-lg border border-green-200">
            Approved Vendor: {vendor.name}
          </span>
        )}
      </div>

      <div className="p-6">
        {/* TABLE HEADER */}
        <div className="hidden md:grid grid-cols-12 gap-4 pb-2 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          <div className="col-span-4">Item Details</div>
          <div className="col-span-2 text-center">Price</div>
          <div className="col-span-2 text-center">Quantity</div>
          <div className="col-span-2 text-center">GST %</div>
          <div className="col-span-2 text-right">Total</div>
        </div>

        {/* ITEMS LIST */}
        <div className="space-y-4 md:space-y-0 md:divide-y md:divide-gray-50 mb-6">
          {poItems.map((item, idx) => {
            const qty = Number(item.quantity);
            const price = Number(item.unit_price);
            const gst = item.gst_rate ? Number(item.gst_rate) : 0;
            const lineTotal = qty * price * (1 + gst / 100);

            return (
              <div key={item.rfq_item_id || idx} className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 py-3 items-center">
                {/* Item Name */}
                <div className="col-span-4 font-bold text-gray-700 text-sm">
                  {item.item_name}
                </div>

                {/* Unit Price */}
                <div className="col-span-2 text-left md:text-center text-sm font-medium text-gray-600">
                  {formatCurrency(price)}
                </div>

                {/* Quantity Editor */}
                <div className="col-span-2 flex items-center justify-start md:justify-center gap-2">
                  {(canDEEditPO || canDMReviewPO) ? (
                    <>
                      <button
                        onClick={() => handleQuantityChange(idx, -1)}
                        className="p-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                      >
                        <FaMinus size={10} />
                      </button>
                      <input
                        type="number"
                        className="w-12 text-center border border-gray-200 rounded text-sm font-bold py-1 outline-none focus:border-blue-500"
                        value={qty}
                        onChange={(e) => handleInputChange(idx, e.target.value)}
                      />
                      <button
                        onClick={() => handleQuantityChange(idx, 1)}
                        className="p-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                      >
                        <FaPlus size={10} />
                      </button>
                    </>
                  ) : (
                    <span className="font-bold text-sm bg-gray-50 px-3 py-1 rounded border border-gray-100">
                      x{qty}
                    </span>
                  )}
                </div>

                {/* GST Rate */}
                <div className="col-span-2 text-left md:text-center text-xs font-medium text-gray-500">
                  {gst > 0 ? `${gst}%` : "—"}
                </div>

                {/* Line Total */}
                <div className="col-span-2 text-left md:text-right font-bold text-gray-800 text-sm">
                  {formatCurrency(lineTotal)}
                </div>
              </div>
            );
          })}
        </div>

        {/* FINANCIAL SUMMARY */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pt-4 border-t border-gray-100">
          
          {/* Terms & Conditions Input */}
          <div className="w-full md:w-2/3">
            {(canDEEditPO || canDMReviewPO)? (
              <div>
                 <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">
                    Terms & Conditions
                 </label>
                 <textarea
                  className="w-full border-2 border-gray-100 p-3 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all placeholder:text-gray-300 bg-gray-50/30"
                  rows={3}
                  value={poTerms}
                  onChange={(e) => setPoTerms(e.target.value)}
                  placeholder="e.g. Delivery within 7 days..."
                />
              </div>
            ) : (
               <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">PO Terms</p>
                  <p className="text-xs text-gray-600 whitespace-pre-line">{poTd.terms}</p>
               </div>
            )}
          </div>

          {/* Grand Totals */}
          <div className="w-full md:w-1/3 space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="flex justify-between text-xs text-gray-500">
              <span>Subtotal</span>
              <span>{formatCurrency(subTotal)}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Total GST</span>
              <span>{formatCurrency(totalTax)}</span>
            </div>
            <div className="flex justify-between text-lg font-black text-slate-800 pt-2 border-t border-slate-200 mt-2">
              <span>Grand Total</span>
              <span>{formatCurrency(grandTotal)}</span>
            </div>
          </div>
        </div>

        {/* ACTIONS */}
<div className="mt-8 flex justify-end gap-3">

  {/* 🔵 DE STAGE */}
  {canDEEditPO && (
    <button
      onClick={sendToDM}
      className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-all"
    >
      Send to DM for Review
    </button>
  )}

  {/* 🟢 DM REVIEW (No Qty Change) */}
  {canDMReviewPO && !isEffectiveQuantityChanged && (
    <button
      onClick={approvePOByDM}
      className="px-8 py-3 bg-green-600 text-white rounded-xl font-bold shadow-lg hover:bg-green-700 transition-all flex items-center gap-2"
    >
      <FaCalculator /> Approve & Issue PO
    </button>
    
    
  )}

  {/* 🟠 DM REVIEW (Qty Modified) */}
  {canDMReviewPO  && isEffectiveQuantityChanged && (
    <button
      onClick={sendToCH}
      className="px-8 py-3 bg-orange-600 text-white rounded-xl font-bold shadow-lg hover:bg-orange-700 transition-all"
    >
      Quantity Modified — Send to CH
    </button>
  )}

  {canDMReviewPO && (
  <button
    onClick={() => setRejectingStage("PO_REVIEW_DM")}
    className="px-6 py-3 bg-red-600 text-white rounded-xl font-bold shadow hover:bg-red-700"
  >
    Reject
  </button>
)}

  {/* 🟣 CH RE-APPROVAL */}
  {canCHReapprovePO && (
    <button
      onClick={reapprovePOByCH}
      className="px-8 py-3 bg-purple-600 text-white rounded-xl font-bold shadow-lg hover:bg-purple-700 transition-all flex items-center gap-2"
    >
      <FaCalculator /> Final Approve & Issue PO
    </button>
  )}

  {canCHReapprovePO && (
  <button
    onClick={() => setRejectingStage("PO_REAPPROVAL_CH")}
    className="px-6 py-3 bg-red-600 text-white rounded-xl font-bold shadow hover:bg-red-700"
  >
    Reject
  </button>
)}

  {/* 🔵 DOWNLOAD */}
  {request.current_status === "PO_ISSUED" && (
    <button
      onClick={() =>
        generatePOPdf({
          request,
          vendor,
          poItems,
          poTd,
          totals: { subTotal, totalTax, grandTotal }
        })
      }
      className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-all flex items-center gap-2"
    >
      <FaFilePdf /> Download PO PDF
    </button>
  )}


</div>
{rejectingStage && (
  <div className="mt-4 bg-red-50 border border-red-200 p-4 rounded-xl">
    
    <label className="text-xs font-bold text-red-600 uppercase">
      Rejection Reason
    </label>

    <textarea
      className="w-full border p-2 rounded mt-2"
      rows={3}
      value={rejectReason}
      onChange={(e) => setRejectReason(e.target.value)}
      placeholder="Enter reason for rejection"
    />

    <div className="flex gap-3 mt-3">
     <button
  disabled={!rejectReason.trim()}
  onClick={() => rejectStage(rejectingStage)}
  className="px-4 py-2 bg-red-600 text-white rounded disabled:opacity-40"
>
  Confirm Reject
</button>

      <button
        onClick={() => {
          setRejectingStage(null);
          setRejectReason("");
        }}
        className="px-4 py-2 bg-gray-300 rounded"
      >
        Cancel
      </button>
    </div>
  </div>
)}
      </div>
    </section>
  );
}