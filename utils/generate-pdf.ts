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

  // Temporarily remove zoom from the preview wrapper to prevent cropping
  let originalZoom = "";
  const zoomWrapper = element.parentElement;
  if (zoomWrapper && zoomWrapper.className.includes("zoom")) {
    originalZoom = zoomWrapper.style.zoom || "";
    zoomWrapper.style.zoom = "1";
  }

  // Temporarily force dimensions on the element to ensure it renders full A4 size on mobile
  const originalWidth = element.style.width;
  const originalMaxWidth = element.style.maxWidth;
  const originalHeight = element.style.height;
  element.style.width = "794px";
  element.style.maxWidth = "794px";
  element.style.height = "1123px";

  // Wait a tick for theme to apply
  await new Promise((resolve) => setTimeout(resolve, 100));

  try {
    // We use html-to-image instead of html2canvas because it properly supports 
    // modern CSS features like Tailwind v4's oklch() colors.
    const imgDataUrl = await toJpeg(element, {
      quality: 1,
      backgroundColor: "#ffffff",
      pixelRatio: 2, // High resolution
      canvasWidth: 794,
      canvasHeight: 1123,
      style: {
        zoom: "1",
        width: "794px",
        height: "1123px"
      }
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
    if (zoomWrapper && zoomWrapper.className.includes("zoom")) {
      zoomWrapper.style.zoom = originalZoom;
    }
    
    element.style.width = originalWidth;
    element.style.maxWidth = originalMaxWidth;
    element.style.height = originalHeight;
  }
};
