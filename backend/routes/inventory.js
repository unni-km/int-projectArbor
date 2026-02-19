import express from 'express';
import poolPromise from '../db.js';
import sendEmail from '../sentemail.js';

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const pool = await poolPromise;
    const [rows] = await pool.query(`
      SELECT 
        inv.id, inv.item_id, itm.name AS item_name, inv.quantity, inv.unit, inv.unit_price,
        inv.vendor_id, ven.name AS vendor_name,  CONVERT_TZ(inv.created_at, '+00:00', '+05:30') AS created_at, inv.userid, inv.invoice_id,
        usr.username AS user_name, invo.invoice_no, invo.invoice_file_path,inv.purchase_date
      FROM m_inventory inv
      JOIN item itm ON inv.item_id = itm.id
      LEFT JOIN vendors ven ON inv.vendor_id = ven.id
      LEFT JOIN users usr ON inv.userid = usr.id
      LEFT JOIN invoice invo ON inv.invoice_id = invo.id
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

router.get("/summary", async (req, res) => {
  try {
    const pool = await poolPromise;
    const [rows] = await pool.query(`
      SELECT i.name AS name, SUM(m.quantity) AS total_quantity, i.unit
      FROM m_inventory m
      JOIN item i ON m.item_id = i.id
      GROUP BY i.name, i.unit
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

router.post('/add', async (req, res) => {
  try {
    const {
      item_id,
      quantity,
      unit,
      unit_price,
      vendor_id,
      userid,
      invoice_id,
      purchase_date,
      isasset
    } = req.body;

    const pool = await poolPromise;
    const conn = await pool.getConnection();
    await conn.beginTransaction();

    try {
  
      const [inventoryResult] = await conn.query(
        `INSERT INTO m_inventory 
         (item_id, quantity, unit, unit_price, vendor_id, userid, invoice_id, purchase_date)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [item_id, quantity, unit, unit_price, vendor_id, userid, invoice_id, purchase_date]
      );

      const inventoryId = inventoryResult.insertId;
    
     
      if (parseInt(isasset) === 1) {

        const created_date = new Date();
        const assetInsertPromises = [];

        for (let i = 1; i <= quantity; i++) {

                const [itemRows] = await pool.query(
      "SELECT item_code FROM item WHERE id = ?",
      [item_id]
    );

      if (!itemRows.length) {
      return res.status(400).json({ message: "Invalid itemId" });
    }

    const itemCode = itemRows[0].item_code;

     const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0"); 
    const yearMonth = `${year}${month}`; 

    const prefix = `IND/${yearMonth}/${itemCode}`;


const [seqRow] = await pool.query(`SELECT seq FROM asset_sequence WHERE id = 1`);

let nextSeq = seqRow[0].seq + 1;


await pool.query(`UPDATE asset_sequence SET seq = ? WHERE id = 1`, [nextSeq]);


const sequence = String(nextSeq).padStart(4, "0");

 const assetTagId = `${prefix}/${sequence}`;
   

          const assetData = [
            assetTagId,           // AssetCode
            null,                // Description (to be filled later)
            null,                // TypeID
            null,                // SubClassID
            null,                // SerialNumber
            null,                // PictureURL
            vendor_id || null,   // SupplierID (optional)
            purchase_date || null, // PurchaseDate
            1,                   // IsPurchased
            unit_price || 0,     // InitialValue
            null,                // DepreciationStartDate
            null,                // NumberOfYears
            null,                // DepreciationRate
            null,                // CurrentValue
            null,                // DepreciationEndDate
            null,                // LocationID
            null,                // AssignedTo
            0,                   // WriteOff
            null,                // WriteOffReason
            null,                // DeptID
            null,                // wifi_mac_address
            null,                // ethernet_mac_address
            item_id,             // item_id
            created_date,        // created_date
            inventoryId          // ✅ Foreign key link to m_inventory.id
          ];

          assetInsertPromises.push(
            conn.query(
              `INSERT INTO asset 
                (AssetCode, Description, TypeID, SubClassID, SerialNumber, PictureURL, SupplierID, PurchaseDate,
                 IsPurchased, InitialValue, DepreciationStartDate, NumberOfYears, DepreciationRate, CurrentValue,
                 DepreciationEndDate, LocationID, AssignedTo, WriteOff, WriteOffReason, DeptID,
                 wifi_mac_address, ethernet_mac_address, item_id, created_date, inventory_id)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              assetData
            )
          );
        }

        await Promise.all(assetInsertPromises);
      }

      await conn.commit();

      res.status(200).json({
        message: 'Stock added successfully',
        isAsset: !!isasset,
      });
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  } catch (err) {
    console.error('Error adding stock:', err);
    res.status(500).json({ error: err.message });
  }
});


