import React, { useState } from "react";
import { toast } from "react-toastify";
import * as XLSX from "xlsx-js-style";

const baseURL = process.env.REACT_APP_API_BASE_URL;

/* ─── inline styles as a design system ─── */
const css = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(8, 12, 24, 0.72)",
    backdropFilter: "blur(6px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    animation: "fadeIn .2s ease",
  },
  panel: {
    background: "#0f1623",
    border: "1px solid rgba(99,179,237,0.15)",
    borderRadius: "16px",
    width: "96%",
    maxWidth: "1160px",
    maxHeight: "90vh",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)",
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    color: "#e2e8f0",
  },
  header: {
    padding: "22px 28px 18px",
    borderBottom: "1px solid rgba(255,255,255,0.07)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "linear-gradient(135deg, rgba(30,64,175,0.18) 0%, transparent 60%)",
  },
  titleBlock: { display: "flex", alignItems: "center", gap: "12px" },
  iconBadge: {
    width: 38,
    height: 38,
    borderRadius: "10px",
    background: "linear-gradient(135deg, #1e40af, #3b82f6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
    flexShrink: 0,
  },
  title: {
    margin: 0,
    fontSize: "17px",
    fontWeight: 700,
    letterSpacing: "-0.3px",
    color: "#f0f6ff",
  },
  subtitle: { margin: 0, fontSize: "12px", color: "#64748b", marginTop: "1px" },
  closeBtn: {
    width: 32,
    height: 32,
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "8px",
    background: "transparent",
    color: "#94a3b8",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "16px",
    transition: "all .15s",
  },
  toolbar: {
    padding: "16px 28px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
    background: "rgba(255,255,255,0.015)",
  },
  labelGroup: { display: "flex", flexDirection: "column", gap: "4px" },
  label: { fontSize: "11px", color: "#64748b", fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase" },
  dateInput: {
    background: "#1a2236",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "8px",
    color: "#e2e8f0",
    padding: "8px 12px",
    fontSize: "13px",
    outline: "none",
    cursor: "pointer",
    colorScheme: "dark",
  },
  btnPrimary: {
    padding: "9px 20px",
    borderRadius: "8px",
    border: "none",
    background: "linear-gradient(135deg, #1d4ed8, #3b82f6)",
    color: "#fff",
    fontWeight: 600,
    fontSize: "13px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    transition: "opacity .15s, transform .1s",
    marginTop: "auto",
  },
  btnSecondary: {
    padding: "9px 20px",
    borderRadius: "8px",
    border: "1px solid rgba(99,179,237,0.3)",
    background: "rgba(99,179,237,0.07)",
    color: "#93c5fd",
    fontWeight: 600,
    fontSize: "13px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    transition: "all .15s",
    marginTop: "auto",
  },
  tableWrap: {
    flex: 1,
    overflowY: "auto",
    overflowX: "auto",
    padding: "0 28px 16px",
  },
  table: {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: "0 3px",
    fontSize: "13px",
    minWidth: "680px",
  },
  th: {
    padding: "10px 14px",
    textAlign: "left",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.6px",
    textTransform: "uppercase",
    color: "#475569",
    background: "#0f1623",
    position: "sticky",
    top: 0,
    zIndex: 2,
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    whiteSpace: "nowrap",
  },
  tr: {
    background: "rgba(255,255,255,0.025)",
    transition: "background .1s",
  },
  td: {
    padding: "11px 14px",
    color: "#cbd5e1",
    borderTop: "1px solid rgba(255,255,255,0.03)",
    whiteSpace: "nowrap",
  },
  tdFirst: {
    padding: "11px 14px",
    color: "#e2e8f0",
    fontWeight: 600,
    borderTop: "1px solid rgba(255,255,255,0.03)",
    whiteSpace: "nowrap",
  },
  footer: {
    padding: "14px 28px",
    borderTop: "1px solid rgba(255,255,255,0.06)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "12px",
    background: "rgba(255,255,255,0.015)",
  },
  statChip: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "8px",
    padding: "8px 16px",
  },
  statLabel: { fontSize: "11px", color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.4px" },
  statValue: { fontSize: "16px", fontWeight: 700, color: "#f0f6ff" },
  emptyState: {
    textAlign: "center",
    padding: "56px 28px",
    color: "#475569",
  },
  spinner: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    padding: "40px",
    color: "#64748b",
    fontSize: "14px",
  },
  usageBadge: (pct) => ({
    display: "inline-flex",
    alignItems: "center",
    padding: "2px 8px",
    borderRadius: "99px",
    fontSize: "12px",
    fontWeight: 600,
    background: pct >= 75 ? "rgba(239,68,68,0.15)" : pct >= 40 ? "rgba(234,179,8,0.15)" : "rgba(34,197,94,0.15)",
    color: pct >= 75 ? "#f87171" : pct >= 40 ? "#fde047" : "#4ade80",
  }),
  balanceLow: { color: "#f87171", fontWeight: 700 },
};

