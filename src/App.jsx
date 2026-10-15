import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, Box, FileCode2, Home, Image as ImageIcon, Layout, Palette, Scan, Settings, Share2, ShieldCheck, Sliders, Sparkles, Activity } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import { supabase } from './supabaseClient';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SeoGuide from './components/SeoGuide';
import ToolSEOContent from './components/ToolSEOContent';
import HomePage from './pages/HomePage';
import ResizerPage from './pages/ResizerPage';
import FilterPage from './pages/FilterPage';
import CompressorPage from './pages/CompressorPage';
import Blog from './pages/Blog';
import PrivacyPolicy from './pages/PrivacyPolicy';
import AboutUs from './pages/AboutUs';
import Terms from './pages/Terms';
import BarcodeScanner from './pages/BarcodeScanner';
import SpeedChecker from './pages/SpeedChecker';
import MediaCodeGenerator from './MediaCodeGenerator';
import QRCodeMaker from './QRCodeMaker';
import BatchRenamer from './BatchRenamer';
import SocialStudio from './SocialStudio';
import ColorExtractor from './ColorExtractor';
import ExifStripper from './ExifStripper';
import GlassGenerator from './GlassGenerator';

const seoInfo = {
  '/': ['QuickResize Studio | Privacy-First Image Tools', 'Free browser-based image tools for resizing, filtering, compression, QR codes, thumbnails, and metadata privacy.'],
  '/resize': ['Image Resizer | QuickResize Studio', 'Resize, crop, enhance, and convert images in your browser while keeping your files on your device.'],
  '/studio': ['Thumbnail Studio | QuickResize Studio', 'Create social media posts and YouTube thumbnails with text, layouts, and creative styling.'],
  '/filter': ['Online Photo Filters | QuickResize Studio', 'Apply professional brightness, contrast, color, and creative photo filters online.'],
  '/compressor': ['Image and File Compressor | QuickResize Studio', 'Reduce file sizes for faster websites, sharing, and storage with a simple browser tool.'],
  '/glass-ui': ['Glassmorphism Generator | QuickResize Studio', 'Generate glassmorphism CSS with live blur, opacity, tint, and border controls.'],
  '/renamer': ['Batch File Renamer | QuickResize Studio', 'Rename multiple files consistently in your browser with a fast batch naming utility.'],
  '/palette': ['Color Palette Extractor | QuickResize Studio', 'Extract dominant HEX colors from images and build a useful palette for your next design.'],
  '/eraser': ['EXIF Metadata Remover | QuickResize Studio', 'Remove hidden location, camera, and metadata from images before sharing them online.'],
  '/qr-generator': ['Free QR Code Generator | QuickResize Studio', 'Create custom QR codes for links, text, email, WiFi, phone numbers, WhatsApp, and images.'],
  '/code-extractor': ['Media URL and HTML Code Tool | QuickResize Studio', 'Create hosted media URLs and ready-to-use HTML embed code for images and videos.'],
  '/speed-test': ['Internet Speed Test | QuickResize Studio', 'Test ping, download, and upload performance before sending large files or publishing media.'],
  '/scanner': ['Barcode and QR Scanner | QuickResize Studio', 'Scan QR codes and barcodes from your camera with a fast browser-based reader.'],
  '/blog': ['Creator Guides and Tutorials | QuickResize Studio', 'Practical guides for image optimization, privacy, QR codes, color, and digital content workflows.'],
  '/privacy-policy': ['Privacy Policy | QuickResize Studio', 'Read how QuickResize processes information, protects privacy, and uses advertising cookies.'],
  '/about': ['About QuickResize Studio', 'Learn about QuickResize Studio and our mission to provide practical, privacy-first browser tools.'],
  '/terms': ['Terms of Use | QuickResize Studio', 'Review the terms that apply when using QuickResize Studio tools and services.'],
};

function usePageSEO() {
  const { pathname } = useLocation();
  useEffect(() => {
    const [title, description] = seoInfo[pathname] || seoInfo['/'];
    document.title = title;
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) { meta = document.createElement('meta'); meta.name = 'description'; document.head.appendChild(meta); }
    meta.content = description;
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.appendChild(canonical); }
    canonical.href = `https://quickresizetool.online${pathname === '/' ? '/' : pathname}`;
  }, [pathname]);
}

const mainItems = [
  { id: 'Home', path: '/', icon: <Home size={18} /> },
  { id: 'Resize', path: '/resize', icon: <ImageIcon size={18} /> },
  { id: 'Studio', path: '/studio', icon: <Share2 size={18} /> },
];
const extraItems = [
  { id: 'Blog', path: '/blog', icon: <BookOpen size={18} />, desc: 'Creator Guides' },
  { id: 'Filter', path: '/filter', icon: <Sliders size={18} />, desc: 'Photo Filters' },
  { id: 'Compressor', path: '/compressor', icon: <Box size={18} />, desc: 'Compress Files' },
  { id: 'Glass UI', path: '/glass-ui', icon: <Layout size={18} />, desc: 'Glassmorphism' },
  { id: 'Renamer', path: '/renamer', icon: <Settings size={18} />, desc: 'Batch Rename' },
  { id: 'Palette', path: '/palette', icon: <Palette size={18} />, desc: 'Color Extractor' },
  { id: 'Image Data Eraser', path: '/eraser', icon: <ShieldCheck size={18} />, desc: 'Scrub Metadata' },
  { id: 'QR Maker', path: '/qr-generator', icon: <Box size={18} />, desc: 'Custom QR Codes' },
  { id: 'Code Extractor', path: '/code-extractor', icon: <FileCode2 size={18} />, desc: 'Media to HTML' },
  { id: 'Speed Test', path: '/speed-test', icon: <Activity size={18} />, desc: 'Quick Speed Test' },
  { id: 'Scanner', path: '/scanner', icon: <Scan size={18} />, desc: 'Barcode & QR' },
];

