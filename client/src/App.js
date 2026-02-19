import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login" 
import Home from "./pages/Home";
import PrivateRoute from "./pages/PrivateRoute";
import Inventory from "./pages/Inventory"
import Transactions from "./pages/Transactions";
import ApproveTransaction from "./pages/Approval";
import RejectRequest from "./pages/Rejection";
import 'react-confirm-alert/src/react-confirm-alert.css';
import Register from "./pages/Register"
import HomePage from "./pages/HomePage";
import VisitorDashboard from "./pages/VisitorDashboard";
import IdCardList from "./components/IdCardList";
import ActiveVisitors from "./pages/Visitor";
import UserManagement from "./pages/UserManagement";
import AssetHome from "./pages/HomePageAsset";
import AddAsset from "./components/AddAsset";
import AssetList from "./pages/Asset";
import StaffPage from "./pages/Staff";
import TransactionTable from "./pages/AssetTransactions";
import LocationPage from "./pages/LocationPage";
import ExpenseModule from "./pages/ExpenseModule";


function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<PrivateRoute> 
            <Home />
          </PrivateRoute>
           
              
            } />
          <Route path="/inventory" element={<PrivateRoute> <Inventory /></PrivateRoute>} />
          <Route path="/transactions" element={<PrivateRoute> <Transactions /></PrivateRoute>} />
          <Route path="/approve-request/:id" element={<ApproveTransaction />} />
          <Route path="/reject-request/:id" element={<RejectRequest />} />
          <Route path="/register" element={<PrivateRoute><Register /></PrivateRoute>} />
           <Route path="/homepage" element={<PrivateRoute> 
            <HomePage />
          </PrivateRoute>}/>

 <Route path="/visitor" element={<PrivateRoute> 
            <VisitorDashboard/>
          </PrivateRoute>}/>
 <Route path="/idcard" element={<PrivateRoute> 
            <IdCardList/>
          </PrivateRoute>}/>

<Route path="/active" element={<PrivateRoute> 
            <ActiveVisitors/>
          </PrivateRoute>}/>

          <Route path="/users" element={<PrivateRoute> 
            <UserManagement/>
          </PrivateRoute>}/>
            <Route path="/assethome" element={<PrivateRoute> 
            <AssetHome/>
          </PrivateRoute>}/>
          
         <Route path="/addasset" element={<PrivateRoute> 
            <AddAsset />
          </PrivateRoute>}/>
           <Route path="/asset" element={<PrivateRoute> 
            <AssetList />
          </PrivateRoute>}/>

                     <Route path="/staff" element={<PrivateRoute> 
            <StaffPage />
          </PrivateRoute>}/>

               <Route path="/assettransactions" element={<PrivateRoute> 
            <TransactionTable />
          </PrivateRoute>}/>

     <Route path="/location" element={<PrivateRoute> 
            <LocationPage />
          </PrivateRoute>}/>

          <Route path="/expense" element={<PrivateRoute> 
            <ExpenseModule />
          </PrivateRoute>}/>

        </Routes>
      </BrowserRouter>
      
    </div>
  );
}

export default App;
