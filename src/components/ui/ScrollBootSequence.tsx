"use client";

import { useTranslations } from "next-intl";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { TerminalWindow,  ShieldCheck } from "@phosphor-icons/react";
import { PerpetualBento } from "./PerpetualBento";
import { ProjectsShowcase } from "./ProjectsShowcase";
import { TerminalFooter } from "./TerminalFooter";

export function ScrollBootSequence() {
  const t = useTranslations("Hero");
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [scrollRange, setScrollRange] = useState(2500); // Fallback
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    setIsMobile(window.innerWidth < 1024);
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!contentRef.current || typeof window === "undefined") return;
    
    const calculateRange = () => {
      if (contentRef.current) {
        // Altura total do conteúdo interno MENOS a altura da janela (viewport) + margem do header do terminal (50px).
        // Isso garante que ele trave EXATAMENTE no último pixel do Footer.
        const maxScroll = contentRef.current.scrollHeight - window.innerHeight + 120;
        setScrollRange(Math.max(0, maxScroll));
      }
    };

    calculateRange();

    const observer = new ResizeObserver(calculateRange);
    observer.observe(contentRef.current);
    
    return () => observer.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Hero Text Transformations (Fades early)
  const heroOpacity = useTransform(smoothProgress, [0, 0.2], [1, 0]);
  const heroY = useTransform(smoothProgress, [0, 0.2], [0, -100]);

  // Terminal Expansion Math - Compress expansion to 0.2 -> 0.35
  // Smaller initial window for a more authentic "CLI floating" feel
  const desktopTop = "30vh"; 
  const desktopRight = "10vw";
  const desktopBottom = "30vh";
  const desktopLeft = "55vw";

  const mobileTop = "60vh";
  const mobileRight = "6vw";
  const mobileBottom = "10vh";
  const mobileLeft = "6vw";

  // Expand
  const top = useTransform(smoothProgress, [0.2, 0.35], [isMobile ? mobileTop : desktopTop, "0vh"]);
  const right = useTransform(smoothProgress, [0.2, 0.35], [isMobile ? mobileRight : desktopRight, "0vw"]);
  const bottom = useTransform(smoothProgress, [0.2, 0.35], [isMobile ? mobileBottom : desktopBottom, "0vh"]);
  const left = useTransform(smoothProgress, [0.2, 0.35], [isMobile ? mobileLeft : desktopLeft, "0vw"]);
  const borderRadius = useTransform(smoothProgress, [0.2, 0.35], ["24px", "0px"]);

  // Typing Timeline (0.0 to 0.15 for Boot Sequence)
  const line1Op = useTransform(smoothProgress, [0.0, 0.02], [0, 1]); // cd ~/projects
  const line2Op = useTransform(smoothProgress, [0.03, 0.05], [0, 1]); // ls
  const line3Op = useTransform(smoothProgress, [0.06, 0.08], [0, 1]); // cd portfolio
  const line4Op = useTransform(smoothProgress, [0.09, 0.11], [0, 1]); // git log
  const line5Op = useTransform(smoothProgress, [0.12, 0.14], [0, 1]); // npm install
  const line6Op = useTransform(smoothProgress, [0.15, 0.17], [0, 1]); // dependencies checked
  const line7Op = useTransform(smoothProgress, [0.18, 0.20], [0, 1]); // npm run dev
  const line8Op = useTransform(smoothProgress, [0.21, 0.24], [0, 1]); // next.js ready

  // Header Metamorphosis
  const headerTerminalOp = useTransform(smoothProgress, [0.25, 0.35], [1, 0]);
  const headerTerminalY = useTransform(smoothProgress, [0.25, 0.35], [0, -20]);
  const headerBrowserOp = useTransform(smoothProgress, [0.3, 0.4], [0, 1]);
  const headerBrowserY = useTransform(smoothProgress, [0.3, 0.4], [20, 0]);

  // INNER SCROLL SLIDE (This physically pushes the terminal buffer upwards!)
  // Using exact pixel mapping to lock exactly at the bottom of the TerminalFooter
  const contentYOffset = useTransform(smoothProgress, [0.35, 1], [0, -scrollRange]);

  const scrollToPercent = (percent: number) => {
    if (typeof window === "undefined") return;
    window.scrollTo({
      top: document.body.scrollHeight * percent,
      behavior: "smooth"
    });
  };

  return (
    // 1000vh creates a massive canvas. 35% is reserved for the spectacular boot.
    // 65% is purely dedicated to sliding the portfolio content through the terminal window!
    <div ref={containerRef} className="relative w-full h-[1000vh]">
      <div className="sticky top-0 w-full h-screen overflow-hidden bg-[#0c0c10]">
        
        {/* Quick Links Navigation */}
        <motion.div
          style={mounted ? { opacity: heroOpacity } : { opacity: 1 }}
          className="absolute bottom-10 left-6 md:left-auto md:right-10 z-50 flex flex-wrap md:flex-row items-center gap-4 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white text-xs font-geist-mono uppercase tracking-widest glass-panel"
        >
          <button onClick={() => scrollToPercent(0.48)} className="hover:text-emerald-400 transition-colors flex items-center gap-2">
            <span className="text-emerald-500">{">"}</span> whoami
          </button>
          <span className="hidden md:block opacity-20">|</span>
          <button onClick={() => scrollToPercent(0.55)} className="hover:text-emerald-400 transition-colors flex items-center gap-2">
            <span className="text-emerald-500">{">"}</span> system_info
          </button>
          <span className="hidden md:block opacity-20">|</span>
          <button onClick={() => scrollToPercent(0.7)} className="hover:text-emerald-400 transition-colors flex items-center gap-2">
            <span className="text-emerald-500">{">"}</span> projects
          </button>
          <span className="hidden md:block opacity-20">|</span>
          <button onClick={() => scrollToPercent(0.88)} className="hover:text-emerald-400 transition-colors flex items-center gap-2">
            <span className="text-emerald-500">{">"}</span> contact
          </button>
        </motion.div>

        {/* Hero Content */}
        <motion.div
          style={mounted ? { opacity: heroOpacity, y: heroY } : { opacity: 1, y: 0 }}
          className="absolute top-0 left-0 w-full md:w-[55%] h-full flex flex-col justify-center px-8 md:pl-24 lg:pl-32 xl:pl-40 pr-8 z-10"
        >
          <div className="flex items-center gap-3 text-xs font-geist-mono text-slate-400 uppercase tracking-widest mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            {t("role")}
          </div>
          <h1 className="text-5xl md:text-8xl lg:text-[7rem] tracking-tighter leading-[0.9] text-white font-medium mb-2">
            {t("title")}
          </h1>
          <span className="block text-2xl md:text-4xl lg:text-5xl tracking-tight text-slate-400 font-medium mb-6">
            {t("heroRole")}
          </span>
          <p className="text-lg md:text-xl text-slate-400 max-w-[40ch] leading-relaxed">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* Terminal Window (THE MAIN PLATFORM) */}
        <motion.div
          key={isMobile ? "mobile" : "desktop"}
          style={mounted 
            ? { top, right, bottom, left, borderRadius } 
            : { top: desktopTop, right: desktopRight, bottom: desktopBottom, left: desktopLeft, borderRadius: "24px" }
          }
          className="absolute bg-[#0c0c10] shadow-[0_0_80px_rgba(0,0,0,0.6)] z-20 flex flex-col border border-white/10 overflow-hidden"
        >

          {/* Fixed Terminal Header (Inside the expanding box) */}
          <div className="h-12 border-b border-white/5 flex items-center px-4 justify-between bg-white/[0.02] relative shrink-0 z-50">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.4)]" />
              <div className="w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.4)]" />
              <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]" />
            </div>
            
            <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center w-full max-w-[200px] md:max-w-xs h-full overflow-hidden pointer-events-none">
               <motion.div 
                 style={mounted ? { opacity: headerTerminalOp, y: headerTerminalY } : { opacity: 1, y: 0 }}
                 className="absolute font-geist-mono text-xs text-slate-500 flex items-center gap-2 whitespace-nowrap"
               >
                 <TerminalWindow weight="duotone" className="text-sm" /> erik@local
               </motion.div>
               
               <motion.div 
                 style={mounted ? { opacity: headerBrowserOp, y: headerBrowserY } : { opacity: 0, y: 20 }}
                 className="absolute w-full py-1.5 px-4 bg-black/40 border border-white/5 rounded-full font-geist-mono text-xs text-slate-300 flex items-center justify-center gap-2"
               >
                 <ShieldCheck weight="fill" className="text-emerald-500" /> https://localhost:3000
               </motion.div>
            </div>
            <div className="w-16"></div>
          </div>

          {/* 
            THE TERMINAL BUFFER
            This takes the remaining space. We animate its `y` mapping negative percentages 
            to physically shove the text upwards, simulating native scroll / terminal printing!
          */}
          <div className="flex-1 w-full relative overflow-hidden">
            <motion.div 
              ref={contentRef}
              style={mounted ? { y: contentYOffset } : {}}
              className="absolute left-0 w-full p-6 md:p-8 font-geist-mono text-xs md:text-sm text-slate-300 flex flex-col gap-2"
            >
              {/* Fake Boot Script */}
              <motion.div style={mounted ? { opacity: line1Op } : { opacity: 0 }}>
                <span className="text-emerald-400">erik@local</span>
                <span className="text-blue-400"> ~</span> $ cd ~/projects
              </motion.div>
              
              <motion.div style={mounted ? { opacity: line2Op } : { opacity: 0 }}>
                <span className="text-emerald-400">erik@local</span>
                <span className="text-blue-400"> ~/projects</span> $ ls
                <div className="flex gap-6 mt-1 mb-2 text-slate-500 font-medium whitespace-nowrap overflow-x-auto scroller-none">
                  <span className="text-emerald-200/50">portfolio/</span>
                  <span>api/</span>
                  <span>mobile-app/</span>
                </div>
              </motion.div>

              <motion.div style={mounted ? { opacity: line3Op } : { opacity: 0 }}>
                <span className="text-emerald-400">erik@local</span>
                <span className="text-blue-400"> ~/projects</span> $ cd portfolio
              </motion.div>

              <motion.div style={mounted ? { opacity: line4Op } : { opacity: 0 }} className="mr-4">
                <span className="text-emerald-400">erik@local</span>
                <span className="text-teal-400"> ~/portfolio</span> <span className="text-purple-400">(main)</span> $ git log -1
                <div className="mt-1 text-slate-400 mb-2 border-l-2 border-slate-700 pl-3">
                  <span className="text-yellow-500/80">commit 8f2a1b9c</span><br/>
                  Author: Erik &lt;erik@local&gt;<br/>
                  <span className="text-white mt-1 inline-block">feat: build premium portfolio for awesome recruiters</span>
                </div>
              </motion.div>

              <motion.div style={mounted ? { opacity: line5Op } : { opacity: 0 }}>
                 <span className="text-emerald-400">erik@local</span>
                 <span className="text-teal-400"> ~/portfolio</span> $ npm install
              </motion.div>

              <motion.div style={mounted ? { opacity: line6Op } : { opacity: 0 }} className="text-slate-400 space-y-0.5 mt-1 mb-2">
                <div className="text-emerald-500/80 font-bold mb-1">Installing dependencies...</div>
                <div className="flex items-center gap-2"><span className="text-emerald-500">✔</span> react@18.2</div>
                <div className="flex items-center gap-2"><span className="text-emerald-500">✔</span> next@15.0</div>
                <div className="flex items-center gap-2"><span className="text-emerald-500">✔</span> framer-motion</div>
              </motion.div>

              <motion.div style={mounted ? { opacity: line7Op } : { opacity: 0 }}>
                <span className="text-emerald-400">erik@local</span>
                <span className="text-teal-400"> ~/portfolio</span> $ npm run dev
                <div className="text-slate-500 mt-2">
                  {">"} portifolio@0.1.0 dev <br/>
                  {">"} next dev
                </div>
              </motion.div>

              <motion.div style={mounted ? { opacity: line8Op } : { opacity: 0 }} className="text-white mt-4 font-bold flex flex-col gap-1 mb-32">
                <div className="flex items-center gap-2">
                  <span className="text-white">▲</span> Next.js 15.0.0
                </div>
                <div className="text-emerald-400 font-normal mt-1">
                  - Local: <span className="text-white ml-6 underline decoration-white/30 hover:decoration-white cursor-pointer transition-all">http://localhost:3000</span>
                </div>
                <div className="text-slate-400 font-normal">
                  - Environments: .env.local
                </div>
                <div className="text-emerald-400 font-normal mt-3 flex items-center gap-2">
                  <span className="inline-block animate-pulse">✓</span> Ready in 1250ms
                </div>
              </motion.div>

              {/* 
                PORTFOLIO REAL CONTENT 
                Injected DIRECTLY into the terminal stream!
                As `contentYOffset` pushes this wrapper up, these elements slide into view.
                When they cross the viewport threshold, they animate (opacity fade in) line by line!
              */}
              <div className="w-full max-w-[1400px] mx-auto pb-[10vh]">
                <PerpetualBento />
                <div className="w-full max-w-3xl mx-auto py-20">
                  <ProjectsShowcase />
                </div>
                <TerminalFooter />
              </div>
              
              <div className="h-[2vh]" /> {/* Buffer */}
              
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
