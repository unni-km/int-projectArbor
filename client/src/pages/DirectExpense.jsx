import React, { useState } from "react";
import { FaBolt, FaTag, FaLayerGroup, FaSpinner } from "react-icons/fa";
import expenseApi from "../expenseApi";

const DirectExpense = ({ onBack, onSuccess }) => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Utilities");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const requesterId = localStorage.getItem("userid") || localStorage.getItem("user_id");
  const departmentId = localStorage.getItem("department_id");

  // UX: Validate silently instead of using alerts
  const isFormValid = title.trim().length > 0;

  const submit = async () => {
    if (!isFormValid) return;

    setIsSubmitting(true);
    try {
      await expenseApi.createRequest({
        request_type: "DIRECT",
        title: title.trim(),
        requested_by: requesterId,
        department_id: departmentId,
        category,
        current_status: "Invoice pending", 
        estimated_cost: 0,
      });

      if (onSuccess) {
        onSuccess();
      } else {
        onBack();
      }
    } catch (error) {
      console.error("Failed to create request", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col items-center justify-center mb-6 text-center">
        <div className="w-12 h-12 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mb-3 shadow-sm">
          <FaBolt size={20} />
        </div>
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">
          Direct Expense
        </h2>
      
      </div>

      {/* ================= FORM BODY ================= */}
      <div className="space-y-5">
        
        {/* TITLE */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
            Expense Title <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <FaTag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm focus:bg-white focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all placeholder:text-slate-400"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., December Electricity Bill"
              autoFocus
            />
          </div>
        </div>

        {/* CATEGORY */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
            Category
          </label>
          <div className="relative">
            <FaLayerGroup className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <select
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm focus:bg-white focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all appearance-none"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option>Utilities</option>
              <option>Services</option>
              <option>Rental</option>
              <option>Consumables</option>
            </select>
          </div>
        </div>
      </div>

      {/* ================= ACTION BUTTONS ================= */}
      <div className="mt-8 pt-5 border-t border-slate-100 flex justify-end gap-3">
        <button
          type="button"
          disabled={isSubmitting}
          className="px-6 py-2.5 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors disabled:opacity-50"
          onClick={onBack}
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={!isFormValid || isSubmitting}
          className="flex items-center gap-2 px-8 py-2.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 disabled:opacity-50 disabled:shadow-none transition-all active:scale-[0.98]"
          onClick={submit}
        >
          {isSubmitting ? (
            <>
              <FaSpinner className="animate-spin" /> Submitting...
            </>
          ) : (
            "Create Direct Expense"
          )}
        </button>
      </div>
    </div>
  );
};

export default DirectExpense;