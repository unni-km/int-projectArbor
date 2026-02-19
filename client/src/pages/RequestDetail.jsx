// src/modules/expense/pages/RequestDetail.jsx
import React, { useEffect, useState,useMemo, useRef } from "react";
import { FaArrowLeft, FaHistory, FaEllipsisV, FaShieldAlt } from "react-icons/fa";
import expenseApi from "../expenseApi";
import generatePOPdf from "../components/generatePOPdf";
import RequestHeader from "../components/RequestHeader";
import RFQBlock from "../components/RFQBlock";
import QuotesBlock from "../components/QuotesBlock";
import PurchaseOrderBlock from "../components/PurchaseOrderBlock";
import InvoiceBlock from "../components/InvoiceBlock";
import PaymentBlock from "../components/PaymentBlock";

const baseURL = process.env.REACT_APP_API_BASE_URL;
const RequestDetail = ({ expenseId, onBack }) => {
  /* ---------------------- GLOBAL HOOKS ---------------------- */
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);


  // RFQ states
  const [itemId, setItemId] = useState("");
  const [qty, setQty] = useState("");
  const [desc, setDesc] = useState("");
  const [items, setItems] = useState([]);
const [rfqDraftItems, setRfqDraftItems] = useState([]);
const [rfqItems, setRfqItems] = useState([]); // From DB (DM view)


  // Vendors
const [vendors, setVendors] = useState([]);

// Draft quotes



// Single quote form
const [quoteVendorId, setQuoteVendorId] = useState("");

const [vendorQuotes, setVendorQuotes] = useState([]);
const [quotes, setQuotes] = useState([]);
const [expandedQuoteId, setExpandedQuoteId] = useState(null);
const [showCompare, setShowCompare] = useState(false);




  // Quote selection (DM)
  const [selectedQuoteIds, setSelectedQuoteIds] = useState([]);
const [recommendationReasons, setRecommendationReasons] = useState({});

  // PO

const [poItems, setPoItems] = useState([]);
const [poTerms, setPoTerms] = useState(
  `1. Price Validity: 30 Days
2. Delivery Period: Within 3 working days from the date of confirmed order`
);
const [poTd, setPoTd] = useState([]);
const [poPdfUrl, setPoPdfUrl] = useState(null);


  // Invoice upload
  const [invNo, setInvNo] = useState("");
  const [taxable, setTaxable] = useState("");
  const [gst, setGst] = useState("");
  const [tds, setTds] = useState("");
  const [invoiceFile, setInvoiceFile] = useState(null);

  // Payment
  const [utr, setUtr] = useState("");

  /* ---------------------- ROLE & USER ---------------------- */
  const roleId = parseInt(
    localStorage.getItem("roleid") || localStorage.getItem("role_id"),
    10
  );

  const userId =
    localStorage.getItem("userid") || localStorage.getItem("user_id");
    const isDM = roleId === 44;
     const canDMGeneratePO =
  isDM && request && request.current_status === "PO_PENDING_DM";


  /* ---------------------- LOAD DATA ---------------------- */
  const comparisonItems = React.useMemo(() => {
  if (!quotes?.length) return [];

  const map = {};

  quotes.forEach(q => {
    q.items.forEach(item => {
      if (!map[item.rfq_item_id]) {
        map[item.rfq_item_id] = {
          rfq_item_id: item.rfq_item_id,
          item_name: item.item_name,
          quantity: item.quantity,
          prices: {}
        };
      }

      map[item.rfq_item_id].prices[q.vendor_name] = {
        unit_price: item.unit_price,
        total_price: item.total_price
      };
    });
  });

  return Object.values(map);
}, [quotes]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await expenseApi.getOne(expenseId);
        setRequest(data);

        // Load item master list
        const itemList = await expenseApi.getItems();
        setItems(itemList);
             if (data.current_status !== "RFQ_PENDING") {
        const rfqData = await expenseApi.getRFQItems(expenseId);
        setRfqItems(rfqData);
      }
      const vendorList = await expenseApi.getVendors();
setVendors(vendorList);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [expenseId]);

