import React, { useState, useRef, useEffect } from 'react';
import { Upload, Download, Type, Plus, Bold, Italic, Underline as UnderlineIcon, Strikethrough, X, Layers, Droplet, Sparkles, AlignCenter, AlignLeft, AlignRight, Type as CaseIcon, Trash2, MessageCircle, Move, Move as MoveIcon } from 'lucide-react';
import { clsx } from 'clsx';

export default function SocialStudio({ isDark }) {
    const [image, setImage] = useState(null);
    
    const platforms = [
        { name: 'Square Post', w: 1080, h: 1080, ratio: '1/1' },
        { name: 'Insta / FB Reel', w: 1080, h: 1920, ratio: '9/16' },
        { name: 'YouTube Thumbnail', w: 1280, h: 720, ratio: '16/9' },
        { name: 'Insta Portrait', w: 1080, h: 1350, ratio: '4/5' }
    ];
    const [selectedSize, setSelectedSize] = useState(platforms[0]);

    const presetColors = ['#FFFFFF', '#000000', '#FF0000', '#FFD700', '#00FF00', '#00FFFF', '#FF1493', '#8A2BE2'];

    const [texts, setTexts] = useState([]);
    const [activeTextId, setActiveTextId] = useState(null);

    const [bgPosition, setBgPosition] = useState({ x: 50, y: 50 }); 
    const [isDraggingBg, setIsDraggingBg] = useState(false);
    const dragStartPos = useRef({ x: 0, y: 0, startBgX: 50, startBgY: 50 });

    // 👇👇👇 ✨ YAHAN PASTE KARNA HAI ✨ 👇👇👇
  useEffect(() => {
    document.title = "Social Studio Pro | Quick Resize Tool";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Create amazing social media posts, YouTube thumbnails, and add custom stickers easily with Quick Resize Studio.");
    }
  }, []);
  // 👆👆👆 ✨ YAHAN PASTE KARNA HAI ✨ 👆👆👆

    const canvasContainerRef = useRef(null);
    const textRefs = useRef({}); 

    useEffect(() => {
        const link = document.createElement('link');
        link.href = "https://fonts.googleapis.com/css2?family=Alfa+Slab+One&family=Amiri&family=Bebas+Neue&family=Caveat&family=Cinzel&family=Comfortaa&family=Comic+Neue:wght@700&family=Creepster&family=Dancing+Script&family=Fredoka+One&family=Great+Vibes&family=Indie+Flower&family=Josefin+Sans&family=Kalam&family=Lobster&family=Lora&family=Merriweather&family=Montserrat:wght@900&family=Noto+Nastaliq+Urdu&family=Oswald:wght@700&family=Pacifico&family=Permanent+Marker&family=Playfair+Display&family=Poppins:wght@800&family=Press+Start+2P&family=Righteous&family=Rubik+Glitch&family=Satisfy&family=Space+Mono&family=Special+Elite&family=Teko:wght@600&display=swap";
        link.rel = "stylesheet";
        document.head.appendChild(link);
    }, []);

    const fontOptions = [
        { name: 'Default Bold', value: 'sans-serif' }, 
        { name: 'YouTube Loud', value: "'Bebas Neue', sans-serif" }, 
        { name: 'Cinematic', value: "'Cinzel', serif" },
        { name: 'Modern Black', value: "'Montserrat', sans-serif" },
        { name: 'Marker Pen', value: "'Permanent Marker', cursive" },
        { name: 'Horror / Scary', value: "'Creepster', system-ui" },
        { name: 'Cyber Glitch', value: "'Rubik Glitch', system-ui" },
        { name: 'Retro Gaming', value: "'Press Start 2P', cursive" },
        { name: 'Typewriter', value: "'Special Elite', system-ui" },
        { name: 'Sign Board', value: "'Righteous', cursive" },
        { name: 'Thick Cartoon', value: "'Fredoka One', cursive" },
        { name: 'Comic Book', value: "'Comic Neue', cursive" },
        { name: 'Urdu Nastaliq', value: "'Noto Nastaliq Urdu', serif" }, 
        { name: 'Arabic Classic', value: "'Amiri', serif" }, 
        { name: 'Tall Condensed', value: "'Oswald', sans-serif" },
        { name: 'Blocky Impact', value: "'Alfa Slab One', cursive" },
        { name: 'Cyberpunk Tall', value: "'Teko', sans-serif" },
        { name: 'Round & Cute', value: "'Comfortaa', cursive" },
        { name: 'Handwritten', value: "'Caveat', cursive" },
        { name: 'Messy Notes', value: "'Kalam', cursive" },
        { name: 'Cursive Stylish', value: "'Dancing Script', cursive" },
        { name: 'Classic Signature', value: "'Pacifico', cursive" },
        { name: 'Wedding Vibes', value: "'Great Vibes', cursive" },
        { name: 'Luxury Serif', value: "'Playfair Display', serif" },
        { name: 'Book Text', value: "'Merriweather', serif" },
        { name: 'Hacker Code', value: "'Space Mono', monospace" }
    ];

    const proStyles = [
        { name: '🚫 Reset (None)', color: '#FFFFFF', strokeSize: 0, shadowSize: 0, bgStyle: 'none', isBold: true, isItalic: false, isUnderline: false, isStrike: false, opacity: 100 },
        { name: 'Classic YT', color: '#FFFFFF', strokeSize: 4, strokeColor: '#000000', shadowSize: 0, bgStyle: 'none', isBold: true, opacity: 100 },
        { name: 'YT Yellow', color: '#FFD700', strokeSize: 4, strokeColor: '#000000', shadowSize: 5, shadowColor: '#000000', bgStyle: 'none', isBold: true, opacity: 100 },
        { name: 'Neon Pink', color: '#FF1493', strokeSize: 0, shadowSize: 20, shadowColor: '#FF1493', bgStyle: 'none', isBold: true, opacity: 100 },
        { name: 'Neon Cyan', color: '#00FFFF', strokeSize: 0, shadowSize: 20, shadowColor: '#00FFFF', bgStyle: 'none', isBold: true, opacity: 100 },
        { name: 'Subtitle', color: '#FFFFFF', strokeSize: 0, bgStyle: 'pill', bgColor: 'rgba(0,0,0,0.6)', isBold: false, opacity: 100 },
        { name: 'Chat Bubble', color: '#000000', strokeSize: 0, bgStyle: 'speech', bgColor: '#FFFFFF', isBold: true, opacity: 100 },
        { name: 'Hacker', color: '#00FF00', strokeSize: 0, shadowSize: 10, shadowColor: '#00FF00', bgStyle: 'outline', bgColor: '#00FF00', isBold: true, opacity: 100 },
        { name: 'Watermark', color: '#FFFFFF', strokeSize: 0, bgStyle: 'none', isBold: true, opacity: 30 },
        { name: 'Miami Vice', color: '#FF1493', strokeSize: 2, strokeColor: '#00FFFF', shadowSize: 0, bgStyle: 'none', isBold: true, opacity: 100 },
        { name: 'Cyberpunk', color: '#FFFF00', strokeSize: 0, shadowSize: 15, shadowColor: '#00FFFF', bgStyle: 'none', isBold: true, opacity: 100 },
        { name: 'Retro 80s', color: '#FF00FF', strokeSize: 2, strokeColor: '#00FFFF', shadowSize: 5, shadowColor: '#000000', bgStyle: 'none', isBold: true, opacity: 100 },
        { name: 'News Flash', color: '#FFFFFF', strokeSize: 0, bgStyle: 'solid', bgColor: '#FF0000', isBold: true, opacity: 100 },
        { name: 'Warning', color: '#000000', strokeSize: 0, bgStyle: 'solid', bgColor: '#FFD700', isBold: true, opacity: 100 },
        { name: 'Purple Haze', color: '#8A2BE2', strokeSize: 3, strokeColor: '#FFFFFF', shadowSize: 10, shadowColor: '#8A2BE2', bgStyle: 'none', isBold: true, opacity: 100 },
        { name: 'Mint Fresh', color: '#98FF98', strokeSize: 2, strokeColor: '#006400', shadowSize: 0, bgStyle: 'none', isBold: true, opacity: 100 },
        { name: 'Blood Dark', color: '#8B0000', strokeSize: 2, strokeColor: '#000000', shadowSize: 10, shadowColor: '#FF0000', bgStyle: 'none', isBold: true, opacity: 100 },
        { name: 'Gold Luxury', color: '#DAA520', strokeSize: 2, strokeColor: '#000000', shadowSize: 15, shadowColor: '#DAA520', bgStyle: 'none', isBold: true, opacity: 100 },
        { name: 'Pure Black', color: '#000000', strokeSize: 3, strokeColor: '#FFFFFF', shadowSize: 0, bgStyle: 'none', isBold: true, opacity: 100 },
        { name: 'Deep Blue', color: '#00008B', strokeSize: 3, strokeColor: '#FFFFFF', shadowSize: 5, shadowColor: '#00BFFF', bgStyle: 'none', isBold: true, opacity: 100 },
        { name: 'Orange Pop', color: '#FF4500', strokeSize: 4, strokeColor: '#FFFFFF', shadowSize: 5, shadowColor: '#000000', bgStyle: 'none', isBold: true, opacity: 100 },
        { name: 'White Box', color: '#000000', strokeSize: 0, bgStyle: 'solid', bgColor: '#FFFFFF', isBold: true, opacity: 100 },
        { name: 'Dark Mode', color: '#A9A9A9', strokeSize: 1, strokeColor: '#000000', bgStyle: 'rounded', bgColor: '#1A1A1A', isBold: false, opacity: 100 },
        { name: 'Elegant Serif', color: '#333333', strokeSize: 0, bgStyle: 'none', fontFamily: "'Times New Roman', serif", isBold: false, opacity: 100 },
        { name: 'Clean Modern', color: '#222222', strokeSize: 0, bgStyle: 'none', fontFamily: "'Open Sans', sans-serif", isBold: false, opacity: 100 },
        { name: 'Strike Red', color: '#FF0000', strokeSize: 0, bgStyle: 'none', isBold: true, isStrike: true, opacity: 100 },
        { name: 'Underline Blue', color: '#0000FF', strokeSize: 0, bgStyle: 'none', isBold: true, isUnderline: true, opacity: 100 },
        { name: 'Ghost', color: '#FFFFFF', strokeSize: 0, shadowSize: 0, bgStyle: 'none', isBold: true, opacity: 50 },
        { name: 'Glass Effect', color: '#FFFFFF', strokeSize: 0, bgStyle: 'glass', bgColor: '#FFFFFF', isBold: true, opacity: 80 },
        { name: 'Double Border', color: '#FFFFFF', strokeSize: 0, bgStyle: 'double', bgColor: '#000000', isBold: true, opacity: 100 },
        { name: 'Outline Red', color: '#FFFFFF', strokeSize: 4, strokeColor: '#FF0000', bgStyle: 'none', isBold: true, opacity: 100 },
        { name: 'Outline Black', color: '#FFFFFF', strokeSize: 6, strokeColor: '#000000', bgStyle: 'none', isBold: true, opacity: 100 },
        { name: 'Shadow Text', color: '#FFFFFF', strokeSize: 0, shadowSize: 15, shadowColor: '#000000', bgStyle: 'none', isBold: true, opacity: 100 },
        { name: 'Glowing Green', color: '#00FF00', strokeSize: 1, strokeColor: '#FFFFFF', shadowSize: 20, shadowColor: '#00FF00', bgStyle: 'none', isBold: true, opacity: 100 }
    ];

    const handleUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(URL.createObjectURL(file));
            setBgPosition({ x: 50, y: 50 }); 
            addNewText(); 
        }
    };

    const clearImage = () => { setImage(null); setTexts([]); setActiveTextId(null); setBgPosition({ x: 50, y: 50 }); };

    const addNewText = () => {
        const newId = Date.now();
        const stepOffset = (texts.length % 6) * 10; 
        const startY = 35 + stepOffset;

        const newText = {
            id: newId, text: '', isPlaceholder: true, 
            x: 50, y: startY, 
            fontSize: 40, fontFamily: 'sans-serif',
            color: '#FFFFFF', bgStyle: 'none', bgColor: '#000000',
            isBold: true, isItalic: false, isUnderline: false, isStrike: false, textTransform: 'none', textAlign: 'center', opacity: 100,
            shadowSize: 10, shadowColor: '#000000', strokeSize: 0, strokeColor: '#000000'
        };
        setTexts(prev => [...prev, newText]);
        setActiveTextId(newId);
        setTimeout(() => { if (textRefs.current[newId]) textRefs.current[newId].focus(); }, 100);
    };

    const handleTextChange = (id, val) => setTexts(prev => prev.map(t => t.id === id ? { ...t, text: val, isPlaceholder: false } : t));
    const updateTextProp = (id, key, value) => setTexts(prev => prev.map(t => t.id === id ? { ...t, [key]: value } : t));
    const applyStyle = (id, style) => setTexts(prev => prev.map(t => t.id === id ? { ...t, ...style, isPlaceholder: false } : t));
    const removeText = (e, id) => { e.stopPropagation(); setTexts(prev => prev.filter(t => t.id !== id)); if (activeTextId === id) setActiveTextId(null); };

    const formatText = (text, transformOption) => {
        if (!text) return '';
        if (transformOption === 'uppercase') return text.toUpperCase();
        if (transformOption === 'lowercase') return text.toLowerCase();
        return text;
    };

    // --- DRAG TO MOVE & DRAG TO RESIZE STATE ---
    const [isDraggingText, setIsDraggingText] = useState(false);
    const [isResizingText, setIsResizingText] = useState(false); // ✨ NEW STATE FOR RESIZING
    const resizeStartPos = useRef({ x: 0, startSize: 40 }); // ✨ REF FOR RESIZING

    const handleTextDragStart = (e, id) => {
        e.stopPropagation();
        setActiveTextId(id);
        setIsDraggingText(true);
        e.target.setPointerCapture(e.pointerId);
    };

    // ✨ NEW FUNCTION: START RESIZING
    const handleResizeStart = (e, id) => {
        e.stopPropagation();
        setActiveTextId(id);
        setIsResizingText(true);
        const t = texts.find(x => x.id === id);
        resizeStartPos.current = { x: e.clientX, startSize: t.fontSize };
        e.target.setPointerCapture(e.pointerId);
    };

    const handleCanvasPointerDown = (e) => {
        if (!image) return; 
        setActiveTextId(null); 
        setIsDraggingBg(true);
        dragStartPos.current = { x: e.clientX, y: e.clientY, startBgX: bgPosition.x, startBgY: bgPosition.y };
        e.currentTarget.setPointerCapture(e.pointerId);
    };

    const handleCanvasPointerMove = (e) => {
        if (isDraggingText && activeTextId) {
            const container = canvasContainerRef.current.getBoundingClientRect();
            let newX = Math.max(0, Math.min(100, ((e.clientX - container.left) / container.width) * 100));
            let newY = Math.max(0, Math.min(100, ((e.clientY - container.top) / container.height) * 100));
            updateTextProp(activeTextId, 'x', newX); 
            updateTextProp(activeTextId, 'y', newY);
        } 
        // ✨ NEW LOGIC: DRAG TO ZOOM/RESIZE TEXT
        else if (isResizingText && activeTextId) {
            const dx = e.clientX - resizeStartPos.current.x;
            // Dragging Right = Bigger, Left = Smaller
            const newSize = Math.max(10, Math.min(300, resizeStartPos.current.startSize + (dx * 0.5)));
            updateTextProp(activeTextId, 'fontSize', newSize);
        }
        else if (isDraggingBg) {
            const dx = e.clientX - dragStartPos.current.x;
            const dy = e.clientY - dragStartPos.current.y;
            const rect = canvasContainerRef.current.getBoundingClientRect();
            const pctX = (dx / rect.width) * 100;
            const pctY = (dy / rect.height) * 100;
            
            let newBgX = dragStartPos.current.startBgX - (pctX * 1.5);
            let newBgY = dragStartPos.current.startBgY - (pctY * 1.5);
            newBgX = Math.max(0, Math.min(100, newBgX));
            newBgY = Math.max(0, Math.min(100, newBgY));
            setBgPosition({ x: newBgX, y: newBgY });
        }
    };
    
    const handleCanvasPointerUp = (e) => { 
        setIsDraggingText(false); 
        setIsResizingText(false); // ✨ STOP RESIZING
        setIsDraggingBg(false); 
        if (e.pointerId && e.currentTarget.hasPointerCapture(e.pointerId)) {
            e.currentTarget.releasePointerCapture(e.pointerId);
        }
    };

    const downloadImage = () => {
        if (!image) return;
        const canvas = document.createElement('canvas');
        canvas.width = selectedSize.w; canvas.height = selectedSize.h;
        const ctx = canvas.getContext('2d');

        const imgObj = new Image();
        imgObj.onload = () => {
            ctx.fillStyle = '#000000'; ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            const scale = Math.max(canvas.width / imgObj.width, canvas.height / imgObj.height);
            const scaledW = imgObj.width * scale;
            const scaledH = imgObj.height * scale;
            const excessW = scaledW - canvas.width;
            const excessH = scaledH - canvas.height;
            const offsetX = -(excessW * (bgPosition.x / 100));
            const offsetY = -(excessH * (bgPosition.y / 100));

            ctx.drawImage(imgObj, offsetX, offsetY, scaledW, scaledH);

            texts.forEach(t => {
                const rawText = t.isPlaceholder ? 'Add text' : t.text;
                if (!rawText.trim() && t.bgStyle === 'none') return; 

                const displayText = formatText(rawText, t.textTransform);
                const fontScale = canvas.width / 800;
                ctx.globalAlpha = t.opacity / 100;
                ctx.font = `${t.isItalic ? 'italic' : 'normal'} ${t.isBold ? 'bold' : 'normal'} ${t.fontSize * fontScale}px ${t.fontFamily}`;
                ctx.textAlign = t.textAlign; ctx.textBaseline = 'middle';
                
                const pxX = (t.x / 100) * canvas.width;
                const pxY = (t.y / 100) * canvas.height;

                const metrics = ctx.measureText(displayText);
                const padX = 20 * fontScale, padY = 15 * fontScale;
                let boxCenterX = pxX;
                if (t.textAlign === 'left') boxCenterX = pxX + (metrics.width / 2);
                if (t.textAlign === 'right') boxCenterX = pxX - (metrics.width / 2);

                const bgWidth = metrics.width + (padX * 2), bgHeight = (t.fontSize * fontScale) + (padY * 2);
                const rectX = boxCenterX - (bgWidth / 2), rectY = pxY - (bgHeight / 2);

                if (t.bgStyle !== 'none') {
                    ctx.fillStyle = t.bgColor; ctx.strokeStyle = t.bgColor; ctx.lineWidth = 3 * fontScale;
                    if (t.bgStyle === 'solid') { ctx.fillRect(rectX, rectY, bgWidth, bgHeight); }
                    else if (t.bgStyle === 'rounded') { ctx.beginPath(); ctx.roundRect(rectX, rectY, bgWidth, bgHeight, 15 * fontScale); ctx.fill(); }
                    else if (t.bgStyle === 'outline') { ctx.beginPath(); ctx.roundRect(rectX, rectY, bgWidth, bgHeight, 10 * fontScale); ctx.stroke(); }
                    else if (t.bgStyle === 'glass') { ctx.globalAlpha = (t.opacity / 100) * 0.4; ctx.fillRect(rectX, rectY, bgWidth, bgHeight); ctx.globalAlpha = t.opacity / 100; }
                    else if (t.bgStyle === 'pill') { ctx.beginPath(); ctx.roundRect(rectX, rectY, bgWidth, bgHeight, bgHeight/2); ctx.fill(); }
                    else if (t.bgStyle === 'speech') { 
                        ctx.beginPath(); ctx.roundRect(rectX, rectY, bgWidth, bgHeight, 15 * fontScale);
                        ctx.moveTo(rectX, rectY + bgHeight); ctx.lineTo(rectX + 20 * fontScale, rectY + bgHeight); ctx.lineTo(rectX + 20 * fontScale, rectY + bgHeight + 15 * fontScale);
                        ctx.closePath(); ctx.fill();
                    }
                    else if (t.bgStyle === 'slant') {
                        ctx.save(); ctx.transform(1, 0, -0.2, 1, 0, 0); 
                        ctx.fillRect(rectX + (bgHeight * 0.2), rectY, bgWidth, bgHeight);
                        ctx.restore();
                    }
                }

                ctx.shadowColor = t.shadowColor; ctx.shadowBlur = t.shadowSize;
                ctx.shadowOffsetX = t.shadowSize / 2; ctx.shadowOffsetY = t.shadowSize / 2;
                if (t.strokeSize > 0) { ctx.lineWidth = t.strokeSize * fontScale; ctx.strokeStyle = t.strokeColor; ctx.lineJoin = 'round'; ctx.strokeText(displayText, pxX, pxY); }

                ctx.fillStyle = t.color; ctx.fillText(displayText, pxX, pxY);
                
                if (t.isUnderline || t.isStrike) {
                    ctx.strokeStyle = t.color; ctx.lineWidth = Math.max(2, 3 * fontScale);
                    ctx.beginPath();
                    if (t.isUnderline) { const y = pxY + (t.fontSize * fontScale * 0.4); ctx.moveTo(pxX - metrics.width/2, y); ctx.lineTo(pxX + metrics.width/2, y); }
                    if (t.isStrike) { const y = pxY; ctx.moveTo(pxX - metrics.width/2, y); ctx.lineTo(pxX + metrics.width/2, y); }
                    ctx.stroke();
                }

                ctx.shadowBlur = 0; ctx.globalAlpha = 1.0;
            });

            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/jpeg', 0.95);
            link.download = `SocialStudio_${Date.now()}.jpg`; link.click();
        };
        imgObj.src = image;
    };

    const activeText = texts.find(t => t.id === activeTextId);

    return (
        <div className="mt-4 animate-in fade-in duration-500 max-w-6xl mx-auto px-2 md:px-4 pb-10 relative">
            
            <div className="flex flex-col sm:flex-row items-center justify-between mb-4 border-b border-gray-500/20 pb-4 gap-4">
                <div className="text-center sm:text-left">
                    <h2 className="text-2xl md:text-3xl font-black italic text-purple-600 uppercase tracking-tighter">Social Studio Pro</h2>
                    <p className="text-[10px] md:text-xs opacity-60 font-black uppercase tracking-widest">Text Zoom Drag Feature Added</p>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                
                <div className={clsx("lg:w-3/5 flex flex-col z-40 sticky top-0 md:top-4 self-start pb-4 pt-2 md:pt-0", isDark ? "bg-[#0d1117]/95" : "bg-white/95")}>
                    
                    <div className="flex flex-col gap-3 mb-4 w-full">
                        <div className="flex w-full justify-end gap-2 shrink-0">
                            {image && (
                                <button onClick={clearImage} className="flex-1 sm:flex-none bg-red-600/10 hover:bg-red-600/20 text-red-500 px-4 py-2.5 rounded-xl font-black text-xs uppercase transition-all flex items-center justify-center gap-2 border border-red-500/20">
                                    <Trash2 size={16} /> Clear Image
                                </button>
                            )}
                            <button onClick={downloadImage} disabled={!image} className="flex-[2] sm:flex-none bg-green-600 hover:bg-green-500 text-white px-6 py-2.5 rounded-xl font-black text-xs uppercase shadow-xl disabled:opacity-30 active:scale-95 flex items-center justify-center gap-2 transition-all">
                                <Download size={16} /> Export Art
                            </button>
                        </div>

                        <div className="flex gap-2 overflow-x-auto w-full pb-2 custom-scrollbar pr-4">
                            {platforms.map((p, index) => {
                                const isSelected = p.name === selectedSize.name;
                                return (
                                <button key={index} onClick={() => setSelectedSize(p)} className={clsx("shrink-0 px-4 py-2.5 rounded-xl font-black text-[10px] uppercase transition-all border", isSelected ? "bg-purple-600 text-white border-purple-600 shadow-md" : isDark ? "bg-slate-800 border-slate-700 text-gray-300" : "bg-white border-gray-300")}>
                                    {p.name}
                                </button>
                            )})}
                        </div>
                    </div>

                    {/* ✨ SIRF IS DIV KI HEIGHT CHOTI KI HAI (h-[28vh] md:h-[45vh]) ✨ */}
                    <div className="w-full flex items-center justify-center bg-black/5 dark:bg-white/5 rounded-2xl p-2 md:p-4 border-2 border-dashed border-gray-300 dark:border-slate-700 h-[28vh] md:h-[45vh]">
                        <div 
                            ref={canvasContainerRef}
                            onPointerDown={handleCanvasPointerDown} 
                            onPointerMove={handleCanvasPointerMove} 
                            onPointerUp={handleCanvasPointerUp}
                            onPointerLeave={handleCanvasPointerUp}
                            className={clsx("relative shadow-2xl flex items-center justify-center overflow-hidden shrink-0 cursor-grab active:cursor-grabbing touch-none", isDark ? "bg-slate-900" : "bg-gray-100")}
                            style={{ 
                                aspectRatio: selectedSize.ratio, 
                                maxHeight: '100%', 
                                maxWidth: '100%',
                                height: selectedSize.h >= selectedSize.w ? '100%' : 'auto',
                                width: selectedSize.w >= selectedSize.h ? '100%' : 'auto'
                            }}
                        >
                            {!image ? (
                                <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer group hover:bg-black/10 transition-all z-50">
                                    <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
                                    <Upload size={44} className="text-purple-500 mb-3 opacity-40 group-hover:scale-110 group-hover:opacity-100 transition-all pointer-events-none" />
                                    <span className="bg-purple-600 text-white px-5 py-2.5 rounded-full font-black text-[10px] uppercase shadow-md pointer-events-none">Upload Photo</span>
                                </label>
                            ) : (
                                <div className="absolute inset-0 w-full h-full relative overflow-hidden pointer-events-none">
                                    
                                    <img 
                                        src={image} 
                                        className="absolute inset-0 w-full h-full object-cover pointer-events-none touch-none" 
                                        style={{ objectPosition: `${bgPosition.x}% ${bgPosition.y}%` }} 
                                        alt="Base" 
                                    />
                                    
                                    {!activeTextId && (
                                        <div className="absolute top-4 left-0 right-0 flex justify-center opacity-50 pointer-events-none">
                                            <span className="bg-black/50 text-white text-[9px] uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1 backdrop-blur-sm">
                                                <MoveIcon size={10} /> Drag Image To Adjust
                                            </span>
                                        </div>
                                    )}

                                    {texts.map(t => {
                                        const rawText = t.isPlaceholder ? 'Add text' : t.text;
                                        const displayText = formatText(rawText, t.textTransform);

                                        let alignClass = "justify-center text-center";
                                        if(t.textAlign === 'left') alignClass = "justify-start text-left";
                                        if(t.textAlign === 'right') alignClass = "justify-end text-right";

                                        let bubbleClass = "bg-transparent";
                                        let borderStyle = "none";
                                        if (t.bgStyle === 'solid') bubbleClass = "rounded-md";
                                        if (t.bgStyle === 'rounded') bubbleClass = "rounded-xl";
                                        if (t.bgStyle === 'pill') bubbleClass = "rounded-full"; 
                                        if (t.bgStyle === 'speech') bubbleClass = "rounded-2xl rounded-bl-none"; 
                                        if (t.bgStyle === 'slant') bubbleClass = "-skew-x-12 px-5 rounded-sm"; 
                                        if (t.bgStyle === 'outline') { bubbleClass = "bg-transparent rounded-lg"; borderStyle = `2px solid ${t.bgColor}`; }
                                        if (t.bgStyle === 'glass') bubbleClass = "rounded-md backdrop-blur-sm bg-opacity-40";

                                        let textDeco = [];
                                        if (t.isUnderline) textDeco.push('underline');
                                        if (t.isStrike) textDeco.push('line-through');

                                        return (
                                            <div 
                                                key={t.id}
                                                className={clsx("absolute flex flex-col items-center transition-shadow pointer-events-auto cursor-auto touch-none", 
                                                    activeTextId === t.id ? "z-50" : ""
                                                )}
                                                style={{ left: `${t.x}%`, top: `${t.y}%`, transform: 'translate(-50%, -50%)' }}
                                                onPointerDown={(e) => { 
                                                    e.stopPropagation(); 
                                                    setActiveTextId(t.id); 
                                                }}
                                            >
                                                {/* MOVE DRAG HANDLE (Top) */}
                                                {activeTextId === t.id && (
                                                    <div className="mb-2 bg-purple-600 text-white p-2.5 rounded-full shadow-xl cursor-grab active:cursor-grabbing z-[100] touch-none" onPointerDown={(e) => handleTextDragStart(e, t.id)}>
                                                        <Move size={18} />
                                                    </div>
                                                )}

                                                <div
                                                    className={clsx("flex items-center px-4 py-2 relative touch-none", 
                                                        activeTextId === t.id ? "ring-2 ring-purple-500 ring-offset-2 ring-offset-transparent shadow-2xl scale-105" : "cursor-pointer",
                                                        bubbleClass, alignClass
                                                    )}
                                                    style={{
                                                        fontSize: `${t.fontSize}px`, fontFamily: t.fontFamily, color: t.color,
                                                        backgroundColor: ['solid','rounded','pill','speech','slant','glass'].includes(t.bgStyle) ? t.bgColor : 'transparent',
                                                        border: borderStyle, fontWeight: t.isBold ? 'bold' : 'normal', fontStyle: t.isItalic ? 'italic' : 'normal',
                                                        textDecoration: textDeco.join(' ') || 'none', opacity: t.opacity / 100, 
                                                        textShadow: `${t.shadowSize/2}px ${t.shadowSize/2}px ${t.shadowSize}px ${t.shadowColor}`,
                                                        WebkitTextStroke: `${t.strokeSize}px ${t.strokeColor}`, whiteSpace: 'nowrap'
                                                    }}
                                                >
                                                    <div className="relative inline-flex items-center justify-center min-w-[40px] min-h-[30px]" style={{ transform: t.bgStyle === 'slant' ? 'skewX(12deg)' : 'none' }}>
                                                        <span className="invisible whitespace-pre px-1" style={{ textTransform: t.textTransform }}>
                                                            {displayText || ' '}
                                                        </span>
                                                        
                                                        <input
                                                            ref={el => textRefs.current[t.id] = el}
                                                            value={formatText(t.text, t.textTransform)}
                                                            onChange={(e) => handleTextChange(t.id, e.target.value)}
                                                            onPointerDown={(e) => { e.stopPropagation(); setActiveTextId(t.id); }}
                                                            onFocus={() => setActiveTextId(t.id)} 
                                                            placeholder="" 
                                                            className={clsx("absolute inset-0 w-full h-full bg-transparent border-none outline-none p-0 m-0 touch-none", 
                                                                activeTextId === t.id ? "pointer-events-auto" : "pointer-events-none"
                                                            )}
                                                            style={{ 
                                                                color: 'inherit', font: 'inherit', textShadow: 'inherit', WebkitTextStroke: 'inherit', 
                                                                textDecoration: textDeco.join(' ') || 'none', 
                                                                textTransform: t.textTransform, textAlign: t.textAlign 
                                                            }}
                                                        />
                                                        
                                                        {activeTextId !== t.id && (
                                                            <span className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none whitespace-pre" style={{ textTransform: t.textTransform, textAlign: t.textAlign, textDecoration: textDeco.join(' ') || 'none' }}>
                                                                {displayText}
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* DELETE BUTTON (Top Right) */}
                                                    {activeTextId === t.id && (
                                                        <button onClick={(e) => removeText(e, t.id)} className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1.5 shadow-lg hover:bg-red-600 transition-colors z-[100] cursor-pointer pointer-events-auto touch-none" onPointerDown={e => e.stopPropagation()}>
                                                            <X size={14} strokeWidth={4} />
                                                        </button>
                                                    )}

                                                    {/* ✨ NEW: ZOOM / RESIZE DRAG HANDLE (Bottom Right) ✨ */}
                                                    {activeTextId === t.id && (
                                                        <div 
                                                            className="absolute -bottom-3 -right-3 w-7 h-7 bg-purple-600 rounded-full border-[3px] border-white shadow-xl flex items-center justify-center cursor-ew-resize z-[100] pointer-events-auto touch-none active:scale-110 transition-transform"
                                                            onPointerDown={(e) => handleResizeStart(e, t.id)}
                                                        >
                                                            {/* Inner white dot design */}
                                                            <div className="w-2.5 h-2.5 bg-white rounded-full pointer-events-none" />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className={clsx("lg:w-2/5 p-5 md:p-6 rounded-[2rem] border shadow-xl h-fit", isDark ? "bg-slate-800/80 border-slate-700" : "bg-white border-gray-200")}>
                    
                    {!activeText ? (
                        <div className={clsx("flex flex-col items-center justify-center h-48 text-center space-y-4 rounded-2xl border-2 border-dashed", isDark ? "bg-slate-800/50 border-slate-600 text-slate-300" : "bg-slate-50 border-slate-300 text-slate-700")}>
                            <Type size={40} className="text-purple-500 opacity-60" />
                            <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] px-4">Tap any text on image to edit</p>
                            <button onClick={() => addNewText()} disabled={!image} className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-3.5 rounded-xl font-black text-xs uppercase flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50 shadow-md">
                                <Plus size={18} /> Add New Text
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-5 animate-in fade-in zoom-in-95">
                            
                            <button onClick={() => addNewText()} className="w-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 py-3 rounded-xl font-black text-[10px] uppercase transition-colors flex justify-center items-center gap-2 border border-dashed border-gray-400">
                                <Plus size={14} /> Add New Text Bubble
                            </button>

                            <div className={clsx("p-4 rounded-xl border-2", isDark ? "bg-slate-900/30 border-purple-900/50" : "bg-purple-50 border-purple-200")}>
                                <span className="text-[10px] font-black uppercase tracking-widest text-purple-600 block mb-3 flex items-center gap-1"><Sparkles size={14}/> 34 Pro Styles</span>
                                <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar px-1">
                                    {proStyles.map((style, idx) => (
                                        <button key={idx} onClick={() => applyStyle(activeText.id, style)} className="shrink-0 px-3 py-2 rounded-lg font-black text-[9px] uppercase border border-gray-400 shadow-sm transition-transform active:scale-95 hover:border-purple-500" style={{ color: style.color, backgroundColor: style.bgStyle !== 'none' ? style.bgColor : (isDark ? '#1a1a1a' : '#ffffff') }}>
                                            {style.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 border-t border-gray-500/10 pt-4">
                                <div>
                                    <span className="text-[10px] font-black uppercase opacity-60 block mb-2 pl-1">Fonts (Web Styles)</span>
                                    <select value={activeText.fontFamily} onChange={(e) => updateTextProp(activeText.id, 'fontFamily', e.target.value)} className={clsx("w-full p-3 rounded-xl font-black text-[10px] uppercase outline-none cursor-pointer border shadow-sm", isDark ? "bg-slate-900 border-slate-700" : "bg-white border-gray-200")}>
                                        {fontOptions.map(f => <option key={f.name} value={f.value}>{f.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <span className="text-[10px] font-black uppercase opacity-60 block mb-2 pl-1"><Droplet size={12} className="inline"/> Opacity ({activeText.opacity}%)</span>
                                    <input type="range" min="10" max="100" value={activeText.opacity} onChange={(e) => updateTextProp(activeText.id, 'opacity', e.target.value)} className="w-full h-2 mt-2 accent-purple-600 cursor-pointer" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="text-[10px] font-black uppercase opacity-50 block mb-2 pl-1">Size ({activeText.fontSize})</span>
                                    <input type="range" min="15" max="150" value={activeText.fontSize} onChange={(e) => updateTextProp(activeText.id, 'fontSize', e.target.value)} className="w-full h-2 mt-2 accent-purple-600 cursor-pointer" />
                                </div>
                                <div>
                                    <span className="text-[10px] font-black uppercase opacity-60 block mb-2 pl-1">Typography</span>
                                    <div className="flex gap-1 h-10 mb-2">
                                        <button onClick={() => updateTextProp(activeText.id, 'isBold', !activeText.isBold)} className={clsx("flex-1 rounded-lg flex items-center justify-center transition-all border", activeText.isBold ? "bg-purple-600 text-white border-purple-600" : isDark ? "bg-slate-900 border-slate-700" : "bg-white border-gray-200")}><Bold size={14}/></button>
                                        <button onClick={() => updateTextProp(activeText.id, 'isItalic', !activeText.isItalic)} className={clsx("flex-1 rounded-lg flex items-center justify-center transition-all border", activeText.isItalic ? "bg-purple-600 text-white border-purple-600" : isDark ? "bg-slate-900 border-slate-700" : "bg-white border-gray-200")}><Italic size={14}/></button>
                                        <button onClick={() => updateTextProp(activeText.id, 'isUnderline', !activeText.isUnderline)} className={clsx("flex-1 rounded-lg flex items-center justify-center transition-all border", activeText.isUnderline ? "bg-purple-600 text-white border-purple-600" : isDark ? "bg-slate-900 border-slate-700" : "bg-white border-gray-200")}><UnderlineIcon size={14}/></button>
                                        <button onClick={() => updateTextProp(activeText.id, 'isStrike', !activeText.isStrike)} className={clsx("flex-1 rounded-lg flex items-center justify-center transition-all border", activeText.isStrike ? "bg-purple-600 text-white border-purple-600" : isDark ? "bg-slate-900 border-slate-700" : "bg-white border-gray-200")}><Strikethrough size={14}/></button>
                                    </div>
                                    <div className="flex gap-1 h-10">
                                        <button onClick={() => updateTextProp(activeText.id, 'textTransform', activeText.textTransform === 'uppercase' ? 'none' : 'uppercase')} className={clsx("flex-1 rounded-lg flex items-center justify-center transition-all border", activeText.textTransform === 'uppercase' ? "bg-purple-600 text-white border-purple-600" : isDark ? "bg-slate-900 border-slate-700" : "bg-white border-gray-200")}><CaseIcon size={14}/></button>
                                        <button onClick={() => updateTextProp(activeText.id, 'textAlign', 'left')} className={clsx("flex-1 rounded-lg flex items-center justify-center transition-all border", activeText.textAlign === 'left' ? "bg-purple-600 text-white border-purple-600" : isDark ? "bg-slate-900 border-slate-700" : "bg-white border-gray-200")}><AlignLeft size={14}/></button>
                                        <button onClick={() => updateTextProp(activeText.id, 'textAlign', 'center')} className={clsx("flex-1 rounded-lg flex items-center justify-center transition-all border", activeText.textAlign === 'center' ? "bg-purple-600 text-white border-purple-600" : isDark ? "bg-slate-900 border-slate-700" : "bg-white border-gray-200")}><AlignCenter size={14}/></button>
                                        <button onClick={() => updateTextProp(activeText.id, 'textAlign', 'right')} className={clsx("flex-1 rounded-lg flex items-center justify-center transition-all border", activeText.textAlign === 'right' ? "bg-purple-600 text-white border-purple-600" : isDark ? "bg-slate-900 border-slate-700" : "bg-white border-gray-200")}><AlignRight size={14}/></button>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-gray-500/10 pt-4">
                                <span className="text-[10px] font-black uppercase opacity-50 block mb-3 pl-1">Text Color</span>
                                <div className="flex gap-3 flex-wrap">
                                    {presetColors.map(color => (
                                        <button key={'txt'+color} onClick={() => updateTextProp(activeText.id, 'color', color)} className={clsx("w-8 h-8 rounded-full border-2 shadow-sm transition-all hover:scale-110", activeText.color === color ? "border-purple-500 scale-110 ring-2 ring-purple-500/30" : "border-gray-400")} style={{ backgroundColor: color }} />
                                    ))}
                                    <label className="w-8 h-8 rounded-full border-2 border-gray-400 shadow-sm cursor-pointer relative hover:scale-110 transition-all" style={{ background: 'conic-gradient(red, yellow, green, cyan, blue, magenta, red)' }}>
                                        <input type="color" value={activeText.color} onChange={(e) => updateTextProp(activeText.id, 'color', e.target.value)} className="absolute opacity-0 w-full h-full cursor-pointer" />
                                    </label>
                                </div>
                            </div>

                            <div className={clsx("p-4 rounded-xl border-2 border-dashed", isDark ? "bg-slate-900/30 border-slate-600" : "bg-purple-50/50 border-purple-200")}>
                                <span className="text-[10px] font-black uppercase tracking-widest text-purple-600 block mb-4 flex items-center gap-1"><Layers size={14}/> Text Effects (shadow& Outline)</span>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1">
                                            <span className="text-[9px] font-black uppercase opacity-60 block mb-1">Shadow </span>
                                            <input type="range" min="0" max="30" value={activeText.shadowSize} onChange={(e) => updateTextProp(activeText.id, 'shadowSize', e.target.value)} className="w-full h-1.5 accent-purple-600 cursor-pointer" />
                                        </div>
                                        <label className="w-6 h-6 rounded-full border-2 border-gray-400 shadow-sm cursor-pointer relative shrink-0 mt-3" title="Shadow Color">
                                            <div className="w-full h-full rounded-full" style={{ backgroundColor: activeText.shadowColor }}></div>
                                            <input type="color" value={activeText.shadowColor} onChange={(e) => updateTextProp(activeText.id, 'shadowColor', e.target.value)} className="absolute opacity-0 w-full h-full cursor-pointer" />
                                        </label>
                                    </div>
                                    <div className="flex items-center gap-3 border-t border-gray-500/20 pt-3">
                                        <div className="flex-1">
                                            <span className="text-[9px] font-black uppercase opacity-60 block mb-1">Outline (Border)</span>
                                            <input type="range" min="0" max="10" value={activeText.strokeSize} onChange={(e) => updateTextProp(activeText.id, 'strokeSize', e.target.value)} className="w-full h-1.5 accent-purple-600 cursor-pointer" />
                                        </div>
                                        <label className="w-6 h-6 rounded-full border-2 border-gray-400 shadow-sm cursor-pointer relative shrink-0 mt-3" title="Outline Color">
                                            <div className="w-full h-full rounded-full" style={{ backgroundColor: activeText.strokeColor }}></div>
                                            <input type="color" value={activeText.strokeColor} onChange={(e) => updateTextProp(activeText.id, 'strokeColor', e.target.value)} className="absolute opacity-0 w-full h-full cursor-pointer" />
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className={clsx("p-4 rounded-2xl border transition-all", isDark ? "bg-slate-900/50 border-slate-700" : "bg-black/5 border-gray-200")}>
                                <div className="mb-4">
                                    <span className="text-[10px] font-black uppercase opacity-60 block mb-3 text-center flex items-center justify-center gap-1"><MessageCircle size={14}/> Premium Bubble Shapes</span>
                                    <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                                        <button onClick={() => updateTextProp(activeText.id, 'bgStyle', 'none')} className={clsx("py-2 rounded-lg font-black text-[9px] uppercase transition-all border", activeText.bgStyle === 'none' ? "bg-purple-600 text-white border-purple-600 shadow-sm" : "bg-transparent border-gray-400 opacity-60")}>None</button>
                                        <button onClick={() => updateTextProp(activeText.id, 'bgStyle', 'solid')} className={clsx("py-2 rounded-lg font-black text-[9px] uppercase transition-all border", activeText.bgStyle === 'solid' ? "bg-purple-600 text-white border-purple-600 shadow-sm" : "bg-transparent border-gray-400 opacity-60")}>Square</button>
                                        <button onClick={() => updateTextProp(activeText.id, 'bgStyle', 'rounded')} className={clsx("py-2 rounded-lg font-black text-[9px] uppercase transition-all border", activeText.bgStyle === 'rounded' ? "bg-purple-600 text-white border-purple-600 shadow-sm" : "bg-transparent border-gray-400 opacity-60")}>Rounded</button>
                                        <button onClick={() => updateTextProp(activeText.id, 'bgStyle', 'pill')} className={clsx("py-2 rounded-full font-black text-[9px] uppercase transition-all border", activeText.bgStyle === 'pill' ? "bg-purple-600 text-white border-purple-600 shadow-sm" : "bg-transparent border-gray-400 opacity-60")}>Pill</button>
                                        <button onClick={() => updateTextProp(activeText.id, 'bgStyle', 'speech')} className={clsx("py-2 rounded-2xl rounded-bl-none font-black text-[9px] uppercase transition-all border", activeText.bgStyle === 'speech' ? "bg-purple-600 text-white border-purple-600 shadow-sm" : "bg-transparent border-gray-400 opacity-60")}>Chat</button>
                                        <button onClick={() => updateTextProp(activeText.id, 'bgStyle', 'slant')} className={clsx("py-2 -skew-x-12 rounded-sm font-black text-[9px] uppercase transition-all border", activeText.bgStyle === 'slant' ? "bg-purple-600 text-white border-purple-600 shadow-sm" : "bg-transparent border-gray-400 opacity-60")}>Slant</button>
                                        <button onClick={() => updateTextProp(activeText.id, 'bgStyle', 'outline')} className={clsx("py-2 rounded-lg font-black text-[9px] uppercase transition-all border", activeText.bgStyle === 'outline' ? "bg-purple-600 text-white border-purple-600 shadow-sm" : "bg-transparent border-gray-400 opacity-60")}>Outline</button>
                                        <button onClick={() => updateTextProp(activeText.id, 'bgStyle', 'glass')} className={clsx("py-2 rounded-lg font-black text-[9px] uppercase transition-all border", activeText.bgStyle === 'glass' ? "bg-purple-600 text-white border-purple-600 shadow-sm" : "bg-transparent border-gray-400 opacity-60")}>Glass</button>
                                    </div>
                                </div>
                                {activeText.bgStyle !== 'none' && (
                                    <div className="animate-in fade-in zoom-in-95 border-t border-gray-500/20 pt-3">
                                        <span className="text-[10px] font-black uppercase opacity-60 block mb-2 text-center">Shape Color</span>
                                        <div className="flex gap-2 flex-wrap justify-center">
                                            {presetColors.map(color => (
                                                <button key={'bg'+color} onClick={() => updateTextProp(activeText.id, 'bgColor', color)} className={clsx("w-7 h-7 rounded-full border shadow-sm transition-all hover:scale-110", activeText.bgColor === color ? "border-purple-500 scale-110 ring-2 ring-purple-500/30" : "border-gray-400")} style={{ backgroundColor: color }} />
                                            ))}
                                            <label className="w-7 h-7 rounded-full border-2 border-gray-400 shadow-sm cursor-pointer relative hover:scale-110 transition-all" style={{ background: 'conic-gradient(red, yellow, green, cyan, blue, magenta, red)' }}>
                                                <input type="color" value={activeText.bgColor} onChange={(e) => updateTextProp(activeText.id, 'bgColor', e.target.value)} className="absolute opacity-0 w-full h-full cursor-pointer" />
                                            </label>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
