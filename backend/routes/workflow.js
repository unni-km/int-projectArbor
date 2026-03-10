import express from 'express';
import poolPromise from '../db.js';

const router = express.Router();

/* =========================================
   GET ALL WORKFLOW STATUS WITH ROLES
========================================= */

router.get("/status", async (req, res) => {
  try {
    const pool = await poolPromise;

    const [rows] = await pool.query(`
      SELECT 
        ws.status_code,
        ws.status_name,
        ws.stage_order,
        GROUP_CONCAT(r.id ORDER BY r.role SEPARATOR ',') AS role_ids,
        GROUP_CONCAT(r.role ORDER BY r.role SEPARATOR ', ') AS roles
      FROM workflow_status ws
      LEFT JOIN workflow_roles wr
        ON ws.status_code = wr.status_code
      LEFT JOIN roles r
        ON wr.role_id = r.id
      GROUP BY ws.status_code, ws.status_name, ws.stage_order
      ORDER BY ws.stage_order;
    `);

    res.json(rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


/* =========================================
   CREATE STATUS
========================================= */

router.post("/status", async (req, res) => {

  try {

    const { status_code, status_name } = req.body;
console.log(req.body);
    const pool = await poolPromise;

    await pool.query(
      "INSERT INTO workflow_status (status_code, status_name) VALUES (?,?)",
      [status_code, status_name]
    );

    res.json({ message: "Status created" });

  } catch (err) {

    console.error(err);
    res.status(500).json({ error: err.message });

  }

});


/* =========================================
   UPDATE STATUS
========================================= */

router.put("/status/:code", async (req, res) => {

  try {

    const { status_name } = req.body;
    const { code } = req.params;
console.log(req.body);
    const pool = await poolPromise;

    await pool.query(
      "UPDATE workflow_status SET status_name=? WHERE status_code=?",
      [status_name, code]
    );

    res.json({ message: "Status updated" });

  } catch (err) {

    console.error(err);
    res.status(500).json({ error: err.message });

  }

});


/* =========================================
   DELETE STATUS
========================================= */

router.delete("/status/:code", async (req, res) => {

  try {

    const { code } = req.params;

    const pool = await poolPromise;

    await pool.query(
      "DELETE FROM workflow_roles WHERE status_code=?",
      [code]
    );

    await pool.query(
      "DELETE FROM workflow_status WHERE status_code=?",
      [code]
    );

    res.json({ message: "Status deleted" });

  } catch (err) {

    console.error(err);
    res.status(500).json({ error: err.message });

  }

});


/* =========================================
   SAVE ROLES FOR STATUS
========================================= */

router.post("/roles", async (req, res) => {

  const { status_code, roles } = req.body;

  let conn;

  try {

    const pool = await poolPromise;
    conn = await pool.getConnection();

    await conn.beginTransaction();

    await conn.query(
      "DELETE FROM workflow_roles WHERE status_code=?",
      [status_code]
    );

    for (const role of roles) {

      await conn.query(
        "INSERT INTO workflow_roles (status_code, role_id) VALUES (?,?)",
        [status_code, role]
      );

    }

    await conn.commit();

    res.json({ message: "Roles saved" });

  } catch (err) {

    if (conn) await conn.rollback();

    console.error(err);
    res.status(500).json({ error: err.message });

  } finally {

    if (conn) conn.release();

  }

});


router.get("/roles-list", async (req, res) => {
  const pool = await poolPromise;

  const [rows] = await pool.query(`
    SELECT id, role FROM roles ORDER BY role
  `);

  res.json(rows);
});

export default router;