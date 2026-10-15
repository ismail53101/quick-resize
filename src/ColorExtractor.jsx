import React, { useState, useEffect, useRef } from 'react';
import { Upload, Palette, Copy, CheckCircle, X } from 'lucide-react';
import { clsx } from 'clsx';

export default function ColorExtractor({ isDark }) {
    const [imageSrc, setImageSrc] = useState(null);
    const [colors, setColors] = useState([]);
    const [copiedColor, setCopiedColor] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    // 👇👇👇 ✨ SEO Code for Color Extractor ✨ 👇👇👇
  useEffect(() => {
    document.title = "Color Palette Extractor | Quick Resize Tool";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Extract beautiful color palettes and HEX codes from any uploaded image automatically. Free online color picker by Quick Resize Tool.");
    }
  }, []);
  // 👆👆👆 ✨ YAHAN PASTE KARNA HAI ✨ 👆👆👆

    const canvasRef = useRef(null);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsProcessing(true);
        const reader = new FileReader();
        reader.onload = (event) => {
            setImageSrc(event.target.result);
            const img = new Image();
            img.onload = () => extractPalette(img);
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    };

    const extractPalette = (img) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        
        // Canvas ka size image ke mutabiq set karein (Performance ke liye chota size)
        const maxWidth = 600;
        const scale = Math.min(maxWidth / img.width, 1);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        const colorCounts = {};

        // Speed ke liye har 40th pixel check karein
        for (let i = 0; i < imageData.length; i += 160) {
            const r = imageData[i];
            const g = imageData[i + 1];
            const b = imageData[i + 2];
            // Alpha channel (transparency) ignore karein
            if (imageData[i + 3] < 128) continue; 

            // Convert to HEX
            const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
            colorCounts[hex] = (colorCounts[hex] || 0) + 1;
        }

        // Top 8 colors nikalna jo sab se zyada use hue hain
        const sortedColors = Object.keys(colorCounts)
            .sort((a, b) => colorCounts[b] - colorCounts[a])
            .slice(0, 8);

        setColors(sortedColors);
        setIsProcessing(false);
    };

    const copyToClipboard = (hex) => {
        navigator.clipboard.writeText(hex);
        setCopiedColor(hex);
        setTimeout(() => setCopiedColor(null), 2000);
    };

    const resetTool = () => {
        setImageSrc(null);
        setColors([]);
    };

    return (
        <div className="max-w-4xl mx-auto py-10 md:py-14 animate-in zoom-in-95 duration-300 px-4">
            <div className="text-center mb-10">
                <h2 className="text-3xl md:text-5xl font-black mb-4 md:mb-6 italic text-pink-500">Color Palette Extractor</h2>
                <p className="opacity-70 text-sm md:text-lg font-bold">Upload an image to magically extract its dominant colors.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 md:gap-10">
                {/* Upload & Image Area */}
                <div className={clsx("lg:w-1/2 space-y-4 sticky top-[100px] z-30", isDark ? "bg-[#05070a]" : "bg-slate-50")}>
                    <div className={clsx("h-[300px] md:h-[400px] rounded-[2rem] md:rounded-[3rem] border-4 flex items-center justify-center relative overflow-hidden shadow-2xl transition-colors", !imageSrc ? "border-dashed border-pink-500/40 bg-pink-500/5 hover:border-pink-500 cursor-pointer" : (isDark ? "bg-slate-800/50 border-slate-700" : "bg-white border-gray-200"))}>
                        
                        {!imageSrc ? (
                            <div className="text-center p-8 w-full h-full flex flex-col items-center justify-center group">
                                <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 z-10 cursor-pointer" />
                                <Upload size={60} className="mx-auto mb-4 md:mb-6 text-pink-500 group-hover:scale-110 transition-transform md:w-20 md:h-20" />
                                <p className="font-black text-lg md:text-2xl text-slate-700 dark:text-white">Drop Photo Here</p>
                            </div>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center p-4 bg-black/5 relative group">
                                <img src={imageSrc} alt="Uploaded" className="max-h-full max-w-full object-contain rounded-2xl shadow-lg" />
                                <button onClick={resetTool} className="absolute top-4 right-4 bg-red-500 p-3 rounded-2xl text-white shadow-2xl hover:rotate-90 transition-all z-20">
                                    <X size={24} />
                                </button>
                            </div>
                        )}
                        <canvas ref={canvasRef} className="hidden" />
                    </div>
                </div>

                {/* Colors Result Area */}
                <div className={clsx("lg:w-1/2 p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] border-2 shadow-2xl h-fit", isDark ? "bg-slate-800/50 border-slate-700" : "bg-white border-gray-200")}>
                    <div className="flex items-center gap-3 text-pink-500 border-b-2 border-gray-500/20 pb-4 md:pb-6 mb-6 md:mb-8">
                        <Palette size={28} /> <h3 className="font-black text-lg md:text-xl uppercase tracking-[0.2em] italic">Extracted Colors</h3>
                    </div>

                    {!imageSrc ? (
                        <div className="text-center py-10 opacity-50">
                            <Palette size={48} className="mx-auto mb-4" />
                            <p className="font-bold text-lg">Waiting for image...</p>
                        </div>
                    ) : isProcessing ? (
                        <div className="text-center py-10">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-pink-500 mx-auto mb-4"></div>
                            <p className="font-bold text-lg text-pink-500 animate-pulse">Extracting Colors...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6">
                            {colors.map((hex, index) => (
                                <div key={index} className="flex flex-col items-center gap-3 group">
                                    {/* Color Box */}
                                    <div 
                                        className="w-full aspect-square rounded-2xl shadow-inner border-4 border-white dark:border-slate-700 relative cursor-pointer overflow-hidden transform group-hover:scale-105 transition-all"
                                        style={{ backgroundColor: hex }}
                                        onClick={() => copyToClipboard(hex)}
                                    >
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                            {copiedColor === hex ? <CheckCircle className="text-white drop-shadow-md" size={32} /> : <Copy className="text-white opacity-0 group-hover:opacity-100 drop-shadow-md" size={28} />}
                                        </div>
                                    </div>
                                    {/* HEX Text */}
                                    <button 
                                        onClick={() => copyToClipboard(hex)}
                                        className="text-xs md:text-sm font-black uppercase tracking-widest bg-slate-100 dark:bg-slate-900 px-3 py-2 rounded-xl w-full hover:bg-pink-100 dark:hover:bg-pink-900/30 transition-colors text-slate-800 dark:text-slate-200"
                                    >
                                        {hex}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}