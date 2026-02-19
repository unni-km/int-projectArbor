import express from "express";
const router = express.Router();
import bwipjs from "bwip-js";


router.get('/bycode', async (req, res) => {
  try {
      const code = req.query.code;   // FIXED

    if (!code) {
      return res.status(400).send("Code is required");
    }

    console.log("Received code:", code);

    const png = await bwipjs.toBuffer({
      bcid: 'code128',     // Barcode type
      text: code,          // Text to encode
      scale: 5,            // Higher = sharper print
      height: 15,          // mm
      includetext: true,
      textxalign: 'center',
    });

    res.set('Content-Type', 'image/png');
    res.send(png);

  } catch (err) {
    console.error(err);
    res.status(500).send('Error generating barcode');
  }
});

export default router;