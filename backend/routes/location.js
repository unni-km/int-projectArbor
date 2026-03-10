import express from 'express';
import poolPromise from '../db.js';

const router = express.Router();

// GET all vendors
router.get("/", async (req, res) => {
  try {
    const pool = await poolPromise;
    const [rows] = await pool.execute("SELECT * FROM location");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Error fetching vendors", details: err.message });
  }
});

router.get('/:id/assets', async (req, res) => {
  const staffId = req.params.id;
  try {
    const pool = await poolPromise;
    const [rows] = await pool.query(`
      SELECT a.AssetID, a.AssetCode, i.name AS item_name, a.SerialNumber
      FROM asset a
      JOIN item i ON a.item_id = i.id
      WHERE a.LocationID = ?
    `, [staffId]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching staff assets', error: error.message });
  }
});

router.put('/unassign/:assetId', async (req, res) => {
  const { assetId } = req.params;
  const { userid } = req.body;

  try {
    const pool = await poolPromise;

    // 1️⃣ Fetch current assignment and location info
    const [rows] = await pool.query(
      'SELECT AssignedTo, LocationID FROM asset WHERE AssetID = ?',
      [assetId]
    );

    if (!rows.length) {
      return res.status(404).json({ message: 'Asset not found' });
    }

    const { AssignedTo, LocationID } = rows[0];

    // 2️⃣ Update asset table — remove assignment and location
    await pool.query(
      'UPDATE asset SET AssignedTo = NULL, LocationID =9, updated_by = ? WHERE AssetID = ?',
      [userid || null, assetId]
    );

    // 3️⃣ Log unassignment into transactions (keep old location for record)
    await pool.query(
      `INSERT INTO asset_transactions (
        asset_id, employee_id, action, remarks, transaction_date, created_by, LocationID
      ) VALUES (?, ?, 'UNASSIGN', 'Asset unassigned and removed from location', NOW(), ?, ?)
      `,
      [assetId, AssignedTo || null, userid || null, LocationID || null]
    );

    res.json({ message: 'Asset unassigned successfully and removed from location' });
  } catch (error) {
    console.error('Error unassigning asset:', error);
    res.status(500).json({
      message: 'Error unassigning asset',
      error: error.message
    });
  }
});

router.delete('/delete/:id', async (req, res) => {
  const { id } = req.params;
  console.log('deete meth');
  try {
    const pool = await poolPromise;
    await pool.query('DELETE FROM location WHERE LocationID = ?', [id]);
    res.json({ message: 'staff deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});


// UPDATE location
router.put('/update/:id', async (req, res) => {
  const { id } = req.params;
  const { LocationName, Description } = req.body;

  try {
    const pool = await poolPromise;

    // 1️⃣ Check if location exists
    const [existing] = await pool.query(
      'SELECT * FROM location WHERE LocationID = ?',
      [id]
    );

    if (!existing.length) {
      return res.status(404).json({ message: 'Location not found' });
    }

    // 2️⃣ Update location
    await pool.query(
      `UPDATE location 
       SET LocationCode = ?, 
           Description = ?
       WHERE LocationID = ?`,
      [LocationName, Description, id]
    );

    // 3️⃣ Fetch updated record to return
    const [updatedLocation] = await pool.query(
      'SELECT * FROM location WHERE LocationID = ?',
      [id]
    );

    res.json(updatedLocation[0]);

  } catch (err) {
    console.error('Error updating location:', err);
    res.status(500).json({
      error: 'Error updating location',
      details: err.message
    });
  }
});


export default router;