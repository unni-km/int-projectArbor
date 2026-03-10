import React, { useEffect, useState } from "react";
import expenseApi from "../expenseApi";
import CreateRequest from "./CreateRequest";
import DirectExpense from "./DirectExpense";

// ─── Icons (inline SVG to avoid react-icons dependency issues) ───────────────
const SearchIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M11.5 11.5L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
const PlusIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);
const BoltIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M7 1L2 7h4l-1 4 5-6H6l1-4z" fill="currentColor"/>
  </svg>
);
const ChevronIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M4.5 2.5L8 6l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const InboxIcon = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
    <rect x="4" y="4" width="28" height="28" rx="6" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M4 22h8l2 4h8l2-4h8" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
  </svg>
);
const InvoiceIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <rect x="2" y="1" width="10" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
    <path d="M4.5 5h5M4.5 7.5h5M4.5 10h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);
const XIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
const SpinnerIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" style={{ animation: "rl-spin 0.9s linear infinite" }}>
    <circle cx="14" cy="14" r="11" stroke="#E2E8F0" strokeWidth="3"/>
    <path d="M25 14A11 11 0 0014 3" stroke="#1A56FF" strokeWidth="3" strokeLinecap="round"/>
  </svg>
);

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  REJECTED:    { color: "#DC2626", bg: "#FEF2F2", border: "#FECACA", dot: "#EF4444" },
  PENDING:     { color: "#D97706", bg: "#FFFBEB", border: "#FDE68A", dot: "#F59E0B" },
  ISSUED:      { color: "#059669", bg: "#ECFDF5", border: "#A7F3D0", dot: "#10B981" },
  COMPLETED:   { color: "#059669", bg: "#ECFDF5", border: "#A7F3D0", dot: "#10B981" },
  REVIEW:      { color: "#2563EB", bg: "#EFF6FF", border: "#BFDBFE", dot: "#3B82F6" },
  RECOMMENDED: { color: "#2563EB", bg: "#EFF6FF", border: "#BFDBFE", dot: "#3B82F6" },
  APPROVAL:    { color: "#7C3AED", bg: "#F5F3FF", border: "#DDD6FE", dot: "#8B5CF6" },
  AUTHORIZE:   { color: "#7C3AED", bg: "#F5F3FF", border: "#DDD6FE", dot: "#8B5CF6" },
};

const getStatusConfig = (status = "") => {
  const s = status.toUpperCase();
  for (const [key, val] of Object.entries(STATUS_CONFIG)) {
    if (s.includes(key)) return val;
  }
  return { color: "#64748B", bg: "#F8FAFC", border: "#E2E8F0", dot: "#94A3B8" };
};

// ─── Category color strips ────────────────────────────────────────────────────
const CATEGORY_COLORS = ["#1A56FF","#7C3AED","#059669","#D97706","#DC2626","#0891B2","#DB2777"];
const categoryColor = (cat = "") => CATEGORY_COLORS[cat.charCodeAt(0) % CATEGORY_COLORS.length];

// ─── Modal ────────────────────────────────────────────────────────────────────
const Modal = ({ children, onClose }) => (
  <div
    style={{
      position: "fixed", inset: 0, background: "rgba(15,23,42,0.55)",
      backdropFilter: "blur(6px)", display: "flex", alignItems: "center",
      justifyContent: "center", zIndex: 100, padding: "16px",
      animation: "rl-fadein 0.18s ease"
    }}
    onClick={e => e.target === e.currentTarget && onClose()}
  >
    <div style={{
      background: "white", borderRadius: "20px", padding: "28px",
      width: "100%", maxWidth: "560px", maxHeight: "90vh",
      overflowY: "auto", position: "relative",
      boxShadow: "0 24px 80px rgba(0,0,0,0.18), 0 4px 16px rgba(0,0,0,0.06)",
      animation: "rl-slidein 0.2s cubic-bezier(0.34,1.56,0.64,1)"
    }}>
      <button
        onClick={onClose}
        style={{
          position: "absolute", top: "16px", right: "16px",
          width: "28px", height: "28px", borderRadius: "50%",
          border: "1.5px solid #E2E8F0", background: "white",
          color: "#94A3B8", cursor: "pointer", display: "flex",
          alignItems: "center", justifyContent: "center",
          transition: "all 0.15s"
        }}
        onMouseEnter={e => { e.currentTarget.style.background = "#FEF2F2"; e.currentTarget.style.color = "#DC2626"; e.currentTarget.style.borderColor = "#FECACA"; }}
        onMouseLeave={e => { e.currentTarget.style.background = "white"; e.currentTarget.style.color = "#94A3B8"; e.currentTarget.style.borderColor = "#E2E8F0"; }}
      >
        <XIcon />
      </button>
      {children}
    </div>
  </div>
);

