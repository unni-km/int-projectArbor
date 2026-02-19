import React, { useState } from "react";
import ExpenseHeader from "../components/ExpenseHeader";
import ExpenseSidebar from "../components/ExpenseSidebar";
import ExpenseDashboard from "../components/ExpenseDashboard";

import RequestList from "./RequestList";
import RequestDetail from "./RequestDetail";
import BudgetView from "./BudgetView";

export default function ExpenseModule() {
  const [view, setView] = useState("dashboard");
  const [selectedRequestId, setSelectedRequestId] = useState(null);

  // Same width as Dashboard (fixes alignment issue)
  const ContentWrapper = ({ children }) => (
    <div className="mx-auto w-full max-w-[1400px]">{children}</div>
  );

  return (
    <div className="flex">

      {/* Top fixed header */}
      <ExpenseHeader />

      {/* Sidebar fixed left */}
      <ExpenseSidebar view={view} setView={setView} />

      {/* Main content */}
      <main className="ml-64 mt-[56px] p-6 w-full min-h-screen bg-gray-50">

        {/* DASHBOARD */}
        {view === "dashboard" && (
          <ContentWrapper>
            <ExpenseDashboard />
          </ContentWrapper>
        )}

        {/* REQUEST LIST */}
        {view === "list" && (
          <ContentWrapper>
            <RequestList
              onSelect={(id) => {
                setSelectedRequestId(id);
                setView("detail");
              }}
              onCreate={() => setView("new")}
            />
          </ContentWrapper>
        )}

        {/* REQUEST DETAIL */}
        {view === "detail" && selectedRequestId && (
          <ContentWrapper>
            <RequestDetail
              expenseId={selectedRequestId}
              onBack={() => setView("list")}
            />
          </ContentWrapper>
        )}

 

        {/* BUDGET VIEW */}
        {view === "budget" && (
          <ContentWrapper>
            <BudgetView />
          </ContentWrapper>
        )}

      </main>
    </div>
  );
}
