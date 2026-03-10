import React, { useState, useEffect, useRef } from "react";

const STEPS = [
  { id: "RFQ", label: "RFQ Items", short: "RFQ", statuses: ["RFQ_PENDING", "RFQ_SUBMITTED", "RFQ_RECOMMENDED_DM"] },
  { id: "QUOTES", label: "Quotes", short: "Quotes", statuses: ["QUOTES_PENDING", "QUOTE_REVIEW_DM", "QUOTE_APPROVAL_CH"] },
  { id: "PO", label: "Purchase Order", short: "P.O.", statuses: ["PO_PENDING_DM","PO_DRAFT_DE","PO_REVIEW_DM","PO_REAPPROVAL_CH","PO_APPROVED_DM"] },
  { id: "INVOICE", label: "Invoicing", short: "Invoice", statuses: ["PO_ISSUED", "INVOICE_REVIEW_DM", "INVOICE_REVIEW_FM"] },
  { id: "PAYMENT", label: "Payment", short: "Payment", statuses: ["PAYMENT_INITIATION", "PAYMENT_APPROVAL_CH", "PAYMENT_EXECUTION", "VENDOR_VERIFICATION"] }
];

const STATUS_META = {
  RFQ_PENDING: { color: "#F59E0B", label: "RFQ Pending" },
  RFQ_SUBMITTED: { color: "#3B82F6", label: "RFQ Submitted" },
  RFQ_RECOMMENDED_DM: { color: "#8B5CF6", label: "RFQ Recommended" },
  QUOTES_PENDING: { color: "#F59E0B", label: "Quotes Pending" },
  QUOTE_REVIEW_DM: { color: "#3B82F6", label: "Quote Review" },
  QUOTE_APPROVAL_CH: { color: "#8B5CF6", label: "Quote Approval" },
  PO_PENDING_DM: { color: "#F59E0B", label: "PO Pending" },
  PO_ISSUED: { color: "#10B981", label: "PO Issued" },
  INVOICE_REVIEW_DM: { color: "#3B82F6", label: "Invoice Review" },
  INVOICE_REVIEW_FM: { color: "#8B5CF6", label: "Invoice Review FM" },
  PAYMENT_INITIATION: { color: "#F59E0B", label: "Payment Initiation" },
  PAYMENT_APPROVAL_CH: { color: "#3B82F6", label: "Payment Approval" },
  PAYMENT_EXECUTION: { color: "#8B5CF6", label: "Payment Execution" },
  VENDOR_VERIFICATION: { color: "#10B981", label: "Vendor Verification" },
};

const CheckIcon = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
    <path d="M2 5L4 7L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CalendarIcon = () => (
  <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
    <rect x="1" y="2" width="10" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
    <path d="M4 1v2M8 1v2M1 5h10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);

const TagIcon = () => (
  <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
    <path d="M1.5 1.5h4l5 5-4 4-5-5v-4z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
    <circle cx="4" cy="4" r="0.8" fill="currentColor"/>
  </svg>
);

