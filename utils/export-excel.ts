import ExcelJS from 'exceljs';

export async function exportInvoicesToExcel(
  invoices: Array<{
    invoice_number?: string;
    client_name?: string;
    created_at?: string;
    due_date?: string;
    total_amount?: number;
    currency?: string;
    status?: string;
    tax_rate?: number;
    tax_amount?: number;
    discount?: number;
    discount_amount?: number;
    subtotal?: number;
    shipping?: number;
  }>,
  companyName: string
) {
  const defaultCompanyName = companyName || "Company";
  const dateFormatted = new Date().toLocaleDateString("en-US").replace(/\//g, "-");
  const filename = `${defaultCompanyName}_Invoices_${dateFormatted}.xlsx`;

  const workbook = new ExcelJS.Workbook();
  workbook.creator = "InvoiceQuickly";
  workbook.created = new Date();

  // Add sheet
  const sheet = workbook.addWorksheet("Invoices", {
    views: [{ state: "frozen", xSplit: 0, ySplit: 1 }],
  });

  // Define columns
  sheet.columns = [
    { header: "INVOICE #",       key: "invoice_number",   width: 18 },
    { header: "CLIENT",           key: "client_name",      width: 32 },
    { header: "STATUS",           key: "status",           width: 14 },
    { header: "DATE ISSUED",      key: "created_at",       width: 16 },
    { header: "DUE DATE",         key: "due_date",         width: 16 },
    { header: "SUBTOTAL",         key: "subtotal",         width: 16 },
    { header: "TAX",              key: "tax_amount",       width: 14 },
    { header: "DISCOUNT",         key: "discount_amount",  width: 14 },
    { header: "SHIPPING",         key: "shipping",         width: 14 },
    { header: "TOTAL",            key: "total_amount",     width: 16 },
    { header: "CURRENCY",         key: "currency",         width: 10 },
  ];

  // Status colors
  const STATUS_COLORS: Record<string, { bg: string; font: string }> = {
    paid:    { bg: "FFD1FAE5", font: "FF065F46" }, // emerald
    overdue: { bg: "FFFEE2E2", font: "FF991B1B" }, // red
    sent:    { bg: "FFDBEAFE", font: "FF1E40AF" }, // blue
    draft:   { bg: "FFF3F4F6", font: "FF4B5563" }, // gray
  };

  // Style Header Row
  const headerRow = sheet.getRow(1);
  headerRow.height = 30;
  headerRow.eachCell((cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF2563EB" },
    };
    cell.font = {
      bold: true,
      color: { argb: "FFFFFFFF" },
      size: 11,
      name: "Arial",
    };
    cell.alignment = { vertical: "middle", horizontal: "center" };
    cell.border = {
      top:    { style: "thin", color: { argb: "FF2563EB" } },
      left:   { style: "thin", color: { argb: "FF2563EB" } },
      bottom: { style: "thin", color: { argb: "FF2563EB" } },
      right:  { style: "thin", color: { argb: "FF2563EB" } },
    };
  });

  // Add Data Rows in chunks to prevent UI freeze on huge datasets
  const chunkSize = 500;
  for (let i = 0; i < invoices.length; i += chunkSize) {
    const chunk = invoices.slice(i, i + chunkSize);

    chunk.forEach((inv) => {
      const status = (inv.status || "draft").toLowerCase();
      // Calculate overdue if not explicitly set
      const displayStatus =
        status !== "paid" && inv.due_date && inv.due_date < new Date().toISOString().split("T")[0]
          ? "overdue"
          : status;

      const row = sheet.addRow({
        invoice_number:  inv.invoice_number  || "—",
        client_name:     inv.client_name     || "—",
        status:          displayStatus.charAt(0).toUpperCase() + displayStatus.slice(1),
        created_at:      inv.created_at      ? new Date(inv.created_at) : null,
        due_date:        inv.due_date        ? new Date(inv.due_date)   : null,
        subtotal:        inv.subtotal        ?? null,
        tax_amount:      inv.tax_amount      ?? null,
        discount_amount: inv.discount_amount != null ? -(inv.discount_amount) : null, // show as negative
        shipping:        inv.shipping        ?? null,
        total_amount:    inv.total_amount    || 0,
        currency:        (inv.currency      || "USD").toUpperCase(),
      });

      row.height = 24;

      // Alignment
      row.getCell("invoice_number").alignment  = { vertical: "middle", horizontal: "center" };
      row.getCell("client_name").alignment     = { vertical: "middle", horizontal: "left"   };
      row.getCell("status").alignment          = { vertical: "middle", horizontal: "center" };
      row.getCell("currency").alignment        = { vertical: "middle", horizontal: "center" };

      // Date columns
      for (const key of ["created_at", "due_date"] as const) {
        const cell = row.getCell(key);
        cell.numFmt = "mmm dd, yyyy";
        cell.alignment = { vertical: "middle", horizontal: "center" };
      }

      // Number columns
      for (const key of ["subtotal", "tax_amount", "discount_amount", "shipping", "total_amount"] as const) {
        const cell = row.getCell(key);
        cell.numFmt = "#,##0.00";
        cell.alignment = { vertical: "middle", horizontal: "right" };
      }

      // Status cell color
      const statusCell = row.getCell("status");
      const colors = STATUS_COLORS[displayStatus] || STATUS_COLORS.draft;
      statusCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: colors.bg } };
      statusCell.font = { bold: true, color: { argb: colors.font }, size: 10, name: "Arial" };
    });

    // Yield to main thread so UI remains smooth
    await new Promise((resolve) => setTimeout(resolve, 0));
  }

  // Export to Blob
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
