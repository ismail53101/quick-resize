import React, { useState, useEffect } from 'react';
import { clsx } from 'clsx';
import { Sliders, X, Download, ChevronRight, Eye, RefreshCcw, Sparkles, Save, UploadCloud, RotateCw, FlipHorizontal, FlipVertical, Palette, Settings2, Wand2 } from 'lucide-react';

const FilterPage = ({ isDark, preview, setPreview, img, setImg, executeWithLimit }) => {
  // 1. Advanced Filters State (Added Temp, Tint, Noise)
  const defaultFilters = { brightness: 100, contrast: 100, saturate: 100, grayscale: 0, sepia: 0, blur: 0, hueRotate: 0, invert: 0, vignette: 0, temp: 0, tint: 0, noise: 0 };
  const [filters, setFilters] = useState(defaultFilters);
  
// 👇👇👇 ✨ SEO Code for Photo Filters ✨ 👇👇👇
  useEffect(() => {
    document.title = "Pro Photo Filters | Quick Resize Tool";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Apply Lightroom style professional filters to your photos for free. Best online photo editor and color grading by Quick Resize Tool.");
    }
  }, []);
  // 👆👆👆 ✨ YAHAN PASTE KARNA HAI ✨ 👆👆👆

  // 2. Transform State (Rotate & Flip)
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);

  // 3. UI State
  const [isComparing, setIsComparing] = useState(false); 
  const [isDragging, setIsDragging] = useState(false);
  const [mySavedPreset, setMySavedPreset] = useState(null);
  const [activeSettingTab, setActiveSettingTab] = useState('basic'); // basic, colors, effects
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [dlFormat, setDlFormat] = useState('image/jpeg');
  const [dlQuality, setDlQuality] = useState(0.95);

  useEffect(() => {
    const saved = localStorage.getItem('quickResizeCustomPreset');
    if (saved) setMySavedPreset(JSON.parse(saved));
  }, []);

  const basePresets = [
    { name: 'Normal', icon: '✨', values: defaultFilters },
    { name: 'Cinematic', icon: '🎬', values: { ...defaultFilters, contrast: 130, saturate: 120, brightness: 90, hueRotate: 15, vignette: 20, temp: 10 } },
    { name: 'Vintage', icon: '🎞️', values: { ...defaultFilters, sepia: 80, contrast: 120, brightness: 90, vignette: 30, noise: 15 } },
    { name: 'Cyberpunk', icon: '🌃', values: { ...defaultFilters, contrast: 140, saturate: 150, hueRotate: 180, brightness: 110, tint: 20 } },
    { name: 'B&W Pro', icon: '📸', values: { ...defaultFilters, grayscale: 100, contrast: 120, brightness: 105, vignette: 15, noise: 10 } },
    { name: 'Golden Hour', icon: '☀️', values: { ...defaultFilters, sepia: 30, saturate: 140, contrast: 110, brightness: 105, temp: 30 } },
    { name: 'Winter', icon: '❄️', values: { ...defaultFilters, saturate: 110, brightness: 110, contrast: 105, temp: -30 } },
  ];

  const presets = mySavedPreset ? [...basePresets, { name: 'My Filter', icon: '💾', values: mySavedPreset }] : basePresets;

  const saveCustomPreset = () => {
    localStorage.setItem('quickResizeCustomPreset', JSON.stringify(filters));
    setMySavedPreset(filters);
  };

  const getFilterString = (f) => {
    return `brightness(${f.brightness}%) contrast(${f.contrast}%) saturate(${f.saturate}%) grayscale(${f.grayscale}%) sepia(${f.sepia}%) hue-rotate(${f.hueRotate}deg) blur(${f.blur}px) invert(${f.invert}%)`;
  };

  const processFile = (file) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const image = new Image(); image.onload = () => { 
        setImg(image); setPreview(ev.target.result); 
        // Reset transforms on new image
        setRotation(0); setFlipH(false); setFlipV(false); setFilters(defaultFilters);
      }; 
      image.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = (e) => { const file = e.target.files[0]; if (file) processFile(file); };
  const handleDrop = (e) => { e.preventDefault(); setIsDragging(false); const file = e.dataTransfer.files[0]; if (file) processFile(file); };

  // Canvas Drawing & Export Logic
  const downloadFiltered = () => {
    if (!img) return;
    const cvs = document.createElement('canvas'); 
    const isVertical = rotation === 90 || rotation === 270;
    cvs.width = isVertical ? img.height : img.width; 
    cvs.height = isVertical ? img.width : img.height;
    const ctx = cvs.getContext('2d');
    
    // 1. Apply Transforms
    ctx.translate(cvs.width / 2, cvs.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);

    // 2. Draw Image with CSS Filters
    ctx.filter = getFilterString(filters);
    ctx.drawImage(img, -img.width / 2, -img.height / 2, img.width, img.height);
    
    // Reset transforms for Overlays
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    // 3. Temperature & Tint (Color Grading)
    if (filters.temp !== 0) {
      ctx.fillStyle = filters.temp > 0 ? `rgba(255, 180, 0, ${filters.temp / 200})` : `rgba(0, 100, 255, ${Math.abs(filters.temp) / 200})`;
      ctx.globalCompositeOperation = 'overlay';
      ctx.fillRect(0, 0, cvs.width, cvs.height);
    }
    if (filters.tint !== 0) {
      ctx.fillStyle = filters.tint > 0 ? `rgba(255, 0, 255, ${filters.tint / 200})` : `rgba(0, 255, 0, ${Math.abs(filters.tint) / 200})`;
      ctx.globalCompositeOperation = 'overlay';
      ctx.fillRect(0, 0, cvs.width, cvs.height);
    }
    ctx.globalCompositeOperation = 'source-over';

    // 4. Vignette
    if (filters.vignette > 0) {
      const maxRadius = Math.sqrt(Math.pow(cvs.width/2, 2) + Math.pow(cvs.height/2, 2));
      const gradient = ctx.createRadialGradient(cvs.width / 2, cvs.height / 2, cvs.width * 0.4, cvs.width / 2, cvs.height / 2, maxRadius);
      gradient.addColorStop(0, 'rgba(0,0,0,0)');
      gradient.addColorStop(1, `rgba(0,0,0,${filters.vignette / 100})`);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, cvs.width, cvs.height);
    }

    // 5. Film Grain (Noise)
    if (filters.noise > 0) {
      const nCvs = document.createElement('canvas'); nCvs.width = 100; nCvs.height = 100;
      const nCtx = nCvs.getContext('2d'); const imgData = nCtx.createImageData(100, 100);
      for(let i=0; i<imgData.data.length; i+=4){
        let val = Math.random() * 255;
        imgData.data[i] = val; imgData.data[i+1] = val; imgData.data[i+2] = val; imgData.data[i+3] = 255;
      }
      nCtx.putImageData(imgData, 0, 0);
      ctx.globalAlpha = filters.noise / 200;
      ctx.globalCompositeOperation = 'overlay';
      ctx.fillStyle = ctx.createPattern(nCvs, 'repeat');
      ctx.fillRect(0, 0, cvs.width, cvs.height);
      ctx.globalAlpha = 1.0; ctx.globalCompositeOperation = 'source-over';
    }

    // Download
    const link = document.createElement('a'); 
    link.href = cvs.toDataURL(dlFormat, dlQuality); 
    const ext = dlFormat.split('/')[1];
    link.download = `QuickResize_Pro_${Date.now()}.${ext}`; 
    link.click();
    setShowDownloadMenu(false);
  };

  // Helper function for Temp/Tint preview styles
  const getOverlayStyle = () => {
    let bg = 'transparent';
    if (filters.temp > 0) bg = `rgba(255, 180, 0, ${filters.temp / 200})`;
    else if (filters.temp < 0) bg = `rgba(0, 100, 255, ${Math.abs(filters.temp) / 200})`;
    
    let tintBg = 'transparent';
    if (filters.tint > 0) tintBg = `rgba(255, 0, 255, ${filters.tint / 200})`;
    else if (filters.tint < 0) tintBg = `rgba(0, 255, 0, ${Math.abs(filters.tint) / 200})`;
    return { bg, tintBg };
  };
  const overlay = getOverlayStyle();

  const tabConfigs = {
    basic: [
      { key: 'brightness', label: 'Brightness', min: 0, max: 200, unit: '%' },
      { key: 'contrast', label: 'Contrast', min: 0, max: 200, unit: '%' },
      { key: 'saturate', label: 'Saturation', min: 0, max: 200, unit: '%' },
      { key: 'grayscale', label: 'Grayscale', min: 0, max: 100, unit: '%' },
      { key: 'invert', label: 'Invert', min: 0, max: 100, unit: '%' },
    ],
    colors: [
      { key: 'temp', label: 'Temperature', min: -100, max: 100, unit: '' },
      { key: 'tint', label: 'Tint', min: -100, max: 100, unit: '' },
      { key: 'hueRotate', label: 'Hue Rotate', min: 0, max: 360, unit: '°' },
      { key: 'sepia', label: 'Sepia', min: 0, max: 100, unit: '%' },
    ],
    effects: [
      { key: 'blur', label: 'Blur Focus', min: 0, max: 20, unit: 'px' },
      { key: 'vignette', label: 'Vignette (Dark Edges)', min: 0, max: 100, unit: '%' },
      { key: 'noise', label: 'Film Grain (Noise)', min: 0, max: 100, unit: '%' },
    ]
  };

  return (
    <div className="mt-4 overflow-visible">
        <div className="text-center md:text-left mb-4 md:mb-6 px-2">
            <h2 className="text-2xl font-black italic text-green-500">Pro Photo Filters</h2>
            <p className="text-sm opacity-60 font-bold">Lightroom-style grading and effects in browser.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-5 md:gap-6 relative">
          
          {/* LEFT: CANVAS & TRANSFORMS */}
          <div className={clsx("lg:w-3/5 sticky top-[64px] md:top-[80px] z-40 pt-2 pb-4 border-b lg:border-none", isDark ? "bg-[#05070a] border-slate-800" : "bg-slate-50 border-gray-200")}>
            
            <div 
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={clsx("h-[220px] sm:h-[300px] md:h-[400px] rounded-[1.5rem] md:rounded-[2rem] border-2 flex items-center justify-center relative overflow-hidden shadow-xl transition-all", 
                isDark ? "bg-slate-800/50" : "bg-white",
                isDragging ? "border-green-500 bg-green-500/10 scale-[1.02]" : (isDark ? "border-slate-700" : "border-gray-200")
              )}
            >
              {!preview ? (
                <div className="text-center p-6 md:p-10 cursor-pointer group w-full h-full flex flex-col items-center justify-center">
                  <input type="file" onChange={handleUpload} className="absolute inset-0 opacity-0 z-10 cursor-pointer" />
                  <UploadCloud size={54} className={clsx("mx-auto mb-3 transition-transform", isDragging ? "text-green-500 scale-110" : "text-green-500 opacity-50 group-hover:scale-110")} />
                  <p className="font-black text-xs md:text-sm opacity-60 uppercase tracking-widest italic">
                    {isDragging ? 'Drop Photo Here!' : 'Click or Drag Image Here'}
                  </p>
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center p-2 md:p-6 bg-black/5 relative overflow-hidden">
                  
                  {/* MAIN IMAGE WITH CSS FILTERS & TRANSFORMS */}
                  <img 
                    src={preview} alt="Preview" 
                    className="max-h-full max-w-full object-contain shadow-lg transition-all duration-200 relative z-10" 
                    style={{ 
                      filter: isComparing ? 'none' : getFilterString(filters),
                      transform: `rotate(${rotation}deg) scaleX(${flipH ? -1 : 1}) scaleY(${flipV ? -1 : 1})`
                    }} 
                  />
                  
                  {/* LIVE PREVIEW OVERLAYS (Temp, Tint, Vignette, Noise) */}
                  {!isComparing && (
                    <div className="absolute inset-0 pointer-events-none rounded transition-all duration-200 z-10"
                      style={{ 
                        transform: `rotate(${rotation}deg) scaleX(${flipH ? -1 : 1}) scaleY(${flipV ? -1 : 1})`
                      }}>
                      {/* Vignette */}
                      {filters.vignette > 0 && <div className="absolute inset-0" style={{ background: `radial-gradient(circle, transparent 40%, rgba(0,0,0,${filters.vignette / 100}) 100%)` }} />}
                      {/* Temp & Tint */}
                      <div className="absolute inset-0 mix-blend-overlay" style={{ backgroundColor: overlay.bg }} />
                      <div className="absolute inset-0 mix-blend-overlay" style={{ backgroundColor: overlay.tintBg }} />
                      {/* Fake Noise Preview */}
                      {filters.noise > 0 && <div className="absolute inset-0 opacity-30" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='${filters.noise/100}'/%3E%3C/svg%3E")` }} />}
                    </div>
                  )}
                  
                  {/* UI Buttons */}
                  <button 
                    onMouseDown={() => setIsComparing(true)} onMouseUp={() => setIsComparing(false)} onMouseLeave={() => setIsComparing(false)}
                    onTouchStart={() => setIsComparing(true)} onTouchEnd={() => setIsComparing(false)}
                    className="absolute top-3 left-3 md:top-5 md:left-5 bg-slate-900/70 backdrop-blur-md text-white p-2.5 rounded-xl shadow-xl active:scale-95 transition-all z-20 border border-white/10 hover:bg-slate-900"
                    title="Hold to Compare"
                  >
                    <Eye size={18} className={isComparing ? "text-green-400" : "text-white"} /> 
                  </button>
                  <button onClick={() => { setPreview(null); setImg(null); setFilters(defaultFilters); setShowDownloadMenu(false); }} className="absolute top-3 right-3 md:top-5 md:right-5 bg-red-500 p-2 rounded-xl text-white shadow-xl hover:rotate-90 transition-all z-20"><X size={16} /></button>
                </div>
              )}
            </div>

            {/* ✨ NEW: Transform Controls (Rotate & Flip) ✨ */}
            {preview && (
              <div className="flex items-center justify-center gap-3 mt-4">
                <button onClick={() => setRotation(r => (r + 90) % 360)} className={clsx("p-3 rounded-xl border-2 transition-all active:scale-95", isDark ? "bg-slate-800 border-slate-700 hover:border-green-500" : "bg-white border-gray-200 hover:border-green-400")} title="Rotate 90°"><RotateCw size={18} /></button>
                <button onClick={() => setFlipH(!flipH)} className={clsx("p-3 rounded-xl border-2 transition-all active:scale-95", isDark ? "bg-slate-800 border-slate-700 hover:border-green-500" : "bg-white border-gray-200 hover:border-green-400")} title="Flip Horizontal"><FlipHorizontal size={18} /></button>
                <button onClick={() => setFlipV(!flipV)} className={clsx("p-3 rounded-xl border-2 transition-all active:scale-95", isDark ? "bg-slate-800 border-slate-700 hover:border-green-500" : "bg-white border-gray-200 hover:border-green-400")} title="Flip Vertical"><FlipVertical size={18} /></button>
              </div>
            )}

            {/* Presets List */}
            {preview && (
              <div className="flex gap-3 overflow-x-auto mt-4 pb-2 scrollbar-hide px-1">
                {presets.map((preset) => (
                  <button 
                    key={preset.name} onClick={() => setFilters(preset.values)}
                    className={clsx("flex flex-col items-center justify-center min-w-[70px] md:min-w-[90px] p-2.5 rounded-2xl border-2 transition-all hover:scale-105 active:scale-95 shadow-sm", 
                      isDark ? "bg-slate-800 border-slate-700 hover:border-green-500" : "bg-white border-gray-200 hover:border-green-400",
                      preset.name === 'My Filter' && "border-green-500 bg-green-500/10"
                    )}
                  >
                    <span className="text-xl md:text-2xl mb-1">{preset.icon}</span>
                    <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest opacity-80 whitespace-nowrap">{preset.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* RIGHT: LIGHTROOM STYLE TABS & SLIDERS */}
          <div className={clsx("lg:w-2/5 p-5 md:p-7 rounded-[1.5rem] md:rounded-[2rem] border h-fit shadow-xl flex flex-col mb-10", isDark ? "bg-slate-800/50 border-slate-700" : "bg-white border-gray-200")}>
            
            <div className="flex items-center justify-between border-b border-gray-500/20 pb-3 md:pb-4 mb-5">
              <div className="flex items-center gap-3">
                <button onClick={saveCustomPreset} disabled={!preview} className="text-[10px] md:text-xs font-black uppercase tracking-widest flex items-center gap-1.5 text-green-600 hover:text-green-500 transition-colors disabled:opacity-30"><Save size={14} /> Save</button>
                <div className="w-px h-4 bg-gray-500/30"></div>
                <button onClick={() => { setFilters(defaultFilters); setRotation(0); setFlipH(false); setFlipV(false); }} disabled={!preview} className="text-[10px] md:text-xs font-black uppercase tracking-widest flex items-center gap-1.5 opacity-60 hover:opacity-100 hover:text-red-500 transition-colors disabled:opacity-30"><RefreshCcw size={14} /> Reset</button>
              </div>
            </div>

            {/* Tabs Navigation */}
            <div className="flex bg-black/5 dark:bg-black/20 p-1.5 rounded-xl mb-6">
               {[
                 { id: 'basic', label: 'Basic', icon: <Settings2 size={14}/> },
                 { id: 'colors', label: 'Colors', icon: <Palette size={14}/> },
                 { id: 'effects', label: 'Effects', icon: <Wand2 size={14}/> }
               ].map(tab => (
                 <button 
                   key={tab.id} onClick={() => setActiveSettingTab(tab.id)}
                   className={clsx("flex-1 py-2 text-[10px] md:text-xs font-black uppercase tracking-widest flex items-center justify-center gap-1.5 rounded-lg transition-all",
                     activeSettingTab === tab.id ? "bg-white dark:bg-slate-700 text-green-600 shadow-sm" : "opacity-50 hover:opacity-100"
                   )}
                 >
                   {tab.icon} {tab.label}
                 </button>
               ))}
            </div>

            {/* Active Tab Sliders */}
            <div className="grid grid-cols-1 gap-y-6 px-1 flex-1">
              {tabConfigs[activeSettingTab].map((s) => (
                <div key={s.key} className="flex flex-col">
                  <label className="flex justify-between text-[10px] md:text-xs font-black opacity-60 uppercase mb-2 tracking-widest">
                    <span>{s.label}</span>
                    <span className="text-green-600">{filters[s.key]}{s.unit}</span>
                  </label>
                  <input 
                    type="range" min={s.min} max={s.max} 
                    value={filters[s.key]} 
                    onChange={(e) => setFilters(prev => ({ ...prev, [s.key]: e.target.value }))} 
                    disabled={!preview}
                    className="w-full h-1.5 md:h-2 bg-slate-300 rounded-lg accent-green-600 cursor-pointer disabled:opacity-40 transition-opacity" 
                  />
                </div>
              ))}
            </div>

            {/* ✨ NEW: Pro Download Menu ✨ */}
            <div className="mt-8 relative">
              {showDownloadMenu && (
                <div className={clsx("absolute bottom-full left-0 right-0 mb-3 p-5 rounded-2xl border shadow-2xl animate-in fade-in slide-in-from-bottom-5", isDark ? "bg-slate-900 border-slate-700" : "bg-white border-gray-200")}>
                  <div className="flex justify-between items-center mb-4">
                     <h4 className="text-xs font-black uppercase tracking-widest">Export Settings</h4>
                     <button onClick={() => setShowDownloadMenu(false)} className="opacity-50 hover:opacity-100 hover:text-red-500"><X size={16}/></button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-black opacity-60 uppercase tracking-widest block mb-2">Format</label>
                      <div className="flex gap-2">
                         {['image/jpeg', 'image/png', 'image/webp'].map(fmt => (
                           <button key={fmt} onClick={() => setDlFormat(fmt)} className={clsx("flex-1 py-2 text-[10px] font-black uppercase rounded-lg border transition-all", dlFormat === fmt ? "bg-green-500/10 border-green-500 text-green-600" : "border-gray-500/20 opacity-70")}>
                             {fmt.split('/')[1]}
                           </button>
                         ))}
                      </div>
                    </div>
                    <div>
                      <label className="flex justify-between text-[10px] font-black opacity-60 uppercase tracking-widest mb-2">
                        <span>Quality</span> <span className="text-green-600">{Math.round(dlQuality * 100)}%</span>
                      </label>
                      <input type="range" min="0.1" max="1.0" step="0.1" value={dlQuality} onChange={(e) => setDlQuality(parseFloat(e.target.value))} className="w-full h-1.5 bg-slate-300 rounded-lg accent-green-600" />
                    </div>
                    <button onClick={() => executeWithLimit(downloadFiltered)} className="w-full py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl font-black uppercase tracking-[0.2em] text-[10px] transition-all">Save to Device</button>
                  </div>
                </div>
              )}

              <button 
                onClick={() => setShowDownloadMenu(!showDownloadMenu)} disabled={!img} 
                className="w-full py-3.5 md:py-4 bg-green-600 hover:bg-green-500 text-white rounded-xl font-black uppercase tracking-[0.2em] text-[10px] md:text-xs shadow-xl disabled:opacity-30 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <Download size={16} /> Export Options
              </button>
            </div>

          </div>
        </div>
    </div>
  );
};

export default FilterPage;