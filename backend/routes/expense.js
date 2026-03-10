import express from "express";
import multer from "multer";
import {
  BlobServiceClient,
  StorageSharedKeyCredential,
  generateBlobSASQueryParameters,
  BlobSASPermissions,
  SASProtocol
} from "@azure/storage-blob";
import { SecretClient } from "@azure/keyvault-secrets";
import { DefaultAzureCredential } from "@azure/identity";
import poolPromise from "../db.js";
import PDFDocument from "pdfkit";

import fs from "fs";
import path from "path";


const router = express.Router();



/* -----------------------------------------
   1. Multer (memory storage)
------------------------------------------ */
const upload = multer({ storage: multer.memoryStorage() });

/* -----------------------------------------
   2. Azure Key Vault + Blob Setup
------------------------------------------ */
const keyVaultName = "ar-india-mgt-dev01";
const vaultUrl = `https://${keyVaultName}.vault.azure.net`;

const credential = new DefaultAzureCredential();
const secretClient = new SecretClient(vaultUrl, credential);

let containerClient = null;
let sharedKeyCredential = null;
let CONTAINER_NAME = "expense-files";

async function initAzure() {
  const accountName = (await secretClient.getSecret("StorageAccountName")).value;
  const accountKey = (await secretClient.getSecret("StorageAccountKey")).value;

  sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);

  const blobService = new BlobServiceClient(
    `https://${accountName}.blob.core.windows.net`,
    sharedKeyCredential
  );

  containerClient = blobService.getContainerClient(CONTAINER_NAME);

  if (!(await containerClient.exists())) {
    await containerClient.create();
  }

  console.log("Expense Azure Blob Initialized");
}

initAzure();

/* -----------------------------------------
   SAS URL Helper
------------------------------------------ */
function generateSas(blobName) {
  const expiresOn = new Date(Date.now() + 60 * 60 * 1000);

  const sasToken = generateBlobSASQueryParameters(
    {
      containerName: CONTAINER_NAME,
      blobName,
      permissions: BlobSASPermissions.parse("r"),
      expiresOn,
      protocol: SASProtocol.Https
    },
    sharedKeyCredential
  );

  const blobClient = containerClient.getBlockBlobClient(blobName);
  return `${blobClient.url}?${sasToken}`;
}

/* -----------------------------------------
   Helper: Upload file to Azure
------------------------------------------ */
async function uploadToAzure(file) {
  const blobName = `${Date.now()}-${file.originalname}`;
  const blobClient = containerClient.getBlockBlobClient(blobName);

  await blobClient.uploadData(file.buffer, {
    blobHTTPHeaders: { blobContentType: file.mimetype }
  });

  return blobClient.url;
}

/* ===================================================================
   EXPENSE MODULE API
=================================================================== */

/* -----------------------------------------
   1. CREATE REQUEST (Standard / Direct)
------------------------------------------ */
router.post("/create", async (req, res) => {
  try {
    const {
      request_type,
      title,
      requested_by,
      category,
      estimated_cost
    } = req.body;
    console.log(req.body);

    const pool = await poolPromise;

    const [result] = await pool.execute(
      `INSERT INTO expense_requests 
        (request_type, title, requested_by, category, estimated_cost, current_status, created_at)
       VALUES (?, ?, ?, ?, ?, 'RFQ_PENDING', NOW())`,
      [request_type, title, requested_by, category, estimated_cost]
    );

    res.json({ message: "Request created", id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: "Create failed", details: err.message });
  }
});


/* -----------------------------------------
   2. UPLOAD QUOTE (Dept Exec)
------------------------------------------ */
router.post(
  "/quotes/upload",
  upload.any(),
  async (req, res) => {
    try {
      const { expense_id, uploaded_by, quotes } = req.body;

      if (!expense_id || !Array.isArray(quotes) || quotes.length === 0) {
        return res.status(400).json({ error: "Invalid quotes payload" });
      }

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: "Quote files required" });
      }

      const pool = await poolPromise;

      /**
       * Map files by index
       * fieldname example: quotes[0][file]
       */
      const filesMap = {};
      req.files.forEach((file) => {
        const match = file.fieldname.match(/quotes\[(\d+)\]\[file\]/);
        if (match) {
          filesMap[match[1]] = file;
        }
      });

      const insertSql = `
        INSERT INTO expense_quotes
        (expense_id, vendor_id, amount, file_url, uploaded_by, created_at)
        VALUES (?, ?, ?, ?, ?, NOW())
      `;

      for (let i = 0; i < quotes.length; i++) {
        const vendorId = quotes[i].vendor_id;
        const amount = quotes[i].amount;
        const file = filesMap[i];

        if (!vendorId || !amount || !file) continue;

        const fileUrl = await uploadToAzure(file);

        await pool.execute(insertSql, [
          expense_id,
          vendorId,
          amount,
          fileUrl,
          uploaded_by,
        ]);
      }

      // Move status forward
      await pool.execute(
        `
        UPDATE expense_requests
        SET current_status = 'QUOTE_REVIEW_DM'
        WHERE id = ?
        `,
        [expense_id]
      );

      res.json({ message: "Quotes uploaded successfully" });
    } catch (err) {
      console.error("Quote upload error:", err);
      res.status(500).json({
        error: "Quote upload failed",
        details: err.message,
      });
    }
  }
);


