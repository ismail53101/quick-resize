import React from 'react';
import { clsx } from 'clsx';

const Footer = ({ isDark, setActiveModal }) => {
  return (
    <footer className={clsx("py-8 md:py-12 border-t mt-auto font-black uppercase tracking-widest md:tracking-[0.3em] text-[9px] md:text-xs", isDark ? "bg-slate-950 border-slate-800 shadow-2xl" : "bg-indigo-950 border-indigo-900")}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-6 md:gap-10 text-center">
        <p className="text-white opacity-90 tracking-tighter italic">© © 2026 Quick Resize - All rights reserved. Designed for speed</p>
        <div className="flex flex-wrap justify-center gap-6 md:gap-10 text-white font-black italic px-4">
          <button onClick={() => setActiveModal('about')} className="hover:text-blue-400 transition-colors border-b border-white/20 pb-1">About Us</button>
          <button onClick={() => setActiveModal('privacy')} className="hover:text-blue-400 transition-colors border-b border-white/20 pb-1">Privacy Policy</button>
          <button onClick={() => setActiveModal('terms')} className="hover:text-blue-400 transition-colors border-b border-white/20 pb-1">Terms</button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;