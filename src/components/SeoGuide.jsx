import React from 'react';
import { clsx } from 'clsx';

const SeoGuide = ({ activeTab, isDark }) => {
  const guides = {
    'Home': {
      title: "Why Use Quick Resize Pro for Your Content Creation?",
      content:"Welcome to QuickResize Pro – your all-in-one, privacy-first image processing toolkit. Designed specifically for digital creators, marketers, and developers, our platform provides fast, reliable, and free online tools. Whether you need to design high-quality social media thumbnails or securely compress heavy PDF files, we have you covered. Powered by advanced client-side technology, all file processing happens directly within your browser. This means zero server uploads, lightning-fast speeds, and 100% guaranteed data privacy. Experience seamless editing where your files never leave your device."
    },
    'Resize': {
      title: "How to Resize Images Without Losing Quality",
      content: "Resizing images for web optimization or social media platforms like Instagram and YouTube is crucial for faster page loads and better engagement. Using our Image Resizer, you can change the dimensions (width and height) while maintaining the aspect ratio. Our 'Auto-Enhance' feature uses smart algorithms to ensure your cropped and resized photos remain crisp and HD."
    },
    'Studio': {
      title: "Create Luxury Thumbnails & Social Posts",
      content: "A compelling thumbnail is the key to higher Click-Through Rates (CTR). Our Thumbnail Studio allows you to add custom text overlays (including Urdu Nastaliq and English fonts), apply elegant gradient shadows, and resize your canvas perfectly for YouTube, Instagram, or LinkedIn. All processing is done locally, making it a powerful, free alternative to expensive design software."
    },
    'Filter': {
      title: "Apply Professional Photo Filters Online",
      content: "Color grading can dramatically change the mood of your photography. With our Pro Filters tool, you can adjust brightness, contrast, saturation, and apply grayscale effects in real-time. This is perfect for standardizing your brand's aesthetic before posting to visual platforms like Pinterest or Instagram."
    },
    // Agar future mein mazeed tools ki SEO description add karni ho, toh yahan line add kar sakte hain
  };

  const currentGuide = guides[activeTab] || guides['Home'];

  return (
    <div className={clsx("mt-16 p-6 md:p-8 rounded-[2rem] border-t border-l border-r-4 border-b-4", isDark ? "bg-slate-900/50 border-slate-700" : "bg-blue-50/50 border-blue-100")}>
      <h3 className="text-lg md:text-xl font-black uppercase tracking-tighter text-blue-600 italic mb-3">
        {currentGuide.title}
      </h3>
      <p className="text-xs md:text-sm font-bold opacity-70 leading-relaxed">
        {currentGuide.content}
      </p>
    </div>
  );
};

export default SeoGuide;