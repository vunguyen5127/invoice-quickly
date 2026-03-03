import { toJpeg } from "html-to-image";
import jsPDF from "jspdf";

export const generatePDF = async (elementId: string, filename: string) => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id ${elementId} not found`);
    return;
  }

  // Optional: Force light mode for printing
  const originalTheme = document.documentElement.className;
  document.documentElement.classList.remove("dark");
  document.documentElement.classList.add("light");

  // Wait a tick for theme to apply
  await new Promise((resolve) => setTimeout(resolve, 100));

  try {
    // We use html-to-image instead of html2canvas because it properly supports 
    // modern CSS features like Tailwind v4's oklch() colors.
    const imgDataUrl = await toJpeg(element, {
      quality: 1,
      backgroundColor: "#ffffff",
      pixelRatio: 2, // High resolution
    });
    
    // Create new PDF instance (portrait, millimeters, A4 size)
    const pdf = new jsPDF("p", "mm", "a4");
    
    // Get PDF dimensions
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    // Calculate the dimensions of the image to fit the PDF
    // Usually element is styled for A4, but we can do a ratio math just in case
    const imgProps = pdf.getImageProperties(imgDataUrl);
    const contentWidth = pdfWidth;
    const contentHeight = (imgProps.height * pdfWidth) / imgProps.width;
    
    // Add the image to the PDF
    pdf.addImage(imgDataUrl, "JPEG", 0, 0, contentWidth, contentHeight);
    
    // Trigger the download
    pdf.save(`${filename}.pdf`);
  } catch (error) {
    console.error("Error generating PDF:", error);
    // Fallback to print dialog if html2canvas fails (e.g. due to oklch colors in Tailwind v4)
    alert("Could not generate PDF file directly. Opening print dialog instead. Please select 'Save to PDF'.");
    window.print();
  } finally {
    // Restore everything
    document.documentElement.className = originalTheme;
  }
};