// ─── Empty / Loading states ───────────────────────────────────────────────────
const EmptyState = ({ search, activeFilter }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "64px 24px", color: "#94A3B8" }}>
    <div style={{ marginBottom: "16px", opacity: 0.4 }}><InboxIcon /></div>
    <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "15px", color: "#334155", marginBottom: "6px" }}>
      {search || activeFilter ? "No matches found" : "No requests yet"}
    </p>
    <p style={{ fontSize: "12.5px", color: "#94A3B8", textAlign: "center", maxWidth: "280px", lineHeight: 1.6 }}>
      {search
        ? `Nothing matched "${search}". Try a different term.`
        : activeFilter
        ? `No requests with status "${activeFilter}". Click the pill again to clear the filter.`
        : "Create a new purchase request to get started."}
    </p>
  </div>
);

const LoadingState = () => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "64px 24px", gap: "14px" }}>
    <SpinnerIcon />
    <p style={{ fontSize: "12.5px", color: "#94A3B8", fontFamily: "'DM Mono', monospace", letterSpacing: "0.06em" }}>LOADING REQUESTS</p>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const RequestList = ({ onSelect }) => {
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showNewRequest, setShowNewRequest] = useState(false);
  const [showDirectExpense, setShowDirectExpense] = useState(false);
  const [hoveredRow, setHoveredRow] = useState(null);
  // null = no filter, "PENDING" | "REVIEW" = active filter
  const [activeFilter, setActiveFilter] = useState(null);

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

  useEffect(() => { fetchRequests(); }, []);

  // Toggle a stat-pill filter; clicking the same pill again clears it
  const handleFilterClick = (filterKey) => {
    setActiveFilter(prev => prev === filterKey ? null : filterKey);
  };

  const filtered = requests.filter((r) => {
    const statusUp = (r.current_status || "").toUpperCase();

    // Apply stat-pill filter
    if (activeFilter && !statusUp.includes(activeFilter)) return false;

    // Apply search
    const key = `${r.id} ${r.title || ""} ${r.category || ""} ${r.current_status || ""}`.toLowerCase();
    return key.includes(search.toLowerCase());
  });

  // Derived stats
  const pendingCount = requests.filter(r => (r.current_status || "").toUpperCase().includes("PENDING")).length;
  const reviewCount  = requests.filter(r => (r.current_status || "").toUpperCase().includes("REVIEW")).length;
  const approvalCount  = requests.filter(r => (r.current_status || "").toUpperCase().includes("APPROVAL")).length;

  // Stat pill configs
  const statPills = [
    {
      key: "APPROVAL",
      label: "Approval",
      value: approvalCount,
      color: "#0F172A",
      bg: "#F1F5F9",
      activeBg: "#E2E8F0",
      activeBorder: "#94A3B8",
    },
    {
      key: "PENDING",
      label: "Pending",
      value: pendingCount,
      color: "#D97706",
      bg: "#FFFBEB",
      activeBg: "#FDE68A",
      activeBorder: "#D97706",
    },
    {
      key: "REVIEW",
      label: "In Review",
      value: reviewCount,
      color: "#2563EB",
      bg: "#EFF6FF",
      activeBg: "#BFDBFE",
      activeBorder: "#2563EB",
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        @keyframes rl-fadein  { from { opacity: 0 } to { opacity: 1 } }
        @keyframes rl-slidein { from { opacity: 0; transform: scale(0.94) translateY(8px) } to { opacity: 1; transform: scale(1) translateY(0) } }
        @keyframes rl-spin    { to { transform: rotate(360deg) } }
        @keyframes rl-rowfade { from { opacity: 0; transform: translateY(4px) } to { opacity: 1; transform: none } }
        .rl-row { animation: rl-rowfade 0.2s ease both; }
        .rl-search:focus { outline: none; border-color: #1A56FF !important; box-shadow: 0 0 0 3px rgba(26,86,255,0.1); }
        .rl-btn-primary:hover { background: #1445E0 !important; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(26,86,255,0.3) !important; }
        .rl-btn-primary:active { transform: translateY(0); }
        .rl-btn-secondary:hover { border-color: #1A56FF !important; color: #1A56FF !important; background: #EEF2FF !important; }
        .rl-clear-btn:hover { color: #334155 !important; }
        .rl-stat-pill {
          cursor: pointer;
          border: 1.5px solid transparent;
          transition: all 0.18s ease;
          user-select: none;
        }
        .rl-stat-pill:hover { filter: brightness(0.96); transform: translateY(-1px); }
        .rl-stat-pill:active { transform: translateY(0); }
      `}</style>

      <div style={{
        height: "calc(100vh - 60px)", width: "100%", maxWidth: "1400px",
        margin: "0 auto", display: "flex", flexDirection: "column",
        padding: "24px", gap: "20px", fontFamily: "'DM Sans', sans-serif",
        boxSizing: "border-box"
      }}>

        {/* ── Header ── */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", flexShrink: 0 }}>
          <div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "9.5px", letterSpacing: "0.14em", color: "#94A3B8", textTransform: "uppercase", marginBottom: "6px" }}>
              Expense Management
            </div>
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "26px", color: "#0F172A", margin: 0, letterSpacing: "-0.03em", lineHeight: 1.1 }}>
              Purchase Requests
            </h1>
          </div>

          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <button
              className="rl-btn-secondary"
              onClick={() => setShowDirectExpense(true)}
              style={{
                display: "flex", alignItems: "center", gap: "7px",
                padding: "9px 16px", borderRadius: "10px",
                border: "1.5px solid #E2E8F0", background: "white",
                color: "#475569", fontSize: "13px", fontWeight: 600,
                cursor: "pointer", transition: "all 0.15s", fontFamily: "'DM Sans', sans-serif"
              }}
            >
              <span style={{ color: "#D97706" }}><BoltIcon /></span>
              Direct Expense
            </button>
            <button
              className="rl-btn-primary"
              onClick={() => setShowNewRequest(true)}
              style={{
                display: "flex", alignItems: "center", gap: "7px",
                padding: "9px 18px", borderRadius: "10px",
                background: "#1A56FF", border: "none",
                color: "white", fontSize: "13px", fontWeight: 600,
                cursor: "pointer", transition: "all 0.15s",
                boxShadow: "0 4px 14px rgba(26,86,255,0.25)",
                fontFamily: "'DM Sans', sans-serif"
              }}
            >
              <PlusIcon /> New Purchase
            </button>
          </div>
        </div>

        {/* ── Stat Pills ── */}
        {!isLoading && requests.length > 0 && (
          <div style={{ display: "flex", gap: "10px", flexShrink: 0, flexWrap: "wrap", alignItems: "center" }}>
            {statPills.map(stat => {
              const isActive = activeFilter === stat.key;
              return (
                <div
                  key={stat.label}
                  className="rl-stat-pill"
                  onClick={() => stat.key !== null && handleFilterClick(stat.key)}
                  title={stat.key ? (isActive ? `Clear "${stat.label}" filter` : `Filter by ${stat.label}`) : undefined}
                  style={{
                    padding: "7px 14px",
                    borderRadius: "8px",
                    background: isActive ? stat.activeBg : stat.bg,
                    borderColor: isActive ? stat.activeBorder : "transparent",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    cursor: stat.key ? "pointer" : "default",
                    boxShadow: isActive ? `0 0 0 3px ${stat.activeBorder}22` : "none",
                    position: "relative",
                  }}
                >
                  <span style={{
                    fontFamily: "'Syne', sans-serif",
                    fontWeight: 700,
                    fontSize: "16px",
                    color: stat.color,
                  }}>
                    {stat.value}
                  </span>
                  <span style={{
                    fontSize: "11px",
                    color: isActive ? stat.color : "#94A3B8",
                    fontWeight: isActive ? 600 : 500,
                    letterSpacing: "0.02em",
                    transition: "color 0.15s",
                  }}>
                    {stat.label}
                  </span>
                  {/* Active indicator dot */}
                  {isActive && (
                    <span style={{
                      width: "5px", height: "5px", borderRadius: "50%",
                      background: stat.color, flexShrink: 0,
                      animation: "rl-fadein 0.15s ease",
                    }} />
                  )}
                  {/* Clear badge on active */}
                  {isActive && (
                    <span style={{
                      display: "inline-flex", alignItems: "center", justifyContent: "center",
                      width: "14px", height: "14px", borderRadius: "50%",
                      background: stat.color, color: "white",
                      fontSize: "8px", lineHeight: 1, flexShrink: 0,
                    }}>
                      ✕
                    </span>
                  )}
                </div>
              );
            })}

            {/* Active filter label */}
            {activeFilter && (
              <span style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "10px",
                color: "#94A3B8",
                letterSpacing: "0.08em",
                marginLeft: "2px",
                animation: "rl-fadein 0.2s ease",
              }}>
                — filtered by {
  activeFilter === "APPROVAL" 
    ? "Approval" 
    : activeFilter === "PENDING" 
      ? "Pending" 
      : "In Review"
}
              </span>
            )}
          </div>
        )}

        {/* ── Table Card ── */}
        <div style={{
          flex: 1, display: "flex", flexDirection: "column",
          background: "white", borderRadius: "16px", minHeight: 0,
          border: "1px solid #E2E8F0",
          boxShadow: "0 1px 4px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.03)",
          overflow: "hidden"
        }}>

          {/* Search bar */}
          <div style={{
            padding: "14px 20px", borderBottom: "1px solid #F1F5F9",
            background: "#FAFAFA", display: "flex", alignItems: "center",
            gap: "12px", flexShrink: 0
          }}>
            <div style={{ position: "relative", flex: 1, maxWidth: "420px" }}>
              <span style={{ position: "absolute", left: "13px", top: "50%", transform: "translateY(-50%)", color: "#94A3B8", pointerEvents: "none" }}>
                <SearchIcon />
              </span>
              <input
                className="rl-search"
                style={{
                  width: "100%", paddingLeft: "38px", paddingRight: search ? "36px" : "14px",
                  paddingTop: "9px", paddingBottom: "9px",
                  border: "1.5px solid #E2E8F0", borderRadius: "9px",
                  fontSize: "13px", color: "#334155", background: "white",
                  transition: "border-color 0.15s, box-shadow 0.15s",
                  fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box"
                }}
                placeholder="Search requests…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {search && (
                <button className="rl-clear-btn" onClick={() => setSearch("")} style={{
                  position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", cursor: "pointer", color: "#CBD5E1",
                  display: "flex", alignItems: "center", padding: "2px", transition: "color 0.15s"
                }}><XIcon /></button>
              )}
            </div>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "10px", color: "#CBD5E1", letterSpacing: "0.08em", marginLeft: "auto", whiteSpace: "nowrap" }}>
              {filtered.length} / {requests.length}
            </span>
          </div>

          {/* Table scroll area */}
          <div style={{ flex: 1, overflowY: "auto", overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "1000px" }}>
              <thead>
                <tr style={{
                  position: "sticky", top: 0, zIndex: 10,
                  background: "#F8FAFC", borderBottom: "1px solid #E2E8F0"
                }}>
                  {["Req ID", "Request", "Category", "Status", ""].map((h, i) => (
                    <th key={i} style={{
                      padding: i === 3 ? "11px 85px" : "11px 20px",
                      textAlign: i === 4 ? "right" : "left",
                      fontFamily: "'DM Mono', monospace", fontSize: "9px",
                      letterSpacing: "0.12em",
                      color: "#94A3B8", fontWeight: 500, whiteSpace: "nowrap"
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={5}><LoadingState /></td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={5}><EmptyState search={search} activeFilter={activeFilter} /></td></tr>
                ) : filtered.map((req, idx) => {
                  const sc = getStatusConfig(req.current_status);
                  const catColor = categoryColor(req.category);
                  const isHovered = hoveredRow === req.id;
                  return (
                    <tr
                      key={req.id}
                      className="rl-row"
                      style={{
                        animationDelay: `${Math.min(idx * 25, 200)}ms`,
                        borderBottom: "1px solid #F1F5F9",
                        background: isHovered ? "#F8FBFF" : "white",
                        cursor: "pointer", transition: "background 0.12s"
                      }}
                      onMouseEnter={() => setHoveredRow(req.id)}
                      onMouseLeave={() => setHoveredRow(null)}
                      onClick={() => onSelect(req.id)}
                    >
                      {/* ID */}
                      <td style={{ padding: "14px 20px", whiteSpace: "nowrap" }}>
                        <span style={{
                          fontFamily: "'DM Mono', monospace", fontSize: "11px",
                          fontWeight: 500, color: "#64748B",
                          background: "#F1F5F9", borderRadius: "6px",
                          padding: "3px 8px", letterSpacing: "0.04em"
                        }}>
                          REQ-{req.id.toString().padStart(4, "0")}
                        </span>
                      </td>

                      {/* Title */}
                      <td style={{ padding: "14px 20px", maxWidth: "280px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <div style={{
                            width: "32px", height: "32px", borderRadius: "9px",
                            background: catColor + "15", color: catColor,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            flexShrink: 0
                          }}>
                            <InvoiceIcon />
                          </div>
                          <span style={{
                            fontWeight: 600, fontSize: "13.5px",
                            color: isHovered ? "#1A56FF" : "#1E293B",
                            transition: "color 0.12s",
                            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"
                          }}>
                            {req.title}
                          </span>
                        </div>
                      </td>

                      {/* Category */}
                      <td style={{ padding: "14px 20px", whiteSpace: "nowrap" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: catColor, flexShrink: 0 }} />
                          <span style={{ fontSize: "13px", color: "#475569", fontWeight: 400 }}>{req.category}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td style={{ padding: "14px 20px", whiteSpace: "nowrap" }}>
                        <span style={{
                          display: "inline-flex", alignItems: "center", gap: "5px",
                          padding: "4px 10px", borderRadius: "999px",
                          background: sc.bg, border: `1px solid ${sc.border}`,
                          color: sc.color, fontSize: "10px", fontWeight: 500,
                          fontFamily: "'DM Mono', monospace", letterSpacing: "0.05em",
                          textTransform: "uppercase"
                        }}>
                          <span style={{
                            width: "5px", height: "5px", borderRadius: "50%",
                            background: sc.dot, flexShrink: 0
                          }} />
                          {(req.current_status || "UNKNOWN").replace(/_/g, " ")}
                        </span>
                      </td>

                      {/* Action arrow */}
                      <td style={{ padding: "14px 20px", textAlign: "right" }}>
                        <span style={{
                          display: "inline-flex", alignItems: "center", justifyContent: "center",
                          width: "28px", height: "28px", borderRadius: "8px",
                          background: isHovered ? "#EEF2FF" : "#F8FAFC",
                          border: `1px solid ${isHovered ? "#BFDBFE" : "#E2E8F0"}`,
                          color: isHovered ? "#1A56FF" : "#CBD5E1",
                          transition: "all 0.12s",
                          transform: isHovered ? "translateX(2px)" : "none"
                        }}>
                          <ChevronIcon />
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showNewRequest && (
        <Modal onClose={() => setShowNewRequest(false)}>
          <CreateRequest
            onBack={() => setShowNewRequest(false)}
            onSuccess={() => { setShowNewRequest(false); fetchRequests(); }}
          />
        </Modal>
      )}
      {showDirectExpense && (
        <Modal onClose={() => setShowDirectExpense(false)}>
          <DirectExpense
            onBack={() => setShowDirectExpense(false)}
            onSuccess={() => { setShowDirectExpense(false); fetchRequests(); }}
          />
        </Modal>
      )}
    </>
  );
};

export default RequestList;