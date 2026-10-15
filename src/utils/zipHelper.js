import JSZip from 'jszip';
import { saveAs } from 'file-saver';

/**
 * @param {Array} images - Array of objects containing { name, data }
 * images.data should be the base64 or blob of the resized image
 */
export const downloadAllAsZip = async (images) => {
  const zip = new JSZip();

  images.forEach((img, index) => {
    // Base64 data se image ka asli content nikalna
    const imageData = img.data.split(',')[1];
    const fileName = img.name || `resized-image-${index + 1}.jpg`;
    
    zip.file(fileName, imageData, { base64: true });
  });

  // ZIP file generate karna
  const content = await zip.generateAsync({ type: "blob" });
  
  // User ke computer par download karwana
  saveAs(content, "QuickResize_Bulk_Images.zip");
};