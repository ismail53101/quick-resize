import BatchRenamer from './BatchRenamer';
import SocialStudio from './SocialStudio'; // Naya Luxury Tool
import ColorExtractor from './ColorExtractor';
import ExifStripper from './ExifStripper';
import GlassGenerator from './GlassGenerator';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrowserRouter as Router, useLocation, useNavigate } from 'react-router-dom'; // ✨ SEO Ke Liye Router
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react'; // ✨ CLERK IMPORT
import { 
  Home, Image as ImageIcon, Box, Sun, Moon, Download, 
  Scissors, Lock, Unlock, X, FileBarChart, Activity, 
  Upload, Zap, Settings, Palette, ShieldCheck, Sliders, 
  MoreVertical, MoreHorizontal, FastForward, CheckCircle, Layout,
  Share2, Type, Sparkles 
} from 'lucide-react';
import { clsx } from 'clsx';
import JSZip from 'jszip'; 
import logo from './logo.jpg'; 

// ==========================================
// Letter Animation & Trust Badge Components
// ==========================================
const logoVariant = {
  initial: { y: 0 },
  hover: (i) => ({ y: [0, -4, 0], scale: [1, 1.1, 1], transition: { duration: 0.6, delay: i * 0.04, repeat: Infinity } }),
};

const AnimatedLogo = () => {
  const lettersQ = "Quick".split(""); const lettersR = "Resize".split(""); const lettersP = "Pro".split("");
  return (
    <motion.div className="flex select-none items-center text-xl md:text-2xl tracking-tighter" initial="initial" whileHover="hover">
      {lettersQ.map((l, i) => <motion.span key={i} className="text-blue-600 font-black" custom={i} variants={logoVariant}>{l}</motion.span>)}
      {lettersR.map((l, i) => <motion.span key={i + 5} className="text-green-600 font-black" custom={i + 5} variants={logoVariant}>{l}</motion.span>)}
      <span className="relative flex font-black text-slate-900 dark:text-white">
        {lettersP.map((l, i) => <motion.span key={i + 11} custom={i + 11} variants={logoVariant}>{l}</motion.span>)}
      </span>
    </motion.div>
  );
};

const FeatureBadge = ({ icon: Icon, title, desc, colorClass, isDark }) => (
    <div className={clsx("flex items-center gap-4 p-4 md:p-5 rounded-2xl border-2 transition-transform hover:scale-105 shadow-sm", colorClass, isDark ? "bg-opacity-10" : "bg-opacity-50")}>
        <div className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-md">
            <Icon size={24} />
        </div>
        <div className="text-left">
            <h4 className="font-black text-sm md:text-base uppercase tracking-widest">{title}</h4>
            <p className="text-[10px] md:text-xs font-bold opacity-70">{desc}</p>
        </div>
    </div>
);

// ==========================================
// 1. HOME PAGE COMPONENT
// ==========================================
const HomePage = ({ setActiveTab, isDark }) => (
  <div className="py-10 md:py-16 text-center space-y-8 animate-in fade-in duration-500 overflow-hidden">
    <motion.h1 className="text-3xl md:text-5xl font-black italic tracking-tighter flex justify-center items-center gap-2 md:gap-4 flex-wrap" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
      Welcome to <span className="text-blue-500">Quick</span><span className="text-green-500">Resize</span> Studio
    </motion.h1>
    <p className="opacity-70 max-w-2xl mx-auto text-base md:text-lg px-4 font-bold">Your all-in-one privacy-first toolkit for image resizing, pro filtering, and social media thumbnails.</p>

    <div className="grid md:grid-cols-3 gap-5 md:gap-6 max-w-5xl mx-auto mt-10 md:mt-14 mb-10 px-4">
      {[
        { tab: 'Resize', icon: ImageIcon, color: 'blue', title: 'Image Resizer', desc: 'Crop, resize, and auto-enhance HD.' },
        { tab: 'Studio', icon: Share2, color: 'purple', title: 'Thumbnail Studio', desc: 'Add text, luxury filters & graphics.' },
        { tab: 'Filter', icon: Sliders, color: 'green', title: 'Pro Filters', desc: 'Studio effects without Photoshop.' }
      ].map((item, index) => (
        <motion.div key={item.tab} onClick={() => setActiveTab(item.tab)} className={clsx("p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border cursor-pointer transition-all shadow-lg text-left", isDark ? "hover:bg-slate-800 border-slate-700/50" : "hover:bg-gray-100 border-gray-200", item.color === 'blue' ? "bg-blue-500/5" : item.color === 'green' ? "bg-green-500/5" : "bg-purple-500/5")} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }} whileHover={{ scale: 1.05, y: -5 }}>
          <item.icon size={44} className={`mx-auto mb-3 md:mb-4 text-${item.color}-500`} />
          <h2 className="font-black text-xl md:text-2xl mb-2 italic text-center">{item.title}</h2>
          <p className="text-xs md:text-sm opacity-70 font-semibold text-center">{item.desc}</p>
        </motion.div>
      ))}
    </div>

    <div className="max-w-5xl mx-auto px-4 mb-10 text-left">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FeatureBadge icon={ShieldCheck} title="100% Private" desc="No Server Uploads" colorClass="text-blue-600 border-blue-500/20 bg-blue-50" isDark={isDark} />
            <FeatureBadge icon={FastForward} title="Lightning Fast" desc="Zero Loading Time" colorClass="text-green-600 border-green-500/20 bg-green-50" isDark={isDark} />
            <FeatureBadge icon={CheckCircle} title="Free Basic Tools" desc="No Sign-up Required" colorClass="text-purple-600 border-purple-500/20 bg-purple-50" isDark={isDark} />
        </div>
    </div>
  </div>
);

// ==========================================
// 2. IMAGE RESIZER COMPONENT
// ==========================================
const ResizerPage = ({ isDark, setActiveTab, setFilterPreview, setFilterImg }) => {
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
              <button onClick={downloadResized} disabled={!resizerImg} className="w-full py-3.5 md:py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-black uppercase tracking-[0.2em] text-[10px] md:text-xs shadow-xl disabled:opacity-30 transition-all flex items-center justify-center gap-2"><Download size={16} /> Download Size</button>
              <button onClick={sendToFilter} disabled={!resizerImg} className="w-full py-3.5 md:py-4 bg-green-600 hover:bg-green-500 text-white rounded-xl font-black uppercase tracking-[0.2em] text-[10px] md:text-xs shadow-xl disabled:opacity-30 transition-all flex items-center justify-center gap-2"><Sliders size={16} /> Edit in Filters</button>
            </div>
          </div>
        </div>
    </div>
  );
};

