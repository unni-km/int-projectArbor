// src/modules/expense/components/ExpenseSidebar.jsx
import React from "react";
import { AiFillHome } from "react-icons/ai";
import { FaClipboardList, FaMoneyBillWave } from "react-icons/fa";

const ExpenseSidebar = ({ view, setView }) => {
  const roleId = parseInt(
    localStorage.getItem("roleid") || localStorage.getItem("role_id"),
    10
  );

  const menuItems = [
    { key: "dashboard", label: "Dashboard", icon: <AiFillHome size={20} /> },
    { key: "list", label: "Requests", icon: <FaClipboardList size={20} /> },
  ];

  // Admin – show Budget Overview
  if (roleId === 40) {
    menuItems.push({
      key: "budget",
      label: "Budget Overview",
      icon: <FaMoneyBillWave size={20} />,
    },{
      key: "Workflow",
      label: "Workflow Control",
      icon: <FaClipboardList size={20} />,
    });
  }

  return (
    <nav className="fixed top-[56px] left-0 bg-white text-gray-700 w-64 h-screen p-6 shadow-lg flex flex-col gap-6 font-semibold overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
      <ul className="space-y-4">
        {menuItems.map((item) => (
          <li
            key={item.key}
            className={`p-3 rounded-xl flex items-center gap-3 text-lg cursor-pointer transition-all duration-200 ${
              view === item.key
                ? "bg-[#56a802] text-white shadow-md"
                : "hover:bg-[#56a802] hover:text-white"
            }`}
            onClick={() => setView(item.key)}
          >
            {item.icon}
            {item.label}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default ExpenseSidebar;
