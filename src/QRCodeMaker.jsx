import React, { useState, useEffect, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Download, Type, Palette, RefreshCw, Zap, Smartphone, Globe, Phone, MessageCircle, Mail, Wifi, Image as ImageIcon } from 'lucide-react'; 
import { HexColorPicker } from "react-colorful"; 
import logo from './logo.jpg'; 
import { clsx } from 'clsx';

const QRCodeMaker = ({ isDark }) => {
  // QR Type State
  const [qrType, setQrType] = useState('url');
  
  // Input States
  const [text, setText] = useState('https://quickresizetool.online');
  const [phone, setPhone] = useState('');
  const [waNumber, setWaNumber] = useState('');
  const [waMessage, setWaMessage] = useState('');
  const [emailTo, setEmailTo] = useState('');
  const [emailSub, setEmailSub] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [wifiSsid, setWifiSsid] = useState('');
  const [wifiPass, setWifiPass] = useState('');
  const [imageValue, setImageValue] = useState('');
  
  // 👇👇👇 ✨ SEO Code for QR Code Maker ✨ 👇👇👇
  useEffect(() => {
    document.title = "Free QR Code Maker | Quick Resize Tool";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Generate free custom QR codes for links, text, WiFi, and contacts instantly online with Quick Resize Tool.");
    }
  }, []);
  // 👆👆👆 ✨ YAHAN PASTE KARNA HAI ✨ 👆👆👆

  // NEW: Uploading states for Image
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // Design States
  const [fgColor, setFgColor] = useState('#2563eb'); 
  const [bgColor, setBgColor] = useState('#ffffff');
  const [size, setSize] = useState(256);
  const [includeLogo, setIncludeLogo] = useState(true);
  
  // VIP Picker Toggler State
  const [showPicker, setShowPicker] = useState(false);
  
  const qrRef = useRef();

  // 🚀 VIP UPGRADE: Professional Cloud Upload Handler
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Sirf 32MB tak ki files allow karein (ImgBB ki limit)
    if (file.size > 32 * 1024 * 1024) {
      setUploadError("Image is too large! Maximum limit is 32MB.");
      return;
    }

    setIsUploading(true);
    setUploadError('');
    setImageValue(''); // Purana QR clear kar dein

    // Form data banayen jo API ko bhejna hai
    const formData = new FormData();
    formData.append('image', file);

    try {
      // Yahan apni ImgBB API Key dalein (Step 2 mein bataya hai kahan se milegi)
      const IMGBB_API_KEY = "7eeaec4f0ed5484c76af8e08a3125a9d"; 
      
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();

      if (data.success) {
        // Hamein Cloud se chota URL mil gaya!
        setImageValue(data.data.url); 
      } else {
        setUploadError("Upload failed. Please try again.");
      }
    } catch (error) {
      setUploadError("Network error. Please check your internet connection.");
    } finally {
      setIsUploading(false); // Loading khatam
    }
  };

  // Dynamic QR Value Generator
  const getQRValue = () => {
    switch (qrType) {
      case 'url':
      case 'text':
        return text || 'https://quickresizetool.online';
      case 'phone':
        return `tel:${phone.replace(/[^\d+]/g, '')}`; 
      case 'whatsapp':
        return `https://wa.me/${waNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(waMessage)}`;
      case 'email':
        return `mailto:${emailTo}?subject=${encodeURIComponent(emailSub)}&body=${encodeURIComponent(emailBody)}`;
      case 'wifi':
        return `WIFI:T:WPA;S:${wifiSsid};P:${wifiPass};H:false;;`;
      case 'image': 
        return imageValue || ' '; // Ab yahan URL pass hoga, jis se code crash nahi hoga
      default:
        return text;
    }
  };

  const downloadQR = () => {
    const canvas = qrRef.current.querySelector('canvas');
    const url = canvas.toDataURL("image/png");
    const link = document.createElement('a');
    link.href = url;
    link.download = `QuickResize_${qrType.toUpperCase()}_QR.png`;
    link.click();
  };

  const swapColors = () => {
    const temp = fgColor;
    setFgColor(bgColor);
    setBgColor(temp);
  };

  const types = [
    { id: 'url', icon: <Globe size={16} />, label: 'Link' },
    { id: 'text', icon: <Type size={16} />, label: 'Text' },
    { id: 'whatsapp', icon: <MessageCircle size={16} />, label: 'WhatsApp' },
    { id: 'phone', icon: <Phone size={16} />, label: 'Call' },
    { id: 'email', icon: <Mail size={16} />, label: 'Email' },
    { id: 'wifi', icon: <Wifi size={16} />, label: 'WiFi' },
    { id: 'image', icon: <ImageIcon size={16} />, label: 'Image' }, 
  ];

  const inputClass = "w-full bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 p-4 rounded-2xl outline-none font-black text-sm md:text-base border-2 border-slate-200 dark:border-slate-700 focus:border-orange-500 dark:focus:border-orange-500 transition-all shadow-sm";

  return (
    <div className="mt-4 animate-in fade-in duration-500 px-2 md:px-0">
      <div className="text-center md:text-left mb-6">
        <div className="flex items-center gap-2 mb-2 justify-center md:justify-start">
            <span className="bg-orange-500 text-white text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest">Ultimate</span>
            <h2 className="text-xl md:text-2xl font-black italic text-orange-500 uppercase tracking-tighter">QR Studio</h2>
        </div>
        <p className="text-xs md:text-sm opacity-60 font-bold">Generate QR codes for links, WiFi, WhatsApp, and more.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-center lg:items-start">
        
        {/* ✨ PREVIEW SECTION ✨ */}
        <div className={clsx("w-full lg:w-2/5 p-6 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] border-2 flex flex-col items-center justify-center shadow-xl relative overflow-hidden group sticky top-24", 
          isDark ? "bg-slate-900 border-orange-500/20 shadow-orange-500/5" : "bg-white border-gray-100 shadow-slate-200")}>
          
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-50"></div>

          <div ref={qrRef} className="p-4 md:p-8 bg-white rounded-[1.5rem] md:rounded-[2.5rem] shadow-2xl border-4 md:border-[12px] border-slate-50 max-w-full transition-transform group-hover:scale-105 duration-500">
            <div className="relative flex justify-center">
              {/* Jab image upload ho rahi ho to spinner dikhayein */}
              {isUploading ? (
                <div className="flex flex-col items-center justify-center w-[250px] h-[250px] bg-slate-50 dark:bg-slate-800 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600">
                  <RefreshCw size={32} className="text-orange-500 animate-spin mb-4" />
                  <span className="text-xs font-bold text-slate-500">Uploading Image...</span>
                </div>
              ) : (
                <QRCodeCanvas 
                  value={getQRValue() || ' '} 
                  size={size > 300 ? 250 : size} 
                  style={{ width: '100%', height: 'auto', maxWidth: '250px' }} 
                  fgColor={fgColor} 
                  bgColor={bgColor} 
                  level={"H"} // Ab Image URL ban gayi hai, isliye wapas High quality rakh sakte hain
                  includeMargin={true} 
                  imageSettings={includeLogo ? {
                    src: logo,
                    height: 40,
                    width: 40,
                    excavate: true,
                  } : null}
                />
              )}
            </div>
          </div>
          
          <button 
            onClick={downloadQR}
            disabled={isUploading}
            className={clsx("mt-8 w-full text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg transition-all flex items-center justify-center gap-3 border-b-4", isUploading ? "bg-slate-400 border-slate-500 cursor-not-allowed" : "bg-orange-600 hover:bg-orange-500 border-orange-800 active:scale-95")}
          >
            <Download size={16} /> Export {qrType.toUpperCase()} QR
          </button>
        </div>

        {/* --- CONTROLS SECTION --- */}
        <div className={clsx("w-full lg:w-3/5 p-5 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border space-y-6 shadow-lg", isDark ? "bg-slate-800/50 border-slate-700" : "bg-white border-gray-200")}>
          
          {/* TYPE SELECTOR */}
          <div>
             <label className="text-[10px] font-black uppercase opacity-60 tracking-[0.2em] mb-3 block">QR Code Type</label>
             <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2"> 
                {types.map(t => (
                  <button 
                    key={t.id} 
                    onClick={() => setQrType(t.id)}
                    className={clsx("flex flex-col items-center justify-center gap-2 p-3 rounded-2xl border-2 transition-all", qrType === t.id ? "border-orange-500 bg-orange-500/10 text-orange-500 shadow-sm" : "border-slate-200 dark:border-slate-700 opacity-60 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5")}
                  >
                    {t.icon}
                    <span className="text-[8px] font-black uppercase tracking-widest">{t.label}</span>
                  </button>
                ))}
             </div>
          </div>

          {/* DYNAMIC INPUTS BASED ON TYPE */}
          <div className="p-5 rounded-[2rem] border-2 border-orange-500/20 bg-orange-500/5 space-y-4">
            
            {(qrType === 'url' || qrType === 'text') && (
               <div>
                 <label className="text-[9px] font-black uppercase opacity-60 tracking-widest mb-2 block text-orange-600 dark:text-orange-400">
                    {qrType === 'url' ? 'Destination URL' : 'Your Text Message'}
                 </label>
                 <input type="text" value={text} onChange={(e) => setText(e.target.value)} className={inputClass} placeholder={qrType === 'url' ? "https://example.com" : "Type something..."} />
               </div>
            )}

            {qrType === 'phone' && (
               <div>
                 <label className="text-[9px] font-black uppercase opacity-60 tracking-widest mb-2 block text-orange-600 dark:text-orange-400">Phone Number</label>
                 <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} placeholder="+1234567890" />
               </div>
            )}

            {qrType === 'whatsapp' && (
               <>
                 <div>
                   <label className="text-[9px] font-black uppercase opacity-60 tracking-widest mb-2 block text-orange-600 dark:text-orange-400">WhatsApp Number (with country code)</label>
                   <input type="tel" value={waNumber} onChange={(e) => setWaNumber(e.target.value)} className={inputClass} placeholder="923001234567" />
                 </div>
                 <div className="mt-3">
                   <label className="text-[9px] font-black uppercase opacity-60 tracking-widest mb-2 block text-orange-600 dark:text-orange-400">Pre-filled Message (Optional)</label>
                   <input type="text" value={waMessage} onChange={(e) => setWaMessage(e.target.value)} className={inputClass} placeholder="Hello, I need help with..." />
                 </div>
               </>
            )}

            {qrType === 'email' && (
               <>
                 <div>
                   <label className="text-[9px] font-black uppercase opacity-60 tracking-widest mb-2 block text-orange-600 dark:text-orange-400">Email Address</label>
                   <input type="email" value={emailTo} onChange={(e) => setEmailTo(e.target.value)} className={inputClass} placeholder="contact@example.com" />
                 </div>
                 <div className="mt-3">
                   <label className="text-[9px] font-black uppercase opacity-60 tracking-widest mb-2 block text-orange-600 dark:text-orange-400">Subject</label>
                   <input type="text" value={emailSub} onChange={(e) => setEmailSub(e.target.value)} className={inputClass} placeholder="Inquiry" />
                 </div>
                 <div className="mt-3">
                   <label className="text-[9px] font-black uppercase opacity-60 tracking-widest mb-2 block text-orange-600 dark:text-orange-400">Message</label>
                   <textarea value={emailBody} onChange={(e) => setEmailBody(e.target.value)} className={`${inputClass} h-24 resize-none`} placeholder="Write your message here..." />
                 </div>
               </>
            )}

            {qrType === 'wifi' && (
               <>
                 <div>
                   <label className="text-[9px] font-black uppercase opacity-60 tracking-widest mb-2 block text-orange-600 dark:text-orange-400">Network Name (SSID)</label>
                   <input type="text" value={wifiSsid} onChange={(e) => setWifiSsid(e.target.value)} className={inputClass} placeholder="My Home WiFi" />
                 </div>
                 <div className="mt-3">
                   <label className="text-[9px] font-black uppercase opacity-60 tracking-widest mb-2 block text-orange-600 dark:text-orange-400">Password</label>
                   <input type="password" value={wifiPass} onChange={(e) => setWifiPass(e.target.value)} className={inputClass} placeholder="********" />
                 </div>
               </>
            )}

            {/* NEW: Cloud Image Upload Field */}
            {qrType === 'image' && (
               <div>
                 <label className="text-[9px] font-black uppercase opacity-60 tracking-widest mb-2 block text-orange-600 dark:text-orange-400">
                   Upload Image (Up to 32MB)
                 </label>
                 <input 
                   type="file" 
                   accept="image/*" 
                   onChange={handleImageUpload} 
                   disabled={isUploading}
                   className={`${inputClass} file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-[10px] file:font-black file:bg-orange-500 file:text-white hover:file:bg-orange-600 file:cursor-pointer cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`} 
                 />
                 
                 {/* Error Message Display */}
                 {uploadError && <p className="text-red-500 text-[10px] font-bold mt-2">{uploadError}</p>}
                 
                 {/* Success URL Display */}
                 {imageValue && !isUploading && !uploadError && (
                   <div className="mt-2 p-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg overflow-hidden">
                     <p className="text-[8px] font-black uppercase text-green-600 dark:text-green-400 mb-1">Upload Success! Image URL:</p>
                     <p className="text-[10px] text-slate-600 dark:text-slate-300 truncate">{imageValue}</p>
                   </div>
                 )}
                 
                 <p className="text-[8px] mt-2 opacity-60 italic font-medium">
                   *Your image is securely uploaded to the cloud and converted to a fast-scanning URL QR code.
                 </p>
               </div>
            )}
          </div>

          {/* ✨ 100% VIP CUSTOM REACT COLOR PICKER ✨ */}
          <div className="grid grid-cols-1 gap-4">
            <div className={clsx("p-5 rounded-[2rem] border-2 transition-all relative", isDark ? "bg-black/20 border-white/5 shadow-inner" : "bg-slate-50 border-slate-200")}>
              <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-3 relative z-10">
                <label className="text-[10px] font-black uppercase opacity-60 tracking-[0.2em] flex items-center gap-2">
                  <Palette size={14} className="text-orange-500" /> Brand Color
                </label>
                
                <div className="flex items-center gap-2 bg-white dark:bg-slate-900 px-3 py-2 rounded-xl border border-orange-500/20 shadow-sm relative">
                  <span className="text-[10px] font-black font-mono text-orange-500 uppercase tracking-widest">{fgColor}</span>
                  
                  {/* The Modern Button that opens our Custom Popup */}
                  <div 
                    onClick={() => setShowPicker(!showPicker)}
                    className="w-8 h-8 rounded-full shadow-inner border border-slate-300 dark:border-slate-700 cursor-pointer hover:scale-110 active:scale-95 transition-all"
                    style={{ backgroundColor: fgColor }}
                  ></div>

                  {/* 🚀 OUR CUSTOM VIP POPUP (Bypasses Android System Box) 🚀 */}
                  {showPicker && (
                    <div className="absolute right-0 top-12 p-4 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 z-50 animate-in fade-in zoom-in-95 duration-200">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[10px] font-black uppercase opacity-50 tracking-widest">Select Color</span>
                        <button 
                          onClick={() => setShowPicker(false)}
                          className="bg-orange-500/10 text-orange-500 px-3 py-1 rounded-lg text-[9px] font-black uppercase hover:bg-orange-500 hover:text-white transition-all"
                        >
                          Close
                        </button>
                      </div>
                      <HexColorPicker color={fgColor} onChange={setFgColor} />
                    </div>
                  )}
                </div>
              </div>

              {/* Luxury Preset Dots */}
              <div className="flex flex-wrap gap-3 justify-center md:justify-start mt-2">
                {[
                  { name: 'Classic', color: '#000000' }, { name: 'Royal', color: '#2563eb' },
                  { name: 'Emerald', color: '#059669' }, { name: 'Gold', color: '#d97706' },
                  { name: 'Rose', color: '#e11d48' }, { name: 'Purple', color: '#7c3aed' }
                ].map((preset) => (
                  <button 
                    key={preset.color} 
                    onClick={() => {
                      setFgColor(preset.color);
                      setShowPicker(false); 
                    }} 
                    className={clsx("w-8 h-8 rounded-full border-2 transition-all hover:scale-110 active:scale-90 shadow-md", fgColor === preset.color ? "border-orange-500 scale-110" : "border-white/20 dark:border-slate-700")} 
                    style={{ backgroundColor: preset.color }} 
                    title={preset.name} 
                  />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button onClick={swapColors} className={clsx("p-4 rounded-2xl border-2 flex items-center justify-center gap-2 transition-all", isDark ? "bg-black/20 border-white/5 hover:bg-white/5" : "bg-slate-50 border-slate-200 hover:bg-slate-100")}>
                <RefreshCw size={14} className="text-orange-500" />
                <span className="text-[9px] font-black uppercase opacity-60 tracking-widest">Invert</span>
              </button>
              <button onClick={() => setIncludeLogo(!includeLogo)} className={clsx("p-4 rounded-2xl flex items-center justify-center gap-2 transition-all border-2", includeLogo ? "bg-orange-500 border-orange-400 text-white shadow-lg shadow-orange-500/20" : "bg-transparent border-slate-300 dark:border-slate-700 opacity-50")}>
                <span className="text-[9px] font-black uppercase tracking-widest">Logo: {includeLogo ? 'ON' : 'OFF'}</span>
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-500/10 flex items-center justify-between opacity-50">
             <div className="flex items-center gap-2">
                <Smartphone size={14} className="text-orange-500" />
                <p className="text-[8px] font-black uppercase">Mobile Ready</p>
             </div>
             <div className="flex items-center gap-2">
                <Zap size={14} className="text-orange-500" />
                <p className="text-[8px] font-black uppercase">Auto-Formatted</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodeMaker;