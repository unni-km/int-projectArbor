import express from 'express';
import pool from '../db.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

// GET all transactions with joined user and item info
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        t.id,
        t.inventory_id,
        i.name AS item_name,
        u.username AS user_name,
        t.transaction_type,
        t.quantity,
        t.transaction_date,
        t.status
      FROM inventory_transactions t
    LEFT JOIN m_inventory inv ON t.inventory_id = inv.id
     LEFT JOIN item i ON inv.item_id = i.id
      LEFT JOIN users u ON t.user_id = u.id
      ORDER BY t.transaction_date DESC
    `);

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Error fetching transactions", details: err.message });
  }
});

router.post("/move", async (req, res) => {
  const { transactionIds, userId } = req.body;

  try {
    for (const id of transactionIds) {
      const [txResult] = await pool.query(`
        SELECT t.*, inv.item_id 
        FROM inventory_transactions t
        JOIN m_inventory inv ON t.inventory_id = inv.id
        WHERE t.id = ?
      `, [id]);

      const tx = txResult[0];
      if (!tx) continue;

      await pool.query(`
        UPDATE m_inventory SET quantity = quantity + ? WHERE id = ?
      `, [tx.quantity, tx.inventory_id]);

      await pool.query(`
        INSERT INTO inventory_transactions (inventory_id, user_id, transaction_type, quantity, status)
        VALUES (?, ?, 'MOVE_BACK_TO_INVENTORY', ?, 'Approved')
      `, [tx.inventory_id, userId, tx.quantity]);

      await pool.query(`DELETE FROM inventory_transactions WHERE id = ?`, [id]);
    }

    res.status(200).json({ message: "Items moved back successfully." });
  } catch (err) {
    res.status(500).json({ error: "Error moving items back", details: err.message });
  }
});

router.post('/:id/approve', async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

  try {
    const [users] = await pool.query("SELECT * FROM users WHERE username = 'unni'");
    const user = users[0];

    if (!await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ error: 'Unauthorized: Incorrect password' });
    }

    const [txResult] = await pool.query(`SELECT inventory_id, quantity, status FROM inventory_transactions WHERE id = ?`, [id]);
    if (txResult.length === 0) return res.status(404).json({ error: 'Transaction not found' });

    const tx = txResult[0];
    if (tx.status === 'Approved') return res.status(400).json({ error: 'Transaction already approved' });
    if (tx.status === 'Rejected') return res.status(400).json({ error: 'Transaction already Rejected' });

    const [inventoryResult] = await pool.query(`SELECT quantity FROM m_inventory WHERE id = ?`, [tx.inventory_id]);
    const currentStock = inventoryResult[0]?.quantity;

    if (currentStock < tx.quantity) {
      return res.status(400).json({ error: 'Not enough stock available to approve' });
    }

    await pool.query(`UPDATE m_inventory SET quantity = ? WHERE id = ?`, [currentStock - tx.quantity, tx.inventory_id]);
    await pool.query(`UPDATE inventory_transactions SET status = 'Approved' WHERE id = ?`, [id]);

    res.status(200).json({ message: 'Transaction approved and inventory updated' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to approve transaction', details: err.message });
  }
});

router.post('/reject/:transactionId', async (req, res) => {
  const { transactionId } = req.params;
  const { password } = req.body;

  try {
    const [users] = await pool.query("SELECT * FROM users WHERE username = 'unni'");
    const user = users[0];

    if (!await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ error: 'Unauthorized: Incorrect password' });
    }

    const [txResult] = await pool.query(`SELECT inventory_id, quantity, status FROM inventory_transactions WHERE id = ?`, [transactionId]);
    if (txResult.length === 0) return res.status(404).json({ error: 'Transaction not found' });

    const tx = txResult[0];
    if (tx.status === 'Rejected') return res.status(400).json({ error: 'Transaction already Rejected' });
    if (tx.status === 'Approved') return res.status(400).json({ error: 'Transaction already Approved' });

    await pool.query(`UPDATE inventory_transactions SET status = 'Rejected' WHERE id = ?`, [transactionId]);
    res.status(200).json({ message: 'Transaction rejected successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reject request', details: error.message });
  }
});

router.get("/pendinglist", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        t.id,
        i.name AS item_name,
        t.quantity,
        u.username AS requested_by
      FROM inventory_transactions t
      JOIN m_inventory inv ON t.inventory_id = inv.id
      JOIN item i ON inv.item_id = i.id
      JOIN users u ON t.user_id = u.id
      WHERE t.status = 'pending'
      ORDER BY t.transaction_date DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

router.post('/approve', async (req, res) => {
  const { id } = req.body;

  try {
    const [txRes] = await pool.query(`SELECT inventory_id, quantity, status FROM inventory_transactions WHERE id = ?`, [id]);
    if (txRes.length === 0) return res.status(404).json({ error: 'Transaction not found' });

    const tx = txRes[0];
    if (tx.status === 'Approved') return res.status(400).json({ error: 'Transaction already approved' });
    if (tx.status === 'Rejected') return res.status(400).json({ error: 'Transaction already Rejected' });

    const [inventoryRes] = await pool.query(`SELECT quantity FROM m_inventory WHERE id = ?`, [tx.inventory_id]);
    const currentStock = inventoryRes[0]?.quantity;

    if (currentStock < tx.quantity) {
      return res.status(400).json({ error: 'Not enough stock to approve transaction' });
    }

    await pool.query(`UPDATE m_inventory SET quantity = ? WHERE id = ?`, [currentStock - tx.quantity, tx.inventory_id]);
    await pool.query(`UPDATE inventory_transactions SET status = 'Approved' WHERE id = ?`, [id]);

    res.status(200).json({ message: 'Transaction approved and inventory updated' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to approve transaction', details: err.message });
  }
});

router.post('/reject', async (req, res) => {
  const { id } = req.body;

  try {
    const [txRes] = await pool.query(`SELECT inventory_id, quantity, status FROM inventory_transactions WHERE id = ?`, [id]);
    if (txRes.length === 0) return res.status(404).json({ error: 'Transaction not found' });

    const tx = txRes[0];
    if (tx.status === 'Rejected') return res.status(400).json({ error: 'Transaction already rejected' });
    if (tx.status === 'Approved') return res.status(400).json({ error: 'Transaction already approved' });

    await pool.query(`UPDATE inventory_transactions SET status = 'Rejected' WHERE id = ?`, [id]);
    res.status(200).json({ message: 'Transaction rejected successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reject transaction', details: error.message });
  }
});

export default router;
