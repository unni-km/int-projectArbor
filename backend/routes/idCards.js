import express from 'express';
import poolPromise from '../db.js';

const router = express.Router();

// GET all ID cards
router.get("/", async (req, res) => {
  try {
    const pool = await poolPromise;
    const [rows] = await pool.execute(
      "SELECT card_id, card_number, serial_no, status, created_date, created_by, updated_by, updated_at, is_active FROM id_cards where status=0"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Error fetching ID cards", details: err.message });
  }
});

// POST new ID card
router.post("/add", async (req, res) => {
  const { card_number, serial_no, userid } = req.body;

  if (!card_number || !serial_no || !userid) {
    return res.status(400).json({ error: "card_number, serial_no, and created_by are required" });
  }
  try {
    const pool = await poolPromise;
    await pool.execute(
      `INSERT INTO id_cards 
      (card_number, serial_no, status, created_date, created_by, is_active) 
      VALUES (?, ?, 0, NOW(), ?, 1)`,
      [card_number, serial_no, userid]
    );
    res.status(201).json({ message: "ID card added successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error adding ID card", details: err.message });
  }
});

// PUT /idcard/update/:id
router.put('/update/:id', async (req, res) => {
  const { id } = req.params;
  const { card_number, serial_no, userid } = req.body;
  try {
    const pool = await poolPromise;
    await pool.query(
      'UPDATE id_cards SET card_number=?, serial_no=?, updated_by=?, updated_at=NOW() WHERE card_id=?',
      [card_number, serial_no, userid, id]
    );
    res.json({ message: 'Card updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update card' });
  }
});


router.get("/cards", async (req, res) => {
  try {
    const pool = await poolPromise;
    const [rows] = await pool.execute(
      "SELECT card_id, card_number FROM id_cards where status=0 and is_active=1"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Error fetching ID cards", details: err.message });
  }
});


export default router;