export default function RequestHeader({ request }) {
  const [scrolled, setScrolled] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const activeStepIndex = STEPS.findIndex(step =>
    step.statuses.includes(request.current_status)
  );

  const statusMeta = STATUS_META[request.current_status] || { color: "#6B7280", label: request.current_status };
  const completionPct = activeStepIndex >= 0 ? (activeStepIndex / (STEPS.length - 1)) * 100 : 0;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        .rh-root {
          --accent: #1A56FF;
          --accent-light: #EEF2FF;
          --success: #059669;
          --warn: #D97706;
          --surface: #FAFAFA;
          --border: rgba(0,0,0,0.07);
          --text-primary: #0F172A;
          --text-muted: #94A3B8;
          --text-secondary: #475569;
          font-family: 'DM Sans', sans-serif;
        }

        .rh-wrap {
          position: sticky;
          top: 0;
          z-index: 50;
          background: rgba(250,250,250,0.92);
          backdrop-filter: blur(16px) saturate(180%);
          -webkit-backdrop-filter: blur(16px) saturate(180%);
          border-bottom: 1px solid var(--border);
          transition: box-shadow 0.25s ease;
        }

        .rh-wrap.scrolled {
          box-shadow: 0 4px 24px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04);
        }

        .rh-eyebrow {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 24px;
          border-bottom: 1px solid var(--border);
          font-family: 'DM Mono', monospace;
          font-size: 9.5px;
          letter-spacing: 0.12em;
          color: var(--text-muted);
          text-transform: uppercase;
        }

        .rh-eyebrow-sep { color: var(--border); }
        .rh-eyebrow-accent { color: var(--accent); font-weight: 500; }
        .rh-eyebrow-right { margin-left: auto; }

        .rh-body {
          padding: 16px 24px 14px;
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 16px;
          align-items: start;
        }

        @media (max-width: 640px) {
          .rh-body { grid-template-columns: 1fr; padding: 14px 16px 12px; }
          .rh-eyebrow { padding: 6px 16px; }
        }

        .rh-title {
          font-family: 'Syne', sans-serif;
          font-size: 17px;
          font-weight: 800;
          color: var(--text-primary);
          line-height: 1.15;
          letter-spacing: -0.03em;
          margin: 0 0 8px;
        }

        .rh-meta {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        .rh-meta-item {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 10.5px;
          color: var(--text-secondary);
          font-weight: 400;
          letter-spacing: 0.01em;
        }

        .rh-status-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 5px 10px 5px 7px;
          border-radius: 999px;
          font-family: 'DM Mono', monospace;
          font-size: 9px;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          border: 1.5px solid;
          white-space: nowrap;
          transition: all 0.2s;
        }

        .rh-status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          animation: pulse-dot 2s infinite;
          flex-shrink: 0;
        }

        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(0.85); }
        }

        .rh-stepper {
          padding: 0 24px 16px;
        }

        @media (max-width: 640px) { .rh-stepper { padding: 0 16px 14px; } }

        .rh-track-outer {
          position: relative;
          padding-top: 20px;
        }

        .rh-track-rail {
          position: absolute;
          top: 10px;
          left: 12px;
          right: 12px;
          height: 2px;
          background: #E2E8F0;
          border-radius: 2px;
          overflow: hidden;
        }

        .rh-track-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--success) 0%, var(--accent) 100%);
          border-radius: 2px;
          transition: width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .rh-steps {
          display: flex;
          justify-content: space-between;
          position: relative;
          z-index: 1;
        }

        .rh-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 7px;
          flex: 1;
        }

        .rh-step-node {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
        }

        .rh-step-node.complete {
          background: var(--success);
          box-shadow: 0 0 0 3px rgba(5,150,105,0.12);
        }

        .rh-step-node.active {
          background: white;
          border: 2px solid var(--accent);
          box-shadow: 0 0 0 4px rgba(26,86,255,0.1), 0 2px 8px rgba(26,86,255,0.2);
          transform: scale(1.2);
        }

        .rh-step-node.upcoming {
          background: white;
          border: 2px solid #E2E8F0;
        }

        .rh-step-inner-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }

        .rh-step-node.active .rh-step-inner-dot {
          background: var(--accent);
          animation: pulse-node 1.8s infinite;
        }

        .rh-step-node.upcoming .rh-step-inner-dot { background: #E2E8F0; }

        @keyframes pulse-node {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.3); opacity: 0.7; }
        }

        .rh-step-label {
          font-family: 'DM Mono', monospace;
          font-size: 8.5px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          text-align: center;
          font-weight: 500;
          white-space: nowrap;
          transition: color 0.2s;
        }

        .rh-step-label.complete { color: var(--success); }
        .rh-step-label.active { color: var(--accent); }
        .rh-step-label.upcoming { color: var(--text-muted); }

        .rh-step-num {
          font-family: 'DM Mono', monospace;
          font-size: 7px;
          color: var(--text-muted);
          letter-spacing: 0.04em;
        }
      `}</style>

      <div className="rh-root">
        <div className={`rh-wrap${scrolled ? " scrolled" : ""}`} ref={ref}>

          {/* Eyebrow */}
          <div className="rh-eyebrow">
            <span className="rh-eyebrow-accent">Expense Management</span>
            <span className="rh-eyebrow-sep">/</span>
            <span>REQ-{request.id}</span>
            <span className="rh-eyebrow-sep">/</span>
            <span style={{ display: "none" }} className="sm-show">Category: {request.category}</span>
            <span className="rh-eyebrow-right" style={{ fontVariantNumeric: "tabular-nums" }}>
              Step {activeStepIndex + 1} of {STEPS.length}
            </span>
          </div>

          {/* Title Row */}
          <div className="rh-body">
            <div>
              <h2 className="rh-title">{request.title}</h2>
              <div className="rh-meta">
                <span className="rh-meta-item">
                  <CalendarIcon />
                  {request.created_at || "Feb 16, 2026"}
                </span>
                <span className="rh-meta-item">
                  <TagIcon />
                  {request.category}
                </span>
              </div>
            </div>

            {/* Status Pill */}
            <div
              className="rh-status-pill"
              style={{
                color: statusMeta.color,
                borderColor: statusMeta.color + "30",
                backgroundColor: statusMeta.color + "0D",
              }}
            >
              <span className="rh-status-dot" style={{ background: statusMeta.color }} />
              {statusMeta.label}
            </div>
          </div>

          {/* Stepper */}
          <div className="rh-stepper">
            <div className="rh-track-outer">
              <div className="rh-track-rail">
                <div className="rh-track-fill" style={{ width: `${completionPct}%` }} />
              </div>

              <div className="rh-steps">
                {STEPS.map((step, index) => {
                  const isComplete = index < activeStepIndex;
                  const isActive = index === activeStepIndex;
                  const stateClass = isComplete ? "complete" : isActive ? "active" : "upcoming";

                  return (
                    <div key={step.id} className="rh-step">
                      <div className={`rh-step-node ${stateClass}`}>
                        {isComplete
                          ? <CheckIcon />
                          : <div className="rh-step-inner-dot" />
                        }
                      </div>
                      <span className={`rh-step-label ${stateClass}`}>{step.short}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

// --- Demo ---
const DEMO_REQUEST = {
  id: "20482",
  title: "Q1 Software Licenses & Infrastructure",
  category: "Technology",
  current_status: "QUOTE_REVIEW_DM",
  created_at: "Feb 16, 2026",
};

export function Demo() {
  return (
    <div style={{ minHeight: "200vh", background: "#F1F5F9" }}>
      <RequestHeader request={DEMO_REQUEST} />
      <div style={{ padding: "40px 24px", fontFamily: "DM Sans, sans-serif", color: "#475569", fontSize: 14 }}>
        <p>Scroll down to see the sticky header in action.</p>
      </div>
    </div>
  );
}