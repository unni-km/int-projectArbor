export default function PaymentBlock({
  request,
  utr,
  setUtr,
  canFinInitPayment,
  canCHAuthorizePayment,
  canFinExecutePayment,
  updatePaymentStage,
  canExecVendorVerify,
  completeVerification
}) {
  return (
    <section className="bg-white rounded-xl shadow border p-5">
      <h3 className="text-lg font-semibold mb-4">Payment</h3>

      <div className="text-sm text-gray-600 mb-3">
        Reference: {request.payment_reference || "—"}
      </div>

      {canFinInitPayment && (
        <button
          className="px-4 py-1 bg-indigo-600 text-white rounded"
          onClick={() => updatePaymentStage("INITIATE")}
        >
          Initiate Payment
        </button>
      )}

      {canCHAuthorizePayment && (
        <button
          className="px-4 py-1 bg-orange-600 text-white rounded"
          onClick={() => updatePaymentStage("APPROVE")}
        >
          Authorize Payment
        </button>
      )}

      {canFinExecutePayment && (
        <div className="flex gap-2 mt-3">
          <input
            className="border p-1 text-sm"
            placeholder="UTR Number"
            value={utr}
            onChange={e => setUtr(e.target.value)}
          />
          <button
            className="px-4 py-1 bg-green-600 text-white rounded"
            onClick={() => updatePaymentStage("EXECUTE")}
          >
            Confirm
          </button>
        </div>
      )}

      {canExecVendorVerify && (
        <button
          className="mt-4 px-5 py-1 bg-green-700 text-white rounded"
          onClick={completeVerification}
        >
          Vendor Verified – Close
        </button>
      )}
    </section>
  );
}
