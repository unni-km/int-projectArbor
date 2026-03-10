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

const router = express.Router();

/* -----------------------------------------
   1. Multer (memory)
------------------------------------------ */
const upload = multer({ storage: multer.memoryStorage() });

/* -----------------------------------------
   2. Azure Key Vault + Blob Initialization
------------------------------------------ */
const keyVaultName = "ar-india-mgt-dev01";
const vaultUrl = `https://${keyVaultName}.vault.azure.net`;

const credential = new DefaultAzureCredential();
const secretClient = new SecretClient(vaultUrl, credential);

let containerClient = null;
let sharedKeyCredential = null;
let CONTAINER_NAME = "invoices";

async function initializeAzure() {
  const accountName = (await secretClient.getSecret("StorageAccountName")).value;
  const accountKey = (await secretClient.getSecret("StorageAccountKey")).value;

  sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);

  const blobServiceClient = new BlobServiceClient(
    `https://${accountName}.blob.core.windows.net`,
    sharedKeyCredential
  );

  containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);

  const exists = await containerClient.exists();
  if (!exists) {
    await containerClient.create();
  }

  console.log("Azure Blob Storage initialized");
}

initializeAzure();

/* -----------------------------------------
   SAS Token Generator
------------------------------------------ */
function generateSasUrl(blobName) {
  const expiresOn = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  const sasToken = generateBlobSASQueryParameters(
    {
      containerName: CONTAINER_NAME,
      blobName,
      permissions: BlobSASPermissions.parse("r"),
      expiresOn,
      protocol: SASProtocol.Https
    },
    sharedKeyCredential
  ).toString();

  const blobClient = containerClient.getBlockBlobClient(blobName);
  return `${blobClient.url}?${sasToken}`;
}

/* -----------------------------------------
   3. POST - Upload Invoice
------------------------------------------ */
router.post("/add", upload.single("invoice_file"), async (req, res) => {
  try {
    if (!containerClient) return res.status(500).json({ error: "Azure not initialized" });

    const { invoice_no, vendor_id, created_date, asset, invoice_amount } = req.body;
    if (!req.file) return res.status(400).json({ error: "Invoice file is required" });

    const blobName = `${Date.now()}-${req.file.originalname}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.uploadData(req.file.buffer, {
      blobHTTPHeaders: { blobContentType: req.file.mimetype },
    });

    const fileUrl = blockBlobClient.url;

    const pool = await poolPromise;
    await pool.execute(
      `INSERT INTO invoice (invoice_no, invoice_file_path, vendor_id, created_date, asset, created_at, invoice_amount)
       VALUES (?, ?, ?, ?, ?, NOW(), ?)`,
      [invoice_no, fileUrl, vendor_id, created_date, asset,invoice_amount]
    );

    res.status(201).json({ message: "Invoice uploaded", fileUrl });

  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Upload failed", details: err.message });
  }
});

/* -----------------------------------------
   4. GET - Fetch All Invoices
------------------------------------------ */
router.get("/", async (req, res) => {
  try {
    const pool = await poolPromise;
    const [rows] = await pool.execute(`
      SELECT 
        id,
        invoice_no,
        invoice_file_path AS invoice_url,
        DATE_FORMAT(created_at, '%d-%b-%Y') AS created_date
      FROM invoice
      ORDER BY created_at DESC
    `);

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Fetch failed", details: err.message });
  }
});

/* -----------------------------------------
   5. POST - Bulk Update
------------------------------------------ */
router.post("/bulk-update", async (req, res) => {
  const { inventoryIds, invoice_id } = req.body;

  if (!inventoryIds?.length || !invoice_id)
    return res.status(400).json({ error: "Missing fields" });

  try {
    const pool = await poolPromise;
    const placeholders = inventoryIds.map(() => "?").join(",");

    await pool.execute(
      `UPDATE inventorymanagement.m_inventory
       SET invoice_id = ?
       WHERE id IN (${placeholders})`,
      [invoice_id, ...inventoryIds]
    );

    res.json({ message: "Updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Update failed", details: err.message });
  }
});


router.post("/direct/upload", upload.single("invoice_file"), async (req, res) => {
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

    const blobName = `${Date.now()}-${req.file.originalname}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.uploadData(req.file.buffer, {
      blobHTTPHeaders: { blobContentType: req.file.mimetype },
    });

    const fileUrl = blockBlobClient.url;

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
   6. GET - Download Invoice (Private Container)
------------------------------------------ */
router.get("/download/:id", async (req, res) => {
  try {
    const pool = await poolPromise;

    const [rows] = await pool.execute(
      `SELECT invoice_file_path FROM invoice WHERE id = ?`,
      [req.params.id]
    );

    if (!rows.length) return res.status(404).json({ error: "Not found" });

const fileUrl = rows[0].invoice_file_path;

const blobName = decodeURIComponent(
  new URL(fileUrl).pathname.split("/").pop()
);


    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    const download = await blockBlobClient.download();

    res.setHeader("Content-Disposition", `attachment; filename="${blobName}"`);
    res.setHeader("Content-Type", download.contentType ?? "application/octet-stream");

    download.readableStreamBody.pipe(res);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Download failed" });
  }
});

export default router;