const ToolRoute = ({ slug, children }) => <>{children}<ToolSEOContent slug={slug} /></>;

function MainApp() {
  usePageSEO();
  const location = useLocation();
  const [theme, setTheme] = useState('light');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [filterImg, setFilterImg] = useState(null);
  const [filterPreview, setFilterPreview] = useState(null);
  const [profile, setProfile] = useState({ count: 0, isPro: false });
  const menuRef = useRef(null);
  const { user } = useUser();
  const isDark = theme === 'dark';

  useEffect(() => {
    if (!user) return;
    const syncUser = async () => {
      try {
        const email = user.primaryEmailAddress?.emailAddress || '';
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        if (data) setProfile({ count: data.download_count || 0, isPro: data.is_pro || false });
        else await supabase.from('profiles').insert({ id: user.id, email, download_count: 0, last_download_date: new Date().toISOString().split('T')[0], is_pro: false });
      } catch (error) { console.error('Profile sync error:', error); }
    };
    syncUser();
  }, [user]);
  useEffect(() => { document.body.style.overflow = isMenuOpen || isMobileSidebarOpen ? 'hidden' : 'auto'; return () => { document.body.style.overflow = 'auto'; }; }, [isMenuOpen, isMobileSidebarOpen]);
  const executeWithLimit = async (downloadAction) => downloadAction();

  return (
    <div className={clsx('min-h-screen transition-colors duration-500 font-sans flex flex-col', isDark ? 'bg-[#05070a] text-white' : 'bg-slate-50 text-slate-900')}>
      <Navbar isDark={isDark} theme={theme} setTheme={setTheme} mainItems={mainItems} extraItems={extraItems} isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} menuRef={menuRef} isMobileSidebarOpen={isMobileSidebarOpen} setIsMobileSidebarOpen={setIsMobileSidebarOpen} profile={profile} />
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 overflow-visible relative">
        <AnimatePresence mode="wait"><motion.div key={location.pathname} initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} transition={{ duration: 0.25 }}>
          <Routes>
            <Route path="/" element={<HomePage isDark={isDark} />} />
            <Route path="/resize" element={<ToolRoute slug="resize"><ResizerPage isDark={isDark} setFilterPreview={setFilterPreview} setFilterImg={setFilterImg} executeWithLimit={executeWithLimit} /></ToolRoute>} />
            <Route path="/filter" element={<ToolRoute slug="filter"><FilterPage isDark={isDark} preview={filterPreview} setPreview={setFilterPreview} img={filterImg} setImg={setFilterImg} executeWithLimit={executeWithLimit} /></ToolRoute>} />
            <Route path="/compressor" element={<ToolRoute slug="compressor"><CompressorPage isDark={isDark} executeWithLimit={executeWithLimit} /></ToolRoute>} />
            <Route path="/studio" element={<ToolRoute slug="studio"><SocialStudio isDark={isDark} executeWithLimit={executeWithLimit} /></ToolRoute>} />
            <Route path="/glass-ui" element={<ToolRoute slug="glass"><GlassGenerator isDark={isDark} /></ToolRoute>} />
            <Route path="/renamer" element={<ToolRoute slug="renamer"><BatchRenamer isDark={isDark} /></ToolRoute>} />
            <Route path="/palette" element={<ToolRoute slug="palette"><ColorExtractor isDark={isDark} /></ToolRoute>} />
            <Route path="/eraser" element={<ToolRoute slug="eraser"><ExifStripper isDark={isDark} /></ToolRoute>} />
            <Route path="/qr-generator" element={<ToolRoute slug="qr"><QRCodeMaker isDark={isDark} /></ToolRoute>} />
            <Route path="/code-extractor" element={<ToolRoute slug="code"><MediaCodeGenerator isDark={isDark} /></ToolRoute>} />
            <Route path="/speed-test" element={<ToolRoute slug="speed"><SpeedChecker isDark={isDark} /></ToolRoute>} />
            <Route path="/scanner" element={<ToolRoute slug="scanner"><BarcodeScanner isDark={isDark} /></ToolRoute>} />
            <Route path="/blog" element={<Blog isDark={isDark} />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy isDark={isDark} />} />
            <Route path="/about" element={<AboutUs isDark={isDark} />} />
            <Route path="/terms" element={<Terms isDark={isDark} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </motion.div></AnimatePresence>
        {!['/', '/blog', '/privacy-policy', '/about', '/terms'].includes(location.pathname) && <SeoGuide activeTab={location.pathname} isDark={isDark} />}
      </main>
      <Footer isDark={isDark} />
    </div>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);
  useEffect(() => { const timer = setTimeout(() => setLoading(false), 900); return () => clearTimeout(timer); }, []);
  return loading ? <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-900"><Sparkles size={48} className="text-purple-400 animate-pulse mb-6" /><h1 className="text-4xl font-black italic text-white">QUICK RESIZE</h1><p className="text-purple-400 text-xs font-bold uppercase tracking-[0.4em] mt-2">The Creator Studio</p></div> : <BrowserRouter><MainApp /></BrowserRouter>;
}
