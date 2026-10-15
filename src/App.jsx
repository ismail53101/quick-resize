import BarcodeScanner from './pages/BarcodeScanner';
import SpeedChecker from './pages/SpeedChecker';
import MediaCodeGenerator from './MediaCodeGenerator';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrowserRouter as Router, useLocation, useNavigate } from 'react-router-dom';
import { SignedIn, SignedOut, SignInButton, useUser } from '@clerk/clerk-react';
import { supabase } from './supabaseClient';
import { clsx } from 'clsx';
import { Sparkles, Lock, Share2, Check, Home, Image as ImageIcon, Sliders, Box, Layout, Settings, Palette, ShieldCheck, BookOpen, Activity, Scan, FileCode2 } from 'lucide-react';


// ==========================================
// 📁 IMPORTING SEPARATED COMPONENTS & PAGES
// ==========================================
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import InfoModals from './components/InfoModals';
import SeoGuide from './components/SeoGuide';

import HomePage from './pages/HomePage';
import ResizerPage from './pages/ResizerPage';
import FilterPage from './pages/FilterPage';
import CompressorPage from './pages/CompressorPage';
import Blog from './pages/Blog'; // Naya AdSense Hub

// Existing Heavy Tools (In the src folder)
import QRCodeMaker from './QRCodeMaker';
import BatchRenamer from './BatchRenamer';
import SocialStudio from './SocialStudio';
import ColorExtractor from './ColorExtractor';
import ExifStripper from './ExifStripper';
import GlassGenerator from './GlassGenerator';

