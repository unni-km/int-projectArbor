import express from 'express';
import poolPromise from '../db.js';

const router = express.Router();

// GET all vendors
router.get("/", async (req, res) => {
  try {
    const pool = await poolPromise;
    const [rows] = await pool.execute("SELECT * FROM vendors");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Error fetching vendors", details: err.message });
  }
});

// POST new vendor
router.post("/add", async (req, res) => {
  console.log(req.body);
  const { name, contact, email,asset } = req.body;
  if (!name || !contact || !email) {
    return res.status(400).json({ error: "Name, contact, and email are required" });
  }

  try {
    const pool = await poolPromise;
    await pool.execute(
      "INSERT INTO vendors (name, contact, email,asset, created_at) VALUES (?, ?, ?,?, NOW())",
      [name, contact, email,asset]
    );
    res.status(201).json({ message: "Vendor added successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error adding vendor", details: err.message });
  }
});

export default router;
