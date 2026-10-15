import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; 
import { clsx } from 'clsx';
import { Activity, Download, Upload, Wifi, Play, Zap } from 'lucide-react';

const SpeedChecker = ({ isDark }) => {
  const [isTesting, setIsTesting] = useState(false);
  const [ping, setPing] = useState(0);
  const [downloadSpeed, setDownloadSpeed] = useState(0);
  const [uploadSpeed, setUploadSpeed] = useState(0);
  const [status, setStatus] = useState("Ready to test");
  const [progress, setProgress] = useState(0);

  const [activeValue, setActiveValue] = useState(0);
  const [activeUnit, setActiveUnit] = useState("");

  useEffect(() => {
    document.title = "Quick Speed Test | Quick Resize Tool";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Check your real-time internet speed, ping, download, and upload speeds instantly for free with Quick Resize Tool.");
    }
  }, []);

  const runSpeedTest = async () => {
    setIsTesting(true);
    setPing(0); setDownloadSpeed(0); setUploadSpeed(0);
    setProgress(5);
    setActiveValue(0);

    try {
      // 1. PING TEST
      setStatus("Testing Ping...");
      setActiveUnit("ms");
      const pingStart = performance.now();
      await fetch('https://httpbin.org/get', { cache: 'no-store' });
      const pingEnd = performance.now();
      const finalPing = Math.round(pingEnd - pingStart);
      setPing(finalPing);
      setActiveValue(finalPing);
      setProgress(30);

      // 2. DOWNLOAD TEST
      setStatus("Testing Download...");
      setActiveUnit("Mbps");
      const dlStart = performance.now();
      const imageUrl = "https://images.unsplash.com/photo-1494548162494-384bba4ab999?ixlib=rb-1.2.1&w=2000&q=80"; 
      const response = await fetch(imageUrl, { cache: 'no-store' });
      const blob = await response.blob();
      const dlEnd = performance.now();
      
      const dlDurationInSeconds = (dlEnd - dlStart) / 1000;
      const dlSizeInBits = blob.size * 8;
      const dlSpeedMbps = (dlSizeInBits / dlDurationInSeconds / (1024 * 1024)).toFixed(1);
      setDownloadSpeed(dlSpeedMbps);
      setActiveValue(dlSpeedMbps);
      setProgress(70);

      // 3. UPLOAD TEST
      setStatus("Testing Upload...");
      setActiveUnit("Mbps");
      const ulStart = performance.now();
      const dummyData = new Uint8Array(1024 * 1024); 
      await fetch('https://httpbin.org/post', {
        method: 'POST',
        body: dummyData,
        headers: { 'Content-Type': 'application/octet-stream' },
      });
      const ulEnd = performance.now();
      
      const ulDurationInSeconds = (ulEnd - ulStart) / 1000;
      const ulSizeInBits = dummyData.length * 8;
      const ulSpeedMbps = (ulSizeInBits / ulDurationInSeconds / (1024 * 1024)).toFixed(1);
      setUploadSpeed(ulSpeedMbps);
      
      // Final Finish
      setActiveValue(dlSpeedMbps); 
      setActiveUnit("Mbps");
      setProgress(100);
      setStatus("Test Completed!");
    } catch (error) {
      setStatus("Error! Check connection.");
      setActiveValue(0);
      setActiveUnit("Error");
    } finally {
      setIsTesting(false);
    }
  };

  const radius = 110;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const MetricCard = ({ title, value, unit, icon: Icon, colorClass, delay }) => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5, delay: delay }}
      className={clsx(
        "relative p-5 md:p-6 rounded-3xl border border-white/10 backdrop-blur-xl overflow-hidden shadow-2xl transition-all",
        isDark ? "bg-slate-900/60" : "bg-white/80 border-slate-200"
      )}
    >
      <div className={clsx("absolute -top-10 -right-10 w-32 h-32 rounded-full blur-[40px] opacity-30", colorClass.bg)}></div>
      
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className={clsx("p-3 rounded-2xl", colorClass.lightBg)}>
          <Icon size={24} className={colorClass.text} />
        </div>
        <span className="text-[10px] md:text-xs font-black uppercase tracking-widest opacity-50 pt-2">{title}</span>
      </div>
      
      <div className="flex items-baseline gap-1 relative z-10">
        <span className={clsx("text-4xl md:text-5xl font-black tracking-tighter", value > 0 ? colorClass.text : "opacity-30")}>
          {value || "0"}
        </span>
        <span className="text-xs font-bold opacity-60 ml-1">{unit}</span>
      </div>
    </motion.div>
  );

  return (
    <div className="py-8 md:py-12 max-w-4xl mx-auto px-4 flex flex-col items-center">
      
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter flex items-center justify-center gap-3">
          <Zap size={36} className="text-yellow-500 animate-pulse hidden md:block" /> 
          Quick <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">Speed Test</span>
        </h1>
        <p className="opacity-60 text-xs md:text-sm font-bold tracking-widest uppercase mt-2">Lightning Fast Network Analyzer</p>
      </div>

      <div className="relative flex justify-center items-center mb-4 mt-2">
        <div className={clsx("absolute w-[280px] h-[280px] rounded-full blur-[60px] opacity-30 transition-all duration-1000", 
          isTesting ? "bg-blue-500 scale-110" : "bg-purple-500 scale-100")} 
        />
        
        <svg className="w-[300px] h-[300px] -rotate-90 relative z-10 drop-shadow-2xl" viewBox="0 0 250 250">
          <circle 
            cx="125" cy="125" r={radius} 
            stroke="currentColor" strokeWidth="12" fill="none" 
            className={clsx("opacity-50", isDark ? "text-slate-700" : "text-slate-200")} 
          />
          <motion.circle 
            cx="125" cy="125" r={radius} 
            stroke="url(#gradient)" strokeWidth="16" fill="none" 
            strokeLinecap="round"
            strokeDasharray={circumference}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="drop-shadow-[0_0_15px_rgba(59,130,246,0.6)]"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" /> 
              <stop offset="50%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
          </defs>
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
          {!isTesting && progress === 0 && status !== "Test Completed!" ? (
            <button 
              onClick={runSpeedTest}
              className="w-40 h-40 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex flex-col items-center justify-center text-white shadow-[0_0_30px_rgba(59,130,246,0.5)] hover:scale-105 active:scale-95 transition-all group"
            >
              <Play size={40} className="ml-2 group-hover:text-yellow-300 transition-colors" fill="currentColor" />
              <span className="font-black uppercase tracking-widest text-xs mt-2">Start</span>
            </button>
          ) : (
            <div className={clsx("text-center flex flex-col items-center justify-center w-48 h-48 rounded-full backdrop-blur-md shadow-inner", isDark ? "bg-black/40 border-slate-700/50" : "bg-white/50 border-white/20")}>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500 mb-1 animate-pulse">
                {status}
              </span>
              <div className="flex items-baseline gap-1">
                <span className={clsx("text-5xl md:text-6xl font-black italic tracking-tighter drop-shadow-lg", isDark ? "text-white" : "text-slate-800")}>
                  {activeValue}
                </span>
              </div>
              <span className={clsx("text-xs font-bold uppercase", isDark ? "text-slate-300 opacity-80" : "text-slate-600 opacity-60")}>{activeUnit}</span>
            </div>
          )}
        </div>
      </div>

      {/* 👇 TEST AGAIN BUTTON MOVED HERE 👇 */}
      <div className="h-16 flex items-center justify-center mb-4">
        <AnimatePresence>
          {status === "Test Completed!" && (
            <motion.button 
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
              onClick={runSpeedTest}
              className={clsx("px-8 py-3 rounded-full border-2 text-xs font-black uppercase tracking-widest transition-all shadow-lg", isDark ? "border-slate-700 text-white hover:bg-white hover:text-black" : "border-slate-300 text-slate-800 hover:bg-slate-800 hover:text-white")}
            >
              Test Again
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* 3 METRIC CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 w-full max-w-3xl relative z-10">
        <MetricCard 
          title="Ping Delay" value={ping} unit="ms" icon={Wifi} delay={0.1}
          colorClass={{ bg: "bg-purple-500", text: "text-purple-500 dark:text-purple-400", lightBg: "bg-purple-500/10" }} 
        />
        <MetricCard 
          title="Download" value={downloadSpeed} unit="Mbps" icon={Download} delay={0.2}
          colorClass={{ bg: "bg-blue-500", text: "text-blue-500 dark:text-blue-400", lightBg: "bg-blue-500/10" }} 
        />
        <MetricCard 
          title="Upload" value={uploadSpeed} unit="Mbps" icon={Upload} delay={0.3}
          colorClass={{ bg: "bg-green-500", text: "text-green-500 dark:text-green-400", lightBg: "bg-green-500/10" }} 
        />
      </div>

    </div>
  );
};

export default SpeedChecker;