router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await poolPromise;
    await pool.query('DELETE FROM m_inventory WHERE id = ?', [id]);
    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const {
    item_id, quantity, unit, unit_price,
    vendor_id, invoice_id, userid, purchase_date,
  } = req.body;

  try {
    const pool = await poolPromise;
    await pool.query(`
      UPDATE m_inventory SET
        item_id = ?, quantity = ?, unit = ?, unit_price = ?,
        vendor_id = ?, invoice_id = ?,purchase_date = ?, userid = ?
      WHERE id = ?`,
      [item_id, quantity, unit, unit_price, vendor_id, invoice_id, purchase_date, userid, id]
    );

    res.json({ message: 'Item updated' });
  } catch (err) {
    res.status(500).json({ error: err.message, details: err.message });
  }
});

router.post('/move-to-pantry', async (req, res) => {
  const { inventoryIds, userId, quantityMap, roleid } = req.body;
  const pool = await poolPromise;

  console.log("Received move-to-pantry request:", req.body);

  try {
    if (!Array.isArray(inventoryIds) || typeof quantityMap !== 'object') {
      return res.status(400).json({ error: 'Invalid data format' });
    }

    const [userRows] = await pool.query(
      `SELECT username FROM users WHERE id = ?`,
      [userId]
    );
    const username = userRows[0]?.username || `User ${userId}`;

    const movedItems = [];
    const requestIds = [];

    const isAdmin = parseInt(roleid, 10) === 40;

    for (const id of inventoryIds) {
      const [[invRow]] = await pool.query(
        `SELECT quantity, item_id FROM m_inventory WHERE id = ?`,
        [id]
      );

      if (!invRow) {
        return res.status(400).json({ error: `Inventory item with id ${id} not found.` });
      }

      const [[itemRow]] = await pool.query(
        `SELECT name FROM item WHERE id = ?`,
        [invRow.item_id]
      );

      const itemName = itemRow?.name || `Item ${invRow.item_id}`;
      const movedQuantity = quantityMap[id] || invRow.quantity;

      if (isAdmin && movedQuantity > invRow.quantity) {
        return res.status(400).json({ error: `Not enough stock for item ID ${id}. Available: ${invRow.quantity}, Requested: ${movedQuantity}` });
      }

      // Insert transaction record
      const [insertResult] = await pool.query(
        `INSERT INTO inventory_transactions 
         (inventory_id, user_id, transaction_type, quantity, status)
         VALUES (?, ?, ?, ?, ?)`,
        [id, userId, 'MOVE_TO_PANTRY', movedQuantity, isAdmin ? 'Approved' : 'pending']
      );

      const transactionId = insertResult.insertId;
      movedItems.push({ itemName, quantity: movedQuantity });
      requestIds.push(transactionId);

      // Reduce stock only if admin
      if (isAdmin) {
       const t= await pool.query(
          `UPDATE m_inventory SET quantity = quantity - ? WHERE id = ?`,
          [movedQuantity, id]
        );
      }
    }

    if (!isAdmin) {
      // Send email for approval
      let html = `<p><strong>${username}</strong> requested to move the following items to the pantry:</p><ul>`;
      movedItems.forEach((item, index) => {
        const transactionId = requestIds[index];
        html += `
          <li>
            Item: ${item.itemName}, Quantity: ${item.quantity} <br/>
            <a href="http://localhost:3000/approve-request/${transactionId}" 
               style="display:inline-block; padding:6px 12px; margin:5px 5px 0 0; background-color:#28a745; color:white; text-decoration:none; border-radius:4px;">
              Approve
            </a>
            <a href="http://localhost:3000/reject-request/${transactionId}" 
               style="display:inline-block; padding:6px 12px; margin:5px 0 0 0; background-color:#dc3545; color:white; text-decoration:none; border-radius:4px;">
              Reject
            </a>
          </li>`;
      });
      html += `</ul>`;

      await sendEmail('smita.panangavil@arbor-education.com', 'Pantry Move Notification', "", html);
    }

    res.status(200).json({ 
      message: isAdmin 
        ? 'Items moved to pantry' 
        : 'Request sent for admin approval',
      status: isAdmin ? 'approved' : 'pending'
    });

  } catch (err) {
    console.error('Error in move-to-pantry:', err);
    res.status(500).json({ error: 'Error moving items', details: err.message });
  }
});

export default router;