/* -----------------------------------------
   3. DM SUBMITS RECOMMENDATIONS
------------------------------------------ */
router.post("/quotes/recommend", async (req, res) => {
  let conn;

  try {
    const { expense_id, recommended_quote_ids, reason } = req.body;

    if (!expense_id || !Array.isArray(recommended_quote_ids)) {
      return res.status(400).json({
        error: "Invalid payload"
      });
    }

    const pool = await poolPromise;
    conn = await pool.getConnection();
    await conn.beginTransaction();

    /* 1️⃣ RESET ALL RECOMMENDATIONS FOR THIS EXPENSE */
    await conn.query(
      `
      UPDATE expense_quotes
      SET is_recommended = 0,
          reason = NULL
      WHERE expense_id = ?
      `,
      [expense_id]
    );

    /* 2️⃣ APPLY RECOMMENDATIONS WITH REASONS */
    for (const quoteId of recommended_quote_ids) {
      await conn.query(
        `
        UPDATE expense_quotes
        SET is_recommended = 1,
            reason = ?
        WHERE id = ?
        `,
        [
          reason?.[quoteId] || null, // per-quote reason
          quoteId
        ]
      );
    }

    /* 3️⃣ MOVE EXPENSE TO CH APPROVAL */
    await conn.query(
      `
      UPDATE expense_requests
      SET current_status = 'QUOTE_APPROVAL_CH',
          updated_at = NOW()
      WHERE id = ?
      `,
      [expense_id]
    );

    await conn.commit();

    res.json({
      message: "Recommendations submitted successfully",
      recommended_quotes: recommended_quote_ids
    });

  } catch (err) {
    if (conn) await conn.rollback();
    console.error("RECOMMEND ERROR:", err);

    res.status(500).json({
      error: "Recommendation failed",
      details: err.message
    });
  } finally {
    if (conn) conn.release();
  }
});


