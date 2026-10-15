import React, { useState, useEffect } from 'react';
import { Upload, ShieldCheck, Download, FileBarChart, Activity, Lock } from 'lucide-react';
import { clsx } from 'clsx';

export default function ExifStripper({ isDark }) {
    const [file, setFile] = useState(null);
    const [cleanedUrl, setCleanedUrl] = useState(null);
    const [status, setStatus] = useState('');
    const [savedBytes, setSavedBytes] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);

// 👇👇👇 ✨ SEO Code for Image Data Eraser ✨ 👇👇👇
  useEffect(() => {
    document.title = "Image Data Eraser (Remove EXIF) | Quick Resize Tool";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Remove hidden EXIF metadata from your photos to protect your privacy online. Free image data eraser by Quick Resize Tool.");
    }
  }, []);
  // 👆👆👆 ✨ YAHAN PASTE KARNA HAI ✨ 👆👆👆

    const formatSize = (bytes) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const handleUpload = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;
        
        setFile(selectedFile);
        setCleanedUrl(null);
        setSavedBytes(0);
        setStatus('');
        processImage(selectedFile);
    };

    const processImage = (file) => {
        setIsProcessing(true);
        setStatus("Scanning for hidden metadata... 🔍");

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                // Canvas trick: Drawing image to canvas automatically strips all EXIF data
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);

                // Convert back to image (1.0 means 100% original quality)
                canvas.toBlob((blob) => {
                    if (blob) {
                        const url = URL.createObjectURL(blob);
                        setCleanedUrl(url);
                        
                        // Calculate how much hidden data was removed
                        const diff = file.size - blob.size;
                        setSavedBytes(diff > 0 ? diff : 0);
                        
                        setStatus("Success! All hidden tracking data removed ✅");
                        setIsProcessing(false);
                    }
                }, file.type, 1.0);
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="max-w-4xl mx-auto py-10 md:py-14 animate-in zoom-in-95 duration-300 px-4">
            <div className="text-center mb-10">
                <h2 className="text-3xl md:text-5xl font-black mb-4 md:mb-6 italic text-emerald-500 flex justify-center items-center gap-3">
                    <ShieldCheck size={48} /> EXIF Privacy Stripper
                </h2>
                <p className="opacity-70 text-sm md:text-lg font-bold max-w-2xl mx-auto">
                    Remove hidden GPS locations, camera models, and tracking metadata from your photos before sharing them online.
                </p>
            </div>

            <div className={clsx("lg:w-full space-y-4 sticky top-[100px] z-30 pt-2 pb-2", isDark ? "bg-[#05070a]" : "bg-slate-50")}>
                {/* LARGE UPLOAD ZONE */}
                <div className={clsx("border-4 border-dashed rounded-[2rem] md:rounded-[3rem] p-10 md:p-16 relative group cursor-pointer transition-colors text-center shadow-2xl", 
                    !file ? "border-emerald-500/40 bg-emerald-500/5 hover:border-emerald-500" : (isDark ? "border-slate-700 bg-slate-800/50" : "border-gray-300 bg-white")
                )}>
                    <input type="file" accept="image/jpeg, image/png, image/webp" onChange={handleUpload} className="absolute inset-0 opacity-0 z-10 cursor-pointer" />
                    
                    {!file ? (
                        <>
                            <Upload size={60} className="mx-auto mb-4 md:mb-6 text-emerald-500 group-hover:scale-110 transition-transform md:w-20 md:h-20" />
                            <p className="font-black text-lg md:text-2xl text-slate-800 dark:text-white">Drop Photo to Secure it</p>
                            <p className="text-emerald-600 font-bold mt-2 text-sm md:text-base">100% Client-Side. No server uploads.</p>
                        </>
                    ) : (
                        <div className="space-y-4">
                            <Lock size={60} className="mx-auto text-emerald-500 md:w-20 md:h-20" />
                            <p className="font-black text-xl md:text-3xl text-emerald-600">{file.name}</p>
                        </div>
                    )}
                </div>

                {/* INFO BAR */}
                {file && (
                    <div className={clsx("p-4 md:p-6 rounded-2xl border-2 flex flex-wrap justify-around items-center text-xs md:text-sm font-black uppercase tracking-wider md:tracking-[0.2em] gap-2 shadow-md mt-6", isDark ? "bg-slate-800/90 border-slate-700 backdrop-blur-md" : "bg-white/95 border-gray-300 backdrop-blur-md")}>
                        <span className="opacity-60 flex items-center gap-2"><FileBarChart size={16} /> Orig: {formatSize(file.size)}</span>
                        <span className="text-emerald-600 font-black border-x-2 border-gray-500/20 px-6 md:px-8 italic text-center">
                            Removed Data: {formatSize(savedBytes)}
                        </span>
                        <span className="text-blue-500 flex items-center gap-2"><Activity size={16} /> Status: Secure</span>
                    </div>
                )}
            </div>

            {/* ACTION AREA */}
            {file && (
                <div className={clsx("mt-6 p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] border-2 text-center space-y-6 md:space-y-8 shadow-2xl", isDark ? "bg-slate-800/50 border-slate-700" : "bg-white border-gray-200")}>
                    
                    {isProcessing ? (
                        <div className="py-8">
                            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-500 mx-auto mb-4"></div>
                            <p className="font-black text-xl text-emerald-500 animate-pulse uppercase tracking-widest">Scrubbing Data...</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <p className="text-lg md:text-xl font-black text-emerald-600">{status}</p>
                            
                            <a href={cleanedUrl} download={`Secured_${file.name}`} className="w-full py-4 md:py-6 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-widest text-sm md:text-lg shadow-2xl transition-all flex items-center justify-center gap-3">
                                <Download size={24} /> Download Secured Image
                            </a>
                            
                            <p className="opacity-60 text-xs md:text-sm font-bold">The downloaded image has exactly the same visual quality, but without the hidden tracking tags.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}