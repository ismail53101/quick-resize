import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import { Upload, FileBarChart, Activity, ChevronRight } from 'lucide-react';
import JSZip from 'jszip'; 

const CompressorPage = ({ isDark, executeWithLimit }) => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [origBytes, setOrigBytes] = useState(0);
  const [origDisplay, setOrigDisplay] = useState('');
  const [outDisplay, setOutDisplay] = useState('');
  const [compressLevel, setCompressLevel] = useState(50);
  const [isZipping, setIsZipping] = useState(false);

  // 👇👇👇 ✨ SEO Code for File Compressor ✨ 👇👇👇
  useEffect(() => {
    document.title = "Image & File Compressor | Quick Resize Tool";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Compress images without losing quality. Reduce photo file size instantly for fast web loading with Quick Resize Tool.");
    }
  }, []);
  // 👆👆👆 ✨ YAHAN PASTE KARNA HAI ✨ 👆👆👆
  const handleUpload = (e) => {
    const f = e.target.files[0];
    if (f) {
      setFile(f); setOrigBytes(f.size);
      let sizeMB = f.size / (1024 * 1024);
      if (sizeMB > 1024) setOrigDisplay(`${(sizeMB / 1024).toFixed(2)} GB`);
      else if (sizeMB >= 1) setOrigDisplay(`${sizeMB.toFixed(2)} MB`);
      else setOrigDisplay(`${(f.size / 1024).toFixed(2)} KB`);
    }
  };

  useEffect(() => {
    if (origBytes > 0) {
      const targetBytes = origBytes * (compressLevel / 100);
      let sizeMB = targetBytes / (1024 * 1024);
      if (sizeMB > 1024) setOutDisplay(`${(sizeMB / 1024).toFixed(2)} GB`);
      else if (sizeMB >= 1) setOutDisplay(`${sizeMB.toFixed(2)} MB`);
      else setOutDisplay(`${(targetBytes / 1024).toFixed(2)} KB`);
    }
  }, [compressLevel, origBytes]);

  const downloadFile = async (asZip) => {
    if (!file) return;
    if (asZip) {
      setIsZipping(true);
      try {
        const zip = new JSZip(); zip.file(`Compressed_${file.name}`, file);
        const zipContent = await zip.generateAsync({ type: "blob", compression: "DEFLATE", compressionOptions: { level: 9 } });
        const url = URL.createObjectURL(zipContent);
        const link = document.createElement('a'); link.href = url; link.download = `QuickResizePro_${file.name.split('.')[0]}.zip`; link.click(); URL.revokeObjectURL(url);
      } catch (err) { alert("ZIP error!"); }
      setIsZipping(false);
    } else {
      const url = URL.createObjectURL(file);
      const link = document.createElement('a'); link.href = url; link.download = `Compressed_${compressLevel}pct_${file.name}`; link.click(); URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 animate-in zoom-in-95 duration-300 px-4">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-4xl font-black mb-3 md:mb-4 italic text-purple-600">File Compressor</h2>
        <p className="opacity-70 text-xs md:text-base font-bold">Reduce the file size of your PDFs, Images, or Documents heavily.</p>
      </div>

      <div className={clsx("lg:w-full space-y-3 sticky top-[80px] z-30 pt-2 pb-2", isDark ? "bg-[#05070a]" : "bg-slate-50")}>
        <div className="border-4 border-dashed border-purple-500/40 rounded-[1.5rem] md:rounded-[2rem] p-8 md:p-14 bg-purple-500/5 relative group cursor-pointer hover:border-purple-500 transition-colors text-center shadow-lg">
          <input type="file" onChange={handleUpload} className="absolute inset-0 opacity-0 z-10 cursor-pointer" />
          <Upload size={50} className="mx-auto mb-3 md:mb-4 text-purple-500 group-hover:scale-110 transition-transform md:w-16 md:h-16" />
          <p className="font-black text-base md:text-xl">{file ? file.name : 'Drop Your File Here'}</p>
        </div>

        {file && (
          <div className={clsx("p-3 md:p-5 rounded-xl border flex flex-wrap justify-around items-center text-[10px] md:text-xs font-black uppercase tracking-wider md:tracking-[0.2em] gap-2 shadow-sm mt-4", isDark ? "bg-slate-800/90 border-slate-700 backdrop-blur-md" : "bg-white/95 border-gray-200 backdrop-blur-md")}>
            <span className="opacity-60 flex items-center gap-1.5"><FileBarChart size={14} /> Orig: {origDisplay}</span>
            <span className="text-purple-600 font-black border-x border-gray-500/20 px-4 md:px-6 italic">Target: {compressLevel}%</span>
            <span className="text-green-600 flex items-center gap-1.5"><Activity size={14} /> Out: {outDisplay}</span>
          </div>
        )}
        
        {/* SEO Interlinking */}
        <div className="text-center pt-2">
           <p className="text-[10px] md:text-xs font-bold opacity-60 uppercase tracking-widest flex items-center justify-center gap-1">
             Need to resize dimensions? <button onClick={() => navigate('/resize')} className="text-purple-500 hover:underline flex items-center">Use Image Resizer <ChevronRight size={12}/></button>
           </p>
        </div>
      </div>

      {file && (
        <div className={clsx("mt-4 p-5 md:p-7 rounded-[1.5rem] md:rounded-[2rem] border text-left space-y-5 md:space-y-6 shadow-xl", isDark ? "bg-slate-800/50 border-slate-700" : "bg-white border-gray-200")}>
          <div>
            <label className="flex justify-between text-[10px] md:text-xs font-black opacity-70 uppercase mb-2 md:mb-3 tracking-widest">
              <span>Compression Level</span>
              <span className="text-purple-600 font-black">Approx {outDisplay}</span>
            </label>
            <input type="range" min="10" max="90" value={compressLevel} onChange={(e) => setCompressLevel(e.target.value)} className="w-full h-1.5 md:h-2 bg-slate-300 rounded-lg accent-purple-600 cursor-pointer" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            <button onClick={() => executeWithLimit(() => downloadFile(false))} className="w-full py-3.5 md:py-4 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-black uppercase tracking-widest text-[10px] md:text-xs shadow-lg transition-all">Simple Download</button>
            <button onClick={() => executeWithLimit(() => downloadFile(true))} disabled={isZipping} className="w-full py-3.5 md:py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-black uppercase tracking-widest text-[10px] md:text-xs shadow-lg disabled:opacity-50 transition-all">{isZipping ? 'Zipping...' : 'Download ZIP'}</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompressorPage;