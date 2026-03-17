import ExcelJS from 'exceljs';

export async function exportInvoicesToExcel(
  invoices: Array<{
    invoice_number?: string;
    client_name?: string;
    created_at?: string;
    total_amount?: number;
    currency?: string;
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
    { header: "INVOICE NUMBER", key: "invoice_number", width: 20 },
    { header: "CLIENT NAME", key: "client_name", width: 35 },
    { header: "DATE ISSUED", key: "created_at", width: 18 },
    { header: "AMOUNT", key: "total_amount", width: 18 },
    { header: "CURRENCY", key: "currency", width: 12 },
  ];

  // Style Header Row
  const headerRow = sheet.getRow(1);
  headerRow.height = 30;
  headerRow.eachCell((cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF2563EB" }, // Tailwind Blue-600
    };
    cell.font = {
      bold: true,
      color: { argb: "FFFFFFFF" },
      size: 11,
      name: "Arial",
    };
    cell.alignment = {
      vertical: "middle",
      horizontal: "center",
    };
    cell.border = {
      top: { style: "thin", color: { argb: "FF2563EB" } },
      left: { style: "thin", color: { argb: "FF2563EB" } },
      bottom: { style: "thin", color: { argb: "FF2563EB" } },
      right: { style: "thin", color: { argb: "FF2563EB" } },
    };
  });

  // Add Data Rows in chunks to prevent UI freeze on huge datasets
  const chunkSize = 500;
  for (let i = 0; i < invoices.length; i += chunkSize) {
    const chunk = invoices.slice(i, i + chunkSize);
    
    chunk.forEach((inv) => {
      const row = sheet.addRow({
        invoice_number: inv.invoice_number || "—",
        client_name: inv.client_name || "—",
        created_at: inv.created_at ? new Date(inv.created_at) : null,
        total_amount: inv.total_amount || 0,
        currency: (inv.currency || "USD").toUpperCase(),
      });

      row.height = 25;

      // Apply alignment and number formats
      row.getCell("invoice_number").alignment = { vertical: "middle", horizontal: "center" };
      row.getCell("client_name").alignment = { vertical: "middle", horizontal: "left" };
      
      // Date formatting
      const dateCell = row.getCell("created_at");
      dateCell.alignment = { vertical: "middle", horizontal: "center" };
      dateCell.numFmt = "mmm dd, yyyy";

      // Amount formatting
      const amountCell = row.getCell("total_amount");
      amountCell.alignment = { vertical: "middle", horizontal: "right" };
      amountCell.numFmt = "#,##0.00"; // Generic number format

      row.getCell("currency").alignment = { vertical: "middle", horizontal: "center" };
    });

    // Yield to the main thread briefly so UI animations remain smooth
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
  
  // Trigger download
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
