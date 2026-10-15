import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, MoreVertical, X, Home, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';
import logo from '../logo.jpg';

const AnimatedLogo = () => <motion.div className="flex select-none items-center text-xl md:text-2xl tracking-tighter" initial="initial" whileHover="hover"><span className="text-blue-600 font-black">Quick</span><span className="text-green-600 font-black">Resize</span><span className="font-black text-slate-900 dark:text-white">Pro</span></motion.div>;

export default function Navbar({ isDark, setTheme, mainItems, extraItems, isMenuOpen, setIsMenuOpen, menuRef, isMobileSidebarOpen, setIsMobileSidebarOpen }) {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  const closeMenus = () => { setIsMenuOpen(false); setIsMobileSidebarOpen(false); };
  return <>
    <style>{`.vip-scroll::-webkit-scrollbar{width:5px}.vip-scroll::-webkit-scrollbar-thumb{background:${isDark ? '#334155' : '#cbd5e1'};border-radius:10px}`}</style>
    <nav className={clsx('sticky top-0 z-50 border-b backdrop-blur-md shadow-sm', isDark ? 'bg-[#0d1117]/90 border-slate-800' : 'bg-white/90 border-slate-200')}>
      <div className="max-w-7xl mx-auto px-4 h-16 md:h-20 flex justify-between items-center">
        <Link to="/" onClick={closeMenus} className="flex items-center gap-3"><img src={logo} alt="QuickResize logo" className="h-8 w-auto md:h-10 rounded-lg shadow-sm" /><span className="hidden lg:block"><AnimatedLogo /></span></Link>
        <div className="hidden md:flex items-center bg-black/5 dark:bg-black/20 rounded-full p-1.5 gap-1 md:gap-2 mx-2">
          {mainItems.map(item => <Link key={item.path} to={item.path} className={clsx('flex items-center gap-2 px-3 md:px-4 py-2 rounded-full text-[10px] sm:text-xs font-black transition-all uppercase tracking-wider', isActive(item.path) ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-blue-500/10 opacity-70')}>{item.icon}<span className="hidden sm:inline">{item.id}</span></Link>)}
          <div className="relative" ref={menuRef}><button aria-label="Open tools menu" onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2.5 rounded-full hover:bg-black/10 transition-colors"><MoreVertical size={20} /></button>{isMenuOpen && <div className={clsx('vip-scroll absolute right-0 top-14 w-64 shadow-2xl rounded-2xl border py-2 z-[100] overflow-y-auto max-h-[70vh]', isDark ? 'bg-[#0d1117] border-slate-700' : 'bg-white border-slate-200')}>{extraItems.map(item => <Link key={item.path} to={item.path} onClick={closeMenus} className={clsx('flex items-center gap-4 w-full px-5 py-3 hover:bg-blue-500/10 transition-colors', isActive(item.path) && 'bg-blue-500/10')}><span className="text-blue-500">{item.icon}</span><span className="flex flex-col"><span className="text-xs font-black uppercase">{item.id}</span><span className="text-[10px] opacity-60">{item.desc}</span></span></Link>)}</div>}</div>
        </div>
        <div className="flex items-center gap-2"><button aria-label="Toggle theme" onClick={() => setTheme(isDark ? 'light' : 'dark')} className="p-2.5 rounded-xl border border-slate-700/30 hover:bg-slate-800 transition-colors">{isDark ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} />}</button><button aria-label="Open mobile menu" onClick={() => setIsMobileSidebarOpen(true)} className="md:hidden p-2 rounded-xl hover:bg-black/10"><MoreVertical size={20} /></button></div>
      </div>
    </nav>
    <AnimatePresence>{isMobileSidebarOpen && <><motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeMenus} className="fixed inset-0 bg-black/60 z-[200] md:hidden" /><motion.aside initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className={clsx('fixed top-0 right-0 h-full w-[80%] max-w-sm z-[201] shadow-2xl p-6 flex flex-col md:hidden', isDark ? 'bg-slate-900' : 'bg-white')}><div className="flex justify-between mb-8"><span className="font-black italic text-blue-600 uppercase tracking-widest text-[10px]">Creator Menu</span><button onClick={closeMenus} className="p-2 rounded-full hover:bg-red-500 hover:text-white"><X size={20} /></button></div><div className="flex-1 overflow-y-auto vip-scroll space-y-2"><Link to="/" onClick={closeMenus} className={clsx('w-full flex items-center justify-between p-4 rounded-xl border', isActive('/') ? 'border-blue-500 bg-blue-500/10 text-blue-600' : 'border-transparent')}><span className="flex items-center gap-3 text-xs uppercase tracking-widest font-bold"><Home size={18} /> Home Dashboard</span><ChevronRight size={14} /></Link>{[...mainItems.slice(1), ...extraItems].map(item => <Link key={item.path} to={item.path} onClick={closeMenus} className={clsx('w-full flex items-center justify-between p-4 rounded-xl border', isActive(item.path) ? 'border-blue-500 bg-blue-500/10 text-blue-600' : 'border-transparent opacity-70')}><span className="flex items-center gap-3 text-xs uppercase tracking-widest font-bold"><span className="text-blue-500">{item.icon}</span>{item.id}</span><ChevronRight size={14} /></Link>)}</div><p className="mt-auto pt-6 text-center border-t text-[9px] font-black uppercase tracking-[0.3em] opacity-30">QuickResize v2.0</p></motion.aside></>}</AnimatePresence>
  </>;
}
