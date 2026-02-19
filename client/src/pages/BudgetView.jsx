// src/modules/expense/pages/BudgetView.jsx
import React from "react";

const BudgetView = () => {
  // Later: fetch from /budget. For now just placeholder.
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <h2 className="text-lg font-bold mb-3 text-gray-800">Budget Overview</h2>
      <p className="text-sm text-gray-500">
        Hook this up to your budgets table to show Allocated vs Spent vs Committed.
      </p>
    </div>
  );
};

export default BudgetView;