// ==========================================
// 3. FILTER PAGE COMPONENT
// ==========================================
const FilterPage = ({ isDark, preview, setPreview, img, setImg }) => {
  const [filters, setFilters] = useState({ brightness: 100, contrast: 100, saturate: 100, grayscale: 0 });

  const handleUpload = (e) => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const image = new Image(); image.onload = () => { setImg(image); setPreview(ev.target.result); }; image.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };

  const downloadFiltered = () => {
    if (!img) return;
    const cvs = document.createElement('canvas'); cvs.width = img.width; cvs.height = img.height;
    const ctx = cvs.getContext('2d');
    ctx.filter = `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturate}%) grayscale(${filters.grayscale}%)`;
    ctx.drawImage(img, 0, 0, cvs.width, cvs.height);
    const link = document.createElement('a'); link.href = cvs.toDataURL('image/jpeg', 0.95); link.download = `Filtered_Image.jpg`; link.click();
  };

  return (
    <div className="mt-4 overflow-hidden">
        <div className="text-center md:text-left mb-6">
            <h2 className="text-2xl font-black italic text-green-500">Pro Photo Filters</h2>
            <p className="text-sm opacity-60 font-bold">Enhance colors and apply stunning effects in browser.</p>
        </div>
        <div className="flex flex-col lg:flex-row gap-5 md:gap-6">
          <div className={clsx("lg:w-3/5 sticky top-[80px] z-30 pt-2 pb-2", isDark ? "bg-[#05070a]" : "bg-slate-50")}>
            <div className={clsx("h-[250px] sm:h-[300px] md:h-[450px] rounded-[1.5rem] md:rounded-[2rem] border-2 flex items-center justify-center relative overflow-hidden shadow-xl", isDark ? "bg-slate-800/50 border-slate-700" : "bg-white border-gray-200")}>
              {!preview ? (
                <div className="text-center p-6 md:p-10 cursor-pointer group">
                  <input type="file" onChange={handleUpload} className="absolute inset-0 opacity-0 z-10 cursor-pointer" />
                  <Sliders size={44} className="mx-auto text-green-500 mb-3 opacity-50 group-hover:scale-110 transition-transform" />
                  <p className="font-black text-xs md:text-sm opacity-60 uppercase tracking-widest italic">Upload Image for Filters</p>
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center p-3 md:p-6 bg-black/5">
                  <img src={preview} alt="Preview" className="max-h-full max-w-full object-contain rounded shadow-lg transition-all" style={{ filter: `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturate}%) grayscale(${filters.grayscale}%)` }} />
                  <button onClick={() => { setPreview(null); setImg(null); setFilters({ brightness: 100, contrast: 100, saturate: 100, grayscale: 0 }); }} className="absolute top-3 right-3 md:top-5 md:right-5 bg-red-500 p-2 rounded-xl text-white shadow-xl hover:rotate-90 transition-all z-20"><X size={16} /></button>
                </div>
              )}
            </div>
          </div>
          
          <div className={clsx("lg:w-2/5 p-5 md:p-7 rounded-[1.5rem] md:rounded-[2rem] border space-y-5 md:space-y-6 h-fit shadow-xl z-10", isDark ? "bg-slate-800/50 border-slate-700" : "bg-white border-gray-200")}>
            <div className="flex items-center gap-2 text-green-500 border-b border-gray-500/20 pb-3 md:pb-4">
              <Sliders size={20} /> <h3 className="font-black text-xs md:text-sm uppercase tracking-[0.2em] italic">Filter Settings</h3>
            </div>
            <div className="space-y-5 md:space-y-6 px-1">
              {['brightness', 'contrast', 'saturate'].map((f) => (
                <div key={f}>
                  <label className="flex justify-between text-[10px] md:text-xs font-black opacity-60 uppercase mb-2 tracking-widest"><span>{f}</span><span className="text-green-600">{filters[f]}%</span></label>
                  <input type="range" min="0" max="200" value={filters[f]} onChange={(e) => setFilters(prev => ({ ...prev, [f]: e.target.value }))} className="w-full h-1.5 md:h-2 bg-slate-300 rounded-lg accent-green-600 cursor-pointer" />
                </div>
              ))}
              <div>
                <label className="flex justify-between text-[10px] md:text-xs font-black opacity-60 uppercase mb-2 tracking-widest"><span>Grayscale</span><span className="text-green-600">{filters.grayscale}%</span></label>
                <input type="range" min="0" max="100" value={filters.grayscale} onChange={(e) => setFilters(prev => ({ ...prev, grayscale: e.target.value }))} className="w-full h-1.5 md:h-2 bg-slate-300 rounded-lg accent-green-600 cursor-pointer" />
              </div>
            </div>
            <button onClick={downloadFiltered} disabled={!img} className="w-full mt-2 md:mt-4 py-3.5 md:py-4 bg-green-600 hover:bg-green-500 text-white rounded-xl font-black uppercase tracking-[0.2em] text-[10px] md:text-xs shadow-xl disabled:opacity-30 transition-all flex items-center justify-center gap-2"><Download size={16} /> Download Filtered</button>
          </div>
        </div>
    </div>
  );
};

