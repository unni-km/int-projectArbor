import React, { useEffect, useState } from 'react';
import Dashboard from "../components/Dashboard";
import AdminApproval from "../components/AdminPrompt";



function Home() {

 const [showAdminPopup, setShowAdminPopup] = useState(false);
  const [dashboardRefreshKey, setDashboardRefreshKey] = useState(0); 

useEffect(() => {
   const role = parseInt(localStorage.getItem('roleid'), 10);
  if (role ===40) {
    setShowAdminPopup(true);
  }
}, []);
 const handleCloseAdminPopup = () => {
    setShowAdminPopup(false);
    setDashboardRefreshKey(prev => prev + 1); // trigger Dashboard re-fetch
  };


  return (
    <div>
      <Dashboard key={dashboardRefreshKey} />
   {showAdminPopup && (
  <AdminApproval onClose={handleCloseAdminPopup} />
)}

    </div>
  
  );
}

export default Home;
