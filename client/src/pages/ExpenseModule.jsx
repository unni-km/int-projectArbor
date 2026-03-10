import React, { useState } from "react";
import ExpenseSidebar from "../components/ExpenseSidebar";
import ExpenseDashboard from "../components/ExpenseDashboard";

import RequestList from "./RequestList";
import RequestDetail from "./RequestDetail";
import BudgetView from "./BudgetView";
import Navbar from "../components/NavExpense";
import WorkflowConfig from "./WorkflowConfig";

export default function ExpenseModule() {
  const [view, setView] = useState("dashboard");
  const [selectedRequestId, setSelectedRequestId] = useState(null);

  // Same width as Dashboard (fixes alignment issue)
const ContentWrapper = ({ children }) => (
  <div className="w-full px-6">{children}</div>
);
  return (
    <div className="flex">

      {/* Top fixed header */}
      <Navbar />

      {/* Sidebar fixed left */}
      <ExpenseSidebar view={view} setView={setView} />

      {/* Main content */}
<main className="ml-64 mt-16 p-6 w-full h-[calc(100vh-64px)] bg-gray-50 overflow-hidden">

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

        {view === "Workflow" && (
          <ContentWrapper>
            <WorkflowConfig
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