// ==========================================
// 4. FILE COMPRESSOR COMPONENT
// ==========================================
const CompressorPage = ({ isDark }) => {
  const [file, setFile] = useState(null);
  const [origBytes, setOrigBytes] = useState(0);
  const [origDisplay, setOrigDisplay] = useState('');
  const [outDisplay, setOutDisplay] = useState('');
  const [compressLevel, setCompressLevel] = useState(50);
  const [isZipping, setIsZipping] = useState(false);

  const handleUpload = (e) => {
    const f = e.target.files[0];
    if (f) {
      setFile(f); setOrigBytes(f.size);
      let sizeMB = f.size / (1024 * 1024);
      if (sizeMB > 1024) setOrigDisplay(`${(sizeMB / 1024).toFixed(2)} GB`);
      else if (sizeMB >= 1) setOrigDisplay(`${sizeMB.toFixed(2)} MB`);
      else setOrigDisplay(`${(f.size / 1024).toFixed(2)} KB`);
    }
  };

  useEffect(() => {
    if (origBytes > 0) {
      const targetBytes = origBytes * (compressLevel / 100);
      let sizeMB = targetBytes / (1024 * 1024);
      if (sizeMB > 1024) setOutDisplay(`${(sizeMB / 1024).toFixed(2)} GB`);
      else if (sizeMB >= 1) setOutDisplay(`${sizeMB.toFixed(2)} MB`);
      else setOutDisplay(`${(targetBytes / 1024).toFixed(2)} KB`);
    }
  }, [compressLevel, origBytes]);

  const downloadFile = async (asZip) => {
    if (!file) return;
    if (asZip) {
      setIsZipping(true);
      try {
        const zip = new JSZip(); zip.file(`Compressed_${file.name}`, file);
        const zipContent = await zip.generateAsync({ type: "blob", compression: "DEFLATE", compressionOptions: { level: 9 } });
        const url = URL.createObjectURL(zipContent);
        const link = document.createElement('a'); link.href = url; link.download = `QuickResizePro_${file.name.split('.')[0]}.zip`; link.click(); URL.revokeObjectURL(url);
      } catch (err) { alert("ZIP error!"); }
      setIsZipping(false);
    } else {
      const url = URL.createObjectURL(file);
      const link = document.createElement('a'); link.href = url; link.download = `Compressed_${compressLevel}pct_${file.name}`; link.click(); URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 animate-in zoom-in-95 duration-300 px-4">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-4xl font-black mb-3 md:mb-4 italic text-purple-600">File Compressor</h2>
        <p className="opacity-70 text-xs md:text-base font-bold">Reduce the file size of your PDFs, Images, or Documents heavily.</p>
      </div>

      <div className={clsx("lg:w-full space-y-3 sticky top-[80px] z-30 pt-2 pb-2", isDark ? "bg-[#05070a]" : "bg-slate-50")}>
        <div className="border-4 border-dashed border-purple-500/40 rounded-[1.5rem] md:rounded-[2rem] p-8 md:p-14 bg-purple-500/5 relative group cursor-pointer hover:border-purple-500 transition-colors text-center shadow-lg">
          <input type="file" onChange={handleUpload} className="absolute inset-0 opacity-0 z-10 cursor-pointer" />
          <Upload size={50} className="mx-auto mb-3 md:mb-4 text-purple-500 group-hover:scale-110 transition-transform md:w-16 md:h-16" />
          <p className="font-black text-base md:text-xl">{file ? file.name : 'Drop Your File Here'}</p>
        </div>

        {file && (
          <div className={clsx("p-3 md:p-5 rounded-xl border flex flex-wrap justify-around items-center text-[10px] md:text-xs font-black uppercase tracking-wider md:tracking-[0.2em] gap-2 shadow-sm mt-4", isDark ? "bg-slate-800/90 border-slate-700 backdrop-blur-md" : "bg-white/95 border-gray-200 backdrop-blur-md")}>
            <span className="opacity-60 flex items-center gap-1.5"><FileBarChart size={14} /> Orig: {origDisplay}</span>
            <span className="text-purple-600 font-black border-x border-gray-500/20 px-4 md:px-6 italic">Target: {compressLevel}%</span>
            <span className="text-green-600 flex items-center gap-1.5"><Activity size={14} /> Out: {outDisplay}</span>
          </div>
        )}
      </div>

      {file && (
        <div className={clsx("mt-4 p-5 md:p-7 rounded-[1.5rem] md:rounded-[2rem] border text-left space-y-5 md:space-y-6 shadow-xl", isDark ? "bg-slate-800/50 border-slate-700" : "bg-white border-gray-200")}>
          <div>
            <label className="flex justify-between text-[10px] md:text-xs font-black opacity-70 uppercase mb-2 md:mb-3 tracking-widest">
              <span>Compression Level</span>
              <span className="text-purple-600 font-black">Approx {outDisplay}</span>
            </label>
            <input type="range" min="10" max="90" value={compressLevel} onChange={(e) => setCompressLevel(e.target.value)} className="w-full h-1.5 md:h-2 bg-slate-300 rounded-lg accent-purple-600 cursor-pointer" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            <button onClick={() => downloadFile(false)} className="w-full py-3.5 md:py-4 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-black uppercase tracking-widest text-[10px] md:text-xs shadow-lg transition-all">Simple Download</button>
            <button onClick={() => downloadFile(true)} disabled={isZipping} className="w-full py-3.5 md:py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-black uppercase tracking-widest text-[10px] md:text-xs shadow-lg disabled:opacity-50 transition-all">{isZipping ? 'Zipping...' : 'Download ZIP'}</button>
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 5. ADSENSE & SEO GUIDE COMPONENT
// ==========================================
const SeoGuide = ({ activeTab, isDark }) => {
  const guides = {
    'Home': {
      title: "Why Use QuickResize Pro for Your Content Creation?",
      content: "QuickResize Pro is built specifically for digital creators, marketers, and developers who need fast, reliable, and private image processing tools. Whether you are creating luxury thumbnails for social media or compressing heavy PDF files for email, our browser-based technology ensures your data never leaves your device. This means zero upload times and 100% privacy."
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
    }
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

// ==========================================
// 6. MAIN APP COMPONENT (SEO URLs Added Here)
// ==========================================
const MainApp = () => {
  // ✨ SEO: Router Hooks ✨
  const location = useLocation();
  const navigate = useNavigate();

  const tabPaths = {
    'Home': '/',
    'Resize': '/resize',
    'Studio': '/studio',
    'Filter': '/filter',
    'Compressor': '/compressor',
    'Glass UI': '/glass-ui',
    'Renamer': '/renamer',
    'Palette': '/palette',
    'Image Data Eraser': '/eraser'
  };

  const pathTabs = Object.fromEntries(Object.entries(tabPaths).map(([k, v]) => [v, k]));
  const activeTab = pathTabs[location.pathname] || 'Home';

  const setActiveTab = (tab) => {
    navigate(tabPaths[tab] || '/');
  };

  const [theme, setTheme] = useState('light');
  const [activeModal, setActiveModal] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [filterImg, setFilterImg] = useState(null);
  const [filterPreview, setFilterPreview] = useState(null);

  const isDark = theme === 'dark';
  const menuRef = useRef(null);

  // ✨ SEO: Meta Tags & Title Update ✨
  useEffect(() => {
    const seoInfo = {
      'Home': { title: "QuickResize Studio | Privacy-First Image Tools", desc: "Your all-in-one privacy-first toolkit for image resizing, pro filtering, and social media thumbnails." },
      'Resize': { title: "Image Resizer | QuickResize Studio", desc: "Resize, crop, and auto-enhance your images securely in your browser without uploading." },
      'Studio': { title: "Thumbnail Studio | QuickResize Studio", desc: "Create luxury thumbnails and social posts with text, filters, and logos securely." },
      'Filter': { title: "Pro Photo Filters | QuickResize Studio", desc: "Enhance colors and apply stunning effects to your photos online." },
      'Compressor': { title: "File Compressor | QuickResize Studio", desc: "Reduce the file size of your PDFs, Images, or Documents heavily and securely." },
      'Glass UI': { title: "Glassmorphism Generator | QuickResize Studio", desc: "Generate modern Glass UI CSS code instantly." },
      'Renamer': { title: "Batch File Renamer | QuickResize Studio", desc: "Rename multiple files instantly in your browser." },
      'Palette': { title: "Color Extractor | QuickResize Studio", desc: "Extract beautiful color palettes from any image." },
      'Image Data Eraser': { title: "EXIF Metadata Stripper | QuickResize Studio", desc: "Remove sensitive metadata from your images for privacy." }
    };
    
    const currentInfo = seoInfo[activeTab] || seoInfo['Home'];
    document.title = currentInfo.title;
    
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = "description";
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = currentInfo.desc;
  }, [activeTab]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  const mainItems = [
    { id: 'Home', icon: <Home size={18} /> },
    { id: 'Resize', icon: <ImageIcon size={18} /> },
    { id: 'Studio', icon: <Share2 size={18} /> },
  ];

  const extraItems = [
    { id: 'Filter', icon: <Sliders size={18} />, desc: 'Photo Filters' },
    { id: 'Compressor', icon: <Box size={18} />, desc: 'Compress Files' },
    { id: 'Glass UI', icon: <Layout size={18} />, desc: 'Glassmorphism' },
    { id: 'Renamer', icon: <Settings size={18} />, desc: 'Batch Rename' },
    { id: 'Palette', icon: <Palette size={18} />, desc: 'Color Extractor' },
    { id: 'Image Data Eraser', icon: <ShieldCheck size={18} />, desc: 'Scrub Metadata' }
  ];

  return (
    <div className={clsx("min-h-screen transition-colors duration-500 font-sans flex flex-col", isDark ? "bg-[#05070a] text-white" : "bg-slate-50 text-slate-900")}>
      <nav className={clsx("sticky top-0 z-50 border-b backdrop-blur-md shadow-sm", isDark ? "bg-[#0d1117]/90 border-slate-800" : "bg-white/90 border-slate-200")}>
        <div className="max-w-7xl mx-auto px-4 h-16 md:h-20 flex justify-between items-center">
          
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('Home')}>
            <img src={logo} alt="Logo" className="h-8 w-auto md:h-10 rounded-lg shadow-sm" />
            <div className="hidden lg:block"><AnimatedLogo /></div>
          </div>

          <div className="flex items-center bg-black/5 dark:bg-black/20 rounded-full p-1.5 gap-1 md:gap-2 mx-2">
            {mainItems.map((item) => (
              <button key={item.id} onClick={() => setActiveTab(item.id)}
                className={clsx("flex items-center gap-2 px-3 md:px-4 py-2 rounded-full text-[10px] sm:text-xs font-black transition-all uppercase tracking-wider",
                  activeTab === item.id ? "bg-blue-600 text-white shadow-md" : "hover:bg-blue-500/10 opacity-70")}>
                {item.icon} <span className="hidden sm:inline">{item.id}</span>
              </button>
            ))}

            <div className="relative" ref={menuRef}>
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2.5 rounded-full hover:bg-black/10 transition-colors">
                <MoreVertical size={20} strokeWidth={2.5} />
              </button>
              {isMenuOpen && (
                <div className={clsx("absolute right-0 top-14 w-64 shadow-2xl rounded-2xl border py-2 z-[100] animate-in zoom-in-95", isDark ? "bg-[#0d1117] border-slate-700" : "bg-white border-slate-200")}>
                  {extraItems.map((item) => (
                    <button key={item.id} onClick={() => { setActiveTab(item.id); setIsMenuOpen(false); }} className="flex items-center gap-4 w-full px-5 py-3 hover:bg-blue-500/10 transition-colors text-left">
                      <span className="text-blue-500">{item.icon}</span>
                      <div className="flex flex-col"><span className="text-xs font-black uppercase">{item.id}</span><span className="text-[10px] opacity-60 capitalize">{item.desc}</span></div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ✨ YAHAN CLERK AUR THEME BUTTON HAIN ✨ */}
          <div className="flex items-center gap-2 md:gap-3">
            <button onClick={() => setTheme(isDark ? 'light' : 'dark')} className="p-2.5 rounded-xl border border-slate-700/30 hover:bg-slate-800 transition-colors">
              {isDark ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} className="text-slate-700" />}
            </button>
            
            <SignedOut>
              <SignInButton mode="modal">
                <button className="bg-purple-600 hover:bg-purple-500 text-white px-4 md:px-5 py-2 md:py-2.5 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest shadow-lg transition-all border border-purple-500/50">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton appearance={{ elements: { userButtonAvatarBox: "w-9 h-9 shadow-md border border-slate-700" } }} />
            </SignedIn>
          </div>
          
        </div>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 overflow-visible">
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} transition={{ duration: 0.3 }}>
            {activeTab === 'Home' && <HomePage setActiveTab={setActiveTab} isDark={isDark} />}
            {activeTab === 'Resize' && <ResizerPage isDark={isDark} setActiveTab={setActiveTab} setFilterPreview={setFilterPreview} setFilterImg={setFilterImg} />}
            {activeTab === 'Filter' && <FilterPage isDark={isDark} preview={filterPreview} setPreview={setFilterPreview} img={filterImg} setImg={setFilterImg} />}
            {activeTab === 'Glass UI' && <GlassGenerator isDark={isDark} />}
            {activeTab === 'Compressor' && <CompressorPage isDark={isDark} />}
            {activeTab === 'Renamer' && <BatchRenamer isDark={isDark} />}
            {activeTab === 'Palette' && <ColorExtractor isDark={isDark} />}
            {activeTab === 'Image Data Eraser' && <ExifStripper isDark={isDark} />}
            {activeTab === 'Studio' && <SocialStudio isDark={isDark} />}
          </motion.div>
        </AnimatePresence>
        
        <SeoGuide activeTab={activeTab} isDark={isDark} />
      </main>

      <footer className={clsx("py-8 md:py-12 border-t mt-auto font-black uppercase tracking-widest md:tracking-[0.3em] text-[9px] md:text-xs", isDark ? "bg-slate-950 border-slate-800 shadow-2xl" : "bg-indigo-950 border-indigo-900")}>
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-6 md:gap-10 text-center">
          <p className="text-white opacity-90 tracking-tighter italic">© 2026 QuickResizePro / All Rights Reserved</p>
          <div className="flex flex-wrap justify-center gap-6 md:gap-10 text-white font-black italic px-4">
            <button onClick={() => setActiveModal('about')} className="hover:text-blue-400 transition-colors border-b border-white/20 pb-1">About Us</button>
            <button onClick={() => setActiveModal('privacy')} className="hover:text-blue-400 transition-colors border-b border-white/20 pb-1">Privacy Policy</button>
            <button onClick={() => setActiveModal('terms')} className="hover:text-blue-400 transition-colors border-b border-white/20 pb-1">Terms</button>
          </div>
        </div>
      </footer>

      {activeModal && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 backdrop-blur-lg" onClick={() => setActiveModal(null)}>
          <motion.div className={clsx("rounded-[2rem] md:rounded-[2.5rem] max-w-3xl w-full max-h-[85vh] overflow-auto border shadow-[0_0_60px_rgba(59,130,246,0.2)]", isDark ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-gray-200 text-slate-900")} onClick={(e) => e.stopPropagation()} initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}>
            <div className="p-6 md:p-8 border-b border-slate-700/30 flex justify-between items-center sticky top-0 bg-inherit z-10">
              <h2 className="text-base md:text-lg font-black uppercase tracking-[0.4em] text-blue-600 italic">{activeModal.replace('-', ' ')}</h2>
              <button onClick={() => setActiveModal(null)} className="p-2 hover:bg-red-500 rounded-full transition-all hover:text-white shadow-xl"><X size={24} /></button>
            </div>
            <div className="p-8 md:p-12 text-sm md:text-base leading-relaxed space-y-6 opacity-90 font-bold text-left">
              
             {activeModal === 'about' && (
                <>
                  <p className="font-black text-blue-600 text-xl md:text-2xl tracking-tighter italic uppercase border-b border-blue-500/20 pb-4">About QuickResizePro Studio</p>
                  <p>Welcome to <strong className="font-black text-blue-500">QuickResizePro</strong>, your premier destination for professional-grade browser-based media tools. Our mission is to provide content creators, developers, and everyday users with a fast, 100% secure, and free platform to manage their digital assets.</p>
                  <p>Unlike other tools, QuickResizePro works entirely on the <strong className="font-black text-blue-500">client-side</strong>. This means your images and files never touch our servers, ensuring total privacy.</p>
                  <p>Founded in 2026, we continue to innovate in the field of web-based image processing. For any feedback or business inquiries, feel free to contact us.</p>
                  <p><strong className="font-black text-blue-500">Support Email:</strong> <a href="mailto:muhammadismail66881@gmail.com" className="text-blue-600 font-black hover:underline">muhammadismail66881@gmail.com</a></p>
                </>
              )}

             {activeModal === 'privacy' && (
                <>
                  <p className="font-black text-blue-600 text-xl md:text-2xl uppercase italic tracking-tighter border-b border-blue-500/20 pb-4">Privacy & Data Protection Policy</p>
                  <p>At QuickResizePro, accessible from quickresizetool.online, user privacy is our top priority. Our unique architecture ensures that <strong className="font-black text-blue-500">No Image or File is ever uploaded to our servers</strong>.</p>
                  <h3 className="font-black text-blue-600 mt-5 text-lg">1. Local Processing</h3>
                  <p>All resizing, filtering, and compression happen directly within your browser's memory using JavaScript.</p>
                  <h3 className="font-black text-blue-600 mt-5 text-lg">2. Cookies and Advertising</h3>
                  <p>We use Google AdSense to serve ads. Google may use DART cookies to show relevant ads based on your visit to this and other sites.</p>
                </>
              )}

              {activeModal === 'terms' && (
                <>
                  <p className="font-black text-blue-600 text-xl md:text-2xl uppercase italic tracking-tighter border-b border-blue-500/20 pb-4">Terms and Conditions of Use</p>
                  <p>By accessing <strong className="font-black text-blue-500">QuickResizePro</strong>, you agree to comply with these terms. This tool is provided free of charge for personal and commercial use.</p>
                  <h3 className="font-black text-blue-600 mt-5 text-lg">1. Intellectual Property</h3>
                  <p>The code, design, and branding of QuickResizePro are the intellectual property of muhammadismail66881@gmail.com. You may not reproduce or redistribute our source code without prior written consent.</p>
                  <h3 className="font-black text-blue-600 mt-5 text-lg">2. Limitation of Liability</h3>
                  <p>We strive for 100% accuracy, but we are not responsible for any data loss or damage resulting from the use of our tools.</p>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 7. WRAPPER APP (With Router & Modified Welcome Screen)
// ==========================================
export default function App() {
  const [loading, setLoading] = useState(true);

  // 4 Seconds Timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* ✨ RECONSTRUCTED WELCOME SCREEN FROM IMAGE ✨ */}
      {loading && (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-900 animate-out fade-out duration-700 delay-[3300ms] fill-mode-forwards">
          <div className="flex flex-col items-center animate-in zoom-in-95 duration-500">
            {/* The Icon Container */}
            <div className="relative w-24 h-24 bg-zinc-950/70 rounded-3xl flex items-center justify-center mb-10 shadow-[0_0_30px_rgba(168,85,247,0.5)]">
              <div className="absolute inset-0 bg-purple-950 rounded-full blur-2xl opacity-40"></div>
              {/* Single, glowing, purple pulsing star */}
              <Sparkles size={48} className="text-purple-400 relative z-10 animate-pulse" />
            </div>

            {/* Title: WHITE, BLACK, ITALIC, TEXT-TRANSPARENT, BG-CLIP-TEXT, BG-GRADIENT */}
            <h1 className="text-5xl font-black italic text-white tracking-tighter uppercase text-center text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-white">
              QUICK RESIZE
            </h1>

            {/* Subtitle: Smaller, PURPLE-400, Font-Bold, UPPERCASE, Tracking-[0.4em] */}
            <p className="text-purple-400 text-sm md:text-base font-bold uppercase tracking-[0.4em] mt-2 opacity-80 animate-in fade-in delay-300 duration-1000 text-center">
              THE CREATOR STUDIO
            </p>

            {/* Progress Bar Container */}
            <div className="w-64 h-2 bg-white/10 rounded-full mt-10 overflow-hidden shadow-inner relative">
              {/* Inner progress bar */}
              <div className="absolute inset-y-0 left-0 bg-purple-600 animate-[progress_4s_ease-in-out_forwards] rounded-full"></div>
            </div>
          </div>
          
          {/* Keyframes fine-tuned to remove unnecessary 'spin-slow' */}
          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes progress {
              0% { width: 0%; }
              100% { width: 100%; }
            }
          `}} />
        </div>
      )}

      {/* ✨ MAIN APP WRAPPED IN ROUTER FOR SEO (Unchanged) ✨ */}
      {!loading && (
        <Router>
          <MainApp />
        </Router>
      )}
    </>
  );
}