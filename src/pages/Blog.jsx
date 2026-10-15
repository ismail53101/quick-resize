import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { ChevronRight, BookOpen, Clock, HelpCircle } from 'lucide-react';

const Blog = ({ isDark }) => {
  const navigate = useNavigate();
  // 🚀 VIP AdSense Friendly Articles (Including New Tools)
  const articles = [
    {
      id: 1,
      title: "How to Resize Images for Instagram Without Losing Quality",
      category: "Social Media",
      time: "3 min read",
      desc: "Struggling with pixelated posts? Learn the secret aspect ratios and compression settings for crisp social media uploads. We explain how our smart browser-based resizer maintains your image's HD quality while perfectly fitting Instagram, Facebook, and Twitter dimensions without stretching.",
      targetTab: "Resize"
    },
    {
      id: 2,
      title: "Why Privacy Matters: Removing Metadata from Your Photos",
      category: "Security",
      time: "4 min read",
      desc: "Every time you snap a picture, your smartphone saves hidden EXIF data like your GPS location, camera model, and time. This can be a major privacy risk. Discover how to scrub sensitive metadata safely using our client-side Exif Stripper before sharing photos online.",
      targetTab: "Image Data Eraser"
    },
    {
      id: 3,
      title: "The Ultimate Guide to Generating Custom QR Codes & Barcodes",
      category: "Business",
      time: "5 min read",
      desc: "From WiFi auto-connect to digital V-Cards, custom QR codes are revolutionizing how we share information. Learn how to generate secure, privacy-first 1D barcodes and WhatsApp chat links directly in your browser without any server tracking.",
      targetTab: "Scanner"
    },
    {
      id: 4,
      title: "Reverse Engineering: Extracting Clean HTML from Social Media",
      category: "Development",
      time: "6 min read",
      desc: "Web developers often struggle to embed raw videos and images from platforms like Instagram and TikTok. Discover how our Code Extractor instantly converts any social media link into production-ready, responsive HTML iframe code for your blogs and websites.",
      targetTab: "Code Extractor"
    },
    {
      id: 5,
      title: "Color Psychology: Extracting Palettes from Viral Images",
      category: "Branding",
      time: "3 min read",
      desc: "Discover how top creators and luxury brands use color palettes to evoke emotions. Upload any viral image or aesthetic photo to instantly extract its exact hex codes. Build your brand kit seamlessly for your next big graphic design project.",
      targetTab: "Palette"
    },
    {
      id: 6,
      title: "Is Your Internet Throttling? How to Accurately Test Ping & Speed",
      category: "Network",
      time: "4 min read",
      desc: "Slow uploads ruining your workflow? Learn the difference between Ping, Download, and Upload speeds. Our integrated Speed Test tool helps you diagnose network issues in real-time before you start uploading heavy image and video files.",
      targetTab: "Speed Test"
    }
  ];

  // FAQs to boost Word Count for AdSense
  const faqs = [
    {
      q: "Are my uploaded images safe?",
      a: "Yes, 100%. QuickResize Studio operates entirely on the client side. This means your files are processed directly inside your browser's memory and are never uploaded to any external servers. Your privacy is guaranteed."
    },
    {
      q: "Does resizing an image reduce its quality?",
      a: "Standard resizing can sometimes cause blurriness. However, our advanced Auto-Enhance algorithms preserve the sharpness and contrast of your original photo, ensuring high-definition results even after cropping or reducing dimensions."
    },
    {
      q: "Do I need to install any software to generate QR codes?",
      a: "No! Our entire Creator Toolkit, including the VIP QR & Barcode Generator, runs entirely in your web browser. It is fully optimized for both desktop and mobile devices without requiring any app installations."
    }
  ];

  return (
    <div className={clsx("max-w-6xl mx-auto py-10 md:py-16 px-4 animate-in fade-in duration-500 transition-colors", isDark ? "text-slate-200" : "text-slate-800")}>
      
      {/* SEO Optimized Header Section */}
      <div className="text-center mb-16">
         <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen size={36} className="text-blue-500" />
            <h1 className={clsx("text-4xl md:text-6xl font-black italic tracking-tighter uppercase", isDark ? "text-white" : "text-slate-900")}>
              Creator <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">Guides</span>
            </h1>
         </div>
         <div className="max-w-3xl mx-auto mt-6">
            <p className={clsx("font-bold text-sm md:text-base leading-relaxed text-center", isDark ? "text-slate-400" : "text-slate-600")}>
              Welcome to the ultimate resource hub for digital content creators, marketers, and web developers. 
              In today's fast-paced digital landscape, optimizing your visual assets is a necessity. 
              From reducing heavy file sizes for faster website speeds to generating secure QR codes, 
              our comprehensive guides are designed to help you master your workflow while keeping your data 100% private.
            </p>
         </div>
      </div>

      {/* Grid of Articles */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-20">
        {articles.map((post, i) => (
          <motion.div 
            key={post.id} 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.4, delay: i * 0.1 }}
            onClick={() => navigate({ Resize: '/resize', 'Image Data Eraser': '/eraser', Scanner: '/scanner', 'Code Extractor': '/code-extractor', Palette: '/palette', 'Speed Test': '/speed-test' }[post.targetTab] || '/blog')}
            className={clsx(
              "p-6 md:p-8 rounded-[2rem] border-2 transition-all cursor-pointer group shadow-lg flex flex-col justify-between h-full hover:-translate-y-2", 
              isDark 
                ? "bg-slate-900 border-slate-800 hover:border-blue-500/50 hover:shadow-blue-500/10" 
                : "bg-white border-slate-100 hover:border-blue-200 hover:shadow-xl"
            )}
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className={clsx("text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border", isDark ? "bg-blue-500/10 text-blue-400 border-blue-500/20" : "bg-blue-50 text-blue-600 border-blue-200")}>
                  {post.category}
                </span>
                <span className={clsx("text-[10px] font-bold flex items-center gap-1 uppercase tracking-widest", isDark ? "text-slate-500" : "text-slate-400")}>
                  <Clock size={12} /> {post.time}
                </span>
              </div>
              
              <h2 className={clsx("text-xl md:text-2xl font-black mb-4 leading-tight group-hover:text-blue-500 transition-colors", isDark ? "text-white" : "text-slate-900")}>
                {post.title}
              </h2>
              <p className={clsx("text-sm font-bold mb-6 leading-relaxed line-clamp-4", isDark ? "text-slate-400" : "text-slate-500")}>
                {post.desc}
              </p>
            </div>
            
            <div className="flex items-center gap-2 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-blue-500 group-hover:translate-x-2 transition-transform mt-auto pt-5 border-t border-slate-500/10">
              Read Guide <ChevronRight size={16} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* AdSense Value Addition: FAQ Section */}
      <div className={clsx("max-w-4xl mx-auto p-8 md:p-12 rounded-[2.5rem] border-2 shadow-xl", isDark ? "bg-slate-900 border-slate-800" : "bg-blue-50/50 border-blue-100")}>
        <div className="flex items-center gap-3 mb-10">
          <HelpCircle size={28} className="text-blue-500" />
          <h3 className={clsx("text-2xl md:text-3xl font-black italic uppercase tracking-tighter", isDark ? "text-white" : "text-slate-900")}>Frequently Asked Questions</h3>
        </div>
        <div className="space-y-8">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-slate-500/20 pb-8 last:border-0 last:pb-0">
              <h4 className={clsx("font-black text-lg md:text-xl mb-3", isDark ? "text-white" : "text-slate-800")}>{faq.q}</h4>
              <p className={clsx("text-sm md:text-base font-bold leading-relaxed", isDark ? "text-slate-400" : "text-slate-600")}>{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Blog;