/* ─── keyframe injection ─── */
const styleTag = `
@keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
@keyframes spin { to { transform:rotate(360deg) } }
.inv-row:hover td { background: rgba(255,255,255,0.04) !important; }
.inv-btn:hover { opacity:.85; transform:scale(.98); }
.inv-close:hover { background:rgba(255,255,255,0.08) !important; color:#e2e8f0 !important; }
`;

const InventoryReportPopup = ({ closePopup }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);

  /* inject keyframes once */
  if (!document.getElementById("inv-styles")) {
    const s = document.createElement("style");
    s.id = "inv-styles";
    s.textContent = styleTag;
    document.head.appendChild(s);
  }

  const fetchReport = async () => {
    if (!startDate || !endDate) { toast.error("Please select a date range"); return; }
    setLoading(true);
    try {
      const res = await fetch(`${baseURL}/inventory/reports?startDate=${startDate}&endDate=${endDate}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch report");
      setReportData(data);
      if (data.length === 0) toast.info("No movements found for selected range");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadExcel = () => {
    if (reportData.length === 0) { toast.info("No data to export"); return; }
    const worksheetData = reportData.map((row) => ({
      Item: row.item_name,
      Unit: row.unit,
      Opening: row.opening_stock,
      Issued: row.issued_qty,
      Closing: row.closing_stock,
      "Current Balance": row.current_balance,
      "Movement Count": row.movement_count,
      "Last Moved On": row.last_moved_on,
      "Stock Value": row.stock_value,
      "Avg Price": row.avg_price,
      "Usage %": row.usage_percent,
    }));
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const headerStyle = {
      font: { bold: true, color: { rgb: "FFFFFF" } },
      fill: { fgColor: { rgb: "1E40AF" } },
      alignment: { horizontal: "center", vertical: "center" },
    };
    const range = XLSX.utils.decode_range(worksheet["!ref"]);
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const addr = XLSX.utils.encode_cell({ r: 0, c: C });
      if (worksheet[addr]) worksheet[addr].s = headerStyle;
    }
    worksheet["!cols"] = Array(Object.keys(worksheetData[0]).length).fill({ wch: 18 });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory Report");
    XLSX.writeFile(workbook, `Inventory_Report_${startDate}_to_${endDate}.xlsx`);
    toast.success("Report downloaded successfully");
  };

  const totalIssued = reportData.reduce((s, r) => s + Number(r.issued_qty || 0), 0);
  const totalStockValue = reportData.reduce((s, r) => s + Number(r.stock_value || 0), 0);
  const lowStockCount = reportData.filter((r) => Number(r.current_balance) < 10).length;

  return (
    <div style={css.overlay}>
      <div style={css.panel}>

        {/* ── Header ── */}
        <div style={css.header}>
          <div style={css.titleBlock}>
            <div style={css.iconBadge}>📦</div>
            <div>
              <p style={css.title}>Inventory Movement Report</p>
              <p style={css.subtitle}>
                {reportData.length > 0
                  ? `${reportData.length} items · ${startDate} → ${endDate}`
                  : "Select a date range to generate"}
              </p>
            </div>
          </div>
          <button
            className="inv-close"
            style={css.closeBtn}
            onClick={closePopup}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* ── Toolbar ── */}
        <div style={css.toolbar}>
          <div style={css.labelGroup}>
            <span style={css.label}>From</span>
            <input
              type="date"
              style={css.dateInput}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div style={css.labelGroup}>
            <span style={css.label}>To</span>
            <input
              type="date"
              style={css.dateInput}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <button className="inv-btn" style={css.btnPrimary} onClick={fetchReport} disabled={loading}>
            {loading ? "⏳" : "⚡"} Generate
          </button>
          <button className="inv-btn" style={css.btnSecondary} onClick={downloadExcel}>
            ↓ Export Excel
          </button>

          {lowStockCount > 0 && (
            <div style={{ marginLeft: "auto", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: "8px", padding: "7px 14px", fontSize: "12px", color: "#f87171", fontWeight: 600 }}>
              ⚠ {lowStockCount} item{lowStockCount > 1 ? "s" : ""} low on stock
            </div>
          )}
        </div>

        {/* ── Body ── */}
        {loading && (
          <div style={css.spinner}>
            <svg width="20" height="20" viewBox="0 0 20 20" style={{ animation: "spin 0.8s linear infinite", flexShrink: 0 }}>
              <circle cx="10" cy="10" r="8" stroke="#3b82f6" strokeWidth="2.5" fill="none" strokeDasharray="38 14" />
            </svg>
            Fetching report…
          </div>
        )}

        {!loading && reportData.length > 0 && (
          <div style={css.tableWrap}>
            <table style={css.table}>
              <thead>
                <tr>
                  {["Item", "Unit", "Opening", "Issued", "Closing", "Balance", "Usage", "Last Moved"].map((h) => (
                    <th key={h} style={css.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {reportData.map((row, i) => {
                  const pct = parseFloat(row.usage_percent) || 0;
                  const lowBal = Number(row.current_balance) < 10;
                  return (
                    <tr key={i} className="inv-row" style={css.tr}>
                      <td style={css.tdFirst}>{row.item_name}</td>
                      <td style={css.td}>{row.unit}</td>
                      <td style={css.td}>{row.opening_stock}</td>
                      <td style={css.td}>{row.issued_qty}</td>
                      <td style={css.td}>{row.closing_stock}</td>
                      <td style={{ ...css.td, ...(lowBal ? css.balanceLow : {}) }}>
                        {lowBal && <span style={{ marginRight: 4 }}>!</span>}
                        {row.current_balance}
                      </td>
                      <td style={css.td}>
                        <span style={css.usageBadge(pct)}>{pct}%</span>
                      </td>
                      <td style={{ ...css.td, color: "#64748b", fontSize: "12px" }}>
                        {row.last_moved_on ? new Date(row.last_moved_on).toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" }) : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {!loading && reportData.length === 0 && (
          <div style={css.emptyState}>
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>📋</div>
            <p style={{ fontSize: "15px", fontWeight: 600, color: "#94a3b8", margin: 0 }}>No data yet</p>
            <p style={{ fontSize: "13px", color: "#475569", margin: "6px 0 0" }}>Choose a date range and click Generate</p>
          </div>
        )}

        {/* ── Footer stats ── */}
        {!loading && reportData.length > 0 && (
          <div style={css.footer}>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <div style={css.statChip}>
                <div>
                  <div style={css.statLabel}>Total Issued</div>
                  <div style={css.statValue}>{totalIssued.toLocaleString()}</div>
                </div>
              </div>
              <div style={css.statChip}>
                <div>
                  <div style={css.statLabel}>Stock Value</div>
                  <div style={css.statValue}>₹ {totalStockValue.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</div>
                </div>
              </div>
              <div style={css.statChip}>
                <div>
                  <div style={css.statLabel}>Items Tracked</div>
                  <div style={css.statValue}>{reportData.length}</div>
                </div>
              </div>
            </div>
            <div style={{ fontSize: "11px", color: "#334155" }}>
              {startDate} → {endDate}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default InventoryReportPopup;