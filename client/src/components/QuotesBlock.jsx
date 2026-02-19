import React from "react";
import {
  FaPlus,
  FaTrash,
  FaFilePdf,
  FaCalculator,
  FaCheckCircle,
  FaChevronDown
} from "react-icons/fa";

export default function QuotesBlock({
  quotes,

  /* ===== ROLE FLAGS & ACTIONS ===== */
  canUploadQuotes,
  canDMReviewQuotes,
  canCHApproveVendor,
  approveVendorByCH,

  /* ===== EXEC (UPLOAD) ===== */
  vendors,
  rfqItems,
  quoteVendorId,
  setQuoteVendorId,
  vendorQuotes,
  setVendorQuotes,
  submitQuoteWithItems,

  /* ===== DM (RECOMMEND) ===== */
  selectedQuoteIds,
  setSelectedQuoteIds,
  recommendationReasons,
  setRecommendationReasons,
  submitRecommendations,

  /* ===== COMPARE ===== */
  showCompare,
  setShowCompare,
  comparisonItems,
  baseURL
}) {
  /* ================= ADD VENDOR QUOTE ================= */
  const addVendorQuote = () => {
    if (!quoteVendorId) return;

    if (vendorQuotes.some(v => v.vendor_id === Number(quoteVendorId))) {
      alert("Quote already added for this vendor");
      return;
    }

    const vendor = vendors.find(v => v.id === Number(quoteVendorId));

    setVendorQuotes(prev => [
      ...prev,
      {
        tempId: Date.now(),
        vendor_id: vendor.id,
        vendor_name: vendor.name,
        items: rfqItems.map(i => ({
          rfq_item_id: i.id,
          item_name: i.item_name,
          quantity: i.quantity,
          unit_price: ""
        }))
      }
    ]);

    setQuoteVendorId("");
  };

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* ================= HEADER ================= */}
      <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <FaCalculator className="text-gray-400" />
          <h3 className="text-lg font-bold text-gray-800">
            Vendor Quotes
          </h3>
        </div>

        {quotes.length > 1 && (
          <button
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-2 border ${
              showCompare
                ? "bg-blue-50 border-blue-200 text-blue-600"
                : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
            onClick={() => setShowCompare(p => !p)}
          >
            <FaCalculator size={12} />
            {showCompare ? "Close Comparison" : "Compare Quotes"}
          </button>
        )}
      </div>

      <div className="p-6">
        {/* ================= COMPARISON ================= */}
        {showCompare && (
          <div className="mb-8 overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500 font-bold">
                <tr>
                  <th className="p-4">Item</th>
                  {quotes.map(q => (
                    <th
                      key={q.id}
                      className="p-4 text-right border-l border-gray-100"
                    >
                      {q.vendor_name}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-50">
                {comparisonItems.map(item => (
                  <tr key={item.rfq_item_id}>
                    <td className="p-4 font-medium text-gray-700">
                      {item.item_name}
                      <span className="text-gray-400 ml-1">
                        (x{item.quantity})
                      </span>
                    </td>

                    {quotes.map(q => {
                      const price =
                        q.items.find(
                          i => i.rfq_item_id === item.rfq_item_id
                        )?.unit_price;

                      return (
                        <td
                          key={q.id}
                          className="p-4 text-right border-l border-gray-100"
                        >
                          {price
                            ? `₹${Number(price).toLocaleString()}`
                            : "—"}
                        </td>
                      );
                    })}
                  </tr>
                ))}

                <tr className="bg-blue-50/30 font-bold">
                  <td className="p-4 text-blue-700 text-xs uppercase">
                    Grand Total
                  </td>
                  {quotes.map(q => (
                    <td
                      key={q.id}
                      className="p-4 text-right text-blue-700 border-l"
                    >
                      ₹{Number(q.amount).toLocaleString()}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* ================= EXEC: UPLOAD ================= */}
        {canUploadQuotes && (
          <div className="mb-8 space-y-4">
            <div className="flex gap-2">
              <select
                className="flex-1 border p-2.5 rounded-xl text-sm"
                value={quoteVendorId}
                onChange={e => setQuoteVendorId(e.target.value)}
              >
                <option value="">Select Vendor…</option>
                {vendors.map(v => (
                  <option key={v.id} value={v.id}>
                    {v.name}
                  </option>
                ))}
              </select>

              <button
                onClick={addVendorQuote}
                disabled={!quoteVendorId}
                className="px-6 bg-gray-900 text-white rounded-xl text-sm font-bold disabled:opacity-30"
              >
                <FaPlus size={12} /> Add Quote
              </button>
            </div>

            {vendorQuotes.map((vq, vIdx) => (
              <div
                key={vq.tempId}
                className="border rounded-2xl overflow-hidden"
              >
                <div className="bg-gray-50 p-4 flex justify-between">
                  <span className="font-bold">{vq.vendor_name}</span>
                  <button
                    onClick={() =>
                      setVendorQuotes(prev =>
                        prev.filter(v => v.tempId !== vq.tempId)
                      )
                    }
                    className="text-red-500"
                  >
                    <FaTrash />
                  </button>
                </div>

                <div className="p-4 space-y-3">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={e =>
                      setVendorQuotes(prev =>
                        prev.map((v, i) =>
                          i === vIdx
                            ? { ...v, quote_file: e.target.files[0] }
                            : v
                        )
                      )
                    }
                  />

                  {vq.items.map((item, iIdx) => (
                    <div
                      key={item.rfq_item_id}
                      className="flex justify-between"
                    >
                      <span>
                        {item.item_name} (x{item.quantity})
                      </span>
                      <input
                        type="number"
                        className="w-24 border p-1 rounded"
                        value={item.unit_price}
                        onChange={e =>
                          setVendorQuotes(prev =>
                            prev.map((v, vi) =>
                              vi === vIdx
                                ? {
                                    ...v,
                                    items: v.items.map((it, ii) =>
                                      ii === iIdx
                                        ? {
                                            ...it,
                                            unit_price: e.target.value
                                          }
                                        : it
                                    )
                                  }
                                : v
                            )
                          )
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {vendorQuotes.length > 0 && (
              <button
                className="w-full py-3 bg-green-600 text-white rounded-xl font-bold"
                onClick={submitQuoteWithItems}
              >
                Submit All Vendor Quotes
              </button>
            )}
          </div>
        )}

        {/* ================= VIEW / DM / CH ================= */}
      <div className="space-y-4">
  {quotes.map((q) => {
    const isChecked = selectedQuoteIds.includes(q.id);
    const isAlreadyRecommended = q.is_recommended === 1; // Check DB flag

    return (
      <div
        key={q.id}
        className={`border-2 rounded-2xl overflow-hidden transition-all duration-200 ${
          isAlreadyRecommended
            ? "border-green-500 bg-green-50/30" // Green border if already recommended
            : isChecked
            ? "border-indigo-500 bg-indigo-50/30" // Indigo if currently selected
            : "border-gray-100 bg-white hover:border-gray-200"
        }`}
      >
        <div className="p-5 flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
               <h4 className="font-bold text-gray-800 text-lg">{q.vendor_name}</h4>
               {isAlreadyRecommended && (
                 <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-black uppercase tracking-wider border border-green-200">
                   Recommended
                 </span>
               )}
            </div>
            
            <p className="text-2xl font-black text-gray-900 tracking-tight">
              ₹{Number(q.amount).toLocaleString()}
            </p>
            
            {/* FILE DOWNLOAD - NOW VISIBLE TO EVERYONE */}
            <div className="pt-2">
              {q.file_url ? (
                <button
                  className="flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-2 py-1 rounded transition-colors"
                  onClick={() => window.open(`${baseURL}/expense/quotes/download/${q.id}`, "_blank")}
                >
                  <FaFilePdf size={12} /> View Quote PDF
                </button>
              ) : (
                <span className="text-xs text-gray-400 italic flex items-center gap-2 px-2">
                   No PDF attached
                </span>
              )}
            </div>
          </div>

          {/* ===== DM SELECTION CHECKBOX ===== */}
          {canDMReviewQuotes && !isAlreadyRecommended && (
            <div
              onClick={() =>
                setSelectedQuoteIds((prev) =>
                  isChecked ? prev.filter((id) => id !== q.id) : [...prev, q.id]
                )
              }
              className="cursor-pointer p-2 group"
              title="Click to Recommend"
            >
              {isChecked ? (
                <FaCheckCircle className="text-indigo-600 text-3xl drop-shadow-sm" />
              ) : (
                <div className="w-7 h-7 rounded-full border-2 border-gray-300 group-hover:border-indigo-500 transition-colors bg-white" />
              )}
            </div>
          )}
          
          {/* If already recommended, show a static checkmark */}
          {isAlreadyRecommended && (
             <div className="p-2" title="Already Recommended">
                <FaCheckCircle className="text-green-500 text-3xl opacity-50" />
             </div>
          )}
        </div>

        {/* ===== DM REASON INPUT (Only if currently selecting) ===== */}
        {canDMReviewQuotes && isChecked && !isAlreadyRecommended && (
          <div className="px-5 pb-5 animate-in slide-in-from-top-2">
            <label className="text-xs font-bold text-indigo-900 uppercase tracking-wide mb-1.5 block">
              Reason for Recommendation
            </label>
            <textarea
              className="w-full border-2 border-indigo-100 p-3 rounded-xl text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-indigo-300"
              placeholder="e.g. Lowest price with best warranty terms..."
              rows={2}
              value={recommendationReasons[q.id] || ""}
              onChange={(e) =>
                setRecommendationReasons((prev) => ({
                  ...prev,
                  [q.id]: e.target.value,
                }))
              }
            />
          </div>
        )}

        {/* ===== CH APPROVAL VIEW ===== */}
{canCHApproveVendor && (
  <div className="bg-gray-50/80 border-t border-gray-100 p-5 space-y-4">
    <div>
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
        DM's Recommendation Note
      </p>
      <p className="text-sm text-gray-700 font-medium italic">
        "{q.reason || "No specific reason provided."}"
      </p>
    </div>

    {/* FIX 1: Ensure we check for 1 or convert to boolean */}
    {!q.is_selected  && (
      <button
        className="w-full py-3 bg-green-600 text-white rounded-xl font-bold shadow-lg shadow-green-200 hover:bg-green-700 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
        onClick={() => approveVendorByCH(q)}
      >
        <FaCheckCircle /> Approve Vendor
      </button>
    )}

    {/* FIX 2: Ensure we check for 1 here too */}
    {q.is_selected === 1 && (
      <div className="w-full py-3 bg-green-100 text-green-800 rounded-xl font-bold flex items-center justify-center gap-2 border border-green-200">
        <FaCheckCircle /> Vendor Approved
      </div>
    )}
  </div>
)}
      </div>
    );
  })}
</div>

        {/* ================= DM SUBMIT ================= */}
        {canDMReviewQuotes && selectedQuoteIds.length > 0 && (
          <div className="mt-8">
            <button
              className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold"
              onClick={submitRecommendations}
            >
              Submit Recommended Quotes
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