useEffect(() => {
  if (!canDMGeneratePO) return;

  const loadPO = async () => {
    const data = await expenseApi.getPOItems(expenseId);

    setPoItems(data.items);
  };

  loadPO();
}, [canDMGeneratePO, expenseId]);


const loadQuotes = async () => {
  try {
    const data = await expenseApi.getQuotes(expenseId);
    setQuotes(Array.isArray(data) ? data : []);
  } catch (err) {
    console.error(err);
    setQuotes([]);
  }
};

useEffect(() => {
  loadQuotes();
}, [expenseId]);


useEffect(() => {
  if (request?.current_status === "PO_ISSUED") {
    expenseApi.getPO(request.id).then(res => {
      setPoItems(res.items || []);
      setPoTd(res.po||[]);
    });
  }
}, [request]);


  const refresh = async () => {
    const data = await expenseApi.getOne(expenseId);
    setRequest(data);
  };

  if (loading) return <p>Loading…</p>;
  if (!request) return <p>Request not found</p>;
  


  /* ---------------------- STATUS FLAGS ---------------------- */
  const status = request.current_status;

  const isExec = roleId === 43;
  const isFinExec = roleId === 45;
  const isFM = roleId === 46;
  const isCH = roleId === 47;

  const canExecCreateRFQ = isExec && status === "RFQ_PENDING";
  const showDraft = canExecCreateRFQ && status === "RFQ_PENDING";
  const canDMRecommendRFQ =
  isDM && status === "RFQ_SUBMITTED";

const canCHApproveRFQ =
  isCH && status === "RFQ_RECOMMENDED_DM";



  const canUploadQuotes = isExec && status === "QUOTES_PENDING";
  const canDMReviewQuotes = isDM && status === "QUOTE_REVIEW_DM";
  const canCHApproveVendor = isCH && status === "QUOTE_APPROVAL_CH";
  const canExecUploadInvoice = isExec && status === "PO_ISSUED";
  const canDMInvoiceReview = isDM && status === "INVOICE_REVIEW_DM";
  const canFMInvoiceReview = isFM && status === "INVOICE_REVIEW_FM";
  const canFinInitPayment = isFinExec && status === "PAYMENT_INITIATION";
  const canCHAuthorizePayment = isCH && status === "PAYMENT_APPROVAL_CH";
  const canFinExecutePayment = isFinExec && status === "PAYMENT_EXECUTION";
  const canExecVendorVerify = isExec && status === "VENDOR_VERIFICATION";

  /* ---------------------- RFQ ACTIONS ---------------------- */
 const addRFQItem = () => {
  if (!itemId || !qty) {
    alert("Item and quantity are required");
    return;
  }

 const selectedItem = items.find(
  (i) => i.id === Number(itemId)
);


  const newItem = {
    tempId: Date.now(), // UI key
    item_id: itemId,
    item_name: selectedItem?.name,
    quantity: qty,
    description: desc,
  };

  setRfqDraftItems((prev) => [...prev, newItem]);

  setItemId("");
  setQty("");
  setDesc("");
};



  const submitRFQ = async () => {
  try {
    await expenseApi.submitRFQItems({
      expense_id: request.id,
      items: rfqDraftItems.map((i) => ({
        item_id: i.item_id,
        quantity: i.quantity,
        description: i.description,
      })),
      created_by: userId,
    });

    setRfqDraftItems([]);
    await refresh();
  } catch (err) {
    console.error(err);
    alert("Failed to submit RFQ");
  }
};

const removeDraftItem = (tempId) => {
  setRfqDraftItems((prev) =>
    prev.filter((item) => item.tempId !== tempId)
  );
};

const recommendRFQ = async () => {
  await expenseApi.recommendRFQ({
    expense_id: request.id,
    recommended_by: userId,
  });
  await refresh();
};

const approveRFQByCH = async () => {
  await expenseApi.approveRFQByCH({
    expense_id: request.id,
    approved_by: userId,
  });
  await refresh();
};


  /* ---------------------- QUOTE UPLOAD ---------------------- */

