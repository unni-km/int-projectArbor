import React from "react";
import { FaPlus, FaTrashAlt, FaClipboardList, FaCheckCircle, FaPaperPlane } from "react-icons/fa";

export default function RFQBlock({
  showDraft,
  rfqDraftItems,
  rfqItems,
  items,
  itemId,
  qty,
  desc,
  setItemId,
  setQty,
  setDesc,
  addRFQItem,
  removeDraftItem,
  submitRFQ,
  canDMRecommendRFQ,
  recommendRFQ,
  canCHApproveRFQ,
  approveRFQByCH
}) {
  return (
    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header - This will now stay visible because the container below is constrained */}
      <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex items-center gap-2">
        <FaClipboardList className="text-gray-400" />
        <h3 className="text-lg font-bold text-gray-800">RFQ Items</h3>
      </div>

      <div className="p-6">
        {showDraft ? (
          <div className="space-y-6">
            
            {/* --- UPDATED: Scrollable Draft List Area --- */}
           <div className="max-h-[250px] overflow-y-auto mb-6 pr-2 custom-scrollbar">
              {rfqDraftItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 border-2 border-dashed border-gray-100 rounded-xl bg-gray-50/30">
                  <FaClipboardList className="text-gray-200 text-4xl mb-2" />
                  <p className="text-sm text-gray-400">Your draft is empty. Add items below.</p>
                </div>
              ) : (
                rfqDraftItems.map((item) => (
                  <div
                    key={item.tempId}
                    className="group flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl hover:border-blue-200 hover:shadow-md transition-all"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-700">{item.item_name}</span>
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs font-bold rounded-full">
                          x{item.quantity}
                        </span>
                      </div>
                      {item.description && (
                        <p className="text-sm text-gray-500 mt-0.5 italic text-wrap break-words">“{item.description}”</p>
                      )}
                    </div>
                    <button
                      className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      onClick={() => removeDraftItem(item.tempId)}
                    >
                      <FaTrashAlt size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Add Item Form Area (Always stays at bottom) */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Add New Requirement</p>
              <div className="grid grid-cols-12 gap-3">
                <div className="col-span-12 md:col-span-5">
                  <select
                    className="w-full bg-white border border-gray-200 p-2.5 rounded-lg text-sm outline-none"
                    value={itemId}
                    onChange={(e) => setItemId(e.target.value)}
                  >
                    <option value="">Select Item Type</option>
                    {items.map((i) => (
                      <option key={i.id} value={i.id}>{i.name}</option>
                    ))}
                  </select>
                </div>

                <div className="col-span-12 md:col-span-2">
                  <input
                    className="w-full bg-white border border-gray-200 p-2.5 rounded-lg text-sm outline-none"
                    type="number"
                    placeholder="Qty"
                    value={qty}
                    onChange={(e) => setQty(e.target.value)}
                  />
                </div>

                <div className="col-span-12 md:col-span-5 flex gap-2">
                  <input
                    className="flex-1 bg-white border border-gray-200 p-2.5 rounded-lg text-sm outline-none"
                    placeholder="Brief description..."
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                  />
                  <button
                    className="px-4 py-2.5 bg-gray-800 text-white rounded-lg hover:bg-black transition-colors"
                    onClick={addRFQItem}
                  >
                    <FaPlus />
                  </button>
                </div>
              </div>
            </div>

            {/* Final Submit */}
            {rfqDraftItems.length > 0 && (
              <div className="pt-4 border-t border-gray-100 flex justify-end">
                <button
                  className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95"
                  onClick={submitRFQ}
                >
                  <FaPaperPlane size={14} />
                  Submit Full RFQ
                </button>
              </div>
            )}
          </div>
        ) : (
          /* --- UPDATED: Scrollable View Mode (Read Only) --- */
          <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar grid grid-cols-1 sm:grid-cols-2 gap-3">
            {rfqItems.map((i) => (
              <div key={i.id} className="p-4 border border-gray-100 rounded-xl bg-gray-50/50 flex justify-between items-center h-fit">
                <div>
                  <div className="font-bold text-gray-700">{i.item_name}</div>
                  {i.description && <div className="text-xs text-gray-500 mt-1">{i.description}</div>}
                </div>
                <div className="text-sm font-black text-gray-400 bg-white px-3 py-1 rounded-lg border border-gray-100">
                  x{i.quantity}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Action Bar for DM/CH */}
        {(canDMRecommendRFQ || canCHApproveRFQ) && (
          <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end gap-3">
            {canDMRecommendRFQ && (
              <button
                className="px-6 py-2.5 bg-indigo-50 text-indigo-700 font-bold rounded-lg hover:bg-indigo-100 transition-all"
                onClick={recommendRFQ}
              >
                Recommend to CH
              </button>
            )}
            {canCHApproveRFQ && (
              <button
                className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-all"
                onClick={approveRFQByCH}
              >
                <FaCheckCircle />
                Approve & Process
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}