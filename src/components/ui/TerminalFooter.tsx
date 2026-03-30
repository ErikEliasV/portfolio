"use client";

import { motion } from "framer-motion";
import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";
import { SiGmail } from "react-icons/si";

export function TerminalFooter() {
  const links = [
    {
      name: "GitHub",
      href: "https://github.com/ErikEliasV",
      icon: <FaGithub className="text-slate-300 group-hover:text-white" size={16} />,
    },
    {
      name: "LinkedIn",
      href: "https://www.linkedin.com/in/erik-elias-varela-de-sousa-731363310",
      icon: <FaLinkedin className="text-[#0A66C2] group-hover:text-white" size={16} />,
    },
    {
      name: "Instagram",
      href: "https://instagram.com/Erik_Elias1",
      icon: <FaInstagram className="text-[#E4405F] group-hover:text-[#E4405F]" size={16} />,
    },
    {
      name: "Email",
      href: "mailto:erik100.eliasv@gmail.com",
      icon: <SiGmail className="text-[#EA4335] group-hover:text-[#EA4335]" size={16} />,
    },
  ];

  return (
    <motion.footer 
      id="contact"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      className="w-full max-w-3xl mx-auto flex flex-col gap-10 pt-16 mt-8 border-t border-white/10 pb-16 scroll-mt-32"
    >
      {/* Terminal Input Header */}
      <div className="flex items-center gap-2 mb-2 font-geist-mono text-sm md:text-base selection:bg-emerald-500/30">
        <span className="text-emerald-400">erik@local</span>
        <span className="text-teal-400">~/portfolio</span>
        <span className="text-slate-500">$</span>
        <h2 className="text-slate-200 ml-1">contact --links</h2>
      </div>

      <div className="flex flex-wrap gap-4 pl-4 md:pl-8 border-l border-white/5 ml-[5px]">
        {links.map((link) => (
          <a
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-2.5 bg-[#09090b] border border-white/10 rounded-lg text-sm text-slate-300 shadow-sm transition-all hover:-translate-y-1 hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:text-emerald-400 group cursor-pointer"
          >
            {link.icon}
            <span className="font-geist-mono tracking-widest uppercase text-xs font-medium">
              {link.name}
            </span>
          </a>
        ))}
      </div>

      {/* Final Terminal Closure */}
      <div className="mt-20 text-xs font-geist-mono text-slate-500 flex flex-col gap-1 items-center justify-center opacity-40 hover:opacity-100 transition-opacity cursor-default">
        <span className="text-emerald-500/50">{"[ Process completed ]"}</span>
        <span>EOF</span>
      </div>
    </motion.footer>
  );
}
