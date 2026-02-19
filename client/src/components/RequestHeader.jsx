import React from "react";
import { FaCalendarAlt, FaTag, FaCheckCircle } from "react-icons/fa";

const STEPS = [
  { id: "RFQ", label: "RFQ Items", statuses: ["RFQ_PENDING", "RFQ_SUBMITTED", "RFQ_RECOMMENDED_DM"] },
  { id: "QUOTES", label: "Quotes", statuses: ["QUOTES_PENDING", "QUOTE_REVIEW_DM", "QUOTE_APPROVAL_CH"] },
  { id: "PO", label: "Purchase Order", statuses: ["PO_PENDING_DM"] },
  { id: "INVOICE", label: "Invoicing", statuses: ["PO_ISSUED","INVOICE_REVIEW_DM", "INVOICE_REVIEW_FM"] },
  { id: "PAYMENT", label: "Payment", statuses: ["PAYMENT_INITIATION", "PAYMENT_APPROVAL_CH", "PAYMENT_EXECUTION", "VENDOR_VERIFICATION"] }
];

export default function RequestHeader({ request }) {
  const activeStepIndex = STEPS.findIndex(step => 
    step.statuses.includes(request.current_status)
  );

  return (
    /* Added sticky classes: 
       'sticky top-0' - Sticks to the top of the container.
       'z-50' - Ensures it stays above all other blocks.
       'bg-white/90 backdrop-blur-md' - Modern transparent glass effect.
    */
    <div className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100 transition-all duration-300">
      <div className="max-w-7xl mx-auto overflow-hidden">
        
        {/* Top Meta Bar - Condensed for sticky mode */}
        <div className="bg-gray-50/80 px-6 py-1.5 flex justify-between items-center text-[9px] font-bold uppercase tracking-widest text-gray-400">
          <div className="flex items-center gap-2">
            <span className="text-blue-600">EXPENSE MANAGEMENT</span>
            <span className="text-gray-300">/</span>
            <span>REQ-{request.id}</span>
          </div>
          <div className="hidden sm:block">Category: {request.category}</div>
        </div>

        <div className="p-4 sm:p-6">
          {/* Title and Badge Section */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex flex-col">
              <h2 className="text-xl font-black text-slate-800 tracking-tight leading-none mb-2">
                {request.title}
              </h2>
              <div className="hidden sm:flex items-center gap-4 text-[10px] text-gray-500 italic font-medium">
                <span className="flex items-center gap-1"><FaCalendarAlt /> {request.created_at || "Feb 16, 2026"}</span>
                <span className="flex items-center gap-1"><FaTag /> ID: {request.id}</span>
              </div>
            </div>
            
            <div className="text-right">
              <span className="inline-block px-3 py-1 rounded-full bg-blue-600 text-white text-[9px] font-black uppercase tracking-tighter shadow-md shadow-blue-200">
                {request.current_status.replaceAll("_", " ")}
              </span>
            </div>
          </div>

          {/* PROGRESS STEPPER - Integrated horizontal layout */}
          <div className="relative">
            <div className="absolute top-3 left-0 w-full h-[2px] bg-gray-100" />
            
            <div className="relative z-10 flex justify-between px-2">
              {STEPS.map((step, index) => {
                const isCompleted = index < activeStepIndex;
                const isActive = index === activeStepIndex;
                
                return (
                  <div key={step.id} className="flex flex-col items-center">
                    <div className={`
                      w-6 h-6 rounded-full flex items-center justify-center transition-all duration-500 border-2
                      ${isCompleted ? "bg-green-500 border-green-500 shadow-sm" : ""}
                      ${isActive ? "bg-white border-blue-600 scale-110 shadow-lg shadow-blue-100" : ""}
                      ${!isCompleted && !isActive ? "bg-white border-gray-200" : ""}
                    `}>
                      {isCompleted ? (
                        <FaCheckCircle className="text-white text-[10px]" />
                      ) : (
                        <div className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-blue-600 animate-pulse" : "bg-gray-200"}`} />
                      )}
                    </div>

                    <span className={`
                      mt-2 text-[8px] sm:text-[9px] font-black uppercase tracking-tighter transition-colors
                      ${isActive ? "text-blue-600" : isCompleted ? "text-green-600" : "text-gray-400"}
                    `}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}