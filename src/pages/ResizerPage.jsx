import React, { useState, useEffect } from 'react';
import { clsx } from 'clsx';
import { Image as ImageIcon, X, Scissors, Lock, Unlock, Zap, Download, Sliders, ChevronRight } from 'lucide-react';

const ResizerPage = ({ isDark, setActiveTab, setFilterPreview, setFilterImg, executeWithLimit }) => {
  const [resizerImg, setResizerImg] = useState(null);
  const [resizerPreview, setResizerPreview] = useState(null);
  const [resizeDims, setResizeDims] = useState({ w: 0, h: 0 });
  const [origDims, setOrigDims] = useState({ w: 0, h: 0 });
  const [lockedRatio, setLockedRatio] = useState(true);
  const [fileSize, setFileSize] = useState({ size: 0, unit: 'KB' });
  const [resizeQuality, setResizeQuality] = useState(90);
  const [estimatedSize, setEstimatedSize] = useState(null);
  const [format, setFormat] = useState('image/jpeg');
  const [enhanceHD, setEnhanceHD] = useState(false);

  // ✨ SEO Code for Image Resizer ✨
  useEffect(() => {
    document.title = "Image Resizer Pro | Quick Resize Tool";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Fast and free online image resizer. Resize photos for social media instantly without losing quality.");
    }
  }, []);

  const handleResizerUpload = (e) => {
    const file = e.target.files[0]; if (!file) return;
    let fSize = file.size / 1024;
    setFileSize({ size: fSize > 1024 ? (fSize / 1024).toFixed(2) : fSize.toFixed(2), unit: fSize > 1024 ? 'MB' : 'KB' });
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => { setResizerImg(img); setResizerPreview(ev.target.result); setOrigDims({ w: img.width, h: img.height }); setResizeDims({ w: img.width, h: img.height }); };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    const estimate = async () => {
      if (!resizerImg || resizeDims.w === 0) return;
      const cvs = document.createElement('canvas'); const scaleFactor = enhanceHD ? 4 : 1; 
      cvs.width = resizeDims.w * scaleFactor; cvs.height = resizeDims.h * scaleFactor;
      const ctx = cvs.getContext('2d');
      if (enhanceHD) ctx.filter = 'contrast(105%) saturate(110%)';
      ctx.drawImage(resizerImg, 0, 0, cvs.width, cvs.height);
      const finalQuality = enhanceHD ? 1.0 : resizeQuality / 100;
      cvs.toBlob((blob) => { if (blob) { let s = blob.size / 1024; let u = 'KB'; if (s > 1024) { s = s / 1024; u = 'MB'; } setEstimatedSize(`${s.toFixed(2)} ${u}`); } }, format, finalQuality);
    };
    const timer = setTimeout(estimate, 300); return () => clearTimeout(timer);
  }, [resizeDims, resizeQuality, resizerImg, format, enhanceHD]);

  const changeDim = (type, val) => {
    let v = parseInt(val) || 0; const ratio = origDims.w / origDims.h;
    if (type === 'w') { setResizeDims(prev => ({ ...prev, w: v, h: lockedRatio ? Math.round(v / ratio) : prev.h })); }
    else { setResizeDims(prev => ({ ...prev, h: v, w: lockedRatio ? Math.round(v * ratio) : prev.w })); }
  };

  const downloadResized = () => {
    if (!resizerImg) return;
    const cvs = document.createElement('canvas'); const scaleFactor = enhanceHD ? 4 : 1; 
    cvs.width = resizeDims.w * scaleFactor; cvs.height = resizeDims.h * scaleFactor;
    const ctx = cvs.getContext('2d');
    if (enhanceHD) ctx.filter = 'contrast(105%) saturate(110%)';
    ctx.drawImage(resizerImg, 0, 0, cvs.width, cvs.height);
    const link = document.createElement('a'); link.href = cvs.toDataURL(format, enhanceHD ? 1.0 : resizeQuality / 100);
    link.download = `QuickResize_${enhanceHD ? 'HD_' : ''}${resizeDims.w * scaleFactor}x${resizeDims.h * scaleFactor}.${format.split('/')[1]}`; link.click();
  };

  const sendToFilter = () => {
    if (resizerPreview && resizerImg) {
      const cvs = document.createElement('canvas'); const scaleFactor = enhanceHD ? 4 : 1;
      cvs.width = resizeDims.w * scaleFactor; cvs.height = resizeDims.h * scaleFactor;
      const ctx = cvs.getContext('2d'); if (enhanceHD) ctx.filter = 'contrast(105%) saturate(110%)';
      ctx.drawImage(resizerImg, 0, 0, cvs.width, cvs.height);
      const resizedDataUrl = cvs.toDataURL(format, enhanceHD ? 1.0 : resizeQuality / 100);
      setFilterPreview(resizedDataUrl);
      const imgObj = new Image(); imgObj.onload = () => { setFilterImg(imgObj); setActiveTab('Filter'); }; imgObj.src = resizedDataUrl;
    }
  };

  return (
    <div className="mt-4">
        <div className="text-center md:text-left mb-6">
            <h2 className="text-2xl font-black italic text-blue-500">Image Resizer Tool</h2>
            <p className="text-sm opacity-60 font-bold">Resize, Crop & Change Formats Securely.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-5 md:gap-6">
          <div className={clsx("lg:w-3/5 space-y-4 sticky top-[80px] z-30 pt-2 pb-2", isDark ? "bg-[#05070a]" : "bg-slate-50")}>
            <div className={clsx("h-[250px] sm:h-[300px] md:h-[450px] rounded-[1.5rem] md:rounded-[2rem] border-2 flex items-center justify-center relative overflow-hidden shadow-xl", isDark ? "bg-slate-800/50 border-slate-700" : "bg-white border-gray-200")}>
              {!resizerPreview ? (
                <div className="text-center p-6 md:p-10 cursor-pointer group">
                  <input type="file" onChange={handleResizerUpload} className="absolute inset-0 opacity-0 z-10 cursor-pointer" />
                  <ImageIcon size={44} className="mx-auto text-blue-500 mb-3 opacity-50 group-hover:scale-110 transition-transform" />
                  <p className="font-black text-xs md:text-sm opacity-60 uppercase tracking-widest italic">Upload Photo Here</p>
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center p-3 md:p-6 bg-black/5">
                  <img src={resizerPreview} alt="Preview" className="max-h-full max-w-full object-contain rounded shadow-lg" style={{ filter: enhanceHD ? 'contrast(105%) saturate(110%)' : 'none' }} />
                  <button onClick={() => { setResizerPreview(null); setResizerImg(null); }} className="absolute top-3 right-3 md:top-5 md:right-5 bg-red-500 p-2 rounded-xl text-white shadow-xl hover:rotate-90 transition-all z-20"><X size={16} /></button>
                </div>
              )}
            </div>
            
            {/* SEO Interlinking */}
            <div className="text-center pt-4">
               <p className="text-[10px] md:text-xs font-bold opacity-60 uppercase tracking-widest flex items-center justify-center gap-1">
                 Done Resizing? <button onClick={() => setActiveTab('Palette')} className="text-blue-500 hover:underline flex items-center">Extract Colors <ChevronRight size={12}/></button>
               </p>
            </div>
          </div>

          <div className={clsx("lg:w-2/5 p-5 md:p-7 rounded-[1.5rem] md:rounded-[2rem] border space-y-5 md:space-y-6 h-fit shadow-xl z-10", isDark ? "bg-slate-800/50 border-slate-700" : "bg-white border-gray-200")}>
            <div className="flex items-center gap-2 text-blue-500 border-b border-gray-500/20 pb-3 md:pb-4">
              <Scissors size={20} /> <h3 className="font-black text-xs md:text-sm uppercase tracking-[0.2em] italic">Dimensions</h3>
            </div>
            <div className="grid grid-cols-2 gap-3 md:gap-5 relative">
              <div className="bg-black/10 p-3 md:p-4 rounded-xl border border-gray-500/20">
                <label className="text-[10px] md:text-xs font-black opacity-50 uppercase mb-1 block tracking-widest">Width</label>
                <input type="number" value={resizeDims.w} onChange={e => changeDim('w', e.target.value)} className="bg-transparent w-full font-black outline-none text-blue-600 text-base md:text-lg" />
              </div>
              <div className="bg-black/10 p-3 md:p-4 rounded-xl border border-gray-500/20">
                <label className="text-[10px] md:text-xs font-black opacity-50 uppercase mb-1 block tracking-widest">Height</label>
                <input type="number" value={resizeDims.h} onChange={e => changeDim('h', e.target.value)} className="bg-transparent w-full font-black outline-none text-blue-600 text-base md:text-lg" />
              </div>
              <button onClick={() => setLockedRatio(!lockedRatio)} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform">{lockedRatio ? <Lock size={14} /> : <Unlock size={14} />}</button>
            </div>

            {resizerImg && (
              <div className={clsx("p-3 md:p-4 rounded-xl border space-y-3", isDark ? "bg-slate-900 border-slate-700" : "bg-gray-50 border-gray-300")}>
                <div className="flex justify-between items-center text-[10px] md:text-xs font-black uppercase tracking-widest">
                  <span className="opacity-60">Original: {fileSize.size} {fileSize.unit}</span>
                  <span className="text-blue-600">Output: {estimatedSize || 'Calculating...'}</span>
                </div>
                <div>
                  <label className="flex justify-between text-[10px] md:text-xs font-black opacity-70 uppercase mb-2 tracking-widest">
                    <span>Image Quality</span>
                    <span className="text-blue-600">{resizeQuality}%</span>
                  </label>
                  <input 
                    type="range" min="10" max="100" value={resizeQuality} onChange={(e) => setResizeQuality(e.target.value)} disabled={enhanceHD}
                    className="w-full h-1.5 md:h-2 bg-slate-300 rounded-lg accent-blue-600 cursor-pointer disabled:opacity-50" 
                  />
                </div>
              </div>
            )}

            <select value={format} onChange={(e) => setFormat(e.target.value)} className={clsx("w-full p-3 md:p-4 rounded-xl border text-xs font-black uppercase tracking-widest outline-none", isDark ? "bg-slate-900 border-slate-700 text-blue-400" : "bg-gray-50 border-gray-300 text-indigo-900")}>
              <option value="image/jpeg">Output: JPG</option><option value="image/png">Output: PNG</option><option value="image/webp">Output: WebP</option>
            </select>

            <div className={clsx("flex items-center justify-between p-3 md:p-4 rounded-xl border", isDark ? "bg-slate-900 border-slate-700" : "bg-gray-50 border-gray-300")}>
              <div className="flex items-center gap-2">
                <Zap size={16} className={enhanceHD ? "text-yellow-400" : "text-gray-400"} />
                <span className="text-xs font-black uppercase tracking-widest">Auto-Enhance (Max HD)</span>
              </div>
              <input type="checkbox" checked={enhanceHD} onChange={(e) => setEnhanceHD(e.target.checked)} className="w-5 h-5 accent-blue-600 cursor-pointer" />
            </div>

            <div className="space-y-3 md:space-y-4">
              <button onClick={() => executeWithLimit(downloadResized)} disabled={!resizerImg} className="w-full py-3.5 md:py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-black uppercase tracking-[0.2em] text-[10px] md:text-xs shadow-xl disabled:opacity-30 transition-all flex items-center justify-center gap-2"><Download size={16} /> Download Size</button>
              <button onClick={sendToFilter} disabled={!resizerImg} className="w-full py-3.5 md:py-4 bg-green-600 hover:bg-green-500 text-white rounded-xl font-black uppercase tracking-[0.2em] text-[10px] md:text-xs shadow-xl disabled:opacity-30 transition-all flex items-center justify-center gap-2"><Sliders size={16} /> Edit in Filters</button>
            </div>
          </div>
        </div>
    </div>
  );
};

export default ResizerPage;