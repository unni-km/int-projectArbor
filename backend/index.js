import express from 'express';
import cors from 'cors';

import loginRoutes from './routes/login.js';
import inventoryRoutes from './routes/inventory.js';
import itemsRoutes from './routes/items.js';
import vendorsRoutes from './routes/vendors.js';
import invoiceRoutes from './routes/invoice.js'
import transactionRoutes from './routes/transactions.js';
import idCardRoutes from './routes/idCards.js';
import visitorRoutes from './routes/visitor.js';
import assetRoutes from './routes/asset.js';
import staffRoutes from './routes/staff.js';
import locationRoutes from './routes/location.js'
import barcodeRoutes from './routes/barcode.js'
import expenseRoutes from './routes/expense.js'
import dotenv from 'dotenv';



dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));


// Routes
app.use('/login', loginRoutes);
app.use('/inventory', inventoryRoutes);
app.use('/items', itemsRoutes);
app.use('/vendors', vendorsRoutes);
app.use('/invoice', invoiceRoutes);
app.use("/transactions", transactionRoutes);
app.use('/idcard', idCardRoutes);
app.use('/visitor', visitorRoutes);
app.use('/asset', assetRoutes);
app.use('/staff', staffRoutes);
app.use('/locations', locationRoutes);
app.use('/barcode', barcodeRoutes);
app.use('/expense', expenseRoutes);

app.get("/", (req, res) => {
  res.send("Server running...");
});
const port=process.env.PORT;
app.listen(port, () => {
  console.log("Server is running on port 8800");
});
