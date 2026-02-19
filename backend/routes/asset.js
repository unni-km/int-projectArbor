import express from 'express';
import poolPromise from '../db.js';

const router = express.Router();

// GET /active-visitors


router.get("/", async (req, res) => {
  try {
    const pool = await poolPromise;
    const [rows] = await pool.execute(
      `
      SELECT 
    a.*, 
    i.name AS item_name, 
    s.Name AS staff_name,
    l.Description AS LocationCode,
    inv.invoice_no, 
    inv.invoice_file_path,
    m.model,
    CASE 
        WHEN a.last_verified_at IS NULL 
             THEN 1 
        WHEN a.last_verified_at <= DATE_SUB(NOW(), INTERVAL 6 MONTH) 
             THEN 1
        ELSE 0
    END AS is_unverified,
    u.username

FROM asset a 
LEFT JOIN item i ON a.item_id = i.id
LEFT JOIN staff s ON a.AssignedTo = s.StaffID
LEFT JOIN location l ON a.LocationID = l.LocationID
LEFT JOIN invoice inv ON a.InvoiceID = inv.id
LEFT JOIN item_model m ON a.model_id = m.id
LEFT JOIN users u ON a.last_verified_by= u.id
WHERE a.is_deleted = 0
ORDER BY a.created_date DESC;
`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Error fetching assets", details: err.message });
  }
});


router.get('/items', async (req, res) => {
    try {
        const pool = await poolPromise;
        const [rows] = await pool.query(`SELECT id, name FROM item where asset=1`);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching items:', error);
        res.status(500).json({ message: 'Error fetching items' });
    }
});

router.get('/assettypes', async (req, res) => {
    try {
        const pool = await poolPromise;
        const [rows] = await pool.query('SELECT TypeID, Description FROM assettype');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching asset types:', error);
        res.status(500).json({ message: 'Error fetching asset types' });
    }
});
router.post('/add', async (req, res) => {
  console.log(req.body);
  const {
    itemId,
    modelId,
    assetTypeId,
    serialNo,
    idno,
    installedDate,
    wifiMacAddress,
    ethernetMacAddress,
    assignedTo,
    locationId,
    description,
    userid,
    invoiceId // ✅ new field
  } = req.body;

  try {
    const pool = await poolPromise;

      const [itemRows] = await pool.query(
      "SELECT item_code FROM item WHERE id = ?",
      [itemId]
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
   

    // ✅ Insert into asset table with InvoiceID
    const [result] = await pool.query(
      `INSERT INTO asset (
        item_id, TypeID, AssetCode, SerialNumber, ID_No,
        PurchaseDate, wifi_mac_address, ethernet_mac_address,
        AssignedTo, LocationID, Description, created_by, InvoiceID, model_id
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        itemId,
        assetTypeId,
        assetTagId,
        serialNo || null,
        idno || null,
        installedDate || null,
        wifiMacAddress || null,
        ethernetMacAddress || null,
        assignedTo || null,
        locationId || 9,
        description || null,
        userid || null,
        invoiceId || null, 
        modelId || null
      ]
    );

    const insertedAssetId = result.insertId;

    // ✅ Log to asset_transactions if assignedTo or locationId exists
    if (assignedTo || locationId) {
      const action = assignedTo ? 'ASSIGN' : 'LOCATION_ADD';
      const remarks = assignedTo
        ? 'Initial assignment to staff'
        : 'Added asset to location';

      await pool.query(
        `INSERT INTO asset_transactions (
          asset_id, employee_id, action, remarks,
          transaction_date, created_by, LocationID
        )
        VALUES (?, ?, ?, ?, NOW(), ?, ?)`,
        [
          insertedAssetId,
          assignedTo || null,
          action,
          remarks,
          userid || assignedTo || null,
          locationId || null
        ]
      );
    }

    res.status(201).json({
      message: 'Asset added successfully',
      assetId: insertedAssetId
    });
  } catch (error) {
    console.error('Error adding asset:', error);
    res.status(500).json({ message: 'Error adding asset' });
  }
});



router.put('/update/:id', async (req, res) => {
  console.log(req.body);
  const assetId = req.params.id;
  const {
    itemId,
    assetTypeId,
    assetTagId,
    serialNo,
    idno,
    installedDate,
    wifiMacAddress,
    ethernetMacAddress,
    assignedTo,
    locationId,
    description,
    userid,
    invoiceId
  } = req.body;

  try {
    const pool = await poolPromise;

    // Get existing asset
    const [existingRows] = await pool.query(`SELECT * FROM asset WHERE AssetID = ?`, [assetId]);
    if (!existingRows.length) return res.status(404).json({ message: 'Asset not found' });

    const existing = existingRows[0];

    // Create an object of new values
    const updated = {
      item_id: itemId,
      TypeID: assetTypeId,
      AssetCode: assetTagId,
      SerialNumber: serialNo,
      ID_No: idno,
      PurchaseDate: installedDate,
      wifi_mac_address: wifiMacAddress,
      ethernet_mac_address: ethernetMacAddress,
      AssignedTo: assignedTo,
      LocationID: locationId,
      Description: description,
      InvoiceID: invoiceId
    };

    // Compare old vs new → collect only changed fields (skip technical fields)
    const ignoredFields = ['updated_at', 'updated_by', 'created_by', 'created_date'];

    const changes = [];
    for (const key in updated) {
      if (ignoredFields.includes(key)) continue;

      const oldVal = existing[key] == null ? '' : String(existing[key]);
      const newVal = updated[key] == null ? '' : String(updated[key]);

      if (oldVal !== newVal) {
        changes.push({ field: key, old_value: oldVal, new_value: newVal });
      }
    }

    // 🛑 No meaningful changes → skip audit + update timestamp only
    if (changes.length === 0) {
      await pool.query(
        `UPDATE asset SET updated_by = ? WHERE AssetID = ?`,
        [userid, assetId]
      );
      return res.status(200).json({ message: 'No changes detected — asset unchanged.' });
    }

    // Proceed with actual update
    await pool.query(
      `UPDATE asset SET 
        item_id=?, TypeID=?, AssetCode=?, SerialNumber=?, ID_No=?, PurchaseDate=?, 
        wifi_mac_address=?, ethernet_mac_address=?, AssignedTo=?, LocationID=?, 
        Description=?, InvoiceID=?, updated_by=?
       WHERE AssetID=?`,
      [
        itemId,
        assetTypeId,
        assetTagId,
        serialNo,
        idno,
        installedDate,
        wifiMacAddress,
        ethernetMacAddress,
        assignedTo || null,
        locationId || existing.LocationID || null,
        description || null,
        invoiceId || null,
        userid,
        assetId
      ]
    );

    await pool.query(
      `INSERT INTO asset_audit_log (
        asset_id, item_id, TypeID, AssetCode, SerialNumber, ID_No, PurchaseDate,
        wifi_mac_address, ethernet_mac_address, AssignedTo, LocationID, Description,
        InvoiceID, updated_by, updated_at, changed_by, changed_at, change_action
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?, NOW(), 'UPDATE')`,
      [
        existing.AssetID,
        existing.item_id,
        existing.TypeID,
        existing.AssetCode,
        existing.SerialNumber,
        existing.ID_No,
        existing.PurchaseDate,
        existing.wifi_mac_address,
        existing.ethernet_mac_address,
        existing.AssignedTo,
        existing.LocationID,
        existing.Description,
        existing.InvoiceID,
        userid,
        userid
      ]
    );

    res.status(200).json({ message: 'Asset updated successfully', changes });
  } catch (error) {
    console.error('Error updating asset:', error);
    res.status(500).json({ message: 'Error updating asset' });
  }
});



router.get("/type-summary", async (req, res) => {
  try {
    const pool = await poolPromise;
    const [rows] = await pool.execute(
      `SELECT 
    i.name AS item_name,
    COUNT(*) AS total,
    SUM(CASE WHEN a.AssignedTo IS NOT NULL THEN 1 ELSE 0 END) AS assigned,
    SUM(CASE WHEN a.AssignedTo IS NULL THEN 1 ELSE 0 END) AS unassigned
FROM asset a
JOIN item i ON a.item_id = i.id
GROUP BY i.name;
`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Error fetching data", details: err.message });
  }
});

router.get("/transactions", async (req, res) => {
  try {
    const pool = await poolPromise;
    const [rows] = await pool.execute(
      `SELECT 
    t.transaction_id,
    a.item_id,
    i.name AS item_name,
    a.AssetCode,
    s.Name AS employee_name,
    t.action,
    t.remarks,
    t.transaction_date,
    u.username,
    l.Description AS location
FROM asset_transactions t
LEFT JOIN asset a ON t.asset_id = a.AssetID
LEFT JOIN item i ON a.item_id = i.id
LEFT JOIN staff s ON t.employee_id = s.StaffID
LEFT JOIN users u ON t.created_by = u.id
LEFT JOIN LOCATION l ON t.LocationID=l.LocationID
ORDER BY t.transaction_date DESC;
`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Error fetching data", details: err.message });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const { userId } = req.body;   // <-- GET USER ID

    const pool = await poolPromise;

    await pool.execute(`
      UPDATE asset
      SET 
        is_deleted = 1,
        deleted_at = NOW(),
        deleted_by = ?
      WHERE AssetID = ?
    `, [userId, req.params.id]);

    res.json({ message: "Asset soft-deleted successfully" });

  } catch (err) {
    res.status(500).json({ error: "Failed to delete", details: err.message });
  }
});



router.get('/audit/:assetId', async (req, res) => {
  try {
    const { assetId } = req.params;
    const pool = await poolPromise;

    // ✅ Preload staff names for quick ID-to-name lookup
    const [staffRows] = await pool.query(`SELECT StaffID, Name FROM staff`);
    const staffMap = Object.fromEntries(staffRows.map(s => [String(s.StaffID), s.Name]));
    const [locationRows] = await pool.query(`SELECT LocationID, Description FROM location`);
    const locationMap = Object.fromEntries(locationRows.map(s => [String(s.LocationID), s.Description]));
    const [invoiceRows] = await pool.query(`SELECT id, invoice_no FROM invoice`);
    const invoiceMap = Object.fromEntries(invoiceRows.map(s => [String(s.id), s.invoice_no]));



    // 1️⃣ Fetch all audit records (latest first)
    const [rows] = await pool.query(
      `
      SELECT a.*, u.username 
      FROM asset_audit_log a
      LEFT JOIN users u ON u.id = a.changed_by
      WHERE a.asset_id = ?
      ORDER BY a.changed_at DESC
      `,
      [assetId]
    );

    if (rows.length === 0) {
      return res.json([]);
    }

    const diffs = [];
    const ignoredFields = [
      'audit_id',
      'asset_id',
      'changed_at',
      'changed_by',
      'username',
      'change_action',
      'created_by',
      'created_date',
      'updated_by',
      'updated_at',
      'last_verified_by',
      'last_verified_at',
      'is_deleted',
      'model_id'

    ];

    // 2️⃣ Compare consecutive audit records
    for (let i = 0; i < rows.length - 1; i++) {
      const current = rows[i];
      const previous = rows[i + 1];
      const changedFields = [];

      for (const key in current) {
        if (ignoredFields.includes(key)) continue;

        const oldValue = previous[key] ?? '';
        const newValue = current[key] ?? '';

        if (String(oldValue) !== String(newValue)) {
          // ✅ Replace AssignedTo IDs with staff names
          let formattedOld = oldValue;
          let formattedNew = newValue;

          if (key === 'AssignedTo') {
            formattedOld = staffMap[oldValue] || oldValue || '-';
            formattedNew = staffMap[newValue] || newValue || '-';
          }
           if (key === 'LocationID') {
            formattedOld = locationMap[oldValue] || oldValue || '-';
            formattedNew = locationMap[newValue] || newValue || '-';
          }
           if (key === 'InvoiceID') {
            formattedOld = invoiceMap[oldValue] || oldValue || '-';
            formattedNew = invoiceMap[newValue] || newValue || '-';
          }

          changedFields.push({
            field: key,
            old_value: formattedOld,
            new_value: formattedNew
          });
        }
      }

      if (changedFields.length > 0) {
        diffs.push({
          audit_id: current.audit_id,
          asset_id: current.asset_id,
          changed_by: current.username || current.changed_by || 'Unknown',
          changed_at: current.changed_at,
          changed_fields: changedFields
        });
      }
    }

    // 3️⃣ Compare latest audit record with current asset state
    const [currentAssetRows] = await pool.query(
      `
      SELECT a.*, u.username 
      FROM asset a
      LEFT JOIN users u ON u.id = a.updated_by
      WHERE a.AssetID = ?
      `,
      [assetId]
    );

    const currentAsset = currentAssetRows[0];
    if (currentAsset) {
      const latestAudit = rows[0];
      const changedFields = [];

      for (const key in currentAsset) {
        if (ignoredFields.includes(key) || key === 'AssetID') continue;

        const oldValue = latestAudit[key] ?? '';
        const newValue = currentAsset[key] ?? '';

        if (String(oldValue) !== String(newValue)) {
          // ✅ Replace staff IDs with staff names again
          let formattedOld = oldValue;
          let formattedNew = newValue;

          if (key === 'AssignedTo') {
            formattedOld = staffMap[oldValue] || oldValue || '-';
            formattedNew = staffMap[newValue] || newValue || '-';
          }
           if (key === 'LocationID') {
            formattedOld = locationMap[oldValue] || oldValue || '-';
            formattedNew = locationMap[newValue] || newValue || '-';
          }
           if (key === 'InvoiceID') {
            formattedOld = invoiceMap[oldValue] || oldValue || '-';
            formattedNew = invoiceMap[newValue] || newValue || '-';
          }

          changedFields.push({
            field: key,
            old_value: formattedOld,
            new_value: formattedNew
          });
        }
      }

      if (changedFields.length > 0) {
        diffs.unshift({
          audit_id: latestAudit.audit_id,
          asset_id: latestAudit.asset_id,
          changed_by: currentAsset.username || 'System (Current State)',
          changed_at: currentAsset.updated_at || new Date(),
          changed_fields: changedFields
        });
      }
    }

    // 4️⃣ Handle initial case
    if (diffs.length === 0) {
      diffs.push({
        audit_id: rows[0].audit_id,
        asset_id: rows[0].asset_id,
        changed_by: rows[0].username || 'Unknown',
        changed_at: rows[0].changed_at,
        changed_fields: ['Initial update record (no previous comparison)']
      });
    }

    res.json(diffs);
  } catch (error) {
    console.error('Error fetching audit log:', error);
    res.status(500).json({ message: 'Error fetching audit log' });
  }
});

router.post('/by-code', async (req, res) => {
  const { code } = req.body;

  try {
    const pool = await poolPromise;
    const [rows] = await pool.query(
      `SELECT 
        a.*, 
        i.name AS item_name, 
        s.Name AS staff_name,
        l.Description AS LocationCode
       FROM asset a
       LEFT JOIN item i ON a.item_id = i.id
       LEFT JOIN staff s ON a.AssignedTo = s.StaffID
       LEFT JOIN location l ON a.LocationID = l.LocationID
       WHERE a.AssetCode = ?`,
      [code]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Asset not found' });
    }

    res.json(rows[0]);

  } catch (err) {
    console.error("Error fetching asset by code:", err);
    res.status(500).json({ message: "Server error fetching asset details" });
  }
});



router.post('/verify', async (req, res) => {
  const { code, verified_by } = req.body;

  if (!code) {
    return res.status(400).json({ message: 'Asset code is required' });
  }

  const pool = await poolPromise;

  try {
    // 1️⃣ Check if asset exists
    const [rows] = await pool.query(
      `SELECT AssetID FROM asset WHERE AssetCode = ?`,
      [code]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Asset not found' });
    }

    const assetId = rows[0].AssetID;

    // 2️⃣ Log verification
    await pool.query(
      `INSERT INTO asset_verifications (asset_id, verified_by)
       VALUES (?, ?)`,
      [assetId, verified_by]
    );

    // 3️⃣ Update asset status
    await pool.query(
      `UPDATE asset 
       SET last_verified_at = NOW(), last_verified_by = ?
       WHERE AssetID = ?`,
      [verified_by, assetId]
    );

    res.json({ message: 'Asset verified successfully', assetId });
  } catch (err) {
    console.error('Verification error:', err);
    res.status(500).json({ message: 'Server error verifying asset' });
  }
});

// POST /asset/unverify
router.post('/unverify', async (req, res) => {
  const { code, unverified_by } = req.body;

  if (!code) {
    return res.status(400).json({ message: 'Asset code is required' });
  }

  const pool = await poolPromise;

  try {
    // 1️⃣ Check if asset exists
    const [rows] = await pool.query(
      `SELECT AssetID FROM asset WHERE AssetCode = ?`,
      [code]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Asset not found' });
    }

    const assetId = rows[0].AssetID;

    // 2️⃣ Insert unverify log (recommended for history tracking)
    await pool.query(
      `INSERT INTO asset_verifications (asset_id, verified_by, is_unverify)
       VALUES (?, ?, 1)`,
      [assetId, unverified_by]
    );

    // 3️⃣ Update asset status to unverified
    await pool.query(
      `UPDATE asset 
       SET last_verified_at = NULL, last_verified_by = NULL
       WHERE AssetID = ?`,
      [assetId]
    );

    res.json({ message: 'Asset unverified successfully', assetId });
  } catch (err) {
    console.error('Unverify error:', err);
    res.status(500).json({ message: 'Server error unverifying asset' });
  }
});

router.post("/bulk-update", async (req, res) => {
  const { inventoryIds, invoice_id } = req.body;
console.log(req.body);
  if (!inventoryIds?.length || !invoice_id)
    return res.status(400).json({ error: "Missing fields" });

  try {
    const pool = await poolPromise;
    const placeholders = inventoryIds.map(() => "?").join(",");

    await pool.execute(
      `UPDATE asset
       SET InvoiceID = ?
       WHERE AssetID IN (${placeholders})`,
      [invoice_id, ...inventoryIds]
    );

    res.json({ message: "Updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Update failed", details: err.message });
  }
});

router.post('/add-note', async (req, res) => {
  const { code, note } = req.body;
  console.log(req.body);

  if (!code) {
    return res.status(400).json({ message: 'Asset code is required' });
  }

  if (!note || !note.trim()) {
    return res.status(400).json({ message: 'Note is empty' });
  }

  const pool = await poolPromise;

  try {
    // 1️⃣ Get asset ID
    const [assetRows] = await pool.query(
      `SELECT AssetID FROM asset WHERE AssetCode = ?`,
      [code]
    );

    if (assetRows.length === 0) {
      return res.status(404).json({ message: 'Asset not found' });
    }

    const assetId = assetRows[0].AssetID;

    // 2️⃣ Find latest verification entry
    const [verifications] = await pool.query(
      `
      SELECT id 
      FROM asset_verifications
      WHERE asset_id = ?
      ORDER BY verified_at DESC
      LIMIT 1
      `,
      [assetId]
    );

    if (verifications.length === 0) {
      return res.status(400).json({
        message: 'No verification found for this asset'
      });
    }

    const verificationId = verifications[0].id;

    // 3️⃣ Update notes
    await pool.query(
      `
      UPDATE asset_verifications SET notes = ? WHERE id = ?
      `,
      [note.trim(),verificationId]
    );

    res.json({ message: 'Note added successfully' });
  } catch (err) {
    console.error('Add note error:', err);
    res.status(500).json({ message: 'Server error adding note' });
  }
});

router.get('/verification-history/:assetId', async (req, res) => {
  const { assetId } = req.params;
  const pool = await poolPromise;

  try {
    const [rows] = await pool.query(`
      SELECT 
        av.verified_at,
        av.notes,
        av.is_unverify,
        u.username AS verified_by_name
      FROM asset_verifications av
      LEFT JOIN users u ON av.verified_by = u.id
      WHERE av.asset_id = ?
      ORDER BY av.verified_at DESC
    `, [assetId]);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to load verification history' });
  }
});





export default router;