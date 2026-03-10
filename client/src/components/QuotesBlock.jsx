import React, { useState } from "react";
import {
  FaPlus,
  FaTrash,
  FaFilePdf,
  FaCalculator,
  FaCheckCircle,
  FaChevronDown,
  FaChevronUp,
  FaUndo,
} from "react-icons/fa";

/* ─── Utility: lightest-price column highlight ─────────────────────── */
function getCheapestVendorIds(quotes) {
  if (!quotes.length) return new Set();
  const min = Math.min(...quotes.map((q) => Number(q.amount)));
  return new Set(quotes.filter((q) => Number(q.amount) === min).map((q) => q.id));
}

/* ─── Status chip ────────────────────────────────────────────────────── */
function Chip({ children, color = "gray" }) {
  const map = {
    green: "bg-emerald-50 text-emerald-700 border-emerald-200",
    indigo: "bg-indigo-50 text-indigo-700 border-indigo-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    gray: "bg-gray-100 text-gray-500 border-gray-200",
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${map[color]}`}>
      {children}
    </span>
  );
}

/* ─── Empty file upload button ──────────────────────────────────────── */
function FileDropZone({ label, onChange, fileName }) {
  return (
    <label className="flex items-center gap-3 w-full cursor-pointer group">
      <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 border-dashed text-xs font-semibold transition-all
        ${fileName
          ? "border-indigo-300 bg-indigo-50 text-indigo-700"
          : "border-gray-200 text-gray-400 hover:border-indigo-300 hover:text-indigo-500 hover:bg-indigo-50/40"
        }`}>
        <FaFilePdf size={12} />
        <span className="truncate max-w-[180px]">{fileName || label}</span>
      </div>
      <input type="file" accept=".pdf" className="hidden" onChange={onChange} />
    </label>
  );
}

