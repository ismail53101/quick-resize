import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { X } from 'lucide-react';

const InfoModals = ({ activeModal, setActiveModal, isDark }) => {
  if (!activeModal) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 backdrop-blur-lg" onClick={() => setActiveModal(null)}>
      <motion.div className={clsx("rounded-[2rem] md:rounded-[2.5rem] max-w-3xl w-full max-h-[85vh] overflow-auto border shadow-[0_0_60px_rgba(59,130,246,0.2)]", isDark ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-gray-200 text-slate-900")} onClick={(e) => e.stopPropagation()} initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}>
        <div className="p-6 md:p-8 border-b border-slate-700/30 flex justify-between items-center sticky top-0 bg-inherit z-10">
          <h2 className="text-base md:text-lg font-black uppercase tracking-[0.4em] text-blue-600 italic">{activeModal.replace('-', ' ')}</h2>
          <button onClick={() => setActiveModal(null)} className="p-2 hover:bg-red-500 rounded-full transition-all hover:text-white shadow-xl"><X size={24} /></button>
        </div>
        <div className="p-8 md:p-12 text-sm md:text-base leading-relaxed space-y-6 opacity-90 font-bold text-left">
          
         {activeModal === 'about' && (
            <>
              <p className="font-black text-blue-600 text-xl md:text-2xl tracking-tighter italic uppercase border-b border-blue-500/20 pb-4">About QuickResizePro Studio</p>
              <p>Welcome to <strong className="font-black text-blue-500">QuickResizePro</strong>, your premier destination for professional-grade browser-based media tools. Our mission is to provide content creators, developers, and everyday users with a fast, 100% secure, and free platform to manage their digital assets.</p>
              <p>Unlike other tools, QuickResizePro works entirely on the <strong className="font-black text-blue-500">client-side</strong>. This means your images and files never touch our servers, ensuring total privacy.</p>
              <p>Founded in 2026, we continue to innovate in the field of web-based image processing. For any feedback or business inquiries, feel free to contact us.</p>
              <p><strong className="font-black text-blue-500">Support Email:</strong> <a href="mailto:muhammadismail66881@gmail.com" className="text-blue-600 font-black hover:underline">muhammadismail66881@gmail.com</a></p>
            </>
          )}

         {activeModal === 'privacy' && (
            <>
              <p className="font-black text-blue-600 text-xl md:text-2xl uppercase italic tracking-tighter border-b border-blue-500/20 pb-4">Privacy & Data Protection Policy</p>
              <p>At QuickResizePro, accessible from quickresizetool.online, user privacy is our top priority. Our unique architecture ensures that <strong className="font-black text-blue-500">No Image or File is ever uploaded to our servers</strong>.</p>
              <h3 className="font-black text-blue-600 mt-5 text-lg">1. Local Processing</h3>
              <p>All resizing, filtering, and compression happen directly within your browser's memory using JavaScript.</p>
              <h3 className="font-black text-blue-600 mt-5 text-lg">2. Google AdSense & Cookies</h3>
              <p>We use Google AdSense to serve ads. Third party vendors, including Google, use cookies to serve ads based on a user's prior visits to your website or other websites.</p>
              <p>Google's use of advertising cookies enables it and its partners to serve ads to your users based on their visit to your sites and/or other sites on the Internet. Users may opt out of personalized advertising by visiting <a href="https://myadcenter.google.com/" target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">Ads Settings</a>.</p>
            </>
          )}

          {activeModal === 'terms' && (
            <>
              <p className="font-black text-blue-600 text-xl md:text-2xl uppercase italic tracking-tighter border-b border-blue-500/20 pb-4">Terms and Conditions of Use</p>
              <p>By accessing <strong className="font-black text-blue-500">QuickResizePro</strong>, you agree to comply with these terms. This tool is provided free of charge for personal and commercial use.</p>
              <h3 className="font-black text-blue-600 mt-5 text-lg">1. Intellectual Property</h3>
              <p>The code, design, and branding of QuickResizePro are the intellectual property of muhammadismail66881@gmail.com. You may not reproduce or redistribute our source code without prior written consent.</p>
              <h3 className="font-black text-blue-600 mt-5 text-lg">2. Limitation of Liability</h3>
              <p>We strive for 100% accuracy, but we are not responsible for any data loss or damage resulting from the use of our tools.</p>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default InfoModals;