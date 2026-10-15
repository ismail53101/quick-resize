import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Video, Copy, Check, FileCode2, RefreshCw, UploadCloud, Link as LinkIcon } from 'lucide-react';
import { clsx } from 'clsx';

const MediaCodeGenerator = ({ isDark }) => {
  const [activeTab, setActiveTab] = useState('image'); 
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  // 👇👇👇 ✨ SEO Code for Code Extractor ✨ 👇👇👇
  useEffect(() => {
    document.title = "Code Extractor | Quick Resize Tool";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Extract text and code snippets easily from images with our free online OCR tool by Quick Resize Tool.");
    }
  }, []);
  // 👆👆👆 ✨ YAHAN PASTE KARNA HAI ✨ 👆👆👆
  
  
  // Results State
  const [mediaUrl, setMediaUrl] = useState('');
  const [embedCode, setEmbedCode] = useState('');
  
  // Copy States
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // 🖼️ 1. IMAGE UPLOAD (Using Your ImgBB API)
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setError('');
    setMediaUrl('');
    setEmbedCode('');

    const formData = new FormData();
    formData.append('image', file);

    try {
      // Aapki ImgBB API Key yahan use ho rahi hai
      const IMGBB_API_KEY = "7eeaec4f0ed5484c76af8e08a3125a9d"; 
      
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();

      if (data.success) {
        const url = data.data.url;
        setMediaUrl(url);
        setEmbedCode(`<img src="${url}" alt="Hosted Image" style="max-width: 100%; height: auto;" />`);
      } else {
        setError("Image upload failed. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please check your internet connection.");
    } finally {
      setIsUploading(false);
    }
  };

  // 🎥 2. VIDEO UPLOAD (Cloudinary Structure)
  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setError('');
    setMediaUrl('');
    setEmbedCode('');

    const formData = new FormData();
    formData.append('file', file);
    
    // ✨ YAHAN APNA UPLOAD PRESET LIKHEIN ✨
    formData.append('upload_preset', 'quickresize_preset'); 

    try {
      // ✨ AAPKA CLOUD NAME ADD HO GAYA HAI ✨
      const CLOUDINARY_CLOUD_NAME = "drhwlq5n6";
      
      const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/video/upload`, {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();

      if (data.secure_url) {
        const url = data.secure_url;
        setMediaUrl(url);
        setEmbedCode(`<video width="100%" controls preload="metadata">\n  <source src="${url}" type="video/mp4">\n  Your browser does not support the video tag.\n</video>`);
      } else {
        console.error("Cloudinary Error:", data);
        setError(data.error?.message || "Upload failed. Please check your Upload Preset.");
      }
    } catch (err) {
      console.error("Network Error:", err);
      setError("Video upload failed. Check your internet connection.");
    } finally {
      setIsUploading(false);
    }
  };

  // Copy Functions
  const copyText = (text, type) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    if (type === 'url') {
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    } else {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const inputClass = "w-full bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 p-4 rounded-2xl outline-none font-black text-sm md:text-base border-2 border-slate-200 dark:border-slate-700 transition-all shadow-sm";

  return (
    <div className="mt-4 animate-in fade-in duration-500 px-2 md:px-0">
      <div className="text-center md:text-left mb-6">
        <div className="flex items-center gap-2 mb-2 justify-center md:justify-start">
            <span className="bg-purple-600 text-white text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest">Cloud Tool</span>
            <h2 className="text-xl md:text-2xl font-black italic text-purple-600 uppercase tracking-tighter">Media to URL & Code</h2>
        </div>
        <p className="text-xs md:text-sm opacity-60 font-bold">Upload an image or video to get a permanent URL and HTML embed code.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        
        {/* LEFT PANEL - UPLOAD AREA */}
        <div className={clsx("w-full lg:w-2/5 p-6 md:p-8 rounded-[2rem] border-2 shadow-lg sticky top-24", isDark ? "bg-slate-800/50 border-slate-700" : "bg-white border-gray-200")}>
          
          <div className="flex gap-2 mb-6 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl">
            <button 
              onClick={() => { setActiveTab('image'); setError(''); setMediaUrl(''); setEmbedCode(''); }}
              className={clsx("flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all", activeTab === 'image' ? "bg-purple-600 text-white shadow-md" : "opacity-60 hover:opacity-100")}
            >
              <ImageIcon size={14} /> Image
            </button>
            <button 
              onClick={() => { setActiveTab('video'); setError(''); setMediaUrl(''); setEmbedCode(''); }}
              className={clsx("flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all", activeTab === 'video' ? "bg-purple-600 text-white shadow-md" : "opacity-60 hover:opacity-100")}
            >
              <Video size={14} /> Video
            </button>
          </div>

          <div className="border-2 border-dashed border-purple-500/40 bg-purple-500/5 rounded-2xl p-8 text-center transition-all hover:bg-purple-500/10">
            {isUploading ? (
              <div className="flex flex-col items-center justify-center py-6">
                <RefreshCw size={40} className="text-purple-500 animate-spin mb-4" />
                <span className="text-xs font-black uppercase tracking-widest text-purple-600">Uploading to Cloud...</span>
                <span className="text-[10px] opacity-60 mt-2 font-bold">Please do not close this window</span>
              </div>
            ) : (
              <div>
                <UploadCloud size={48} className="mx-auto text-purple-500 mb-4 opacity-80" />
                <h3 className="font-black text-sm uppercase tracking-widest mb-2">
                  Select {activeTab === 'image' ? 'Image' : 'Video'} File
                </h3>
                <p className="text-[10px] opacity-60 font-bold px-4 mb-6">
                  {activeTab === 'image' ? 'Supports JPG, PNG, GIF up to 32MB' : 'Supports MP4, WebM up to 100MB'}
                </p>
                <input 
                  type="file" 
                  accept={activeTab === 'image' ? 'image/*' : 'video/*'}
                  onChange={activeTab === 'image' ? handleImageUpload : handleVideoUpload}
                  className="block w-full text-sm text-slate-500 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-[10px] file:font-black file:uppercase file:tracking-widest file:bg-purple-600 file:text-white hover:file:bg-purple-500 cursor-pointer text-center"
                />
              </div>
            )}
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-center">
              <p className="text-[10px] font-black uppercase tracking-widest text-red-500">{error}</p>
            </div>
          )}
        </div>

        {/* RIGHT PANEL - RESULTS (URL & CODE) */}
        <div className={clsx("w-full lg:w-3/5 space-y-6", isDark ? "" : "")}>
          
          {/* RESULT 1: DIRECT URL */}
          <div className={clsx("p-6 md:p-8 rounded-[2rem] border-2 shadow-lg transition-all", isDark ? "bg-slate-900 border-purple-500/20" : "bg-white border-purple-100", mediaUrl ? "opacity-100" : "opacity-50 pointer-events-none")}>
            <div className="flex justify-between items-center mb-4">
               <label className="text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 text-purple-600 dark:text-purple-400">
                  <LinkIcon size={14} /> 1. Direct File URL
               </label>
            </div>
            <div className="flex gap-2">
              <input 
                type="text" 
                readOnly
                value={mediaUrl || 'Upload a file to get URL...'}
                className={inputClass}
              />
              <button 
                onClick={() => copyText(mediaUrl, 'url')}
                className={clsx("px-6 rounded-2xl font-black flex items-center justify-center transition-all", copiedUrl ? "bg-green-500 text-white" : "bg-purple-600 hover:bg-purple-500 text-white")}
                title="Copy URL"
              >
                {copiedUrl ? <Check size={18} /> : <Copy size={18} />}
              </button>
            </div>
          </div>

          {/* RESULT 2: HTML EMBED CODE */}
          <div className={clsx("p-6 md:p-8 rounded-[2rem] border-2 shadow-lg flex flex-col transition-all", isDark ? "bg-slate-900 border-purple-500/20" : "bg-white border-purple-100", embedCode ? "opacity-100" : "opacity-50 pointer-events-none")}>
            <div className="flex justify-between items-center mb-4">
               <label className="text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 text-purple-600 dark:text-purple-400">
                  <FileCode2 size={14} /> 2. HTML Embed Code
               </label>
               {embedCode && (
                 <button 
                   onClick={() => copyText(embedCode, 'code')} 
                   className={clsx("flex items-center gap-1.5 text-[10px] font-black uppercase px-4 py-2 rounded-xl transition-all", copiedCode ? "bg-green-500 text-white" : "bg-purple-500/10 text-purple-600 hover:bg-purple-600 hover:text-white")}
                 >
                   {copiedCode ? <Check size={12} /> : <Copy size={12} />}
                   {copiedCode ? 'Copied!' : 'Copy Code'}
                 </button>
               )}
            </div>
            
            <div className="relative rounded-2xl overflow-hidden border border-slate-300 dark:border-slate-700 bg-[#1e1e1e]">
              <textarea 
                readOnly
                value={embedCode || ''}
                className="w-full h-full min-h-[150px] bg-transparent text-[#d4d4d4] font-mono text-xs p-5 outline-none resize-none leading-relaxed"
              />
            </div>
          </div>

          {/* VISUAL PREVIEW (Optional) */}
          {mediaUrl && (
            <div className={clsx("p-6 rounded-[2rem] border-2 shadow-inner text-center", isDark ? "bg-black/40 border-slate-800" : "bg-slate-50 border-slate-200")}>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-4">Live Preview</p>
              {activeTab === 'image' ? (
                <img src={mediaUrl} alt="Uploaded preview" className="max-h-60 mx-auto rounded-xl object-contain shadow-lg" />
              ) : (
                <video src={mediaUrl} controls className="max-h-60 mx-auto rounded-xl shadow-lg w-full max-w-md" />
              )}
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
};

export default MediaCodeGenerator;