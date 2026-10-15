import React, { useState, useEffect, useMemo } from 'react';
import { Copy, CheckCircle, Sliders, Image as ImageIcon, Trash2, Play, Sparkles } from 'lucide-react';
import { clsx } from 'clsx';

export default function GlassGenerator({ isDark }) {
    const [blur, setBlur] = useState(12);
    const [transparency, setTransparency] = useState(0.2);
    const [color, setColor] = useState('#ffffff');
    const [outline, setOutline] = useState(0.1);
    const [copied, setCopied] = useState(false);
    const [bgImage, setBgImage] = useState(null);
    const [testCode, setTestCode] = useState("background: rgba(255, 255, 255, 0.2);\nbackdrop-filter: blur(15px);\nborder: 1px solid rgba(255, 255, 255, 0.2);");

    // 👇👇👇 ✨ SEO Code for Glass Studio ✨ 👇👇👇
  useEffect(() => {
    document.title = "Glassmorphism UI Generator | Quick Resize Tool";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Generate beautiful glassmorphism effects and CSS code for your UI designs and images instantly with Quick Resize Tool.");
    }
  }, []);
  // 👆👆👆 ✨ YAHAN PASTE KARNA HAI ✨ 👆👆👆

    const testStyle = useMemo(() => {
        const style = {};
        testCode.split(';').forEach(rule => {
            const [prop, val] = rule.split(':');
            if (prop && val) {
                const key = prop.trim().replace(/-([a-z])/g, g => g[1].toUpperCase());
                style[key] = val.trim();
                if (key === 'backdropFilter') style['WebkitBackdropFilter'] = val.trim();
            }
        });
        return style;
    }, [testCode]);

    const hexToRgba = (hex, alpha) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    const glassStyle = {
        background: hexToRgba(color, transparency),
        backdropFilter: `blur(${blur}px)`,
        WebkitBackdropFilter: `blur(${blur}px)`,
        border: `2px solid ${hexToRgba(color, outline)}`,
        borderRadius: '20px',
    };

    const cssCode = `background: ${hexToRgba(color, transparency)};\nbackdrop-filter: blur(${blur}px);\nborder: 2px solid ${hexToRgba(color, outline)};\nborder-radius: 20px;`;

    return (
        <div className="mt-4 md:mt-8 animate-in fade-in duration-500 max-w-5xl mx-auto px-2 md:px-6">
            
            {/* Minimal Header */}
            <div className="text-center md:text-left mb-6">
                <h2 className="text-2xl md:text-4xl font-black italic text-cyan-500 uppercase tracking-tighter leading-none">Glass Studio</h2>
                <p className="text-[10px] md:text-sm opacity-60 font-black mt-1 uppercase tracking-widest">Generate & Live-Test Blurry UI</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-4 md:gap-10">
                
                {/* LEFT SIDE: COMPACT PREVIEW (Optimized for Mobile) */}
                <div className={clsx("lg:w-3/5 space-y-3 sticky top-[70px] md:top-[90px] z-30 pt-1 pb-2", isDark ? "bg-[#05070a]" : "bg-slate-50")}>
                    <div className={clsx("h-[220px] md:h-[480px] rounded-[1.5rem] md:rounded-[2.5rem] border-2 md:border-4 flex items-center justify-center relative overflow-hidden shadow-xl transition-all duration-700", !bgImage && "bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-500", isDark ? "border-slate-800" : "bg-white border-gray-200")}>
                        
                        {bgImage && <img src={bgImage} alt="Background" className="absolute inset-0 w-full h-full object-cover" />}
                        
                        <div style={glassStyle} className="w-[85%] h-[50%] md:h-[45%] flex items-center justify-center shadow-2xl relative z-10 transition-all duration-300 border border-white/20">
                             <span className={clsx("text-[10px] md:text-base font-black uppercase italic tracking-widest", color === '#ffffff' ? "text-slate-900/40" : "text-white/40")}>Preview</span>
                        </div>

                        {/* Minimal Overlays */}
                        <div className="absolute bottom-3 right-3 flex gap-2 z-20">
                            <label className="p-2 md:p-3 bg-cyan-600 border border-white/20 rounded-xl text-white cursor-pointer hover:bg-cyan-500 shadow-lg active:scale-90 transition-all">
                                <ImageIcon size={16} className="md:w-5 md:h-5" />
                                <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                                    const file = e.target.files[0];
                                    if(file) {
                                        const reader = new FileReader();
                                        reader.onload = (ev) => setBgImage(ev.target.result);
                                        reader.readAsDataURL(file);
                                    }
                                }} />
                            </label>
                            {bgImage && (
                                <button onClick={() => setBgImage(null)} className="p-2 md:p-3 bg-red-600 rounded-xl text-white shadow-lg active:scale-90 transition-all">
                                    <Trash2 size={16} className="md:w-5 md:h-5" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDE: CONTROLS (Easily Accessible) */}
                <div className={clsx("lg:w-2/5 p-5 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border-2 md:border-4 space-y-6 h-fit shadow-2xl z-10", isDark ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200")}>
                    <div className="flex items-center gap-2 text-cyan-500 border-b border-gray-500/10 pb-3">
                        <Sliders size={20} /> <h3 className="font-black text-xs md:text-sm uppercase tracking-widest italic">Settings</h3>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest"><span>Blur Amount</span><span className="text-cyan-500">{blur}px</span></label>
                            <input type="range" min="0" max="30" value={blur} onChange={(e) => setBlur(e.target.value)} className="w-full h-1.5 bg-slate-200 rounded-lg accent-cyan-500 cursor-pointer" />
                        </div>

                        <div className="space-y-2">
                            <label className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest"><span>Opacity</span><span>{Math.round(transparency * 100)}%</span></label>
                            <input type="range" min="0" max="1" step="0.05" value={transparency} onChange={(e) => setTransparency(e.target.value)} className="w-full h-1.5 bg-slate-200 rounded-lg accent-cyan-500 cursor-pointer" />
                        </div>

                        <div className="flex items-center justify-between bg-black/5 p-3 rounded-xl border border-gray-500/10">
                            <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Tint Color</span>
                            <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-8 h-8 rounded-lg cursor-pointer border-none bg-transparent" />
                        </div>

                        <div className="pt-4 border-t border-gray-500/10">
                            <button onClick={() => { navigator.clipboard.writeText(cssCode); setCopied(true); setTimeout(() => setCopied(false), 2000); }} 
                                className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg active:scale-95 transition-all">
                                {copied ? "Code Copied!" : "Copy CSS Code"}
                            </button>
                            <pre className={clsx("mt-3 p-4 rounded-xl text-[9px] md:text-[11px] font-mono font-bold break-all whitespace-pre-wrap border", isDark ? "bg-slate-950 border-slate-700 text-cyan-400" : "bg-slate-100 border-slate-200 text-slate-800")}>
                                {cssCode}
                            </pre>
                        </div>
                    </div>

                    {/* COMPACT LIVE TESTER */}
                    <div className={clsx("mt-4 p-4 rounded-2xl border-2 border-dashed space-y-3", isDark ? "bg-slate-900 border-cyan-500/20" : "bg-cyan-50 border-cyan-200")}>
                        <div className="flex items-center gap-2 text-cyan-600">
                            <Play size={16} /> <h3 className="text-[10px] font-black uppercase italic tracking-widest">Live CSS Tester</h3>
                        </div>
                        <textarea 
                            value={testCode}
                            onChange={(e) => setTestCode(e.target.value)}
                            placeholder="Paste code here..."
                            className={clsx("w-full h-20 p-3 rounded-xl font-mono font-bold text-[10px] outline-none border transition-all resize-none", isDark ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200")}
                        />
                        <div className="w-full h-24 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center p-3 shadow-inner">
                            <div style={testStyle} className="w-full h-full rounded-xl flex items-center justify-center border border-white/20">
                                <span className="text-white text-[8px] font-black uppercase tracking-widest opacity-60">Result Preview</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}