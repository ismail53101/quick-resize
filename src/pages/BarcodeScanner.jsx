import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { Scan, Copy, Check, RefreshCw, Smartphone, ExternalLink, Zap } from 'lucide-react';

const BarcodeScanner = ({ isDark }) => {
  const [scanResult, setScanResult] = useState(null);
  const [isCopying, setIsCopying] = useState(false);

  useEffect(() => {
    if (!scanResult) {
      const timer = setTimeout(() => {
        try {
          const scanner = new Html5QrcodeScanner("reader", {
            fps: 15,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0,
            showTorchButtonIfSupported: true,
          });

          scanner.render((result) => {
            const audio = new Audio('https://www.soundjay.com/buttons/beep-07a.mp3');
            audio.play().catch(() => {});
            setScanResult(result);
            scanner.clear();
          }, () => {});

          return () => scanner.clear().catch(() => {});
        } catch (e) { console.error(e) }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [scanResult]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(scanResult);
    setIsCopying(true);
    setTimeout(() => setIsCopying(false), 2000);
  };

  const isUrl = (text) => {
    try { return new URL(text).protocol.startsWith('http'); } catch (_) { return false; }
  };

  return (
    <div className={clsx("py-8 md:py-12 max-w-3xl mx-auto px-4 min-h-[80vh] transition-colors duration-300", isDark ? "text-white" : "text-slate-900")}>
      
      {/* 🛠️ Scanner UI Fix (CSS Overrides) */}
      <style>{`
        #reader { border: none !important; }
        #reader__dashboard_section_csr button {
          background-color: #3b82f6 !important;
          color: white !important;
          border-radius: 12px !important;
          padding: 10px 20px !important;
          text-transform: uppercase !important;
          font-weight: 900 !important;
          font-size: 12px !important;
          border: none !important;
          margin-top: 10px !important;
        }
        #reader__scan_region video { border-radius: 20px !important; }
        #reader img { display: none !important; } 
      `}</style>

      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter flex items-center justify-center gap-3">
          <Zap size={36} className="text-blue-500" />
          QUICK <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-500">SCANNER</span>
        </h1>
        <p className="opacity-60 text-xs md:text-sm font-bold tracking-widest uppercase mt-4">Fast & Secure Barcode / QR Reader</p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key="scan" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
          <div className={clsx("max-w-xl mx-auto rounded-[2.5rem] border-4 overflow-hidden shadow-2xl transition-all", isDark ? "bg-slate-900 border-blue-500/30" : "bg-white border-blue-100")}>
            {!scanResult ? (
              <div id="reader" className="w-full"></div>
            ) : (
              <div className="p-10 text-center space-y-6">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto text-green-500 animate-bounce">
                  <Check size={32} strokeWidth={3} />
                </div>
                <h2 className={clsx("text-xl font-black uppercase tracking-tight", isDark ? "text-white" : "text-slate-900")}>Scan Successful!</h2>
                
                <div className={clsx("p-6 rounded-2xl border-2 break-all font-mono text-lg font-bold shadow-inner", isDark ? "bg-black/40 border-slate-700 text-green-400" : "bg-slate-50 border-slate-200 text-green-700")}>
                  {scanResult}
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <button onClick={copyToClipboard} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-blue-500/20">
                    {isCopying ? <Check size={16}/> : <Copy size={16}/>} {isCopying ? "Copied" : "Copy Result"}
                  </button>
                  
                  {isUrl(scanResult) && (
                    <a href={scanResult} target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white py-4 rounded-xl font-black uppercase tracking-widest text-xs transition-all active:scale-95 shadow-lg shadow-green-500/20">
                      <ExternalLink size={16} /> Open Link
                    </a>
                  )}
                  
                  <button onClick={() => setScanResult(null)} className={clsx("p-4 rounded-xl transition-all flex items-center justify-center", isDark ? "bg-slate-800 hover:bg-slate-700 text-white" : "bg-slate-200 hover:bg-slate-300 text-slate-700")}>
                    <RefreshCw size={20} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className={clsx("max-w-xl mx-auto mt-12 p-6 rounded-3xl border flex items-start gap-4 transition-all shadow-sm", isDark ? "bg-blue-500/5 border-blue-500/10 text-slate-300" : "bg-blue-50 border-blue-100 text-slate-700")}>
        <Smartphone className="text-blue-500 mt-1 flex-shrink-0" />
        <div>
          <h4 className={clsx("text-xs font-black uppercase tracking-tighter", isDark ? "text-white" : "text-slate-900")}>Private & Fast</h4>
          <p className="text-[11px] opacity-70 mt-1 leading-relaxed font-medium">Your data never leaves your device. All scanning happens locally in your browser for 100% privacy.</p>
        </div>
      </div>
    </div>
  );
};

export default BarcodeScanner;