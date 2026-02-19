import express from 'express';
import poolPromise from '../db.js';

const router = express.Router();

// GET all items
router.get("/", async (req, res) => {
  try {
    const pool = await poolPromise;
    const [rows] = await pool.execute("SELECT id, name, unit,asset FROM item");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Error fetching items", details: err.message });
  }
});

// POST new item
router.post("/add", async (req, res) => {
  const { name, unit,asset,code,gst_id } = req.body;

  console.log(req.body);

  if (!name || !unit ) {
    return res.status(400).json({ error: "Name,unit and code are required" });
  }

  try {
    const pool = await poolPromise;
    await pool.execute("INSERT INTO item (name, unit,asset,item_code,gst_id) VALUES (?, ?,?,?,?)", [name, unit,asset,code||null,gst_id]);
    res.status(201).json({ message: "Item added successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error adding item", details: err.message });
  }
});

router.post("/addmod", async (req, res) => {
  
  const { itemId, modelName } = req.body;

  console.log(req.body);

  if (!itemId || !modelName) {
    return res.status(400).json({ error: "Name and Model are required" });
  }

  try {
    const pool = await poolPromise;
    await pool.execute("INSERT INTO item_model (item_id,model) VALUES (?,?)", [itemId,modelName]);
    res.status(201).json({ message: "model added successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error adding model", details: err.message });
  }
});

router.get("/model", async (req, res) => {
  
  try {
    const pool = await poolPromise;
    const [rows] = await pool.execute("SELECT * FROM item_model");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Error fetching items", details: err.message });
  }
});

// GET /gst
router.get("/gst", async (req, res) => {
  const pool = await poolPromise;
  const [rows] = await pool.query(
    "SELECT gst_id, gst_rate FROM gst_master WHERE is_active = 1 ORDER BY gst_rate"
  );
  res.json(rows);
});

export default router;
