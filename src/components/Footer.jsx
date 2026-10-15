import React from 'react';
import { Link } from 'react-router-dom';
import { clsx } from 'clsx';

export default function Footer({ isDark }) {
  return <footer className={clsx('py-8 md:py-12 border-t mt-auto font-black uppercase tracking-widest md:tracking-[0.3em] text-[9px] md:text-xs', isDark ? 'bg-slate-950 border-slate-800' : 'bg-indigo-950 border-indigo-900')}>
    <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-6 md:gap-10 text-center">
      <p className="text-white opacity-90 tracking-tighter italic">© 2026 Quick Resize - All rights reserved. Designed for speed</p>
      <nav className="flex flex-wrap justify-center gap-6 md:gap-10 text-white font-black italic px-4" aria-label="Legal navigation">
        <Link to="/about" className="hover:text-blue-400 transition-colors border-b border-white/20 pb-1">About Us</Link>
        <Link to="/privacy-policy" className="hover:text-blue-400 transition-colors border-b border-white/20 pb-1">Privacy Policy</Link>
        <Link to="/terms" className="hover:text-blue-400 transition-colors border-b border-white/20 pb-1">Terms</Link>
      </nav>
    </div>
  </footer>;
}
