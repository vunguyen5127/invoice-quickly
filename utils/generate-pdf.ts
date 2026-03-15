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

  // Temporarily force dimensions on the element to ensure it renders full content
  const originalWidth = element.style.width;
  const originalMaxWidth = element.style.maxWidth;
  const originalHeight = element.style.height;
  const originalMinHeight = element.style.minHeight;
  
  // A4 Reference Width in pixels at 96 DPI is ~794px
  const targetWidth = 794;
  element.style.width = `${targetWidth}px`;
  element.style.maxWidth = `${targetWidth}px`;
  element.style.height = "auto";
  element.style.minHeight = "auto";

  // Wait a tick for styles to apply and get the actual content height
  await new Promise((resolve) => setTimeout(resolve, 100));
  const fullHeight = element.scrollHeight;

  try {
    // We use html-to-image to capture the full content height
    const imgDataUrl = await toJpeg(element, {
      quality: 0.95,
      backgroundColor: "#ffffff",
      pixelRatio: 2, 
      canvasWidth: targetWidth,
      canvasHeight: fullHeight,
      style: {
        zoom: "1",
        width: `${targetWidth}px`,
        height: `${fullHeight}px`
      }
    });
    
    // Create new PDF instance (portrait, millimeters, A4 size)
    const pdf = new jsPDF("p", "mm", "a4");
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    // SCALE-TO-FIT Optimization:
    const pxToMm = pdfWidth / targetWidth;
    const contentHeightMm = fullHeight * pxToMm;
    const fitThreshold = pdfHeight * 1.08; 
    
    if (contentHeightMm <= fitThreshold) {
      // Scale to fit single page if only slightly over
      pdf.addImage(imgDataUrl, "JPEG", 0, 0, pdfWidth, Math.min(contentHeightMm, pdfHeight));
    } else {
      // Improved Tiling: We add a small overlap or handle the split more gracefully
      let heightLeft = contentHeightMm;
      let pageNumber = 1;

      while (heightLeft > 0) {
        if (pageNumber > 1) pdf.addPage();
        
        // Add the image segment for the current page
        pdf.addImage(
          imgDataUrl, 
          "JPEG", 
          0, 
          -((pageNumber - 1) * pdfHeight), 
          pdfWidth, 
          contentHeightMm
        );
        
        heightLeft -= pdfHeight;
        pageNumber++;
      }
    }
    
    // Trigger the download
    pdf.save(`${filename}.pdf`);
  } catch (error) {
    console.error("Error generating PDF:", error);
    alert("Could not generate PDF file directly. Opening print dialog instead.");
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
    element.style.minHeight = originalMinHeight;
  }
};
