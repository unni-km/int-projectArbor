import React, { useState } from "react";
import { FaShoppingBag, FaTag, FaLayerGroup, FaSpinner } from "react-icons/fa";
import expenseApi from "../expenseApi";

const CreateRequest = ({ onBack, onSuccess }) => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Assets");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const requesterId = localStorage.getItem("userid") || localStorage.getItem("user_id");
  const departmentId = localStorage.getItem("department_id");

  const isFormValid = title.trim().length > 0;

const submit = async () => {
    if (!isFormValid) return; 

    setIsSubmitting(true);
    try {
      await expenseApi.createRequest({
        request_type: "STANDARD",
        title: title.trim(),
        requested_by: requesterId,
        department_id: departmentId,
        category,
        estimated_cost: 0, 
        current_status: "RFQ_PENDING", 
      });
      
      // 2. Call onSuccess instead of onBack
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
        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-3 shadow-sm">
          <FaShoppingBag size={20} />
        </div>
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">
          New Purchase Request
        </h2>

      </div>

      {/* ================= FORM BODY ================= */}
      <div className="space-y-5">
        
        {/* TITLE */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
            Request Title <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <FaTag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Office Chairs for 3rd Floor"
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
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all appearance-none"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option>Assets</option>
              <option>Consumables</option>
              <option>Services</option>
              <option>Utilities</option>
              <option>Rental</option>
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
              <FaSpinner className="animate-spin" /> Creating...
            </>
          ) : (
            "Create Request"
          )}
        </button>
      </div>
    </div>
  );
};

export default CreateRequest;