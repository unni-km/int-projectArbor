import React, { useEffect, useState } from 'react';
import Navbar from '../components/NavbarAsset';
import '../components/Dashboard.css';
import AssetByTypeChart from '../components/AssetChart';
import axios from 'axios';

function AssetHome() {
  const [data, setdata] = useState([]);
  const baseURL = process.env.REACT_APP_API_BASE_URL;
    useEffect(() => {
    axios.get(`${baseURL}/asset/type-summary`) // Your API endpoint
      .then(res => setdata(res.data))
      .catch(err => console.error('Failed to load chart data', err));
  }, [baseURL]);


  return (
    <div>
      <Navbar />
       <div className="p-6">
      <AssetByTypeChart data={data} />
    </div>
    </div>
  );
}

export default AssetHome;
