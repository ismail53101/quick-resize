import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import { Sun, Moon, MoreVertical, X, Home, ChevronRight, Crown } from 'lucide-react';
import { clsx } from 'clsx';
import logo from '../logo.jpg'; // Path adjusted for components folder

// --- Animated Logo Logic ---
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

// --- Main Navbar Component ---
const Navbar = ({ 
  isDark, theme, setTheme, activeTab, setActiveTab, 
  mainItems, extraItems, isMenuOpen, setIsMenuOpen, menuRef, 
  isMobileSidebarOpen, setIsMobileSidebarOpen, profile 
}) => {

  const dropdownRef = React.useRef(null);
  
  React.useEffect(() => {
    if (isMenuOpen && dropdownRef.current) {
      dropdownRef.current.focus();
    }
  }, [isMenuOpen]);

  return (
    <>
      <style>{`
        .vip-scroll::-webkit-scrollbar { width: 5px; }
        .vip-scroll::-webkit-scrollbar-track { background: transparent; }
        .vip-scroll::-webkit-scrollbar-thumb { background-color: ${isDark ? '#334155' : '#cbd5e1'}; border-radius: 10px; }
        .vip-scroll::-webkit-scrollbar-thumb:hover { background-color: #3b82f6; }
      `}</style>

      <nav className={clsx("sticky top-0 z-50 border-b backdrop-blur-md shadow-sm", isDark ? "bg-[#0d1117]/90 border-slate-800" : "bg-white/90 border-slate-200")}>
        <div className="max-w-7xl mx-auto px-4 h-16 md:h-20 flex justify-between items-center">
          
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('Home')}>
            <img src={logo} alt="Logo" className="h-8 w-auto md:h-10 rounded-lg shadow-sm" />
            <div className="hidden lg:block"><AnimatedLogo /></div>
          </div>

          <div className="hidden md:flex items-center bg-black/5 dark:bg-black/20 rounded-full p-1.5 gap-1 md:gap-2 mx-2">
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
                <div 
                  ref={dropdownRef} 
                  tabIndex={0} 
                  className={clsx("vip-scroll focus:outline-none absolute right-0 top-14 w-64 shadow-2xl rounded-2xl border py-2 z-[100] animate-in zoom-in-95 overflow-y-auto max-h-[70vh]", isDark ? "bg-[#0d1117] border-slate-700" : "bg-white border-slate-200")}
                >
                  {extraItems.map((item) => (
                    <button key={item.id} onClick={() => { setActiveTab(item.id); setIsMenuOpen(false); }} className="flex items-center gap-4 w-full px-5 py-3 hover:bg-blue-500/10 transition-colors text-left group">
                      <span className="text-blue-500 group-hover:scale-110 transition-transform">{item.icon}</span>
                      <div className="flex flex-col"><span className="text-xs font-black uppercase">{item.id}</span><span className="text-[10px] opacity-60 capitalize">{item.desc}</span></div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <button onClick={() => setTheme(isDark ? 'light' : 'dark')} className="p-2.5 rounded-xl border border-slate-700/30 hover:bg-slate-800 transition-colors">
              {isDark ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} className="text-slate-700" />}
            </button>
            
            {/* <SignedOut>
              <SignInButton mode="modal">
                <button className="bg-purple-600 hover:bg-purple-500 text-white px-4 md:px-5 py-2 md:py-2.5 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest shadow-lg transition-all border border-purple-500/50">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              {profile?.isPro && (
                <div className="flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-yellow-500 text-white px-3 py-1.5 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest shadow-[0_0_15px_rgba(251,191,36,0.4)] border border-yellow-300/50">
                  <Crown size={14} className="animate-pulse" />
                  <span className="hidden sm:inline text-shadow-sm">Pro</span>
                </div>
              )}
              <UserButton appearance={{ elements: { userButtonAvatarBox: "w-9 h-9 md:w-10 md:h-10 shadow-md border-2 border-slate-700 hover:border-blue-500 transition-all" } }} />
            </SignedIn> */}

            <button 
              onClick={() => setIsMobileSidebarOpen(true)}
              className="md:hidden p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            >
              <MoreVertical size={20} strokeWidth={2.5} />
            </button>
          </div>
          
        </div>
      </nav>

      <AnimatePresence>
        {isMobileSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsMobileSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] md:hidden"
            />
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={clsx("fixed top-0 right-0 h-full w-[80%] max-w-sm z-[201] shadow-2xl p-6 flex flex-col md:hidden", 
                isDark ? "bg-slate-900 border-l border-white/10" : "bg-white border-l border-gray-100")}
            >
              <div className="flex items-center justify-between mb-8">
                <span className="font-black italic text-blue-600 uppercase tracking-widest text-[10px]">Creator Menu</span>
                <button onClick={() => setIsMobileSidebarOpen(false)} className="p-2 rounded-full bg-black/5 dark:bg-white/10 text-slate-500 hover:bg-red-500 hover:text-white transition-all"><X size={20} /></button>
              </div>

              <div className="flex-1 overflow-y-auto vip-scroll space-y-2">
                <button 
                  onClick={() => { setActiveTab('Home'); setIsMobileSidebarOpen(false); }}
                  className={clsx("w-full flex items-center justify-between p-4 rounded-xl transition-all border", activeTab === 'Home' ? "border-blue-500 bg-blue-500/10 text-blue-600 font-black shadow-sm" : "border-transparent opacity-70 hover:opacity-100 hover:bg-black/5")}
                >
                  <div className="flex items-center gap-3 text-xs uppercase tracking-widest font-bold">
                    <Home size={18} /> Home Dashboard
                  </div>
                  <ChevronRight size={14} className={activeTab === 'Home' ? "translate-x-1 transition-transform" : ""} />
                </button>

                <div className="h-px bg-gray-500/10 my-4 mx-4" />

                {[...mainItems.slice(1), ...extraItems].map((item) => (
                  <button 
                    key={item.id}
                    onClick={() => { setActiveTab(item.id); setIsMobileSidebarOpen(false); }}
                    className={clsx("w-full flex items-center justify-between p-4 rounded-xl transition-all border group", activeTab === item.id ? "border-blue-500 bg-blue-500/10 text-blue-600 font-black shadow-sm" : "border-transparent opacity-70 hover:opacity-100 hover:bg-black/5")}
                  >
                    <div className="flex items-center gap-3 text-xs uppercase tracking-widest font-bold">
                      <span className="text-blue-500 group-hover:scale-110 transition-transform">{item.icon}</span> {item.id}
                    </div>
                    <ChevronRight size={14} className={activeTab === item.id ? "translate-x-1 transition-transform" : ""} />
                  </button>
                ))}
              </div>
              
              <div className="mt-auto pt-6 text-center border-t border-gray-500/10">
                <p className="text-[9px] font-black uppercase tracking-[0.3em] opacity-30 italic">QuickResize v2.0</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;