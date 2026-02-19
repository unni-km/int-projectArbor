import React from 'react';
import Navbar from './Navbar';
import './Dashboard.css';
import InventoryChart from './InventoryChart';

function Dashboard() {

  return (
    <div>
      <Navbar />
      <div className="dashboard-buttons">
       <InventoryChart />
      </div>
    </div>
  );
}

export default Dashboard;