// ==========================================
// MAIN APP COMPONENT (SEO URLs & LIMITS)
// ==========================================
const MainApp = () => {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isPakistani, setIsPakistani] = useState(true); 

  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(data => { if (data.country_code !== 'PK') setIsPakistani(false); })
      .catch(() => setIsPakistani(true)); 
  }, []);

  const [selectedPlan, setSelectedPlan] = useState(null); 
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
    'Image Data Eraser': '/eraser',
    'QR Maker': '/qr-generator',
    'Code Extractor': '/code-extractor',
    'Speed Test': '/speed-test',
    'Scanner': '/scanner',
    'Blog': '/blog', // Blog URL added
  };

  const pathTabs = Object.fromEntries(Object.entries(tabPaths).map(([k, v]) => [v, k]));
  const activeTab = pathTabs[location.pathname] || 'Home';

  const setActiveTab = (tab) => {
    navigate(tabPaths[tab] || '/');
  };

  const [theme, setTheme] = useState('light');
  const [activeModal, setActiveModal] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const [filterImg, setFilterImg] = useState(null);
  const [filterPreview, setFilterPreview] = useState(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);


  const isDark = theme === 'dark';
  const menuRef = useRef(null);

  // ✨ NEW: VIP Click Outside to Close Menu Logic ✨
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false); 
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 👇✨ NEW: BACKGROUND SCROLL LOCK LOGIC ✨👇
  useEffect(() => {
    if (isMenuOpen || isMobileSidebarOpen) {
      document.body.style.overflow = 'hidden'; // Lock website scroll
    } else {
      document.body.style.overflow = 'auto';   // Unlock website scroll
    }
    return () => {
      document.body.style.overflow = 'auto';   // Cleanup
    };
  }, [isMenuOpen, isMobileSidebarOpen]);
  // 👆✨ END OF NEW LOGIC ✨👆

  // ✨ SUPABASE & LIMIT LOGIC ✨
  const { user } = useUser();
  const [profile, setProfile] = useState({ count: 0, isPro: false });
  const MAX_FREE_DOWNLOADS = 10; 

  useEffect(() => {
    if (user) {
      const syncUser = async () => {
        try {
          const userEmail = user.primaryEmailAddress?.emailAddress || '';
          const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single();
          const today = new Date().toISOString().split('T')[0];

          if (error && error.code === 'PGRST116') { 
            await supabase.from('profiles').insert({ id: user.id, email: userEmail, download_count: 0, last_download_date: today, is_pro: false });
          } else if (data) {
            if (data.email !== userEmail) await supabase.from('profiles').update({ email: userEmail }).eq('id', user.id);
            if (data.last_download_date !== today) {
              await supabase.from('profiles').update({ download_count: 0, last_download_date: today }).eq('id', user.id);
              setProfile({ count: 0, isPro: data.is_pro });
            } else {
              setProfile({ count: data.download_count, isPro: data.is_pro });
            }
            if (data.is_pro === true && !localStorage.getItem('has_seen_pro_welcome')) {
              setShowSuccessModal(true);
              localStorage.setItem('has_seen_pro_welcome', 'true');
            }
          }
        } catch (err) { console.error("Database error:", err); }
      };
      syncUser();
    }
  }, [user]);

  const executeWithLimit = async (downloadAction) => {
    // 👇✨ TEMPORARY ADSENSE BYPASS: Allow download without login ✨👇
    downloadAction();
    return;
    // 👆✨ ORIGINAL LIMIT CODE COMMENTED OUT BELOW ✨👆
    /*
    if (!user) return; 
    if (profile.isPro) { downloadAction(); return; }
    if (profile.count >= MAX_FREE_DOWNLOADS) { setShowUpgradeModal(true); return; }
    
    downloadAction();
    const newCount = profile.count + 1;
    setProfile(p => ({ ...p, count: newCount }));
    await supabase.from('profiles').update({ download_count: newCount }).eq('id', user.id);
    */
  };

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
      'Image Data Eraser': { title: "EXIF Metadata Stripper | QuickResize Studio", desc: "Remove sensitive metadata from your images for privacy." },
      'QR Maker': { title: "Custom QR Code Maker | QuickResize Studio", desc: "Generate premium branded QR codes for WhatsApp, WiFi, and links." },
      'Blog': { title: "Creator Guides & Tutorials | QuickResize Studio", desc: "Learn how to optimize images, extract metadata, and build beautiful digital content." }
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

  const mainItems = [
    { id: 'Home', icon: <Home size={18} /> },
    { id: 'Resize', icon: <ImageIcon size={18} /> },
    { id: 'Studio', icon: <Share2 size={18} /> },
  ];

  const extraItems = [
    { id: 'Blog', icon: <BookOpen size={18} />, desc: 'Creator Guides' }, 
    { id: 'Filter', icon: <Sliders size={18} />, desc: 'Photo Filters' },
    { id: 'Compressor', icon: <Box size={18} />, desc: 'Compress Files' },
    { id: 'Glass UI', icon: <Layout size={18} />, desc: 'Glassmorphism' },
    { id: 'Renamer', icon: <Settings size={18} />, desc: 'Batch Rename' },
    { id: 'Palette', icon: <Palette size={18} />, desc: 'Color Extractor' },
    { id: 'Image Data Eraser', icon: <ShieldCheck size={18} />, desc: 'Scrub Metadata' },
    { id: 'QR Maker', icon: <Box size={18} />, desc: 'Custom QR Codes' },
    { id: 'Code Extractor', icon: <FileCode2 size={18} />, desc: 'Media to HTML' },
    { id: 'Speed Test', icon: <Activity size={18} />, desc: 'Quick Speed Test' },
    { id: 'Scanner', icon: <Scan size={18} />, desc: 'Barcode & IMEI' },
  ];

  return (
    <div className={clsx("min-h-screen transition-colors duration-500 font-sans flex flex-col", isDark ? "bg-[#05070a] text-white" : "bg-slate-50 text-slate-900")}>
      
      {/* 🧩 1. NAVBAR COMPONENT */}
      <Navbar 
        isDark={isDark} theme={theme} setTheme={setTheme} 
        activeTab={activeTab} setActiveTab={setActiveTab} 
        mainItems={mainItems} extraItems={extraItems} 
        isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} menuRef={menuRef} 
        isMobileSidebarOpen={isMobileSidebarOpen} setIsMobileSidebarOpen={setIsMobileSidebarOpen} 
        profile={profile} 
      />

      {/* 🧩 2. DYNAMIC MAIN CONTENT */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 overflow-visible relative">
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} transition={{ duration: 0.3 }}>
            
            {activeTab === 'Home' && <HomePage setActiveTab={setActiveTab} isDark={isDark} />}
            {activeTab === 'Blog' && <Blog setActiveTab={setActiveTab} isDark={isDark} />}
            
            {activeTab !== 'Home' && activeTab !== 'Blog' && (
              <>
                {/* 👇✨ TEMPORARY ADSENSE BYPASS: SIGN-IN WALL HATA DI GAYI HAI ✨👇 */}
                {/* <SignedIn> */}
                  {activeTab === 'Resize' && <ResizerPage isDark={isDark} setActiveTab={setActiveTab} setFilterPreview={setFilterPreview} setFilterImg={setFilterImg} executeWithLimit={executeWithLimit} />}
                  {activeTab === 'Filter' && <FilterPage isDark={isDark} preview={filterPreview} setPreview={setFilterPreview} img={filterImg} setImg={setFilterImg} executeWithLimit={executeWithLimit} setActiveTab={setActiveTab} />}
                  {activeTab === 'Compressor' && <CompressorPage isDark={isDark} executeWithLimit={executeWithLimit} setActiveTab={setActiveTab} />}
                  {activeTab === 'Glass UI' && <GlassGenerator isDark={isDark} />}
                  {activeTab === 'Palette' && <ColorExtractor isDark={isDark} />}
                  {activeTab === 'Image Data Eraser' && <ExifStripper isDark={isDark} />}
                  {activeTab === 'Studio' && <SocialStudio isDark={isDark} executeWithLimit={executeWithLimit} />}
                  {activeTab === 'QR Maker' && <QRCodeMaker isDark={isDark} />}
                  {activeTab === 'Code Extractor' && <MediaCodeGenerator isDark={isDark} />}
                  {activeTab === 'Speed Test' && <SpeedChecker isDark={isDark} />}
                  {activeTab === 'Scanner' && <BarcodeScanner isDark={isDark} />}

                  {/* ✨ VIP PRO LOCK FOR BATCH RENAMER BHI HATA DIYA ✨ */}
                  {activeTab === 'Renamer' && (
                    <BatchRenamer isDark={isDark} />
                    /*
                    profile.isPro ? <BatchRenamer isDark={isDark} /> : (
                      <div className={clsx("mt-10 p-10 md:p-16 rounded-[2rem] border-2 text-center shadow-2xl max-w-2xl mx-auto animate-in zoom-in-95", isDark ? "bg-slate-900/80 border-purple-500/30" : "bg-purple-50 border-purple-200")}>
                        <div className="w-20 h-20 bg-purple-600/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                          <Lock size={40} className="text-purple-600" />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black italic tracking-tighter mb-3 text-purple-600 uppercase">Pro Feature Only</h2>
                        <p className="opacity-70 font-bold text-sm md:text-base mb-8">Batch File Renamer is exclusively available for Pro members. Upgrade to unlock this tool.</p>
                        <button onClick={() => setShowUpgradeModal(true)} className="bg-purple-600 hover:bg-purple-500 text-white px-8 py-4 rounded-xl text-xs md:text-sm font-black uppercase tracking-[0.2em] shadow-lg transition-all hover:scale-105">
                          Upgrade to Pro
                        </button>
                      </div>
                    )
                    */
                  )}
                {/* </SignedIn> */}

                {/* <SignedOut>
                  <div className={clsx("mt-10 p-10 md:p-16 rounded-[2rem] border-2 text-center shadow-2xl max-w-2xl mx-auto animate-in zoom-in-95", isDark ? "bg-slate-900/80 border-purple-500/30" : "bg-purple-50 border-purple-200")}>
                    <div className="w-20 h-20 bg-purple-600/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                      <Lock size={40} className="text-purple-600" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black italic tracking-tighter mb-3 text-purple-600 uppercase">Premium Tools Locked</h2>
                    <p className="opacity-70 font-bold text-sm md:text-base mb-8">Create a free account or sign in to unlock all Creator Studio tools.</p>
                    <SignInButton mode="modal">
                      <button className="bg-purple-600 hover:bg-purple-500 text-white px-8 py-4 rounded-xl text-xs md:text-sm font-black uppercase tracking-[0.2em] shadow-lg transition-all hover:scale-105">
                        Unlock Now - It's Free
                      </button>
                    </SignInButton>
                  </div>
                </SignedOut> */}
                {/* 👆✨ TEMPORARY ADSENSE BYPASS END ✨👆 */}
              </>
            )}

          </motion.div>
        </AnimatePresence>

        {/* 🧩 3. SEO GUIDE COMPONENT (Does not show on Blog page) */}
        {activeTab !== 'Blog' && <SeoGuide activeTab={activeTab} isDark={isDark} />}

      </main>

      {/* 🧩 4. FOOTER COMPONENT */}
      <Footer isDark={isDark} setActiveModal={setActiveModal} />

      {/* 🧩 5. INFO & LEGAL MODALS COMPONENT */}
      <InfoModals activeModal={activeModal} setActiveModal={setActiveModal} isDark={isDark} />

      {/* ✨ LOCATION BASED UPGRADE MODAL ✨ */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4 backdrop-blur-lg" 
             onClick={() => { setShowUpgradeModal(false); setSelectedPlan(null); }}>
          <motion.div 
            className={clsx(
              "rounded-[2.5rem] max-w-2xl w-full p-6 md:p-10 overflow-y-auto max-h-[90vh] border shadow-2xl relative", 
              isDark ? "bg-slate-900 border-purple-500/40" : "bg-white border-purple-100"
            )} 
            onClick={e => e.stopPropagation()} 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500 uppercase">
                Choose Your Plan
              </h2>
              <p className="opacity-60 font-bold mt-2 text-[10px] uppercase tracking-widest italic">
                Step 1: Select a subscription duration
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 mb-8">
              {[
                { id: '1m', duration: "1 Month", pkr: "500", usd: "5.00", theme: "border-blue-500/30 bg-blue-500/5 text-blue-600" },
                { id: '3m', duration: "3 Months", pkr: "900", usd: "9.50", theme: "border-purple-500/30 bg-purple-500/5 text-purple-600", hot: true },
                { id: '6m', duration: "6 Months", pkr: "1,700", usd: "30.00", theme: "border-emerald-500/30 bg-emerald-500/5 text-emerald-600" },
                { id: '1y', duration: "1 Year", pkr: "2,800", usd: "50.00", theme: "border-amber-500/30 bg-amber-500/5 text-amber-600" }
              ].map((plan) => (
                <button 
                  key={plan.id} type="button" onClick={() => setSelectedPlan(plan)}
                  className={clsx(
                    "flex items-center justify-between p-4 rounded-2xl border-2 transition-all active:scale-95",
                    plan.theme, selectedPlan?.id === plan.id ? "ring-4 ring-offset-2 ring-current ring-offset-slate-900 scale-[1.02]" : "opacity-70 hover:opacity-100"
                  )}
                >
                  <div className="flex items-center gap-3 pointer-events-none">
                    <div className={clsx("w-5 h-5 rounded-full border-2 flex items-center justify-center", selectedPlan?.id === plan.id ? "bg-current" : "border-current")}>
                      {selectedPlan?.id === plan.id && <div className="w-2 h-2 bg-slate-900 rounded-full" />}
                    </div>
                    <span className="font-black text-sm uppercase">{plan.duration} {plan.hot && "🔥"}</span>
                  </div>
                  <div className="text-right pointer-events-none">
                    <p className="font-black text-sm">{isPakistani ? `Rs. ${plan.pkr}` : `$${plan.usd}`}</p>
                    <p className="text-[10px] opacity-40 font-bold">{isPakistani ? `($${plan.usd} Global)` : `(Rs. ${plan.pkr} Local)`}</p>
                  </div>
                </button>
              ))}
            </div>

            {selectedPlan && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="border-t border-white/10 pt-8 mt-8">
                <div className="text-center mb-6 text-green-500 font-black animate-bounce uppercase text-xs tracking-tighter">
                  Great Choice! Now pay for the {selectedPlan.duration} plan:
                </div>
                
                <div className="flex justify-center">
                  {isPakistani ? (
                    <div className="w-full max-w-sm p-6 rounded-3xl border-2 border-green-500/20 bg-green-500/5 text-center">
                      <h3 className="font-black text-green-500 text-sm uppercase mb-4 italic tracking-widest">EasyPaisa / JazzCash</h3>
                      <div className="bg-white p-2 rounded-xl w-32 h-32 mx-auto mb-4 shadow-lg border-2 border-white overflow-hidden">
                        <img src="/qr.jpg" alt="QR" className="w-full h-full object-contain" />
                      </div>
                      <p className="text-[10px] opacity-50 uppercase font-black">Account Title:</p>
                      <p className="text-base font-black text-green-800 dark:text-green-200 uppercase tracking-widest bg-black/10 dark:bg-black/40 py-2 px-4 rounded-xl mb-3 shadow-sm border border-green-500/20">Muhammad Ismail</p>
                      <p className="text-[10px] opacity-60 uppercase mb-1 font-bold">Send exact amount:</p>
                      <code className="text-lg font-black block mb-3 text-green-600">Rs. {selectedPlan.pkr}</code>
                      <p className="text-[10px] opacity-50 uppercase mb-1 font-bold">Copy Number:</p>
                      <code className="text-sm font-black block select-all cursor-copy bg-black/10 py-2 rounded-lg">03445979016</code>
                    </div>
                  ) : (
                    <div className="w-full max-w-sm p-6 rounded-3xl border-2 border-blue-500/20 bg-blue-500/5 text-center">
                      <h3 className="font-black text-blue-500 text-sm uppercase mb-4 italic tracking-widest">Payoneer (Global)</h3>
                      <p className="text-[10px] opacity-60 uppercase mb-1 font-bold">Send exact amount:</p>
                      <code className="text-xl font-black block mb-4 text-blue-500">${selectedPlan.usd}</code>
                      <p className="text-[10px] opacity-50 uppercase mb-1 font-bold">Beneficiary Name:</p>
                      <p className="text-base font-black text-blue-800 dark:text-blue-200 uppercase tracking-widest bg-black/10 dark:bg-black/40 py-2 px-4 rounded-xl mb-4 shadow-sm border border-blue-500/20">Muhammad Ismail</p>
                      <p className="text-[10px] opacity-50 uppercase mb-1 font-bold">Copy Payoneer Email:</p>
                      <code className="block bg-black/20 p-3 rounded-lg text-xs font-black select-all mb-4">muhammadismail66881@gmail.com</code>
                      <p className="text-[10px] italic opacity-70">For Credit Card checkout, request link via WhatsApp below.</p>
                    </div>
                  )}
                </div>

                <div className="mt-8 text-center">
                  <a 
                    href={`https://wa.me/923445979016?text=${encodeURIComponent(
                      `Hello Muhammad Ismail! I want to upgrade to the *${selectedPlan?.duration}* plan.\n\n` +
                      `💳 Price: ${isPakistani ? `Rs. ${selectedPlan?.pkr}` : `$${selectedPlan?.usd}`}\n` +
                      `📧 My Login Email: ${user?.primaryEmailAddress?.emailAddress}\n\n` +
                      `I have completed the payment. Please verify and activate my Pro access.`
                    )}`} 
                    target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 bg-green-600 hover:bg-green-500 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl transition-all hover:scale-105"
                  >
                    <Share2 size={16} /> Verify on WhatsApp
                  </a>
                </div>
              </motion.div>
            )}

            <button 
              type="button"
              onClick={() => { setShowUpgradeModal(false); setSelectedPlan(null); }} 
              className="mt-6 text-[10px] font-black uppercase tracking-[0.3em] opacity-40 hover:opacity-100 transition-opacity w-full text-center"
            >
              Cancel Selection
            </button>
          </motion.div>
        </div>
      )}

      {/* ✨ PRO ACTIVATION SUCCESS MODAL ✨ */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[300] bg-black/80 flex items-center justify-center p-4 backdrop-blur-md">
          <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] max-w-sm w-full text-center border-4 border-green-500 shadow-[0_0_50px_rgba(34,197,94,0.3)]">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/50">
              <Check size={40} className="text-white" />
            </div>
            <h2 className="text-2xl font-black uppercase italic text-slate-900 dark:text-white mb-2">You are Pro!</h2>
            <p className="text-sm font-bold opacity-60 mb-6 uppercase tracking-widest">
              Thank you for your support. All premium features are now unlocked for you.
            </p>
            <button onClick={() => setShowSuccessModal(false)} className="w-full bg-slate-900 dark:bg-white dark:text-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:scale-105 transition-transform">
              Let's Create!
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// WRAPPER APP (With 4-sec Loading Screen)
// ==========================================
export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => { setLoading(false); }, 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {loading && (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-900 animate-out fade-out duration-700 delay-[3300ms] fill-mode-forwards">
          <div className="flex flex-col items-center animate-in zoom-in-95 duration-500">
            <div className="relative w-24 h-24 bg-zinc-950/70 rounded-3xl flex items-center justify-center mb-10 shadow-[0_0_30px_rgba(168,85,247,0.5)]">
              <div className="absolute inset-0 bg-purple-950 rounded-full blur-2xl opacity-40"></div>
              <Sparkles size={48} className="text-purple-400 relative z-10 animate-pulse" />
            </div>
            <h1 className="text-5xl font-black italic text-white tracking-tighter uppercase text-center text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-white">
              QUICK RESIZE
            </h1>
            <p className="text-purple-400 text-sm md:text-base font-bold uppercase tracking-[0.4em] mt-2 opacity-80 animate-in fade-in delay-300 duration-1000 text-center">
              THE CREATOR STUDIO
            </p>
            <div className="w-64 h-2 bg-white/10 rounded-full mt-10 overflow-hidden shadow-inner relative">
              <div className="absolute inset-y-0 left-0 bg-purple-600 animate-[progress_4s_ease-in-out_forwards] rounded-full"></div>
            </div>
          </div>
          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes progress { 0% { width: 0%; } 100% { width: 100%; } }
          `}} />
        </div>
      )}

      {!loading && (
        <Router>
          <MainApp />
        </Router>
      )}
    </>
  );
}