/* -----------------------------------------
   4. CH FINAL APPROVAL OF QUOTE
------------------------------------------ */
router.post("/quotes/approve", async (req, res) => {
  const { expense_id, selected_quote_id, approved_by,note} = req.body;

  let conn;
  try {
    const pool = await poolPromise;
    conn = await pool.getConnection();
    await conn.beginTransaction();

    /* ================== GET VENDOR FROM QUOTE ================== */
    const [[quote]] = await conn.query(
      `SELECT vendor_id FROM expense_quotes WHERE id = ?`,
      [selected_quote_id]
    );

    if (!quote) {
      throw new Error("Selected quote not found");
    }

    const vendorId = quote.vendor_id;

    /* ================== MARK SELECTED QUOTE ================== */
    await conn.query(
      `UPDATE expense_quotes SET is_selected = 1 WHERE id = ?`,
      [selected_quote_id]
    );

    /* ================== UNSELECT OTHERS ================== */
    await conn.query(
      `UPDATE expense_quotes 
       SET is_selected = 0 
       WHERE expense_id = ? AND id != ?`,
      [expense_id, selected_quote_id]
    );

    /* ================== MOVE TO NEW STAGE ================== */
    await conn.query(
      `
      UPDATE expense_requests
      SET
        current_status = 'PO_DRAFT_DE',
        selected_vendor_id = ?,
        updated_by = ?,
        updated_at = NOW()
      WHERE id = ?
      `,
      [vendorId, approved_by || null, expense_id]
    );

       await conn.query(
      `
      INSERT INTO approval_logs
      (entity_type, entity_id, action, stage, comment, acted_by)
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        "EXPENSE",
        expense_id,
        "APPROVED",
        "QUOTE_APPROVAL_CH",
        note || null,
        approved_by
      ]
    );

    await conn.commit();

    res.json({
      message: "Vendor approved. PO moved to DE draft stage.",
      next_status: "PO_DRAFT_DE",
      selected_vendor_id: vendorId
    });

  } catch (err) {
    if (conn) await conn.rollback();
    console.error("Approve vendor error:", err);
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) conn.release();
  }
});

router.post("/po/update-status", async (req, res) => {
  const { expense_id, status, acted_by } = req.body;

  const allowedStatuses = [
    "PO_REVIEW_DM",
    "PO_REAPPROVAL_CH",
    "PO_APPROVED_DM",
    "PO_ISSUED"
  ];

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ error: "Invalid PO status transition" });
  }

  let conn;
  try {
    const pool = await poolPromise;
    conn = await pool.getConnection();
    await conn.beginTransaction();

    /* ================== UPDATE STATUS ================== */
    await conn.query(
      `
      UPDATE expense_requests
      SET
        current_status = ?,
        updated_by = ?,
        updated_at = NOW()
      WHERE id = ?
      `,
      [status, acted_by || null, expense_id]
    );

   

    await conn.commit();

    res.json({
      message: "PO status updated successfully",
      current_status: status
    });

  } catch (err) {
    if (conn) await conn.rollback();
    console.error("PO status update error:", err);
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) conn.release();
  }
});

/* -----------------------------------------
   5. GENERATE PO (DM)
------------------------------------------ */

router.get("/po-items/:expenseId", async (req, res) => {
  let conn;
  try {
    const pool = await poolPromise;
    conn = await pool.getConnection();

    const [[quote]] = await conn.query(
      `
      SELECT id, vendor_id
      FROM expense_quotes
      WHERE expense_id = ? AND is_selected = 1
      `,
      [req.params.expenseId]
    );

    if (!quote) {
      return res.json([]);
    }

    const [items] = await conn.query(
      `
      SELECT
        qi.rfq_item_id,
        i.name AS item_name,
        r.quantity,
        qi.unit_price,
        g.gst_rate,
        r.original_quantity
      FROM expense_quote_items qi
      JOIN rfq_items r ON r.id = qi.rfq_item_id
      JOIN item i ON i.id = r.item_id
      LEFT JOIN gst_master g ON i.gst_id = g.gst_id
      WHERE qi.quote_id = ?
      `,
      [quote.id]
    );

    res.json({
      vendor_id: quote.vendor_id,
      items
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) conn.release();
  }
});


router.post("/po/generate", async (req, res) => {
  try {
    const { expense_id, po_number } = req.body;

    const pool = await poolPromise;

    await pool.execute(
      `UPDATE expense_requests SET po_number=?, current_status='PO_ISSUED' WHERE id=?`,
      [po_number, expense_id]
    );

    res.json({ message: "PO Issued" });
  } catch (err) {
    res.status(500).json({ error: "PO generation failed", details: err.message });
  }
});

/* -----------------------------------------
   6. UPLOAD INVOICE (Dept Exec)
------------------------------------------ */
router.post("/invoice/upload", upload.single("invoice_file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "Invoice file required" });

    const {
      expense_id,
      vendor_id,
      invoice_no,
      taxable_amount,
      gst_amount,
      tds_amount,
      final_amount
    } = req.body;
    console.log(req.body);

    const fileUrl = await uploadToAzure(req.file);

    const pool = await poolPromise;
    await pool.execute(
      `INSERT INTO invoice 
      (invoice_no, vendor_id, invoice_file_path, taxable_amount, gst_amount, tds_amount, final_amount, expense_id, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'PENDING', NOW())`,
      [invoice_no, vendor_id, fileUrl, taxable_amount, gst_amount, tds_amount, final_amount, expense_id]
    );

    await pool.execute(
      `UPDATE expense_requests SET current_status='INVOICE_REVIEW_DM' WHERE id=?`,
      [expense_id]
    );

    res.json({ message: "Invoice uploaded", fileUrl });
  } catch (err) {
    res.status(500).json({ error: "Invoice upload failed", details: err.message });
  }
});

/* -----------------------------------------
   7. INVOICE APPROVAL (DM / FM)
------------------------------------------ */
router.post("/invoice/approve", async (req, res) => {
  try {
    const { invoice_id, next_status } = req.body;

    const pool = await poolPromise;

    await pool.execute(`UPDATE invoice SET status='APPROVED' WHERE id=?`, [invoice_id]);

    await pool.execute(
      `UPDATE expense_requests SET current_status=? WHERE id=(SELECT expense_id FROM invoice WHERE id=?)`,
      [next_status, invoice_id]
    );

    res.json({ message: "Invoice approved" });
  } catch (err) {
    res.status(500).json({ error: "Approval failed", details: err.message });
  }
});

/* -----------------------------------------
   8. PAYMENT INITIATION, CH APPROVAL, EXECUTION
------------------------------------------ */
router.post("/payment/update", async (req, res) => {
  try {
    const { expense_id, stage, utr, mode } = req.body;

    const pool = await poolPromise;

    if (stage === "INITIATE") {
      await pool.execute(
        `UPDATE expense_requests SET current_status='PAYMENT_APPROVAL_CH' WHERE id=?`,
        [expense_id]
      );
    } else if (stage === "EXECUTE") {
      await pool.execute(
        `UPDATE expense_requests 
         SET payment_reference=?, current_status='VENDOR_VERIFICATION' 
         WHERE id=?`,
        [utr, expense_id]
      );
    }

    res.json({ message: "Payment updated" });
  } catch (err) {
    res.status(500).json({ error: "Payment update failed", details: err.message });
  }
});

/* -----------------------------------------
   9. Vendor Verification
------------------------------------------ */
router.post("/verify", async (req, res) => {
  try {
    const { expense_id } = req.body;

    const pool = await poolPromise;

    await pool.execute(
      `UPDATE expense_requests SET current_status='COMPLETED' WHERE id=?`,
      [expense_id]
    );

    res.json({ message: "Request marked completed" });
  } catch (err) {
    res.status(500).json({ error: "Verification failed", details: err.message });
  }
});

/* -----------------------------------------
   10. FETCH ALL REQUESTS
------------------------------------------ */
router.get("/", async (req, res) => {
  try {
    const pool = await poolPromise;

    const [rows] = await pool.execute(`
      SELECT 
        er.*,
        u.username AS requester_name,
        v.name AS vendor_name
      FROM expense_requests er
      LEFT JOIN users u ON er.requested_by = u.id
      LEFT JOIN vendors v ON er.selected_vendor_id = v.id
      ORDER BY er.created_at DESC
    `);

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Fetch failed", details: err.message });
  }
});

/* -----------------------------------------
   11. FETCH SINGLE REQUEST
------------------------------------------ */
router.get("/:id", async (req, res) => {
  try {
    const pool = await poolPromise;
    
    const [request] = await pool.execute(
      `SELECT * FROM expense_requests WHERE id=?`,
      [req.params.id]
    );

    const [quotes] = await pool.execute(
      `SELECT * FROM expense_quotes WHERE expense_id=?`,
      [req.params.id]
    );

    const [invoices] = await pool.execute(
      `SELECT * FROM invoice WHERE expense_id=?`,
      [req.params.id]
    );

    res.json({
      ...request[0],
      quotes,
      invoices
    });

  } catch (err) {
    res.status(500).json({ error: "Fetch failed", details: err.message });
  }
});

router.get("/quotes/:id", async (req, res) => {
  let conn;
  try {
    const pool = await poolPromise;
    conn = await pool.getConnection();

    /* ================= QUOTES ================= */
    const [quotes] = await conn.query(
      `
      SELECT 
        q.id,
        q.vendor_id,
        v.name AS vendor_name,
        q.amount,
        q.is_recommended,
        q.is_selected,
        q.reason,
        q.file_url
      FROM expense_quotes q
      LEFT JOIN vendors v ON v.id = q.vendor_id
      WHERE q.expense_id = ?
      ORDER BY q.created_at ASC
      `,
      [req.params.id]
    );

    if (quotes.length === 0) {
      return res.json([]);
    }

    /* ================= QUOTE ITEMS ================= */
    const [quoteItems] = await conn.query(
      `
      SELECT
        qi.quote_id,
        qi.rfq_item_id,
        i.name AS item_name,
        r.quantity,
        qi.unit_price,
        qi.total_price
      FROM expense_quote_items qi
      JOIN rfq_items r ON r.id = qi.rfq_item_id
      JOIN item i ON i.id = r.item_id
      WHERE qi.quote_id IN (?)
      `,
      [quotes.map(q => q.id)]
    );

    /* ================= MAP ITEMS ================= */
    const quotesWithItems = quotes.map(q => ({
      ...q,
      items: quoteItems.filter(i => i.quote_id === q.id)
    }));

    res.json(quotesWithItems);

  } catch (err) {
    console.error("Fetch quotes error:", err);
    res.status(500).json({
      message: "Failed to load quotes",
      error: err.message
    });
  } finally {
    if (conn) conn.release();
  }
});

/* -----------------------------------------
   12. DELETE REQUEST
------------------------------------------ */
router.delete("/:id", async (req, res) => {
  try {
    const pool = await poolPromise;

    await pool.execute(`DELETE FROM expense_requests WHERE id=?`, [req.params.id]);

    res.json({ message: "Request deleted" });
  } catch (err) {
    res.status(500).json({ error: "Delete failed", details: err.message });
  }
});

// ===============================
// GET DASHBOARD STATS
// ===============================
router.get("/stats", async (req, res) => {
  try {
    const pool = await poolPromise;

    // TOTAL BUDGET + YTD SPENT
    const [budgetRows] = await pool.execute(`
      SELECT 
        COALESCE(SUM(allocated), 0) AS totalBudget,
        COALESCE(SUM(spent), 0)     AS totalSpent
      FROM budgets;
    `);

    // ACTIVE REQUESTS
    const [activeRows] = await pool.execute(`
      SELECT COUNT(*) AS activeRequests
      FROM expense_requests
      WHERE current_status NOT IN ('COMPLETED', 'CANCELLED');
    `);

    // FINANCE REVIEW PENDING
    const [financeRows] = await pool.execute(`
      SELECT COUNT(*) AS financeReviewPending
      FROM expense_requests
      WHERE current_status = 'INVOICE_REVIEW_FM';
    `);

    // MONTHLY SPEND (pulling from invoice table)
    const [monthlyRows] = await pool.execute(`
      SELECT 
  DATE_FORMAT(created_at, '%b') AS month,
  SUM(
    COALESCE(
      CAST(final_amount AS DECIMAL(12,2)),
      CAST(invoice_amount AS DECIMAL(12,2)),
      0
    )
  ) AS amount
FROM invoice
WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
GROUP BY YEAR(created_at), MONTH(created_at)
ORDER BY MIN(created_at);

    `);

    return res.json({
      totalBudget: budgetRows[0].totalBudget,
      totalSpent: budgetRows[0].totalSpent,
      activeRequests: activeRows[0].activeRequests,
      financeReviewPending: financeRows[0].financeReviewPending,
      monthlySpend: monthlyRows.map(row => ({
        month: row.month,
        amount: row.amount || 0
      }))
    });

  } catch (err) {
    console.error("Stats Error:", err);
    return res.json({
      totalBudget: 0,
      totalSpent: 0,
      activeRequests: 0,
      financeReviewPending: 0,
      monthlySpend: []
    });
  }
});



// ===============================
// GET RECENT REQUESTS
// ===============================
router.get("/recent", async (req, res) => {
  const pool = await poolPromise;

  const [rows] = await pool.execute(`
    SELECT 
      id,
      title,
      current_status,
      category,
      created_at,
      estimated_cost
    FROM expense_requests
    ORDER BY created_at DESC
    LIMIT 20
  `);

  return res.json(rows);
});


router.post("/rfq/submit", async (req, res) => {
  const { expense_id, created_by, items } = req.body;

  if (!expense_id || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "Invalid RFQ payload" });
  }

  const pool = await poolPromise.getConnection();

  try {
    await pool.beginTransaction();

    // 1️⃣ Insert RFQ items
    const insertSql = `
      INSERT INTO rfq_items
      (expense_id, item_id, quantity, description, created_by,original_quantity)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    for (const item of items) {
      await pool.query(insertSql, [
        expense_id,
        item.item_id,
        item.quantity,
        item.description || null,
        created_by,
         item.quantity,
      ]);
    }

    // 2️⃣ Update expense status
    await pool.query(
      `
      UPDATE expense_requests
      SET current_status = 'RFQ_SUBMITTED',
          updated_at = NOW()
      WHERE id = ?
      `,
      [expense_id]
    );

    await pool.commit();

    res.json({
      message: "RFQ submitted successfully",
    });
  } catch (err) {
    await pool.rollback();
    console.error("RFQ submit error:", err);
    res.status(500).json({ message: "Failed to submit RFQ" });
  } finally {
    pool.release();
  }
});

router.post("/rfq/recommend", async (req, res) => {
  const { expense_id, recommended_by } = req.body;

  if (!expense_id) {
    return res.status(400).json({ message: "Expense ID required" });
  }

  try {
    const pool = await poolPromise;

    await pool.query(
      `
      UPDATE expense_requests
      SET current_status = 'RFQ_RECOMMENDED_DM',
          updated_by = ?,
          updated_at = NOW()
      WHERE id = ?
      `,
      [recommended_by || null, expense_id]
    );

    res.json({
      message: "RFQ recommended to CH successfully",
    });
  } catch (err) {
    console.error("RFQ recommend error:", err);
    res.status(500).json({ message: "Failed to recommend RFQ" });
  }
});

router.post("/rfq/approve-ch", async (req, res) => {
  const { expense_id, approved_by,note } = req.body;

  if (!expense_id) {
    return res.status(400).json({ message: "Expense ID required" });
  }

  try {
    const pool = await poolPromise;

    await pool.query(
      `
      UPDATE expense_requests
      SET current_status = 'QUOTES_PENDING',
          updated_by = ?,
          updated_at = NOW()
      WHERE id = ?
      `,
      [approved_by || null, expense_id]
    );
    
     await pool.query(
      `
      INSERT INTO approval_logs
      (entity_type, entity_id, action, stage, comment, acted_by)
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        "EXPENSE",
        expense_id,
        "APPROVED",
        "RFQ_RECOMMENDED_DM",
        note || null,
        approved_by
      ]
    );

    res.json({
      message: "RFQ approved by CH. Quotes stage started.",
    });
  } catch (err) {
    console.error("RFQ CH approval error:", err);
    res.status(500).json({ message: "Failed to approve RFQ" });
  }
});


router.get("/:id/rfq-items", async (req, res) => {
  const { id } = req.params;

  try {
    const pool = await poolPromise;

    const [rows] = await pool.query(
      `
      SELECT 
        ri.id,
        ri.item_id,
        i.name AS item_name,
        ri.quantity,
        ri.description
      FROM rfq_items ri
      JOIN item i ON ri.item_id = i.id
      WHERE ri.expense_id = ?
      `,
      [id]
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load RFQ items" });
  }
});

router.post(
  "/quotes/upload-with-items",
  upload.any(),
  async (req, res) => {
    console.log("RAW BODY:", req.body);
    console.log("FILES:", req.files);

    const expense_id = Number(req.body.expense_id);
    const uploaded_by = Number(req.body.uploaded_by || null);
    let vendors = req.body.vendors;

    /* ================= VALIDATION ================= */
    if (!expense_id || !Array.isArray(vendors) || vendors.length === 0) {
      return res.status(400).json({ message: "Invalid request data" });
    }

    /* ================= NORMALIZE ================= */
    vendors = vendors.map(v => ({
      vendor_id: Number(v.vendor_id),
      items: (v.items || []).map(i => ({
        rfq_item_id: Number(i.rfq_item_id),
        unit_price: Number(i.unit_price)
      })),
      file: null
    }));

    /* ================= MAP FILES ================= */
    if (Array.isArray(req.files)) {
      req.files.forEach(file => {
        const match = file.fieldname.match(/^vendors\[(\d+)]\[file]$/);
        if (match) {
          const idx = Number(match[1]);
          if (vendors[idx]) {
            vendors[idx].file = file;
          }
        }
      });
    }

    let conn;
    try {
      const pool = await poolPromise;
      conn = await pool.getConnection();
      await conn.beginTransaction();

      const createdQuotes = [];

      for (const vendor of vendors) {
        if (!vendor.vendor_id || vendor.items.length === 0) {
          throw new Error("Invalid vendor quote payload");
        }

        /* ========== 1️⃣ UPLOAD FILE (OPTIONAL) ========== */
        let fileUrl = null;
        if (vendor.file) {
          fileUrl = await uploadToAzure(vendor.file); // same helper as old route
        }

        /* ========== 2️⃣ CREATE QUOTE ========== */
        const [quoteRes] = await conn.query(
          `
          INSERT INTO expense_quotes
          (expense_id, vendor_id, uploaded_by, created_at, amount, file_url)
          VALUES (?, ?, ?, NOW(), 0, ?)
          `,
          [expense_id, vendor.vendor_id, uploaded_by, fileUrl]
        );

        const quoteId = quoteRes.insertId;
        let totalAmount = 0;

        /* ========== 3️⃣ INSERT QUOTE ITEMS ========== */
/* ========== 3️⃣ INSERT QUOTE ITEMS (WITH GST) ========== */
for (const item of vendor.items) {

  const [[rfqItem]] = await conn.query(
    `
    SELECT 
      r.quantity,
      i.id AS item_id,
      g.gst_rate
    FROM rfq_items r
    JOIN item i ON r.item_id = i.id
    LEFT JOIN gst_master g ON i.gst_id = g.gst_id
    WHERE r.id = ?
    `,
    [item.rfq_item_id]
  );

  if (!rfqItem) {
    throw new Error(`RFQ item not found: ${item.rfq_item_id}`);
  }

  const quantity = Number(rfqItem.quantity);
  const unitPrice = Number(item.unit_price);
  const gstRate = Number(rfqItem.gst_rate || 0);

  const taxableAmount = quantity * unitPrice;
  const gstAmount = (taxableAmount * gstRate) / 100;
  const lineTotal = taxableAmount + gstAmount;

  totalAmount += taxableAmount;

  await conn.query(
    `
    INSERT INTO expense_quote_items
    (quote_id, rfq_item_id, unit_price, total_price, gst_rate, gst_amount)
    VALUES (?, ?, ?, ?, ?, ?)
    `,
    [
      quoteId,
      item.rfq_item_id,
      unitPrice,
      taxableAmount,
      gstRate,
      lineTotal,

    ]
  );
}

        /* ========== 4️⃣ UPDATE TOTAL ========== */
        await conn.query(
          `UPDATE expense_quotes SET amount = ? WHERE id = ?`,
          [totalAmount, quoteId]
        );

        createdQuotes.push({
          quote_id: quoteId,
          vendor_id: vendor.vendor_id,
          amount: totalAmount,
          file_url: fileUrl
        });
      }

      /* ========== 5️⃣ UPDATE EXPENSE STATUS ========== */
      await conn.query(
        `
        UPDATE expense_requests
        SET current_status = 'QUOTE_REVIEW_DM',
            updated_by = ?,
            updated_at = NOW()
        WHERE id = ?
        `,
        [uploaded_by, expense_id]
      );

      await conn.commit();

      res.json({
        message: "Quotes submitted successfully",
        quotes: createdQuotes
      });

    } catch (err) {
      if (conn) await conn.rollback();
      console.error("Quote upload error:", err);

      res.status(500).json({
        message: "Failed to submit quotes",
        error: err.message
      });
    } finally {
      if (conn) conn.release();
    }
  }
);








router.get("/:id/po-items", async (req, res) => {
  const pool = await poolPromise;

  const [rows] = await pool.query(
    `
    SELECT 
      ri.id AS rfq_item_id,
      i.name AS item_name,
      ri.quantity,
      ri.description
    FROM rfq_items ri
    JOIN item i ON ri.item_id = i.id
    WHERE ri.expense_id = ?
    `,
    [req.params.id]
  );

  res.json(rows);
});


router.post("/po/create", async (req, res) => {
  let conn;

  try {
    const {
      expense_id,
      vendor_id,
      items,
      terms,
      created_by
    } = req.body;

    console.log(req.body);

    /* ---------- VALIDATION ---------- */
    if (!expense_id) {
      return res.status(400).json({ error: "expense_id required" });
    }

    if (!vendor_id) {
      return res.status(400).json({ error: "vendor_id required" });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "PO items required" });
    }

    /* ---------- SANITIZE ---------- */
    const safeItems = items.map((i, idx) => {
      if (!i.rfq_item_id) {
        throw new Error(`rfq_item_id missing at index ${idx}`);
      }
      return {
        rfq_item_id: Number(i.rfq_item_id),
        quantity: Number(i.quantity) || 0,
        unit_price: Number(i.unit_price) || 0
      };
    });

    const totalAmount = safeItems.reduce(
      (sum, i) => sum + i.quantity * i.unit_price,
      0
    );

    /* ---------- DB ---------- */
    conn = await poolPromise.getConnection();
    await conn.beginTransaction();

    /* ---------- PO NUMBER ---------- */
    const poNumber = `PO-${new Date().getFullYear()}-${Date.now()}`;

    /* ---------- INSERT PO ---------- */
    const [poResult] = await conn.query(
      `
      INSERT INTO purchase_orders
      (expense_id, po_number, vendor_id, total_amount,terms, created_by, created_at)
      VALUES (?, ?, ?, ?, ?, ?, NOW())
      `,
      [expense_id, poNumber, vendor_id, totalAmount,terms|| null, created_by ?? null]
    );

    const poId = poResult.insertId;

    /* ---------- INSERT PO ITEMS ---------- */
    for (const i of safeItems) {
      await conn.query(
        `
        INSERT INTO purchase_order_items
        (po_id, rfq_item_id, quantity, unit_price, total_price)
        VALUES (?, ?, ?, ?, ?)
        `,
        [
          poId,
          i.rfq_item_id,
          i.quantity,
          i.unit_price,
          i.quantity * i.unit_price
        ]
      );
    }

    /* ---------- UPDATE EXPENSE ---------- */
    await conn.query(
      `
      UPDATE expense_requests
      SET current_status = 'PO_ISSUED',
          po_number = ?,
          po_issued_at = NOW(),
          updated_by = ?
      WHERE id = ?
      `,
      [poNumber, created_by ?? null, expense_id]
    );

    await conn.commit();

    res.json({
      message: "Purchase Order issued",
      po_id: poId,
      po_number: poNumber,
      issued_at: new Date()
    });

  } catch (err) {
    if (conn) await conn.rollback();
    console.error("PO CREATE ERROR:", err);
    res.status(500).json({
      error: "Failed to create PO",
      details: err.message
    });
  } finally {
    if (conn) conn.release();
  }
});


router.post("/po/generate", async (req, res) => {
  let conn;

  try {
    /* ===================== RAW INPUT ===================== */
    console.log("RAW PO REQUEST =>", req.body);

    let { expense_id, vendor_id, items, created_by } = req.body;

    /* ===================== HARD VALIDATION ===================== */
    if (!expense_id) {
      return res.status(400).json({ error: "expense_id is required" });
    }

    if (!vendor_id) {
      return res.status(400).json({ error: "vendor_id is required" });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "PO items missing" });
    }

    /* ===================== SANITIZE INPUT (NO UNDEFINED EVER) ===================== */
    expense_id = Number(expense_id);
    vendor_id = Number(vendor_id);
    created_by = created_by ? Number(created_by) : null;

    if (Number.isNaN(expense_id) || Number.isNaN(vendor_id)) {
      return res.status(400).json({ error: "Invalid expense_id or vendor_id" });
    }

    items = items.map((i, index) => {
      if (i.rfq_item_id === undefined || i.rfq_item_id === null) {
        throw new Error(`rfq_item_id missing at item index ${index}`);
      }

      const quantity = Number(i.quantity);
      const unit_price = Number(i.unit_price);

      if (Number.isNaN(quantity) || Number.isNaN(unit_price)) {
        throw new Error(`Invalid quantity/unit_price at item index ${index}`);
      }

      return {
        rfq_item_id: Number(i.rfq_item_id),
        item_name: i.item_name || "-",
        quantity,
        unit_price
      };
    });

    console.log("SANITIZED PO PAYLOAD =>", {
      expense_id,
      vendor_id,
      created_by,
      items
    });

    /* ===================== DB ===================== */
    const pool = await poolPromise;
    conn = await pool.getConnection();
    await conn.beginTransaction();

    /* ===================== VENDOR ===================== */
    const [[vendor]] = await conn.query(
      `SELECT * FROM vendors WHERE id = ?`,
      [vendor_id]
    );

    if (!vendor) {
      throw new Error("Approved vendor not found");
    }

    /* ===================== PO NUMBER ===================== */
    const poNumber = `PO${Date.now()}`;

    /* ===================== TOTAL ===================== */
    const totalAmount = items.reduce(
      (sum, i) => sum + i.quantity * i.unit_price,
      0
    );

    /* ===================== INSERT PO ===================== */
    const [poRes] = await conn.query(
      `
      INSERT INTO purchase_orders
      (expense_id, po_number, vendor_id, total_amount, created_by, created_at)
      VALUES (?, ?, ?, ?, ?, NOW())
      `,
      [
        expense_id,
        poNumber,
        vendor_id,
        totalAmount,
        created_by
      ]
    );

    const poId = poRes.insertId;

    /* ===================== INSERT PO ITEMS ===================== */
    for (const i of items) {
      await conn.query(
        `
        INSERT INTO purchase_order_items
        (po_id, rfq_item_id, quantity, unit_price, total_price)
        VALUES (?, ?, ?, ?, ?)
        `,
        [
          poId,
          i.rfq_item_id,
          i.quantity,
          i.unit_price,
          i.quantity * i.unit_price
        ]
      );
    }

    /* ===================== GENERATE PDF ===================== */
    const pdfDir = path.join(__dirname, "../uploads/po");
    if (!fs.existsSync(pdfDir)) {
      fs.mkdirSync(pdfDir, { recursive: true });
    }

    const pdfFileName = `${poNumber}.pdf`;
    const pdfPath = path.join(pdfDir, pdfFileName);

    const doc = new PDFDocument({ margin: 40 });
    doc.pipe(fs.createWriteStream(pdfPath));

    // ---------- HEADER ----------
    doc.fontSize(18).text("PURCHASE ORDER", { align: "center" });
    doc.moveDown();

    doc.fontSize(10);
    doc.text(`PO No: ${poNumber}`);
    doc.text(`Date: ${new Date().toLocaleDateString("en-IN")}`);
    doc.moveDown();

    // ---------- VENDOR ----------
    doc.font("Helvetica-Bold").text("Vendor Details");
    doc.font("Helvetica");
    doc.text(vendor.name);
    if (vendor.address) doc.text(vendor.address);
    if (vendor.phone) doc.text(`Phone: ${vendor.phone}`);
    doc.moveDown();

    // ---------- TABLE HEADER ----------
    doc.font("Helvetica-Bold");
    doc.text("Item", 40);
    doc.text("Qty", 300);
    doc.text("Rate", 350);
    doc.text("Total", 420);
    doc.moveDown(0.5);
    doc.font("Helvetica");

    // ---------- ITEMS ----------
    items.forEach(i => {
      doc.text(i.item_name, 40);
      doc.text(String(i.quantity), 300);
      doc.text(`₹${i.unit_price}`, 350);
      doc.text(`₹${i.quantity * i.unit_price}`, 420);
      doc.moveDown();
    });

    doc.moveDown();
    doc.font("Helvetica-Bold");
    doc.text(`Grand Total: ₹${totalAmount}`, { align: "right" });

    doc.end();

    /* ===================== SAVE PDF PATH ===================== */
    const pdfUrl = `/uploads/po/${pdfFileName}`;

    await conn.query(
      `UPDATE purchase_orders SET po_pdf_url = ? WHERE id = ?`,
      [pdfUrl, poId]
    );

    /* ===================== UPDATE REQUEST STATUS ===================== */
    await conn.query(
      `
      UPDATE expense_requests
      SET current_status = 'PO_ISSUED',
          updated_at = NOW(),
          updated_by = ?
      WHERE id = ?
      `,
      [created_by, expense_id]
    );

    await conn.commit();

    /* ===================== RESPONSE ===================== */
    res.json({
      message: "Purchase Order generated successfully",
      po_id: poId,
      po_number: poNumber,
      total_amount: totalAmount,
      pdf_url: pdfUrl
    });

  } catch (err) {
    if (conn) await conn.rollback();
    console.error("PO GENERATION ERROR:", err);

    res.status(500).json({
      error: "PO generation failed",
      details: err.message
    });
  } finally {
    if (conn) conn.release();
  }
});

// GET /expense/po/:expenseId
router.get("/po/:expenseId", async (req, res) => {
  const { expenseId } = req.params;
  const pool = await poolPromise;
  const conn = await pool.getConnection();

  try {
    /* ===== PO ===== */
    const [[po]] = await conn.query(
      `
      SELECT *
      FROM purchase_orders
      WHERE expense_id = ?
      `,
      [expenseId]
    );

    if (!po) {
      return res.json({ po: null, items: [] });
    }

    /* ===== PO ITEMS ===== */
    const [items] = await conn.query(
      `
      SELECT
        pi.rfq_item_id,
        i.name AS item_name,
        pi.quantity,
        pi.unit_price,
        g.gst_rate
      FROM purchase_order_items pi
      JOIN rfq_items r ON r.id = pi.rfq_item_id
      JOIN item i ON i.id = r.item_id
      LEFT JOIN gst_master g ON i.gst_id = g.gst_id
      WHERE pi.po_id = ?
      `,
      [po.id]
    );

    res.json({ po, items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load PO" });
  } finally {
    conn.release();
  }
});

router.get("/quotes/download/:id", async (req, res) => {
  try {
    const pool = await poolPromise;

    const [[row]] = await pool.execute(
      `SELECT file_url FROM expense_quotes WHERE id = ?`,
      [req.params.id]
    );

    if (!row || !row.file_url) {
      return res.status(404).json({ error: "Quote file not found" });
    }

    // ✅ CRITICAL FIX
    const blobName = decodeURIComponent(
      row.file_url.split("/").pop()
    );

    const blockBlobClient =
      containerClient.getBlockBlobClient(blobName);

    const download = await blockBlobClient.download();

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${blobName}"`
    );
    res.setHeader(
      "Content-Type",
      download.contentType || "application/pdf"
    );

    download.readableStreamBody.pipe(res);
  } catch (err) {
    console.error("Quote download error:", err);
    res.status(500).json({ error: "Download failed" });
  }
});


router.post("/rfq/reject", async (req, res) => {
  try {
    const { expense_id, reason, acted_by, stage } = req.body;

    if (!reason || !reason.trim()) {
      return res.status(400).json({ error: "Rejection reason required" });
    }

    const pool = await poolPromise;

      const rejectedStatus = `${stage}_REJECTED`;

    // 1️⃣ Update expense status
    await pool.execute(
      `UPDATE expense_requests
       SET current_status = ?
       WHERE id = ?`,
      [rejectedStatus, expense_id]
    );

    // 2️⃣ Insert into approval_logs
    await pool.execute(
      `INSERT INTO approval_logs
       (entity_type, entity_id, action, stage, comment, acted_by)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        "EXPENSE",
        expense_id,
        "REJECTED",
        stage,
        reason,
        acted_by
      ]
    );

    res.json({ message: "RFQ rejected successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "RFQ rejection failed" });
  }
});


router.post("/po/update-quantities", async (req, res) => {
  const { expense_id, items } = req.body;

  let conn;

  try {
    const pool = await poolPromise;
    conn = await pool.getConnection();
    await conn.beginTransaction();

    for (const item of items) {

      await conn.query(
        `UPDATE rfq_items
         SET quantity = ?
         WHERE id = ? AND expense_id = ?`,
        [
          Number(item.quantity),
          item.rfq_item_id,
          expense_id
        ]
      );
    }

    await conn.commit();

    return res.json({ message: "RFQ quantities updated successfully" });

  } catch (err) {

    if (conn) await conn.rollback();

    console.error("Update quantities error:", err);

    return res.status(500).json({ error: err.message });

  } finally {

    if (conn) conn.release();

  }
});

router.post("/rfq/undo", async (req, res) => {
  const { expense_id } = req.body;
 console.log(req.body);
  if (!expense_id) {
    return res.status(400).json({ message: "Expense ID required" });
  }

  const conn = await poolPromise.getConnection();

  try {
    await conn.beginTransaction();

    // 1️⃣ Delete RFQ items
    await conn.query(
      `DELETE FROM rfq_items WHERE expense_id = ?`,
      [expense_id]
    );

    // 2️⃣ Revert expense status
    await conn.query(
      `
      UPDATE expense_requests
      SET current_status = 'RFQ_PENDING',
          updated_at = NOW()
      WHERE id = ?
      `,
      [expense_id]
    );

    await conn.commit();

    res.json({
      message: "RFQ submission undone successfully"
    });

  } catch (err) {
    await conn.rollback();
    console.error("RFQ undo error:", err);
    res.status(500).json({ message: "Failed to undo RFQ submission" });
  } finally {
    conn.release();
  }
});

router.post("/undo-status", async (req, res) => {
  const { expense_id, current_status } = req.body;

console.log(req.body);
  if (!expense_id || !current_status) {
    return res.status(400).json({ message: "Expense ID and current status required" });
  }

  try {
    const pool = await poolPromise;

    // Determine previous status
    const undoMap = {
  RFQ_SUBMITTED: "RFQ_PENDING",
  RFQ_RECOMMENDED_DM: "RFQ_SUBMITTED",
  QUOTES_PENDING: "RFQ_RECOMMENDED_DM",
};

const previousStatus = undoMap[current_status];

    const [result] = await pool.query(
      `
      UPDATE expense_requests
      SET current_status = ?,
          updated_at = NOW()
      WHERE id = ?
      AND current_status = ?
      `,
      [previousStatus, expense_id, current_status]
    );

    if (result.affectedRows === 0) {
      return res.status(400).json({
        message: "Invalid undo operation",
      });
    }

    res.json({
      message: "Undo successful",
      new_status: previousStatus,
    });

  } catch (err) {
    console.error("Undo status error:", err);
    res.status(500).json({ message: "Failed to undo status" });
  }
});

router.post("/quotes/undo-upload", async (req, res) => {
  const { expense_id } = req.body;

  if (!expense_id) {
    return res.status(400).json({ message: "Expense ID required" });
  }

  let conn;

  try {
    const pool = await poolPromise;
    conn = await pool.getConnection();
    await conn.beginTransaction();

    /* ================= GET QUOTES ================= */
    const [quotes] = await conn.query(
      `SELECT id FROM expense_quotes WHERE expense_id = ?`,
      [expense_id]
    );

    const quoteIds = quotes.map(q => q.id);

    if (quoteIds.length > 0) {

      /* ================= DELETE QUOTE ITEMS ================= */
      await conn.query(
        `DELETE FROM expense_quote_items WHERE quote_id IN (?)`,
        [quoteIds]
      );

      /* ================= DELETE QUOTES ================= */
      await conn.query(
        `DELETE FROM expense_quotes WHERE id IN (?)`,
        [quoteIds]
      );
    }

    /* ================= REVERT STATUS ================= */
    await conn.query(
      `
      UPDATE expense_requests
      SET current_status = 'QUOTES_PENDING',
          updated_at = NOW()
      WHERE id = ?
      `,
      [ expense_id]
    );

    await conn.commit();

    res.json({
      message: "Quotes upload undone successfully"
    });

  } catch (err) {
    if (conn) await conn.rollback();
    console.error("Undo quote upload error:", err);

    res.status(500).json({
      message: "Failed to undo quote upload",
      error: err.message
    });
  } finally {
    if (conn) conn.release();
  }
});

router.post("/quotes/recommend/undo", async (req, res) => {
  let conn;

  try {
    const { expense_id} = req.body;

    if (!expense_id) {
      return res.status(400).json({
        error: "Expense ID required"
      });
    }

    const pool = await poolPromise;
    conn = await pool.getConnection();
    await conn.beginTransaction();

    /* 1️⃣ RESET ALL RECOMMENDATIONS */
    await conn.query(
      `
      UPDATE expense_quotes
      SET is_recommended = 0,
          reason = NULL
      WHERE expense_id = ?
      `,
      [expense_id]
    );

    /* 2️⃣ REVERT EXPENSE STATUS */
    await conn.query(
      `
      UPDATE expense_requests
      SET current_status = 'QUOTE_REVIEW_DM',
          updated_at = NOW()
      WHERE id = ?
      `,
      [expense_id]
    );

    await conn.commit();

    res.json({
      message: "Recommendation undone successfully"
    });

  } catch (err) {
    if (conn) await conn.rollback();
    console.error("UNDO RECOMMEND ERROR:", err);

    res.status(500).json({
      error: "Undo recommendation failed",
      details: err.message
    });
  } finally {
    if (conn) conn.release();
  }
});

router.post("/quotes/approve/undo", async (req, res) => {
  const { expense_id } = req.body;

  let conn;

  try {
    const pool = await poolPromise;
    conn = await pool.getConnection();
    await conn.beginTransaction();

    /* ================= RESET SELECTED QUOTES ================= */
    await conn.query(
      `
      UPDATE expense_quotes
      SET is_selected = 0
      WHERE expense_id = ?
      `,
      [expense_id]
    );

    /* ================= REVERT EXPENSE STATUS ================= */
    await conn.query(
      `
      UPDATE expense_requests
      SET
        current_status = 'QUOTE_APPROVAL_CH',
        selected_vendor_id = NULL,
        updated_at = NOW()
      WHERE id = ?
      `,
      [expense_id]
    );

    await conn.commit();

    res.json({
      message: "Vendor approval undone successfully",
      next_status: "QUOTE_APPROVAL_CH"
    });

  } catch (err) {
    if (conn) await conn.rollback();
    console.error("Undo vendor approval error:", err);

    res.status(500).json({
      error: "Undo vendor approval failed",
      details: err.message
    });
  } finally {
    if (conn) conn.release();
  }
});


router.get("/roles/:status", async (req, res) => {
  const { status } = req.params;

  console.log(status);
  try {
    const pool = await poolPromise;

    const [rows] = await pool.query(
      `SELECT role_id
       FROM workflow_roles
       WHERE status_code = ?`,
      [status]
    );

    const roles = rows.map(r => r.role_id);

    res.json({ roles });

  } catch (err) {
    console.error("Workflow roles error:", err);
    res.status(500).json({ error: "Failed to fetch workflow roles" });
  }
});

export default router;
