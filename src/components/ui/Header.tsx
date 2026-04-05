"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "@/i18n/routing";

export function Header() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const { scrollYProgress } = useScroll();
  const widthDesktop = useTransform(scrollYProgress, [0.4, 0.48], ["50%", "80%"]);
  const widthMobile = useTransform(scrollYProgress, [0.4, 0.48], ["90%", "95%"]);
  const width = isMobile ? widthMobile : widthDesktop;

  return (
    <motion.nav
      style={{ width }}
      className="fixed top-6 md:top-16 left-1/2 -translate-x-1/2 flex justify-between items-center glass-panel px-5 md:px-8 py-3.5 md:py-5 rounded-full z-[100] shadow-2xl"
    >
      <span className="font-geist-mono font-medium text-xs md:text-base tracking-widest text-emerald-400">
        ERIK_PORTFOLIO
      </span>
      <div className="flex gap-3 md:gap-4 text-xs md:text-base font-semibold tracking-wider text-slate-300 uppercase">
        <Link href="/" locale="pt-BR" className="hover:text-white transition-colors">PT</Link>
        <span className="opacity-20">/</span>
        <Link href="/" locale="en" className="hover:text-white transition-colors">EN</Link>
      </div>
    </motion.nav>
  );
}
