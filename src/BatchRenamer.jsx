import React, { useState, useEffect} from 'react';
import JSZip from 'jszip';
import { Upload, FileDown, FileBarChart, Activity } from 'lucide-react';
import { clsx } from 'clsx';

export default function BatchRenamer({ isDark }) {
    const [status, setStatus] = useState('');
    const [prefix, setPrefix] = useState('');
    const [zipUrl, setZipUrl] = useState(null);
    const [selectedFiles, setSelectedFiles] = useState([]);

// 👇👇👇 ✨ SEO Code for Batch Renamer ✨ 👇👇👇
  useEffect(() => {
    document.title = "Batch Image Renamer | Quick Resize Tool";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Rename multiple image files at once quickly and easily online for free with Quick Resize Tool. Best bulk renaming tool.");
    }
  }, []);
  // 👆👆👆 ✨ YAHAN PASTE KARNA HAI ✨ 👆👆👆

    const formatSize = (bytes) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedFiles(Array.from(e.target.files));
            setZipUrl(null);
            setStatus('');
        }
    };

    const processImages = async () => {
        if (selectedFiles.length === 0) return;
        const zip = new JSZip();
        setStatus("Processing... Please wait ⏳");

        for (let i = 0; i < selectedFiles.length; i++) {
            const file = selectedFiles[i];
            const extension = file.name.split('.').pop() || 'jpg';
            const fileName = `${prefix || 'image'}_${i + 1}.${extension}`;
            zip.file(fileName, file);
        }

        try {
            const content = await zip.generateAsync({ type: "blob" });
            setZipUrl(URL.createObjectURL(content));
            setStatus("Done! Ready to Download ✅");
        } catch (error) {
            setStatus("Error! Zip file nahi ban saki.");
        }
    };

    return (
        <div className="max-w-3xl mx-auto py-8 md:py-10 animate-in zoom-in-95 duration-300 px-4">
            {/* Header */}
            <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-black mb-3 md:mb-4 italic text-blue-500">Batch Image Renamer</h2>
                <p className="opacity-60 text-xs md:text-sm">Rename and ZIP multiple images instantly.</p>
            </div>

            {/* Upload Area (Matches Compressor Layout) */}
            <div className={clsx("lg:w-full space-y-3 sticky top-[64px] z-30 pt-2 pb-2", isDark ? "bg-[#05070a]" : "bg-slate-50")}>
                <div className="border-4 border-dashed border-blue-500/30 rounded-[2rem] md:rounded-[3rem] p-8 md:p-12 bg-blue-500/5 relative group cursor-pointer hover:border-blue-500 transition-colors text-center shadow-lg">
                    <input type="file" multiple accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 z-10 cursor-pointer" />
                    <Upload size={48} className="mx-auto mb-3 md:mb-4 text-blue-500 group-hover:scale-110 transition-transform md:w-16 md:h-16" />
                    <p className="font-bold text-sm md:text-lg">{selectedFiles.length > 0 ? `${selectedFiles.length} files selected` : 'Drop Multiple Images Here'}</p>
                </div>

                {/* File Info Bar */}
                {selectedFiles.length > 0 && (
                    <div className={clsx("p-3 md:p-4 rounded-xl md:rounded-2xl border flex flex-wrap justify-around items-center text-[9px] md:text-[10px] font-black uppercase tracking-wider md:tracking-[0.2em] gap-1 shadow-sm mt-4", isDark ? "bg-slate-800/90 border-slate-700 backdrop-blur-md" : "bg-white/95 border-gray-200 backdrop-blur-md")}>
                        <span className="opacity-60 flex items-center gap-1"><FileBarChart size={12} /> Count: {selectedFiles.length}</span>
                        <span className="text-blue-500 font-bold border-x border-gray-500/20 px-4 md:px-6 italic">Size: {formatSize(selectedFiles.reduce((a, f) => a + f.size, 0))}</span>
                        <span className="text-green-500 flex items-center gap-1"><Activity size={12} /> Ready to Rename</span>
                    </div>
                )}
            </div>

            {/* Controls Area */}
            {selectedFiles.length > 0 && (
                <div className={clsx("mt-4 p-5 md:p-6 rounded-[1.5rem] md:rounded-3xl border text-left space-y-5 md:space-y-6 shadow-xl", isDark ? "bg-slate-800/50 border-slate-700" : "bg-white border-gray-200")}>
                    <div>
                        <label className="flex justify-between text-[9px] md:text-[10px] font-black opacity-60 uppercase mb-2 md:mb-3 tracking-widest">
                            <span>New Name Prefix</span>
                            <span className="text-blue-500 font-bold">e.g., Trip_Photo</span>
                        </label>
                        <input 
                            type="text" 
                            placeholder="Enter prefix..." 
                            value={prefix}
                            onChange={(e) => setPrefix(e.target.value)} 
                            className={clsx("w-full p-3 md:p-4 rounded-xl border font-bold outline-none transition-all", isDark ? "bg-slate-900 border-slate-600 text-white focus:border-blue-500" : "bg-gray-50 border-gray-300 text-slate-900 focus:border-blue-500")}
                        />
                    </div>
                    
                    <div className="grid grid-cols-1 gap-3 md:gap-4">
                        {!zipUrl ? (
                            <button onClick={processImages} disabled={selectedFiles.length === 0} className="w-full py-3 md:py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl md:rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] md:text-xs shadow-xl disabled:opacity-50 transition-all flex items-center justify-center gap-2">
                                Rename & Create ZIP
                            </button>
                        ) : (
                            <a href={zipUrl} download={`${prefix || 'images'}_bundle.zip`} className="w-full py-3 md:py-4 bg-green-600 hover:bg-green-500 text-white rounded-xl md:rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] md:text-xs shadow-xl transition-all flex items-center justify-center gap-2">
                                <FileDown size={16} /> Download Ready ZIP
                            </a>
                        )}
                    </div>
                    {status && <p className="text-center text-xs font-bold text-blue-500 uppercase tracking-widest mt-2">{status}</p>}
                </div>
            )}
        </div>
    );
}