export default function QuotesBlock({
  quotes,
  canUploadQuotes,
  canDMReviewQuotes,
  canCHApproveVendor,
  approveVendorByCH,
  vendors,
  rfqItems,
  quoteVendorId,
  setQuoteVendorId,
  vendorQuotes,
  setVendorQuotes,
  submitQuoteWithItems,
  selectedQuoteIds,
  setSelectedQuoteIds,
  recommendationReasons,
  setRecommendationReasons,
  submitRecommendations,
  showCompare,
  setShowCompare,
  comparisonItems,
  baseURL,
  rejectingStage,
  setRejectingStage,
  rejectReason,
  setRejectReason,
  rejectStage,
  canUndoQuote,
  undoQuote,
  canQuotesUndoDM,
  canQuotesUndoCH,
      approvalNote,
setApprovalNote,
approvingStage,
setApprovingStage,
  
  

}) {
  const [expandedVendor, setExpandedVendor] = useState(null);
  const cheapestIds = getCheapestVendorIds(quotes);
  const [selectedQuoteForApproval, setSelectedQuoteForApproval] = useState(null);

  const addVendorQuote = () => {
    if (!quoteVendorId) return;
    if (vendorQuotes.some((v) => v.vendor_id === Number(quoteVendorId))) {
      alert("Quote already added for this vendor");
      return;
    }
    const vendor = vendors.find((v) => v.id === Number(quoteVendorId));
    setVendorQuotes((prev) => [
      ...prev,
      {
        tempId: Date.now(),
        vendor_id: vendor.id,
        vendor_name: vendor.name,
        items: rfqItems.map((i) => ({
          rfq_item_id: i.id,
          item_name: i.item_name,
          quantity: i.quantity,
          unit_price: "",
        })),
      },
    ]);
    setQuoteVendorId("");
  };

  return (
    <section style={{ fontFamily: "'DM Sans', sans-serif" }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

      {/* ── Header ── */}
      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/40 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
            <FaCalculator size={13} className="text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 tracking-tight">Vendor Quotes</h3>
            <p className="text-xs text-gray-400">{quotes.length} quote{quotes.length !== 1 ? "s" : ""} received</p>
          </div>
        </div>

        {quotes.length > 1 && (
          <button
            onClick={() => setShowCompare((p) => !p)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-150
              ${showCompare
                ? "bg-slate-800 text-white border-slate-800"
                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
              }`}
          >
            <FaCalculator size={10} />
            {showCompare ? "Close Compare" : "Compare Quotes"}
          </button>
        )}
      </div>

      <div className="p-6 space-y-6">

        {/* ── Comparison Table ── */}
        {showCompare && (
          <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide font-bold">
                  <th className="px-4 py-3">Item</th>
                  {quotes.map((q) => (
                    <th key={q.id}
                      className={`px-4 py-3 text-right border-l border-gray-100 ${cheapestIds.has(q.id) ? "text-emerald-700" : ""}`}>
                      <div>{q.vendor_name}</div>
                      {cheapestIds.has(q.id) && (
                        <span className="text-[9px] font-black tracking-widest text-emerald-600">LOWEST</span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {comparisonItems.map((item) => (
                  <tr key={item.rfq_item_id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-700">
                      {item.item_name}
                      <span className="text-gray-400 text-xs ml-1.5">×{item.quantity}</span>
                    </td>
                    {quotes.map((q) => {
                      const price = q.items?.find((i) => i.rfq_item_id === item.rfq_item_id)?.unit_price;
                      return (
                        <td key={q.id} className="px-4 py-3 text-right border-l border-gray-100 tabular-nums">
                          {price ? `₹${Number(price).toLocaleString()}` : <span className="text-gray-300">—</span>}
                        </td>
                      );
                    })}
                  </tr>
                ))}
                <tr className="bg-slate-50 font-bold border-t border-gray-200">
                  <td className="px-4 py-3 text-xs text-slate-500 uppercase tracking-widest">Grand Total</td>
                  {quotes.map((q) => (
                    <td key={q.id}
                      className={`px-4 py-3 text-right border-l text-sm tabular-nums
                        ${cheapestIds.has(q.id) ? "text-emerald-700 bg-emerald-50/60" : "text-slate-700"}`}>
                      ₹{Number(q.amount).toLocaleString()}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* ── Exec Upload ── */}
        {canUploadQuotes && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Add Vendor Quote</span>
            </div>

            <div className="flex gap-2">
              <div className="relative flex-1">
                <select
                  className="w-full appearance-none border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-slate-300 bg-white pr-8"
                  value={quoteVendorId}
                  onChange={(e) => setQuoteVendorId(e.target.value)}
                >
                  <option value="">Select a vendor…</option>
                  {vendors.map((v) => (
                    <option key={v.id} value={v.id}>{v.name}</option>
                  ))}
                </select>
                <FaChevronDown size={10} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
              <button
                onClick={addVendorQuote}
                disabled={!quoteVendorId}
                className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-900 active:scale-95 text-white text-sm font-bold rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
              >
                <FaPlus size={10} /> Add
              </button>
            </div>

            {vendorQuotes.map((vq, vIdx) => (
              <div key={vq.tempId} className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                <div className="bg-gray-50 px-5 py-3 flex items-center justify-between border-b border-gray-100">
                  <span className="font-bold text-sm text-gray-800">{vq.vendor_name}</span>
                  <button
                    onClick={() => setVendorQuotes((prev) => prev.filter((v) => v.tempId !== vq.tempId))}
                    className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition-colors"
                  >
                    <FaTrash size={11} />
                  </button>
                </div>

                <div className="p-5 space-y-4">
                  <FileDropZone
                    label="Attach Quote PDF"
                    fileName={vq.quote_file?.name}
                    onChange={(e) =>
                      setVendorQuotes((prev) =>
                        prev.map((v, i) => i === vIdx ? { ...v, quote_file: e.target.files[0] } : v)
                      )
                    }
                  />

                  <div className="space-y-2">
                    {vq.items.map((item, iIdx) => (
                      <div key={item.rfq_item_id}
                        className="flex items-center justify-between gap-4 py-2 border-b border-gray-50 last:border-0">
                        <div className="text-sm text-gray-700 flex-1">
                          {item.item_name}
                          <span className="text-gray-400 text-xs ml-1.5">×{item.quantity}</span>
                        </div>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">₹</span>
                          <input
                            type="number"
                            className="w-28 border border-gray-200 rounded-lg pl-6 pr-3 py-1.5 text-sm text-right focus:outline-none focus:ring-2 focus:ring-slate-300 tabular-nums"
                            placeholder="0.00"
                            value={item.unit_price}
                            onChange={(e) =>
                              setVendorQuotes((prev) =>
                                prev.map((v, vi) =>
                                  vi === vIdx
                                    ? { ...v, items: v.items.map((it, ii) => ii === iIdx ? { ...it, unit_price: e.target.value } : it) }
                                    : v
                                )
                              )
                            }
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {vendorQuotes.length > 0 && (
              <button
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-emerald-100"
                onClick={submitQuoteWithItems}
              >
                Submit All Vendor Quotes
              </button>
            )}
          </div>
        )}

              {canUndoQuote && (
          <div className="mt-6 pt-6 border-t border-gray-100 flex justify-end">
            <button
              className="flex items-center gap-2 px-6 py-2.5 bg-yellow-50 text-yellow-700 font-bold rounded-lg hover:bg-yellow-100 transition"
              onClick={undoQuote}
            >
              <FaUndo size={13}/>
        Undo
            </button>
          </div>
        )}

        {/* ── Quote Cards ── */}
        <div className="space-y-3">
          {quotes.map((q) => {
            const isChecked = selectedQuoteIds.includes(q.id);
            const isRecommended = q.is_recommended === 1;
            const isApproved = q.is_selected === 1;
            const isCheapest = cheapestIds.has(q.id);
            const isExpanded = expandedVendor === q.id;
            const isApproving = selectedQuoteForApproval?.id === q.id;

            return (
              <div key={q.id}
                className={`rounded-2xl border-2 overflow-hidden transition-all duration-200
  ${isApproving ? "border-green-400 bg-green-50/20"
  : isApproved ? "border-emerald-400 bg-emerald-50/20"
  : isRecommended ? "border-emerald-300 bg-emerald-50/10"
  : isChecked ? "border-indigo-400 bg-indigo-50/20"
  : "border-gray-100 bg-white hover:border-gray-200"
}`}
              >
                <div className="px-5 py-4 flex items-start justify-between gap-4">
                  {/* Left */}
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-gray-900 text-sm">{q.vendor_name}</span>
                      {isApproved && <Chip color="green"><FaCheckCircle size={9} /> Approved</Chip>}
                      {isRecommended && !isApproved && <Chip color="green">Recommended</Chip>}
                      {isCheapest && <Chip color="amber">Lowest Price</Chip>}
                    </div>

                    <div className="text-2xl font-black text-gray-900 tabular-nums tracking-tight">
                      ₹{Number(q.amount).toLocaleString()}
                    </div>

                    <div className="flex items-center gap-3">
                      {q.file_url ? (
                        <button
                          onClick={() => window.open(`${baseURL}/expense/quotes/download/${q.id}`, "_blank")}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-lg transition-all">
                          <FaFilePdf size={10} /> View PDF
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400 italic">No PDF attached</span>
                      )}
                    </div>
                  </div>

                  {/* Right */}
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    {canDMReviewQuotes && !isRecommended && (
                      <button
                        onClick={() =>
                          setSelectedQuoteIds((prev) =>
                            isChecked ? prev.filter((id) => id !== q.id) : [...prev, q.id]
                          )
                        }
                        title={isChecked ? "Deselect" : "Recommend this vendor"}
                        className="transition-transform active:scale-90"
                      >
                        {isChecked ? (
                          <FaCheckCircle className="text-indigo-600 text-3xl drop-shadow-sm" />
                        ) : (
                          <div className="w-7 h-7 rounded-full border-2 border-gray-300 hover:border-indigo-400 transition-colors bg-white" />
                        )}
                      </button>
                    )}
                    {isApproved && (
                      <FaCheckCircle className="text-emerald-500 text-2xl" />
                    )}
                    {isRecommended && !isApproved && (
                      <FaCheckCircle className="text-emerald-400 text-2xl opacity-60" />
                    )}
                  </div>
                </div>

                {/* DM Reason Input */}
                {canDMReviewQuotes && isChecked && !isRecommended && (
                  <div className="px-5 pb-5">
                    <label className="text-[10px] font-bold text-indigo-700 uppercase tracking-widest mb-1.5 block">
                      Reason for Recommendation
                    </label>
                    <textarea
                      rows={2}
                      className="w-full border-2 border-indigo-100 rounded-xl px-3 py-2 text-sm text-gray-800 placeholder-indigo-300 focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 transition-all resize-none"
                      placeholder="e.g. Best price with strong warranty terms…"
                      value={recommendationReasons[q.id] || ""}
                      onChange={(e) =>
                        setRecommendationReasons((prev) => ({ ...prev, [q.id]: e.target.value }))
                      }
                    />
                  </div>
                )}
                {/* CH Approval */}
                {canCHApproveVendor && (
                  <div className="border-t border-gray-100 bg-gray-50/60 px-5 py-4 space-y-3">
                    <button
                      onClick={() => setExpandedVendor(isExpanded ? null : q.id)}
                      className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {isExpanded ? <FaChevronUp size={10} /> : <FaChevronDown size={10} />}
                      DM's Recommendation Note
                    </button>

                    {isExpanded && (
                      <div className="bg-white border border-gray-100 rounded-xl px-4 py-3">
                        <p className="text-sm text-gray-700 italic leading-relaxed">
                          "{q.reason || "No specific reason provided."}"
                        </p>
                      </div>
                    )}

                    {!isApproved ? (
                      <button
                         onClick={() => {
  setSelectedQuoteForApproval(q);
  setApprovingStage("QUOTE_APPROVAL_CH");
}}
                        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white text-sm font-bold rounded-xl transition-all shadow-sm shadow-emerald-200 flex items-center justify-center gap-2"
                      >
                        <FaCheckCircle size={13} /> Approve Vendor
                      </button>
                      
                    ) : (
                      <div className="w-full py-2.5 bg-emerald-100 text-emerald-800 rounded-xl font-bold text-sm flex items-center justify-center gap-2 border border-emerald-200">
                        <FaCheckCircle size={13} /> Vendor Approved
                      </div>
                    )}
                  </div>
                  
                )}
                {selectedQuoteForApproval?.id === q.id && (
  <div className="mt-3 bg-green-50 border border-green-200 rounded-xl p-4 space-y-3">

    <label className="text-xs font-bold uppercase tracking-widest text-green-700">
      Approval Note (Optional)
    </label>

    <textarea
      rows={2}
      className="w-full border border-green-200 rounded-lg p-2 text-sm"
      placeholder="Add optional approval note..."
      value={approvalNote}
      onChange={(e) => setApprovalNote(e.target.value)}
    />

    <div className="flex justify-end gap-3">

      <button
        className="px-4 py-2 bg-gray-200 rounded"
        onClick={() => {
          setSelectedQuoteForApproval(null);
          setApprovalNote("");
        }}
      >
        Cancel
      </button>

      <button
        className="px-4 py-2 bg-green-600 text-white rounded"
        onClick={() => {
          approveVendorByCH(selectedQuoteForApproval);
        }}
      >
        Confirm Approval
      </button>

    </div>

  </div>
)}
              </div>
            );
          })}



 {canQuotesUndoDM && (
          <div className="mt-6 pt-6 border-t border-gray-100 flex justify-end">
            <button
              className="flex items-center gap-2 px-6 py-2.5 bg-yellow-50 text-yellow-700 font-bold rounded-lg hover:bg-yellow-100 transition"
              onClick={undoQuote}
            >
              <FaUndo size={13}/>
        Undo
            </button>
          </div>
        )}

 {canQuotesUndoCH && (
          <div className="mt-6 pt-6 border-t border-gray-100 flex justify-end">
            <button
              className="flex items-center gap-2 px-6 py-2.5 bg-yellow-50 text-yellow-700 font-bold rounded-lg hover:bg-yellow-100 transition"
              onClick={undoQuote}
            >
              <FaUndo size={13}/>
        Undo
            </button>
          </div>
        )}

          {canCHApproveVendor && (
  <div className="mt-4">
    <button
      onClick={() => setRejectingStage("QUOTE_APPROVAL_CH")}
      className="w-full py-2.5 bg-red-50 text-red-600 font-bold rounded-xl border border-red-200"
    >
      Reject Quotes
    </button>
  </div>
)}
          

          {quotes.length === 0 && (
            <div className="py-10 text-center text-sm text-gray-400">
              No quotes submitted yet.
            </div>
          )}
        </div>

        {/* ── DM Submit ── */}
{canDMReviewQuotes && (
  <div className="space-y-3">
    {selectedQuoteIds.length > 0 && (
      <button
        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl"
        onClick={submitRecommendations}
      >
        Submit {selectedQuoteIds.length} Recommended Quote
      </button>
    )}

    <button
      className="w-full py-2.5 bg-red-50 text-red-600 font-bold rounded-xl border border-red-200"
      onClick={() => setRejectingStage("QUOTE_REVIEW_DM")}
    >
      Reject Quotes
    </button>
  </div>
)}
{rejectingStage && (
  <div className="bg-red-50 border border-red-200 rounded-xl p-5 space-y-3 mt-4">
    <p className="text-xs font-bold uppercase tracking-widest text-red-600">
      Rejecting Stage: {rejectingStage.replaceAll("_", " ")}
    </p>

    <textarea
      rows={3}
      className="w-full border border-red-200 rounded-lg p-2 text-sm"
      placeholder="Reason for rejection..."
      value={rejectReason}
      onChange={(e) => setRejectReason(e.target.value)}
    />

    <div className="flex justify-end gap-3">
      <button
        className="px-4 py-2 bg-gray-200 rounded"
        onClick={() => {
          setRejectingStage(null);
          setRejectReason("");
        }}
      >
        Cancel
      </button>

      <button
        className="px-4 py-2 bg-red-600 text-white rounded"
        onClick={() => rejectStage(rejectingStage)}
      >
        Confirm Reject
      </button>
    </div>
  </div>
)}


      </div>
    </section>
  );
}