import React, { useEffect, useState } from "react";
import { ArrowUpRight, Clock, FileText, CreditCard } from "lucide-react";
import expenseApi from "../expenseApi";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

// ------------------------ STAT CARD ------------------------
const StatCard = ({ title, value, icon: Icon, color, iconColor }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-start justify-between">
    <div>
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <h3 className="text-2xl font-bold text-slate-800 mt-2">{value}</h3>
    </div>
    <div className={`p-3 rounded-lg ${color}`}>
      <Icon size={24} className={iconColor} />
    </div>
  </div>
);

// ------------------------ DASHBOARD ONLY ------------------------
export default function ExpenseDashboard() {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

 const loadDashboard = async () => {
  try {
    const s = await expenseApi.getDashboardStats();

    setStats({
      totalBudget: Number(s.totalBudget || 0),
      totalSpent: Number(s.totalSpent || 0),
      activeRequests: Number(s.activeRequests || 0),
      financeReviewPending: Number(s.financeReviewPending || 0),
      monthlySpend: Array.isArray(s.monthlySpend) ? s.monthlySpend : []
    });

    const r = await expenseApi.getRecentRequests();
    setRecent(Array.isArray(r) ? r : []);
  } catch (err) {
    console.error("Dashboard error", err);
    setRecent([]);
  } finally {
    setLoading(false);
  }
};


  if (loading || !stats)
    return <p className="text-center text-gray-500 mt-20">Loading dashboard...</p>;

const pendingFinance = recent.filter(
  r => (r.current_status || "").toUpperCase() === "INVOICE_REVIEW_FM"
).length;

const paymentProcessing = recent.filter(
  r => (r.current_status || "").toUpperCase() === "PAYMENT_EXECUTION"
).length;

const completed = recent.filter(
  r => (r.current_status || "").toUpperCase() === "COMPLETED"
).length;


  const chartData = stats.monthlySpend.map((m) => ({
    name: m.month,
    spend: m.amount || 0
  }));

  return (
    <div className="p-6">

      {/* ---------------- STATS CARDS ---------------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Budget (FY)"
          value={`₹${(stats.totalBudget / 100000).toFixed(1)}L`}
          icon={ArrowUpRight}
          color="bg-green-50"
          iconColor="text-green-700"
        />

        <StatCard
          title="YTD Spend"
          value={`₹${(stats.totalSpent / 100000).toFixed(2)}L`}
          icon={CreditCard}
          color="bg-green-50"
          iconColor="text-green-500"
        />

        <StatCard
          title="Active Requests"
          value={String(stats.activeRequests ?? 0)}
          icon={Clock}
          color="bg-amber-50"
          iconColor="text-amber-500"
        />

        <StatCard
          title="Finance Review Pending"
          value={String(stats.financeReviewPending ?? 0)}
          icon={FileText}
          color="bg-slate-100"
          iconColor="text-slate-700"
        />
      </div>

      {/* ---------------- CHART + PIPELINE ---------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">

        {/* Spend Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Monthly Spend Trend</h3>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: "#64748b" }} />
                <YAxis tick={{ fill: "#64748b" }} />
                <Tooltip />
                <Bar
                  dataKey="spend"
                  fill="#009d00"
                  barSize={40}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pipeline */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Pipeline Status</h3>

          <div className="space-y-4">

            <div className="p-4 bg-slate-50 rounded-lg border flex justify-between">
              <div>
                <h4 className="text-sm font-semibold">Finance Review</h4>
                <p className="text-xs text-slate-600">Awaiting FM approval</p>
              </div>
              <span className="text-2xl font-bold text-slate-700">{pendingFinance}</span>
            </div>

            <div className="p-4 bg-green-50 rounded-lg border flex justify-between">
              <div>
                <h4 className="text-sm font-semibold text-green-900">Payment Processing</h4>
                <p className="text-xs text-green-700">Payment in progress</p>
              </div>
              <span className="text-2xl font-bold text-green-700">{paymentProcessing}</span>
            </div>

            <div className="p-4 bg-green-100 rounded-lg border flex justify-between">
              <div>
                <h4 className="text-sm font-semibold text-green-900">Completed</h4>
                <p className="text-xs text-green-800">Paid & Verified</p>
              </div>
              <span className="text-2xl font-bold text-green-800">{completed}</span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
