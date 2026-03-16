/**
 * Converts an image (File or Data URL) to WebP format using the Canvas API,
 * with optional resizing to maintain performance and reduce storage.
 * 
 * @param input - The image to convert (File or string data URL)
 * @param quality - The quality of the resulting WebP image (0 to 1)
 * @param maxWidth - Maximum width of the resulting image (optional)
 * @param maxHeight - Maximum height of the resulting image (optional)
 * @returns A promise that resolves to the WebP data URL
 */
export async function convertToWebP(
  input: File | string, 
  quality: number = 0.9,
  maxWidth: number = 800,
  maxHeight: number = 800
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      let width = img.width;
      let height = img.height;

      // Calculate new dimensions while maintaining aspect ratio
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }
      if (height > maxHeight) {
        width = Math.round((width * maxHeight) / height);
        height = maxHeight;
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }
      
      // Use better image smoothing
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      
      ctx.drawImage(img, 0, 0, width, height);
      
      // Convert to WebP
      const webpDataUrl = canvas.toDataURL('image/webp', quality);
      resolve(webpDataUrl);
    };
    
    img.onerror = () => {
      reject(new Error("Could not load image"));
    };
    
    if (typeof input === 'string') {
      img.src = input;
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };
      reader.onerror = () => {
        reject(new Error("Could not read file"));
      };
      reader.readAsDataURL(input);
    }
  });
}