const addVendorQuote = () => {
  if (!quoteVendorId) {
    alert("Select vendor");
    return;
  }

  if (vendorQuotes.some(v => v.vendor_id === quoteVendorId)) {
    alert("Quote already added for this vendor");
    return;
  }

  const vendor = vendors.find(v => v.id === quoteVendorId);

  setVendorQuotes(prev => [
    ...prev,
    {
      tempId: Date.now(),
      vendor_id: quoteVendorId,
      vendor_name: vendor?.name,
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



const submitQuoteWithItems = async () => {
  const form = new FormData();
  form.append("expense_id", request.id);
  form.append("uploaded_by", userId);

  vendorQuotes.forEach((v, idx) => {
    form.append(`vendors[${idx}][vendor_id]`, v.vendor_id);
    if (v.quote_file) {
      form.append(`vendors[${idx}][file]`, v.quote_file);
    }

    v.items.forEach((i, ii) => {
      form.append(`vendors[${idx}][items][${ii}][rfq_item_id]`, i.rfq_item_id);
      form.append(`vendors[${idx}][items][${ii}][unit_price]`, i.unit_price);
    });
  });

  await expenseApi.submitMultiVendorQuotes(form);
  setVendorQuotes([]);
  await refresh();
};









  /* ---------------------- QUOTE RECOMMENDATION ---------------------- */



const approveVendorByCH = async (q) => {
  await expenseApi.approveVendor({
    expense_id: request.id,
    selected_quote_id: q.id,
    vendor_id: q.vendor_id,
    amount: q.amount,
    approved_by: userId,
  });
  await loadQuotes();
};




  const submitRecommendations = async () => {
    await expenseApi.recommendQuotes({
      expense_id: request.id,
      recommended_quote_ids: selectedQuoteIds,
       reason: recommendationReasons

    });
    await refresh();
  };

  


  /* ---------------------- CH Vendor Approval ---------------------- */

  /* ---------------------- PO ISSUE ---------------------- */

const createPO = async () => {
  if (!request?.selected_vendor_id) {
    alert("Approved vendor not found");
    return;
  }

  if (!poItems?.length) {
    alert("No items to create PO");
    return;
  }

  try {
    const payload = {
      expense_id: request.id,
      vendor_id: request.selected_vendor_id,
      items: poItems.map(i => ({
        rfq_item_id: i.rfq_item_id,
        quantity: Number(i.quantity),
        unit_price: Number(i.unit_price) || 0
      })),
      terms: poTerms,
      created_by: userId
    };

    console.log("CREATE PO PAYLOAD:", payload);

    // 1️⃣ Create PO (DB + status update)
    await expenseApi.createPO(payload);

    // 2️⃣ Reload updated request
    const updated = await expenseApi.getOne(request.id);
    setRequest(updated);

    // 3️⃣ Generate PO PDF with latest data
    generatePOPdf({
      request: updated,
      vendor: vendors.find(v => v.id === updated.selected_vendor_id),
      poItems,
      terms: poTerms
    });

  } catch (err) {
    console.error("PO creation failed:", err);
    alert("Failed to create Purchase Order");
  }
};


const selectedVendor = vendors?.find(
  v => v.id === request?.selected_vendor_id
);

const gstRate = Number(selectedVendor?.gst_rate || 0); // 0.18

const getLineBaseTotal = item =>
  Number(item.quantity || 0) * Number(item.unit_price || 0);

const getLineGST = item =>
  getLineBaseTotal(item) * gstRate;

const getLineTotalWithGST = item =>
  getLineBaseTotal(item) + getLineGST(item);





  /* ---------------------- INVOICE UPLOAD ---------------------- */
  const uploadInvoice = async () => {
    if (!invNo || !taxable || !invoiceFile)
      return alert("Invoice no, taxable amount & file required.");

    const total = Number(taxable) + Number(gst || 0);
    const finalAmt = total - Number(tds || 0);

    const form = new FormData();
    form.append("expense_id", request.id);
    form.append("vendor_id", request.selected_vendor_id || "");
    form.append("invoice_no", invNo);
    form.append("taxable_amount", taxable);
    form.append("gst_amount", gst || 0);
    form.append("tds_amount", tds || 0);
    form.append("final_amount", finalAmt);
    form.append("invoice_file", invoiceFile);

    await expenseApi.uploadInvoice(form);
    await refresh();
  };

  /* ---------------------- INVOICE APPROVAL ---------------------- */
  const approveInvoice = async (id, nextStatus) => {
    await expenseApi.approveInvoice({
      invoice_id: id,
      next_status: nextStatus,
    });
    await refresh();
  };

  /* ---------------------- PAYMENT STAGES ---------------------- */
  const updatePaymentStage = async (stage) => {
    await expenseApi.updatePayment({
      expense_id: request.id,
      stage,
      utr,
      mode: "BANK_TRANSFER",
    });
    await refresh();
  };

  const completeVerification = async () => {
    await expenseApi.verifyVendor({ expense_id: request.id });
    await refresh();
  };

const scrollTo = (id) => {
    const container = document.getElementById("main-scroll-container");
    const element = document.getElementById(id);
    
    if (container && element) {
      // offsetTop gives distance from the top of the container
      // -24 gives us a nice visual buffer (padding)
      const topPos = element.offsetTop - 24; 
      container.scrollTo({ top: topPos, behavior: "smooth" });
    }
  };
  if (!request) return <p>Loading...</p>;

  /* ------------------------------------------------------------ */
  /*                            RENDER UI                         */
  /* ------------------------------------------------------------ */
if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p className="text-gray-500 font-medium">Loading request architecture...</p>
    </div>
  );

return (
    // OUTER SHELL: Forces page to be exactly screen height
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      
      {/* --- TOP SECTION (Fixed) --- 
          This block will NEVER move or cover content. 
      */}
      <div className="flex-none bg-white z-50 shadow-sm border-b border-gray-200">
        {/* Utility Bar */}
        <div className="max-w-[1400px] mx-auto px-6 py-2 flex justify-between items-center">
          <button
            onClick={onBack}
            className="group flex items-center text-xs font-bold text-gray-500 hover:text-blue-600 transition-colors uppercase tracking-wider"
          >
            <FaArrowLeft className="mr-2" /> Back to Pipeline
          </button>
          <div className="flex gap-2">
            <button className="p-1.5 text-gray-400 hover:bg-gray-100 rounded"><FaHistory /></button>
            <button className="p-1.5 text-gray-400 hover:bg-gray-100 rounded"><FaEllipsisV /></button>
          </div>
        </div>

        {/* Header Component - Ensure sticky classes are REMOVED from inside this component */}
        <div className="pb-2">
           <RequestHeader request={request} />
        </div>
      </div>

      {/* --- BOTTOM SECTION (Sidebar + Scrollable Content) --- */}
      <div className="flex-1 flex max-w-[1400px] mx-auto w-full overflow-hidden">
        
        {/* SIDEBAR: Stays fixed on the left */}
        <aside className="hidden lg:block w-64 flex-none py-6 pr-6 overflow-y-auto custom-scrollbar">
          <div className="space-y-6">
            <nav className="bg-white rounded-xl border border-gray-100 p-2 shadow-sm">
              <p className="text-[10px] font-black text-gray-400 uppercase p-3 tracking-widest">
                Quick Jump
              </p>
              {[
                { id: "rfq", label: "Requirements" },
                { id: "quotes", label: "Vendor Quotes" },
                { id: "po", label: "Purchase Order" },
                { id: "invoice", label: "Invoices" },
                { id: "payment", label: "Payment Status" }
              ].map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollTo(link.id)}
                  className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-bold text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all text-left"
                >
                  {link.label}
                </button>
              ))}
            </nav>

            <div className="bg-slate-800 rounded-xl p-4 text-white shadow-lg">
              <div className="flex items-center gap-2 mb-2 opacity-60">
                <FaShieldAlt size={12} />
                <span className="text-[10px] font-bold uppercase">Secure View</span>
              </div>
              <p className="text-[10px] leading-relaxed opacity-70">
                Finance & Management Audit Log Active.
              </p>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT: The only scrolling area */}
        <main 
          id="main-scroll-container"
          className="flex-1 overflow-y-auto py-6 px-4 lg:px-8 relative scroll-smooth"
        >
          <div className="space-y-10 pb-40">
            
            {/* We no longer need large padding-top or scroll-margins! */}
            
            <div id="rfq" className="relative">
              <RFQBlock
                /* ... pass your props ... */
                showDraft={showDraft}
                rfqDraftItems={rfqDraftItems}
                rfqItems={rfqItems}
                items={items}
                itemId={itemId}
                qty={qty}
                desc={desc}
                setItemId={setItemId}
                setQty={setQty}
                setDesc={setDesc}
                addRFQItem={addRFQItem}
                removeDraftItem={removeDraftItem}
                submitRFQ={submitRFQ}
                canDMRecommendRFQ={canDMRecommendRFQ}
                recommendRFQ={recommendRFQ}
                canCHApproveRFQ={canCHApproveRFQ}
                approveRFQByCH={approveRFQByCH}
              />
            </div>

            <div id="quotes" className="relative">
              <QuotesBlock
                /* ... pass your props ... */
                quotes={quotes}
                canUploadQuotes={canUploadQuotes}
                canDMReviewQuotes={canDMReviewQuotes}
                vendors={vendors}
                rfqItems={rfqItems}
                quoteVendorId={quoteVendorId}
                setQuoteVendorId={setQuoteVendorId}
                vendorQuotes={vendorQuotes}
                setVendorQuotes={setVendorQuotes}
                submitQuoteWithItems={submitQuoteWithItems}
                selectedQuoteIds={selectedQuoteIds}
                setSelectedQuoteIds={setSelectedQuoteIds}
                recommendationReasons={recommendationReasons}
                setRecommendationReasons={setRecommendationReasons}
                submitRecommendations={submitRecommendations}
                canCHApproveVendor={canCHApproveVendor}
                approveVendorByCH={approveVendorByCH}
                showCompare={showCompare}
                setShowCompare={setShowCompare}
                comparisonItems={comparisonItems}
                baseURL={baseURL}
              />
            </div>

            <div id="po" className="relative">
              <PurchaseOrderBlock
                 /* ... pass your props ... */
                 request={request}
                 vendors={vendors}
                 poItems={poItems}
                 setPoItems={setPoItems}
                 poTd={poTd}
                 gstRate={gstRate}
                 poTerms={poTerms}
                 setPoTerms={setPoTerms}
                 canDMGeneratePO={canDMGeneratePO}
                 createPO={createPO}
                 userId={userId}
              />
            </div>

            <div id="invoice" className="relative">
              <InvoiceBlock
                 /* ... pass your props ... */
                 request={request}
                 canExecUploadInvoice={canExecUploadInvoice}
                 canDMInvoiceReview={canDMInvoiceReview}
                 canFMInvoiceReview={canFMInvoiceReview}
                 uploadInvoice={uploadInvoice}
                 approveInvoice={approveInvoice}
                 invNo={invNo}
                 taxable={taxable}
                 gst={gst}
                 tds={tds}
                 setInvNo={setInvNo}
                 setTaxable={setTaxable}
                 setGst={setGst}
                 setTds={setTds}
                 setInvoiceFile={setInvoiceFile}
              />
            </div>

            <div id="payment" className="relative">
              <PaymentBlock
                 /* ... pass your props ... */
                 request={request}
                 utr={utr}
                 setUtr={setUtr}
                 canFinInitPayment={canFinInitPayment}
                 canCHAuthorizePayment={canCHAuthorizePayment}
                 canFinExecutePayment={canFinExecutePayment}
                 updatePaymentStage={updatePaymentStage}
                 canExecVendorVerify={canExecVendorVerify}
                 completeVerification={completeVerification}
              />
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default RequestDetail;
