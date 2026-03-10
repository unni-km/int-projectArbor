import { useState, useEffect } from "react";

const baseURL = process.env.REACT_APP_API_BASE_URL;

const roleColors = {
  "Department Executive": { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  "Department Manager":   { bg: "bg-green-50", text: "text-green-700", border: "border-green-200" },
  "Centre Head":          { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
  "Finance Manager":      { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
  "Finance Executive":    { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
};

const stageGroups = [
  { label: "RFQ",            color: "text-blue-500",   bg: "bg-blue-500",   light: "bg-blue-50",   border: "border-l-blue-500",   dot: "bg-blue-500" },
  { label: "Quotes",         color: "text-emerald-500", bg: "bg-emerald-500", light: "bg-emerald-50", border: "border-l-emerald-500", dot: "bg-emerald-500" },
  { label: "Purchase Order", color: "text-amber-500",  bg: "bg-amber-500",  light: "bg-amber-50",  border: "border-l-amber-500",  dot: "bg-amber-500" },
  { label: "Invoice",        color: "text-violet-500", bg: "bg-violet-500", light: "bg-violet-50", border: "border-l-violet-500", dot: "bg-violet-500" },
  { label: "Payment",        color: "text-red-500",    bg: "bg-red-500",    light: "bg-red-50",    border: "border-l-red-500",    dot: "bg-red-500" },
];

function getGroup(code) {
  if (code?.startsWith("RFQ"))     return stageGroups[0];
  if (code?.startsWith("QUOTE"))   return stageGroups[1];
  if (code?.startsWith("PO"))      return stageGroups[2];
  if (code?.startsWith("INVOICE")) return stageGroups[3];
  if (code?.startsWith("PAYMENT") || code?.startsWith("VENDOR")) return stageGroups[4];
  return null;
}

export default function WorkflowConfig() {
  const [statuses, setStatuses]       = useState([]);
  const [filtered, setFiltered]       = useState([]);
  const [search, setSearch]           = useState("");
  const [activeGroup, setActiveGroup] = useState("All");
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);

  const [showModal, setShowModal]     = useState(false);
  const [editing, setEditing]         = useState(false);
  const [saving, setSaving]           = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [toast, setToast]             = useState(null);

  const [form, setForm] = useState({ status_code: "", status_name: "", roles: [] });
  const [rolesMaster, setRolesMaster] = useState([]);

  const allRoles = [...new Set(
    statuses.flatMap(s => s.roles ? s.roles.split(",").map(r => r.trim()) : [])
  )].filter(Boolean);

  const liveGroups = stageGroups.filter(g =>
    statuses.some(s => getGroup(s.status_code)?.label === g.label)
  );

  useEffect(() => {
  fetch(`${baseURL}/workflow/roles-list`)
    .then(res => res.json())
    .then(data => setRolesMaster(data));
}, []);

  const loadStatuses = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${baseURL}/workflow/status`);
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      setStatuses(data);
      setFiltered(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => { loadStatuses(); }, []);

  useEffect(() => {
    let result = statuses;
    if (activeGroup !== "All")
      result = result.filter(s => getGroup(s.status_code)?.label === activeGroup);
    if (search)
      result = result.filter(s =>
        s.status_name.toLowerCase().includes(search.toLowerCase()) ||
        s.status_code.toLowerCase().includes(search.toLowerCase())
      );
    setFiltered(result);
  }, [search, statuses, activeGroup]);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const openAdd = () => {
    setEditing(false);
    setForm({ status_code: "", status_name: "", roles: [] });
    setShowModal(true);
  };

  const openEdit = (s) => {
    setEditing(true);
    setForm({
      status_code: s.status_code,
      status_name: s.status_name,
      roles: s.role_ids ? s.role_ids.split(",").map(id => Number(id)) : [],
    });
    setShowModal(true);
  };

  const handleRoleChange = (role) =>
    setForm(f => ({
      ...f,
      roles: f.roles.includes(role) ? f.roles.filter(r => r !== role) : [...f.roles, role],
    }));

  const saveStatus = async () => {
    setSaving(true);
    try {
      if (!editing) {
        const res = await fetch(`${baseURL}/workflow/status`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status_code: form.status_code, status_name: form.status_name,role:form.role_id }),
        });
        if (!res.ok) throw new Error("Failed to create status");
      } else {
        const res = await fetch(`${baseURL}/workflow/status/${form.status_code}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
  status_code: form.status_code,
  status_name: form.status_name,
  role_ids: form.roles
})
        });
        if (!res.ok) throw new Error("Failed to update status");
      }

      const rolesRes = await fetch(`${baseURL}/workflow/roles`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status_code: form.status_code, roles: form.roles }),
      });
      if (!rolesRes.ok) throw new Error("Failed to save roles");

      setShowModal(false);
      showToast(editing ? "Status updated successfully" : "New status added");
      await loadStatuses();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const deleteStatus = async (code) => {
    try {
      const res = await fetch(`${baseURL}/workflow/status/${code}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete status");
      setDeleteConfirm(null);
      showToast("Status deleted", "error");
      await loadStatuses();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        body { font-family: 'DM Sans', system-ui, sans-serif; }
        .font-mono-dm { font-family: 'DM Mono', monospace; }
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(16px) scale(.97) } to { opacity: 1; transform: none } }
        @keyframes toastIn { from { opacity: 0; transform: translateY(10px) } to { opacity: 1; transform: none } }
        @keyframes spin { to { transform: rotate(360deg) } }
        .modal-overlay { animation: fadeIn 0.2s; }
        .modal-box { animation: slideUp 0.25s cubic-bezier(.16,1,.3,1); }
        .toast-anim { animation: toastIn 0.3s; }
        .spinner { width: 20px; height: 20px; border: 2.5px solid #E2E8F0; border-top-color: #3B82F6; border-radius: 50%; animation: spin 0.7s linear infinite; }
        .spinner-sm { width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.7s linear infinite; }
        .table-scroll { overflow-y: auto; max-height: calc(100vh - 520px); min-height: 300px; }
        .table-scroll::-webkit-scrollbar { width: 6px; }
        .table-scroll::-webkit-scrollbar-track { background: #F1F5F9; }
        .table-scroll::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 3px; }
      `}</style>

      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* HEADER */}
        <div className="flex justify-between items-start mb-7">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-md">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2">
                  <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                </svg>
              </div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Workflow Configuration</h1>
            </div>
            <p className="text-sm text-slate-500">Manage procurement stages, roles, and access permissions</p>
          </div>
          <button
            onClick={openAdd}
            className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-1.5 shadow-lg shadow-indigo-200 hover:-translate-y-0.5 transition-transform active:translate-y-0"
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
            </svg>
            Add Status
          </button>
        </div>

        {/* STATS */}
        {!loading && !error && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
            {liveGroups.map(g => {
              const count = statuses.filter(s => getGroup(s.status_code)?.label === g.label).length;
              return (
                <div key={g.label} className={`bg-white rounded-xl p-3.5 border border-slate-200 border-l-4 ${g.border}`}>
                  <div className={`text-xl font-bold font-mono-dm ${g.color}`}>{count}</div>
                  <div className="text-xs text-slate-400 font-medium mt-0.5">{g.label} Stages</div>
                </div>
              );
            })}
            <div className="bg-white rounded-xl p-3.5 border border-slate-200 border-l-4 border-l-slate-400">
              <div className="text-xl font-bold font-mono-dm text-slate-500">{statuses.length}</div>
              <div className="text-xs text-slate-400 font-medium mt-0.5">Total Stages</div>
            </div>
          </div>
        )}

        {/* FILTERS + SEARCH */}
        <div className="flex gap-3 items-center mb-4 flex-wrap">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              className="border border-slate-200 rounded-lg py-2 pl-8 pr-3 text-sm bg-white w-52 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all text-slate-900"
              placeholder="Search stages..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div className="flex gap-1.5 flex-wrap">
            {["All", ...liveGroups.map(g => g.label)].map(label => {
              const g = stageGroups.find(x => x.label === label);
              const active = activeGroup === label;
              return (
                <button
                  key={label}
                  onClick={() => setActiveGroup(label)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border-2 transition-all whitespace-nowrap cursor-pointer
                    ${active
                      ? `${g?.bg ?? "bg-slate-800"} text-white border-transparent`
                      : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
                    }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {!loading && (
            <button
              onClick={loadStatuses}
              title="Refresh"
              className="ml-auto bg-white border border-slate-200 rounded-lg p-2 text-slate-500 hover:-translate-y-0.5 transition-transform active:translate-y-0"
            >
              <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
            </button>
          )}
        </div>

        {/* TABLE CARD */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">

          {/* Loading */}
          {loading && (
            <div className="py-16 text-center">
              <div className="spinner mx-auto mb-3" />
              <p className="text-slate-400 text-sm">Loading workflow stages...</p>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="py-14 text-center">
              <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center mx-auto mb-3.5">
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#F43F5E" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/>
                </svg>
              </div>
              <p className="text-slate-900 font-semibold mb-1.5">Failed to load stages</p>
              <p className="text-slate-400 text-sm mb-4">{error}</p>
              <button
                onClick={loadStatuses}
                className="bg-blue-500 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:-translate-y-0.5 transition-transform"
              >
                Retry
              </button>
            </div>
          )}

          {/* Table */}
          {!loading && !error && (
            <div className="table-scroll">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b-2 border-slate-100">
                    <th className="px-4 py-3 text-left text-slate-500 font-semibold text-xs uppercase tracking-wider w-10">#</th>
                    <th className="px-4 py-3 text-left text-slate-500 font-semibold text-xs uppercase tracking-wider w-56">Status Code</th>
                    <th className="px-4 py-3 text-left text-slate-500 font-semibold text-xs uppercase tracking-wider">Stage Name</th>
                    <th className="px-4 py-3 text-left text-slate-500 font-semibold text-xs uppercase tracking-wider">Allowed Roles</th>
                    <th className="px-4 py-3 text-center text-slate-500 font-semibold text-xs uppercase tracking-wider w-28">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-400">
                        <svg className="mx-auto mb-2.5" width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                        </svg>
                        No stages found
                      </td>
                    </tr>
                  )}
                  {filtered.map((s, i) => {
                    const group = getGroup(s.status_code);
                    const roleList = s.roles ? s.roles.split(",").map(r => r.trim()).filter(Boolean) : [];
                    return (
                      <tr key={s.status_code} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 text-slate-300 font-mono-dm text-xs">{String(i + 1).padStart(2, "0")}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {group && <div className={`w-0.5 h-7 rounded-full ${group.dot} flex-shrink-0`} />}
                            <span className="font-mono-dm text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-md tracking-wide">{s.status_code}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {group && (
                              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${group.light} ${group.color} tracking-wide`}>
                                {group.label}
                              </span>
                            )}
                            <span className="text-slate-800 font-medium">{s.status_name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {roleList.length > 0
                              ? roleList.map(r => {
                                  const c = roleColors[r] || { bg: "bg-slate-100", text: "text-slate-500", border: "border-slate-200" };
                                  return (
                                    <span key={r} className={`inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full border ${c.bg} ${c.text} ${c.border}`}>
                                      {r}
                                    </span>
                                  );
                                })
                              : <span className="text-slate-300 text-xs">—</span>
                            }
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex gap-1.5 justify-center">
                            <button
                              onClick={() => openEdit(s)}
                              className="bg-blue-50 text-blue-500 px-3 py-1 rounded-lg text-xs font-semibold hover:-translate-y-0.5 transition-transform active:translate-y-0"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(s.status_code)}
                              className="bg-rose-50 text-rose-500 px-2.5 py-1 rounded-lg text-xs font-semibold hover:-translate-y-0.5 transition-transform active:translate-y-0"
                            >
                              <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {!loading && !error && (
            <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex justify-between text-xs text-slate-400">
              <span>Showing <strong className="text-slate-600">{filtered.length}</strong> of {statuses.length} stages</span>
              <span>{liveGroups.length} workflow phases</span>
            </div>
          )}
        </div>
      </div>

      {/* ADD / EDIT MODAL */}
      {showModal && (
        <div className="modal-overlay fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="modal-box bg-white rounded-2xl w-full max-w-md mx-4 p-7 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-5">
              <div>
                <h3 className="text-base font-bold text-slate-900">{editing ? "Edit Workflow Stage" : "Add New Stage"}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{editing ? "Modify stage details and permissions" : "Define a new procurement workflow stage"}</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="bg-slate-100 rounded-lg w-8 h-8 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors"
              >
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <div className="mb-4">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">Status Code</label>
              <input
                disabled={editing}
                value={form.status_code}
                onChange={e => setForm({ ...form, status_code: e.target.value })}
                className={`w-full border rounded-lg px-3.5 py-2.5 text-sm font-mono-dm focus:outline-none transition-all
                  ${editing
                    ? "border-slate-200 text-slate-400 bg-slate-50 cursor-not-allowed"
                    : "border-slate-300 text-slate-900 bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  }`}
                placeholder="e.g. RFQ_PENDING"
              />
            </div>

            <div className="mb-5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">Stage Name</label>
              <input
                value={form.status_name}
                onChange={e => setForm({ ...form, status_name: e.target.value })}
                className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                placeholder="e.g. Create RFQ"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-2">Allowed Roles</label>
              {allRoles.length === 0
                ? <p className="text-slate-400 text-sm">No roles found in current data.</p>
                : (
                  <div className="grid grid-cols-2 gap-2">
                    {rolesMaster.map(r => {
                      const c = roleColors[r] || { bg: "bg-slate-100", text: "text-slate-500", border: "border-slate-200" };
                      const checked = form.roles.includes(r.id);
                      return (
                        <label
                          key={r.id}
                          className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg border-2 cursor-pointer transition-all
                            ${checked ? `${c.bg} ${c.border}` : "bg-white border-slate-200 hover:border-slate-300"}`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => handleRoleChange(r.id)}
                            className="w-3.5 h-3.5"
                          />
                          <span className={`text-xs font-medium ${checked ? c.text : "text-slate-500"}`}>{r.role}</span>
                        </label>
                      );
                    })}
                  </div>
                )
              }
            </div>

            <div className="flex gap-2.5 mt-6 justify-end">
              <button
                onClick={() => setShowModal(false)}
                disabled={saving}
                className="bg-slate-100 text-slate-500 px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-slate-200 transition-colors disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                onClick={saveStatus}
                disabled={saving}
                className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 shadow-lg shadow-indigo-200 hover:-translate-y-0.5 transition-transform disabled:opacity-60 disabled:translate-y-0"
              >
                {saving && <div className="spinner-sm" />}
                {saving ? "Saving..." : (editing ? "Save Changes" : "Add Stage")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM */}
      {deleteConfirm && (
        <div className="modal-overlay fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="modal-box bg-white rounded-2xl w-full max-w-sm mx-4 p-7 shadow-2xl text-center">
            <div className="w-13 h-13 rounded-2xl bg-rose-50 flex items-center justify-center mx-auto mb-4" style={{width:52,height:52}}>
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#F43F5E" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/>
              </svg>
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Delete Stage?</h3>
            <p className="text-sm text-slate-500 mb-5">
              This will permanently remove{" "}
              <strong className="text-slate-900 font-mono-dm text-xs">{deleteConfirm}</strong>{" "}
              from the workflow.
            </p>
            <div className="flex gap-2.5 justify-center">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="bg-slate-100 text-slate-500 px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteStatus(deleteConfirm)}
                className="bg-rose-500 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:-translate-y-0.5 transition-transform active:translate-y-0"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div className={`toast-anim fixed bottom-7 right-7 text-white px-5 py-3 rounded-xl text-sm font-medium shadow-lg z-50 flex items-center gap-2
          ${toast.type === "error" ? "bg-rose-500" : "bg-emerald-500"}`}
        >
          {toast.type === "error"
            ? <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
            : <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M5 13l4 4L19 7"/></svg>
          }
          {toast.msg}
        </div>
      )}
    </div>
  );
}