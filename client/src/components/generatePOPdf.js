import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const generatePOPdf = async ({ request, vendor, poItems, poTd }) => {
  if (!poItems || poItems.length === 0) {
    alert("PO items not loaded yet");
    return;
  }

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  /* ================= HELPERS ================= */
  // Format currency
  const fmt = (num) => new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);

  /* ================= LOGO ================= */
  // Note: addImage usually requires a Base64 string or an HTMLImageElement in React. 
  // Passing a relative path like "/images/..." often fails in production builds.
  // For now, we wrap it to prevent crashing.
  try {
    const logo = "/images/Arborimg.png"; 
    doc.addImage(logo, "PNG", 10, 5, 15, 15); // Adjusted size/position
  } catch (err) {
    console.warn("Logo could not be loaded", err);
  }

  /* ================= HEADER ================= */
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  // Centered Title
  doc.text("PURCHASE ORDER", pageWidth / 2, 18, { align: "center" });

  // Company Name (Top Left under logo)
  doc.setFontSize(10);
  doc.text("TKEY EDUCATION SOLUTIONS PVT LTD", 14, 25);

  // PO Details (Top Right)
  doc.setFontSize(10);
  doc.text(`PO No   : ${request?.po_number || request?.id || "-"}`, pageWidth - 14, 18, { align: "right" });
  doc.text(`Date    : ${new Date().toLocaleDateString("en-IN")}`, pageWidth - 14, 23, { align: "right" });

  /* ================= ADDRESS BLOCK ================= */
  // Draw Box
  doc.setDrawColor(0);
  doc.setLineWidth(0.1);
  doc.rect(14, 30, pageWidth - 28, 35); // x, y, w, h

  // Line Divider in middle
  doc.line(pageWidth / 2, 30, pageWidth / 2, 65);

  // VENDOR (Left Side)
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("To (Vendor):", 18, 36);

  doc.setFont("helvetica", "normal");
  const vendorInfo = [
    vendor?.name || "Unknown Vendor",
    vendor?.address || "",
    `GSTIN: ${vendor?.gstin || "N/A"}`
  ].filter(Boolean).join("\n");
  
  doc.text(vendorInfo, 18, 42);

  // SHIP TO (Right Side)
  doc.setFont("helvetica", "bold");
  doc.text("Ship & Bill To:", pageWidth / 2 + 4, 36);

  doc.setFont("helvetica", "normal");
  doc.text(
    `Tkey Education Solutions Private Limited\n3rd Floor, M-Squared Annex Building\nTechnopark Campus, Trivandrum\nKerala - 695 015\nGSTIN: 32AAKCT0137G1ZO`,
    pageWidth / 2 + 4,
    42
  );

  /* ================= ITEMS TABLE ================= */
  
  // 1. Calculate Data Body
  const tableBody = poItems.map((item, idx) => {
    // Parse values safely
    const qty = Number(item.quantity || 0);
    const unitPrice = Number(item.unit_price || 0);
    const gstPercent = item.gst_rate ? Number(item.gst_rate) : 0; // Use item specific GST

    // Calculations
    const gstAmountPerUnit = unitPrice * (gstPercent / 100);
    const unitRateAfterTax = unitPrice + gstAmountPerUnit;
    const totalLineAmount = qty * unitRateAfterTax;

    return [
      idx + 1,                          // No
      item.item_name || "-",            // Description
      qty,                              // Qty
      item.uom || "Nos",                // UOM
      fmt(unitPrice),                   // Rate (Base)
      `${gstPercent}%`,                 // GST %
      fmt(unitRateAfterTax),            // Unit Rate (Inc Tax)
      fmt(totalLineAmount)              // Total Amount
    ];
  });

  // 2. Calculate Grand Total
  const grandTotal = poItems.reduce((sum, item) => {
    const qty = Number(item.quantity || 0);
    const unitPrice = Number(item.unit_price || 0);
    const gstPercent = item.gst_rate ? Number(item.gst_rate) : 0;
    
    const lineTotal = qty * (unitPrice + (unitPrice * gstPercent / 100));
    return sum + lineTotal;
  }, 0);


  // 3. Render Table
  autoTable(doc, {
    startY: 70,
    theme: "grid",
    head: [
      [
        "Sn",
        "Description",
        "Qty",
        "UOM",
        "Rate",
        "GST",
        "Rate (Inc. Tax)",
        "Amount"
      ]
    ],
    body: tableBody,
    styles: {
      fontSize: 8,
      cellPadding: 2,
      valign: 'middle',
      lineColor: [200, 200, 200],
      lineWidth: 0.1,
    },
    headStyles: {
      fillColor: [41, 128, 185], // Professional Blue
      textColor: 255,
      fontStyle: "bold",
      halign: "center"
    },
    columnStyles: {
      0: { halign: "center", cellWidth: 10 }, // Sn
      1: { halign: "left" },                  // Desc (Auto width)
      2: { halign: "center", cellWidth: 15 }, // Qty
      3: { halign: "center", cellWidth: 15 }, // UOM
      4: { halign: "right", cellWidth: 20 },  // Rate
      5: { halign: "center", cellWidth: 15 }, // GST
      6: { halign: "right", cellWidth: 25 },  // Rate (Inc Tax)
      7: { halign: "right", cellWidth: 30 },  // Amount
    }
  });

  /* ================= TOTALS SECTION ================= */
  const finalY = doc.lastAutoTable.finalY + 5;

  // Draw Total Box
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  
  // Label
  doc.text("Grand Total (INR):", pageWidth - 70, finalY + 5);
  
  // Amount
  doc.setFontSize(12);
  doc.text(fmt(grandTotal), pageWidth - 14, finalY + 5, { align: "right" });
  
  // Underline Total
  doc.setLineWidth(0.5);
  doc.line(pageWidth - 70, finalY + 7, pageWidth - 14, finalY + 7);

  /* ================= TERMS & CONDITIONS ================= */
  const termsY = finalY + 20;

  if (poTd?.terms || poTd) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Terms & Conditions:", 14, termsY);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    
    // Handle both object.terms or raw string
    const rawTerms = typeof poTd === 'string' ? poTd : (poTd?.terms || "");
    const splitTerms = doc.splitTextToSize(rawTerms, pageWidth - 28);
    
    doc.text(splitTerms, 14, termsY + 5);
  }

  /* ================= FOOTER ================= */
  // Add page numbers
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(
      `Page ${i} of ${pageCount}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: "center" }
    );
    doc.text("Authorized Signatory", pageWidth - 14, pageHeight - 30, { align: "right" });
  }

  /* ================= SAVE ================= */
  doc.save(`PO_${request?.po_number || request?.id}.pdf`);
};

export default generatePOPdf;