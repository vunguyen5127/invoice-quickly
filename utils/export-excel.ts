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
    views: [{ state: "frozen", xSplit: 0, ySplit: 4 }],
  });

  // Define columns without headers to avoid auto-filling row 1
  sheet.columns = [
    { key: "invoice_number",   width: 20 },
    { key: "client_name",      width: 35 },
    { key: "status",           width: 16 },
    { key: "created_at",       width: 18 },
    { key: "due_date",         width: 18 },
    { key: "subtotal",         width: 18 },
    { key: "tax",              width: 14 },
    { key: "discount_amount",  width: 16 },
    { key: "shipping",         width: 14 },
    { key: "total_amount",     width: 18 },
    { key: "currency",         width: 12 },
  ];

  // Add Professional Title Row
  sheet.mergeCells("A1:K1");
  const titleCell = sheet.getCell("A1");
  titleCell.value = `${defaultCompanyName.toUpperCase()} - INVOICES REPORT`;
  titleCell.font = { name: "Arial", size: 14, bold: true, color: { argb: "FF1E293B" } }; // Slate 800
  titleCell.alignment = { vertical: "middle", horizontal: "center" };
  sheet.getRow(1).height = 35;

  // Add Export Date Row
  sheet.mergeCells("A2:K2");
  const dateCell = sheet.getCell("A2");
  dateCell.value = `Exported on: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} at ${new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`;
  dateCell.font = { name: "Arial", size: 9, italic: true, color: { argb: "FF64748B" } }; // Slate 500
  dateCell.alignment = { vertical: "middle", horizontal: "center" };
  sheet.getRow(2).height = 18;

  // Add Spacing Row
  sheet.getRow(3).height = 10;

  // Add Header Data Row
  const headers = [
    "INVOICE #", "CLIENT", "STATUS", "DATE ISSUED", "DUE DATE", 
    "SUBTOTAL", "TAX", "DISCOUNT", "SHIPPING", "TOTAL", "CURRENCY"
  ];
  const headerRow = sheet.getRow(4);
  headerRow.values = headers;
  headerRow.height = 24;

  // Style Header Row
  headerRow.eachCell((cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF4F46E5" }, // Modern Blue/Indigo
    };
    cell.font = {
      bold: true,
      color: { argb: "FFFFFFFF" },
      size: 10,
      name: "Arial",
    };
    cell.alignment = { vertical: "middle", horizontal: "center" };
    cell.border = {
      top:    { style: "thin", color: { argb: "FF4338CA" } },
      bottom: { style: "thin", color: { argb: "FF4338CA" } },
      left:   { style: "thin", color: { argb: "FF4338CA" } },
      right:  { style: "thin", color: { argb: "FF4338CA" } },
    };
  });

  // Status colors
  const STATUS_COLORS: Record<string, { bg: string; font: string }> = {
    paid:    { bg: "FFD1FAE5", font: "FF065F46" }, // emerald
    overdue: { bg: "FFFEE2E2", font: "FF991B1B" }, // red
    sent:    { bg: "FFDBEAFE", font: "FF1E40AF" }, // blue
    draft:   { bg: "FFF3F4F6", font: "FF4B5563" }, // gray
  };

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
        tax:             (inv as any).tax    ?? null,
        discount_amount: (inv as any).discount_amount != null ? -((inv as any).discount_amount) : null,
        shipping:        (inv as any).shipping ?? null,
        total_amount:    inv.total_amount    || 0,
        currency:        (inv.currency      || "USD").toUpperCase(),
      });

      row.height = 24;

      // Add zebra striping - apply to all columns even if empty
      const isOddRow = (row.number % 2 === 1);
      const rowBgColor = isOddRow ? 'FFF8FAFC' : 'FFFFFFFF'; // Light Slate for odd, White for even

      // Align and Style All Columns Uniformly
      const columnsToStyle = ["invoice_number", "client_name", "status", "created_at", "due_date", "subtotal", "tax", "discount_amount", "shipping", "total_amount", "currency"] as const;
      
      columnsToStyle.forEach((key) => {
        const cell = row.getCell(key);
        
        // Background color (Zebra striping)
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: rowBgColor } };
        
        // Font
        cell.font = { name: "Arial", size: 10, color: { argb: "FF334155" } }; // Uniform Slate 700
        
        // Default center alignment, override for client_name
        cell.alignment = { 
          vertical: "middle", 
          horizontal: key === "client_name" ? "left" : "center" 
        };
      });

      // Special formats
      for (const key of ["created_at", "due_date"] as const) {
        row.getCell(key).numFmt = "mmm dd, yyyy";
      }
      for (const key of ["subtotal", "tax", "discount_amount", "shipping", "total_amount"] as const) {
        row.getCell(key).numFmt = "#,##0.00";
      }

      // Status cell unique color (keep only font color)
      const statusCell = row.getCell("status");
      const colors = STATUS_COLORS[displayStatus] || STATUS_COLORS.draft;
      statusCell.font = { ...statusCell.font, color: { argb: colors.font } };
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
