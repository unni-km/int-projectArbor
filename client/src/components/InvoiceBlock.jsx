export default function InvoiceBlock({
  request,
  canExecUploadInvoice,
  canDMInvoiceReview,
  canFMInvoiceReview,
  uploadInvoice,
  approveInvoice,
  invNo,
  taxable,
  gst,
  tds,
  setInvNo,
  setTaxable,
  setGst,
  setTds,
  setInvoiceFile
}) {
  return (
    <section className="bg-white rounded-xl shadow border p-5">
      <h3 className="text-lg font-semibold mb-4">Invoices</h3>

      {(request.invoices || []).map(inv => (
        <div key={inv.id} className="flex justify-between bg-gray-50 p-3 rounded mb-2">
          <div>
            <div className="font-medium">
              #{inv.invoice_no} – ₹{inv.final_amount}
            </div>
            <div className="text-xs text-gray-500">{inv.status}</div>
          </div>

          <div className="flex gap-2">
            {canDMInvoiceReview && (
              <button
                className="px-3 py-1 bg-green-600 text-white text-xs rounded"
                onClick={() => approveInvoice(inv.id, "INVOICE_REVIEW_FM")}
              >
                DM Approve
              </button>
            )}

            {canFMInvoiceReview && (
              <button
                className="px-3 py-1 bg-purple-600 text-white text-xs rounded"
                onClick={() => approveInvoice(inv.id, "PAYMENT_INITIATION")}
              >
                FM Approve
              </button>
            )}
          </div>
        </div>
      ))}

      {canExecUploadInvoice && (
        <>
          <hr className="my-4" />
          <h4 className="text-sm font-semibold mb-2">Upload Invoice</h4>

          <div className="grid grid-cols-5 gap-2 text-sm">
            <input className="border p-1" placeholder="Invoice No" value={invNo} onChange={e => setInvNo(e.target.value)} />
            <input className="border p-1" placeholder="Taxable" value={taxable} onChange={e => setTaxable(e.target.value)} />
            <input className="border p-1" placeholder="GST" value={gst} onChange={e => setGst(e.target.value)} />
            <input className="border p-1" placeholder="TDS" value={tds} onChange={e => setTds(e.target.value)} />
            <input className="border p-1" type="file" onChange={e => setInvoiceFile(e.target.files[0])} />
          </div>

          <button
            className="mt-3 px-5 py-1 bg-green-600 text-white rounded"
            onClick={uploadInvoice}
          >
            Upload Invoice
          </button>
        </>
      )}
    </section>
  );
}
