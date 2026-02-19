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
  v.id,
  DATE_FORMAT(v.visited_date, '%d-%b-%Y') AS visited_date,
  v.visitor_name,
  v.company_name,
  v.contact_no,
  v.purpose_of_visit,
  DATE_FORMAT(v.time_in, '%d-%b-%Y %h:%i %p') AS time_in,
  DATE_FORMAT(v.time_out, '%d-%b-%Y %h:%i %p') AS time_out,  
  c.card_number,
  se.username AS security_enter,
  co.username AS security_exit
FROM 
  visitors v
LEFT JOIN 
  id_cards c ON v.card_id = c.card_id
LEFT JOIN 
  users se ON v.security_id = se.id
LEFT JOIN 
  users co ON v.checkout_id = co.id
  order by v.time_in desc;

    
      `
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Error fetching ID cards", details: err.message });
  }
});

router.get('/active-visitors', async (req, res) => {
  try {
    const [rows] = await poolPromise.query(`
      SELECT 
        v.id,
        DATE_FORMAT(v.visited_date, '%d-%b-%Y') AS visited_date,
        v.visitor_name,
        v.purpose_of_visit,
        DATE_FORMAT(v.time_in, '%h:%i %p') AS time_in, 
        c.card_number,
        v.guest_count,
        u.username AS security_username
      FROM 
        visitors v
      LEFT JOIN 
        id_cards c ON v.card_id = c.card_id
      LEFT JOIN 
        users u ON v.security_id = u.id
      WHERE 
        v.status = 1
    `);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching active visitors:", err);
    res.status(500).json({ error: "Failed to fetch active visitors" });
  }
});

// PUT /visitor/checkout/:id
router.post('/checkout/:id', async (req, res) => {
  const visitorId = req.params.id;
  const checkoutTime = new Date();
   const { checkout_time, userid } = req.body;
   console.log(req.body);

  try {
    const pool = await poolPromise;

    // Update visitor table with checkout time
    await pool.query(
      `UPDATE visitors 
       SET time_out = ?, status = 0,checkout_id=?
       WHERE id = ?`,
      [checkoutTime, userid, visitorId]
    );

    await pool.query(
      `UPDATE id_cards 
       SET status = 0 
       WHERE card_id = (
         SELECT card_id FROM visitors WHERE id = ?
       )`,
      [visitorId]
    );

    res.status(200).json({ message: "Visitor checked out successfully" });
  } catch (error) {
    console.error('Error during checkout:', error);
    res.status(500).json({ error });
  }
});

router.post('/add', async (req, res) => {
  const {
    visitor_name,
    company_name,
    contact_no,
    purpose_of_visit,
    guest_count,
    remarks,
    card_id,
    userid
  } = req.body;

  const visited_date = new Date();
  const time_in = visited_date;
  const status = 1;
console.log();
  try {
    const pool = await poolPromise;

    // Insert into visitors table
    const insertQuery = `
      INSERT INTO visitors (
        visited_date, visitor_name, company_name, contact_no,
        purpose_of_visit, time_in, card_id,security_id, remarks,
        status, guest_count
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)
    `;
    const insertValues = [
      visited_date,
      visitor_name,
      company_name,
      contact_no,
      purpose_of_visit,
      time_in,
      card_id,
      userid,
      remarks || '',
      status,
      guest_count || 0
    ];
    await pool.query(insertQuery, insertValues);

    // Update ID card status to 0
    const updateQuery = `
      UPDATE id_cards
      SET status = 1, updated_at = ?
      WHERE card_id = ?
    `;
    await pool.query(updateQuery, [new Date(), card_id]);

    res.status(200).json({ message: 'Visitor enrolled and card assigned successfully.' });

  } catch (error) {
    console.error('Error enrolling visitor:', error);
    res.status(500).json({ message: 'Failed to enroll visitor.', error: error.message });
  }
});


export default router;
