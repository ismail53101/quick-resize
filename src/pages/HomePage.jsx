import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { Image as ImageIcon, Share2, Sliders, ShieldCheck, FastForward, CheckCircle } from 'lucide-react';

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

const HomePage = ({ isDark }) => {
  const navigate = useNavigate();

  // 👇👇👇 ✨ SEO Code YAHAN Add Kiya Hai ✨ 👇👇👇
  useEffect(() => {
    document.title = "Quick Resize Tool | Free Online Image Editor & Tools";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Welcome to Quick Resize Tool. Your all-in-one free online platform for image resizing, pro photo filters, file compression, and more.");
    }
  }, []);
  // 👆👆👆 ✨ SEO Code YAHAN Add Kiya Hai ✨ 👆👆👆

  return (
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
          <motion.div key={item.tab} onClick={() => navigate({ Resize: '/resize', Studio: '/studio', Filter: '/filter' }[item.tab])} className={clsx("p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border cursor-pointer transition-all shadow-lg text-left", isDark ? "hover:bg-slate-800 border-slate-700/50" : "hover:bg-gray-100 border-gray-200", item.color === 'blue' ? "bg-blue-500/5" : item.color === 'green' ? "bg-green-500/5" : "bg-purple-500/5")} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }} whileHover={{ scale: 1.05, y: -5 }}>
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
              <FeatureBadge icon={CheckCircle} title="Free Basic Tools" desc="100% Secure" colorClass="text-purple-600 border-purple-500/20 bg-purple-50" isDark={isDark} />
          </div>
      </div>
    </div>
  );
};

export default HomePage;