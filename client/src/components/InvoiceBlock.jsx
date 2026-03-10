import { useState } from "react";
import { FaFilePdf } from "react-icons/fa";

const statusConfig = {
  PENDING: { label: "Pending Review", color: "#f59e0b", bg: "#fffbeb", dot: "#fbbf24" },
  INVOICE_REVIEW_FM: { label: "FM Review", color: "#3b82f6", bg: "#eff6ff", dot: "#60a5fa" },
  PAYMENT_INITIATION: { label: "Payment Initiated", color: "#8b5cf6", bg: "#f5f3ff", dot: "#a78bfa" },
  APPROVED: { label: "Approved", color: "#10b981", bg: "#ecfdf5", dot: "#34d399" },
  PAID: { label: "Paid", color: "#059669", bg: "#d1fae5", dot: "#10b981" },
};

const StatusBadge = ({ status }) => {
  const cfg = statusConfig[status] || { label: status, color: "#6b7280", bg: "#f9fafb", dot: "#9ca3af" };
  return (
    <span style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}22` }}
      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide">
      <span style={{ background: cfg.dot }} className="w-1.5 h-1.5 rounded-full inline-block" />
      {cfg.label}
    </span>
  );
};

export default function InvoiceBlock({
  request,
  canExecUploadInvoice,
  canDMInvoiceReview,
  canFMInvoiceReview,
  uploadInvoice,
  approveInvoice,
  invNo, taxable, gst, tds,
  setInvNo, setTaxable, setGst, setTds,
  setInvoiceFile,
  baseURL
}) {
  const [fileName, setFileName] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = (file) => {
    if (!file) return;
    setInvoiceFile(file);
    setFileName(file.name);
  };

  const invoices = request.invoices || [];

  return (
    <section style={{ fontFamily: "'DM Sans', sans-serif" }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <FaFilePdf size={14} className="text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 tracking-tight">Invoices</h3>
            <p className="text-xs text-gray-400">{invoices.length} document{invoices.length !== 1 ? "s" : ""}</p>
          </div>
        </div>
        {invoices.length > 0 && (
          <span className="text-xs text-gray-400 font-medium">
            Total: ₹{invoices.reduce((s, i) => s + Number(i.final_amount || 0), 0).toLocaleString()}
          </span>
        )}
      </div>

      {/* ── Invoice List ── */}
      <div className="divide-y divide-gray-50">
        {invoices.length === 0 && (
          <div className="py-10 text-center text-sm text-gray-400">
            No invoices submitted yet.
          </div>
        )}

        {invoices.map((inv) => (
          <div key={inv.id} className="px-6 py-4 hover:bg-gray-50/60 transition-colors">
            <div className="flex items-start justify-between gap-4">

              {/* Left */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-bold text-gray-900">#{inv.invoice_no}</span>
                  <StatusBadge status={inv.status} />
                </div>

                <div className="mt-1.5 text-xl font-bold text-gray-800 tracking-tight">
                  ₹{Number(inv.final_amount).toLocaleString()}
                </div>

                <div className="mt-2">
                  {inv.invoice_file_path ? (
                    <button
                      onClick={() => window.open(`${baseURL}/invoice/download/${inv.id}`, "_blank")}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-lg transition-all duration-150">
                      <FaFilePdf size={11} />
                      View PDF
                    </button>
                  ) : (
                    <span className="text-xs text-gray-400 italic">No PDF attached</span>
                  )}
                </div>
              </div>

              {/* Right – Actions */}
              <div className="flex flex-col gap-2 items-end shrink-0">
                {canDMInvoiceReview && inv.status === "PENDING" && (
                  <button
                    onClick={() => approveInvoice(inv.id, "INVOICE_REVIEW_FM")}
                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-semibold rounded-lg transition-all duration-150 shadow-sm shadow-emerald-200">
                    ✓ DM Approve
                  </button>
                )}
                {canFMInvoiceReview && inv.status === "PENDING" && (
                  <button
                    onClick={() => approveInvoice(inv.id, "PAYMENT_INITIATION")}
                    className="px-4 py-1.5 bg-violet-600 hover:bg-violet-700 active:scale-95 text-white text-xs font-semibold rounded-lg transition-all duration-150 shadow-sm shadow-violet-200">
                    ✓ FM Approve
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Upload Form ── */}
      {canExecUploadInvoice && (
        <div className="border-t border-gray-100 px-6 py-5 bg-gray-50/30">
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">
            Upload Invoice
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
            {[
              { placeholder: "Invoice No.", value: invNo, setter: setInvNo },
              { placeholder: "Taxable Amount (₹)", value: taxable, setter: setTaxable },
              { placeholder: "GST (₹)", value: gst, setter: setGst },
              { placeholder: "TDS (₹)", value: tds, setter: setTds },
            ].map(({ placeholder, value, setter }) => (
              <div key={placeholder} className="relative">
                <input
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition bg-white"
                  placeholder={placeholder}
                  value={value}
                  onChange={e => setter(e.target.value)}
                />
              </div>
            ))}
          </div>

          {/* Drop zone */}
          <label
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
            style={{ borderColor: dragOver ? "#6366f1" : "#e5e7eb", background: dragOver ? "#eef2ff" : "#fafafa" }}
            className="flex flex-col items-center justify-center gap-2 w-full border-2 border-dashed rounded-xl py-6 cursor-pointer transition-all duration-200 hover:border-indigo-400 hover:bg-indigo-50/40">
            <FaFilePdf size={22} className={dragOver ? "text-indigo-500" : "text-gray-300"} />
            {fileName ? (
              <span className="text-xs font-semibold text-indigo-600">{fileName}</span>
            ) : (
              <>
                <span className="text-xs font-semibold text-gray-500">Drop PDF here or <span className="text-indigo-600 underline">browse</span></span>
                <span className="text-xs text-gray-400">PDF files only</span>
              </>
            )}
            <input type="file" accept=".pdf" className="hidden"
              onChange={e => handleFile(e.target.files[0])} />
          </label>

          <button
            onClick={uploadInvoice}
            className="mt-4 w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white text-sm font-semibold rounded-xl transition-all duration-150 shadow-md shadow-indigo-200">
            Upload Invoice
          </button>
        </div>
      )}
    </section>
  );
}