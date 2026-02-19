// login.js
import express from 'express';
import bcrypt from 'bcryptjs';
import poolPromise from '../db.js';

const router = express.Router();

// Login Route
router.post("/", async (req, res) => {
  const { username, password } = req.body;
  try {
    const pool = await poolPromise;
    const [rows] = await pool.query(
      "SELECT * FROM users WHERE username = ? AND is_active = 1",
      [username]
    );

    const user = rows[0];
    if (!user) return res.status(400).send("Invalid username or inactive account");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).send("Invalid password");

    res.status(200).json({ message: "Login successful", id: user.id, role: user.role_id,username:user.username });
  } catch (err) {
    console.error(err);
    res.status(500).send("Login error");
  }
});

// Register Route
router.post('/register', async (req, res) => {
  const { username, password, created_by = 'Admin', role_id} = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required." });
  }

  try {
    const pool = await poolPromise;

    // Check for existing user
    const [existingUsers] = await pool.query(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );
    if (existingUsers.length > 0) {
      return res.status(409).json({ error: "Username already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const now = new Date();

    // Insert new user
    await pool.query(
      `INSERT INTO users 
        (username, password, role_id, start_date, is_active, created_date, created_by) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [username, hashedPassword, role_id, now, 1, now, created_by]
    );

    res.status(201).json({ message: "User registered successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Registration failed." });
  }
});

router.put('/:id/toggle', async (req, res) => {
  const { id } = req.params;
  let { is_active } = req.body;

  try {
    const pool = await poolPromise;

    is_active = Number(is_active); // Ensure numeric

    await pool.query(
      `UPDATE users SET is_active = ?, updated_at = NOW() WHERE id = ?`,
      [is_active, id]
    );

    if (is_active === 0) {
      // Deactivate: Insert leave record
      await pool.query(
        `INSERT INTO leave_records (user_id, leave_start_date, created_by, created_at)
         VALUES (?, CURDATE(), ?, NOW())`,
        [id, 'Admin'] // replace with dynamic username if available
      );
    } else {
      // Reactivate: update last leave record
      await pool.query(
        `UPDATE leave_records
         SET leave_end_date = CURDATE(), updated_by = ?, updated_at = NOW()
         WHERE user_id = ? AND leave_end_date IS NULL
         ORDER BY leave_start_date DESC LIMIT 1`,
        ['Admin', id]
      );
    }

    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});



router.get('/users', async (req, res) => {
  try {
    const pool = await poolPromise;

    const [rows] = await pool.query(`
      SELECT u.*, r.role AS role_name
      FROM users u
      LEFT JOIN roles r ON u.role_id = r.id
    `);

    const users = rows.map(row => ({
      ...row,
      is_active: Number(row.is_active), // ensure integer
    }));

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching users' });
  }
});


router.get('/roles', async (req, res) => {
  try {
    const pool = await poolPromise;

    const [rows] = await pool.query(`
    select id,role from roles
    `);



    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching users' });
  }
});



router.get('/leaves', async (req, res) => {
  try {
    const [rows] = await poolPromise.query(`
      SELECT 
        u.username AS security_username,
        DATE_FORMAT(l.leave_start_date, '%d-%b-%Y') AS leave_start_date,
      DATE_FORMAT(l.leave_end_date, '%d-%b-%Y') AS leave_end_date,
        u.username AS username
      FROM 
        leave_records l
      LEFT JOIN 
        users u ON l.user_id = u.id
    `);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching active visitors:", err);
    res.status(500).json({ error: "Failed to fetch active visitors" });
  }
});

// PUT update user (edit)
router.put('/:id/update', async (req, res) => {
  const { id } = req.params;
  const { username, password, role_id, updated_by = 'Admin' } = req.body;

  if (!username || !role_id) {
    return res.status(400).json({ error: 'Username and role are required' });
  }

  try {
    const pool = await poolPromise;

    // Check if username exists for another user
    const [existingUsers] = await pool.query(
      "SELECT * FROM users WHERE username = ? AND id != ?",
      [username, id]
    );
    if (existingUsers.length > 0) {
      return res.status(409).json({ error: 'Username already exists.' });
    }

    let query = 'UPDATE users SET username = ?, role_id = ?, updated_at = ?, updated_by = ?';
    const params = [username, role_id, new Date(), updated_by];

    // Only update password if provided
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 12);
      query += ', password = ?';
      params.push(hashedPassword);
    }

    query += ' WHERE id = ?';
    params.push(id);

    await pool.query(query, params);

    res.json({ message: 'User updated successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update user.' });
  }
});



export default router;
