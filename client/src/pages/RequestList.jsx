import React, { useEffect, useState } from "react";
import { FaSearch, FaPlus, FaBolt, FaChevronRight, FaFileInvoiceDollar, FaInbox } from "react-icons/fa";
import expenseApi from "../expenseApi";
import CreateRequest from "./CreateRequest";
import DirectExpense from "./DirectExpense";

// Improved Modal
const Modal = ({ children, onClose }) => (
  <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex justify-center items-center z-50 animate-in fade-in duration-200 p-4">
    <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-xl relative max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
      <button
        className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors z-10"
        onClick={onClose}
      >
        ✕
      </button>
      {children}
    </div>
  </div>
);

const getStatusStyles = (status) => {
  const s = (status || "").toUpperCase();
  if (s.includes("PENDING")) return "bg-amber-100 text-amber-800 border-amber-200";
  if (s.includes("ISSUED") || s.includes("COMPLETED")) return "bg-emerald-100 text-emerald-800 border-emerald-200";
  if (s.includes("REVIEW") || s.includes("RECOMMENDED")) return "bg-blue-100 text-blue-800 border-blue-200";
  if (s.includes("APPROVAL") || s.includes("AUTHORIZE")) return "bg-indigo-100 text-indigo-800 border-indigo-200";
  if (s.includes("REJECTED")) return "bg-red-100 text-red-800 border-red-200";
  return "bg-gray-100 text-gray-800 border-gray-200";
};

const RequestList = ({ onSelect }) => {
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [showNewRequest, setShowNewRequest] = useState(false);
  const [showDirectExpense, setShowDirectExpense] = useState(false);


  const fetchRequests = async () => {
    try {
      setIsLoading(true);
      const data = await expenseApi.getAll();
      setRequests(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Call it on initial load
  useEffect(() => {
    fetchRequests();
  }, []);

  const filtered = requests.filter((r) => {
    const key = `${r.id} ${r.title || ""} ${r.category || ""} ${r.current_status || ""}`.toLowerCase();
    return key.includes(search.toLowerCase());
  });

  return (
    /* FIX 1: h-[calc(100vh-80px)] (or similar) forces the component to fit the screen height. 
       flex flex-col ensures we can control how the inner parts grow.
    */
    <div className="h-[calc(100vh-60px)] w-full max-w-[1400px] mx-auto flex flex-col p-4 sm:p-6 animate-in fade-in duration-300">
      
      {/* ---------------- HEADER & ACTIONS (Always visible at top) ---------------- */}
      <div className="flex-none flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Expense Requests</h1>
          <p className="text-sm text-slate-500 mt-1">Manage, track, and approve company purchases.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowDirectExpense(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-slate-200 text-slate-700 font-bold rounded-xl hover:border-blue-500 hover:text-blue-600 transition-all active:scale-95"
          >
            <FaBolt className="text-amber-500" /> Direct Expense
          </button>
          
          <button
            onClick={() => setShowNewRequest(true)}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95"
          >
            <FaPlus size={12} /> New Purchase
          </button>
        </div>
      </div>

      {/* ---------------- DATA CARD (Expands to fill available space) ---------------- */}
      <div className="flex-1 flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden min-h-[400px]">
        
        {/* Search Bar Row (Fixed inside the card) */}
        <div className="flex-none bg-slate-50/50 p-4 border-b border-slate-200 flex justify-between items-center">
          <div className="relative w-full max-w-md">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm shadow-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
              placeholder="Search by ID, Title, Category, or Status..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="hidden sm:block text-xs font-bold text-slate-400 uppercase tracking-widest">
            {filtered.length} Record{filtered.length !== 1 && 's'} Found
          </div>
        </div>

        {/* ---------------- TABLE (Only this part scrolls!) ---------------- */}
        {/* FIX 2: overflow-y-auto lets you scroll through 100+ requests inside the box */}
        <div className="flex-1 overflow-y-auto overflow-x-auto relative">
          <table className="w-full text-left text-sm whitespace-nowrap">
            
            {/* FIX 3: sticky top-0 keeps the table headers visible when scrolling down */}
            <thead className="sticky top-0 z-10 bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-bold border-b border-slate-200 shadow-sm">
              <tr>
                <th className="px-6 py-4">Req ID</th>
                <th className="px-6 py-4">Request Details</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Current Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 bg-white">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                      <p className="text-slate-500 font-medium">Loading requests...</p>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-2">
                        <FaInbox className="text-3xl text-slate-300" />
                      </div>
                      <h3 className="text-slate-700 font-bold text-lg">No requests found</h3>
                      <p className="text-slate-500 text-sm max-w-sm whitespace-normal">
                        {search 
                          ? `We couldn't find anything matching "${search}". Try a different term.` 
                          : "Your pipeline is clean. Create a new purchase request to get started."}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((req) => (
                  <tr
                    key={req.id}
                    className="hover:bg-blue-50/50 cursor-pointer transition-colors group"
                    onClick={() => onSelect(req.id)}
                  >
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">
                        REQ-{req.id.toString().padStart(4, '0')}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                          <FaFileInvoiceDollar size={14} />
                        </div>
                        <span className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                          {req.title}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-slate-600 font-medium">{req.category}</span>
                    </td>
                    
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${getStatusStyles(req.current_status)}`}>
                        {(req.current_status || "UNKNOWN").replace(/_/g, " ")}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-400 group-hover:border-blue-300 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
                        <FaChevronRight size={12} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ---------------- POPUPS ---------------- */}
    {showNewRequest && (
        <Modal onClose={() => setShowNewRequest(false)}>
          <CreateRequest 
            onBack={() => setShowNewRequest(false)} 
            // 3. NEW PROP: Pass a success handler to close modal and refresh data
            onSuccess={() => {
              setShowNewRequest(false);
              fetchRequests(); 
            }}
          />
        </Modal>
      )}

{showDirectExpense && (
        <Modal onClose={() => setShowDirectExpense(false)}>
          <DirectExpense 
            onBack={() => setShowDirectExpense(false)} 
            // Do the same for Direct Expense if it adds to this list
            onSuccess={() => {
              setShowDirectExpense(false);
              fetchRequests();
            }}
          />
        </Modal>
      )}
    </div>
  );
};

export default RequestList;