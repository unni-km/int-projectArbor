// src/modules/expense/components/ExpenseHeader.jsx
import React from "react";

const ExpenseHeader = () => {
  const username = localStorage.getItem("username") || "User";

  return (
    <header className="fixed top-0 left-0 right-0 h-[56px] bg-white shadow flex items-center justify-between px-6 z-40">
      <div className="flex items-center gap-2">
        <span className="font-bold text-lg text-gray-700">Expense Manager</span>
        <span className="text-xs text-gray-400">• Procurement & Payments</span>
      </div>
      <div className="text-sm text-gray-600">
        Logged in as: <span className="font-semibold">{username}</span>
      </div>
    </header>
  );
};

export default ExpenseHeader;
