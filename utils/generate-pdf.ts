export const generatePDF = async (elementId: string, filename: string) => {
  // To bypass html2canvas crashing on Tailwind v4's oklch() colors, 
  // we will use the browser's native print API.

  const originalTitle = document.title;
  document.title = filename; // Sets the default save name for the PDF

  // Optional: Force light mode for printing
  const originalTheme = document.documentElement.className;
  document.documentElement.classList.remove("dark");
  document.documentElement.classList.add("light");

  // Wait a tick for theme to apply
  await new Promise((resolve) => setTimeout(resolve, 50));

  window.print();

  // Restore everything
  document.title = originalTitle;
  document.documentElement.className = originalTheme;
};
