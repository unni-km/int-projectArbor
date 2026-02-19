import express from 'express';
const router = express.Router();

import poolPromise from '../db.js';
import multer from 'multer';
import path from 'path';
// Add staff

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/images/'),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

router.post('/add', upload.single('image'), async (req, res) => {
  try {
    const { StaffID, Name, Team, Location } = req.body;
    const PictureURL =req.file ? req.file.path.replace(/\\/g, '/') : null;

    if (!StaffID || !Name) {
      return res.status(400).json({ error: 'StaffID and Name are required' });
    }

    const pool = await poolPromise;

    await pool.query(
      `INSERT INTO staff (StaffID, Name, Team, Location, PictureURL)
       VALUES (?, ?, ?, ?, ?)`,
      [StaffID, Name, Team, Location, PictureURL]
    );

    // Return the created object
    res.status(201).json({
      StaffID,
      Name,
      Team,
      Location,
      PictureURL,
    });
  } catch (err) {
    console.error('Error adding staff:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get all staff
router.get('/', async (req, res) => {
  try {
    const pool = await poolPromise;
    const [rows] = await pool.query(`SELECT 
  s.StaffID,
  s.Name,
  s.Team,
  s.Location,
  s.PictureURL,
  l.Description
FROM staff s
LEFT JOIN location l ON s.Location = l.LocationID;
`);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching staff:', err);
    res.status(500).json({ error: 'Database error' });
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
      WHERE a.AssignedTo = ?
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

    const [asset] = await pool.query('SELECT AssignedTo FROM asset WHERE AssetID = ?', [assetId]);
    const assignedTo = asset[0]?.AssignedTo;

    await pool.query('UPDATE asset SET AssignedTo = NULL, LocationID =9, updated_by = ? WHERE AssetID = ?', [userid || null,assetId]);

    await pool.query(`
      INSERT INTO asset_transactions (asset_id, employee_id, action, remarks, transaction_date, created_by, LocationID)
      VALUES (?, ?, 'UNASSIGN', 'Asset unassigned', NOW(), ?, 1)
    `, [assetId, assignedTo, userid]);

    res.json({ message: 'Asset unassigned successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error unassigning asset', error: error.message });
  }
});

// Update staff
router.put('/update/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { StaffID, Name, Team, Location } = req.body;
    const PictureURL = req.file ? req.file.path.replace(/\\/g, '/') : null;

    const pool = await poolPromise;

    // Get existing record
    const [existing] = await pool.query(`SELECT * FROM staff WHERE StaffID = ?`, [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Staff not found' });
    }

    // Build dynamic update query
    const updateFields = [];
    const values = [];

    if (StaffID) { updateFields.push('StaffID = ?'); values.push(StaffID); }
    if (Name) { updateFields.push('Name = ?'); values.push(Name); }
    if (Team) { updateFields.push('Team = ?'); values.push(Team); }
    if (Location) { updateFields.push('Location = ?'); values.push(Location); }
    if (PictureURL) { updateFields.push('PictureURL = ?'); values.push(PictureURL); }

    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No fields provided to update.' });
    }

    values.push(id);

    const query = `UPDATE staff SET ${updateFields.join(', ')} WHERE StaffID = ?`;

    await pool.query(query, values);

    res.json({ message: 'Staff updated successfully.' });
  } catch (err) {
    console.error('Error updating staff:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

router.delete('/delete/:id', async (req, res) => {
  const { id } = req.params;
  console.log('deete meth');
  try {
    const pool = await poolPromise;
    await pool.query('DELETE FROM staff WHERE StaffID = ?', [id]);
    res.json({ message: 'staff deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});


export default router;
