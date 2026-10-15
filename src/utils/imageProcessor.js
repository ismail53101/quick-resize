/**
 * Professional Image Processor
 * Handles: Resizing, Quality, and Filters (CSS-like)
 */
export const processImage = (imageElement, settings, filters) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Canvas size set karna (Resizing logic)
    canvas.width = settings.width;
    canvas.height = settings.height;

    // Filters apply karna (Canvas Context par)
    // Formula: brightness(100%) contrast(100%) etc.
    ctx.filter = `
      brightness(${filters.brightness}%) 
      contrast(${filters.contrast}%) 
      saturate(${filters.saturate}%) 
      grayscale(${filters.grayscale}%)
    `;

    // Image ko canvas par draw karna
    ctx.drawImage(imageElement, 0, 0, settings.width, settings.height);

    // Final result nikalna (Quality slider ke sath)
    const result = canvas.toDataURL('image/jpeg', settings.quality);
    resolve(result);
  });
};