"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { SiReact, SiNextdotjs, SiTailwindcss, SiTypescript, SiJavascript, SiSpringboot, SiDocker, SiSwift } from "react-icons/si";
import { FaJava } from "react-icons/fa";

export function PerpetualBento() {
  const tExp = useTranslations("Experience");
  const tSkills = useTranslations("Skills");

  const frontendSkills = tSkills("frontend").split(", ");
  const backendSkills = tSkills("backend").split(", ");

  const getIcon = (skillName: string) => {
    const name = skillName.toLowerCase();
    if (name.includes("next")) return <SiNextdotjs className="text-white" />;
    if (name.includes("react")) return <SiReact className="text-[#61DAFB]" />;
    if (name.includes("tailwind")) return <SiTailwindcss className="text-[#06B6D4]" />;
    if (name.includes("typescript")) return <SiTypescript className="text-[#3178C6]" />;
    if (name.includes("javascript")) return <SiJavascript className="text-[#F7DF1E]" />;
    if (name.includes("spring")) return <SiSpringboot className="text-[#6DB33F]" />;
    if (name.includes("docker")) return <SiDocker className="text-[#2496ED]" />;
    if (name.includes("java")) return <FaJava className="text-[#007396]" />;
    if (name.includes("swift")) return <SiSwift className="text-[#F05138]" />;
    return <span className="text-emerald-500">{"$"}</span>;
  };

  return (
    <section className="w-full max-w-3xl mx-auto flex flex-col gap-20 pt-8 pb-32">
      {/* Experience Section */}
      <motion.div
        id="experience"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="flex flex-col scroll-mt-32"
      >
        {/* Terminal Input Header */}
        <div className="flex items-center gap-2 mb-8 font-geist-mono text-sm md:text-base selection:bg-emerald-500/30">
          <span className="text-emerald-400">erik@local</span>
          <span className="text-teal-400">~/portfolio</span>
          <span className="text-slate-500">$</span>
          <h2 className="text-slate-200 ml-1">{tExp("title").replace("> ", "")}</h2>
        </div>

        <div className="flex flex-col gap-12 relative border-l border-white/10 ml-4 pl-8">
          {/* Node 1: i9-systemas */}
          <div className="relative group">
            <div className="absolute -left-[37px] top-1 w-3 h-3 bg-zinc-950 border border-emerald-500 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out" />
            <span className="font-geist-mono text-xs text-emerald-400 tracking-wider uppercase drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]">
              {`[ ${tExp("i9_date")} ]`}
            </span>
            <h3 className="text-xl text-white font-medium tracking-tight mt-2">
              {tExp("i9_role")} • <span className="text-slate-400">{tExp("i9_company")}</span>
            </h3>
            <p className="text-slate-400 mt-3 leading-relaxed max-w-[55ch]">
              {tExp("i9_desc")}
            </p>
          </div>

          {/* Node 2: Senac Labs */}
          <div className="relative group">
            <div className="absolute -left-[37px] top-1 w-3 h-3 bg-zinc-950 border border-white/30 rounded-full group-hover:scale-150 group-hover:border-emerald-500 transition-transform duration-500 ease-out" />
            <span className="font-geist-mono text-xs text-slate-500 tracking-wider uppercase">
              {`[ ${tExp("senac_date")} ]`}
            </span>
            <h3 className="text-xl text-white font-medium tracking-tight mt-2">
              {tExp("senac_role")} • <span className="text-slate-400">{tExp("senac_company")}</span>
            </h3>
            <p className="text-slate-400 mt-3 leading-relaxed max-w-[55ch]">
              {tExp("senac_desc")}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Tech Stack Section */}
      <motion.div
        id="skills"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.1 }}
        className="flex flex-col scroll-mt-32"
      >
        {/* Terminal Input Header */}
        <div className="flex items-center gap-2 mb-8 font-geist-mono text-sm md:text-base selection:bg-emerald-500/30">
          <span className="text-emerald-400">erik@local</span>
          <span className="text-teal-400">~/portfolio</span>
          <span className="text-slate-500">$</span>
          <h2 className="text-slate-200 ml-1">{tSkills("title").replace("> ", "")}</h2>
        </div>

        {/* Output Area */}
        <div className="flex flex-col gap-10 pl-4 md:pl-8 border-l border-white/5 ml-[5px]">
          <div>
            <span className="font-geist-mono text-xs text-slate-600 uppercase tracking-widest mb-4 block">
              -- Frontend / Mobile --
            </span>
            <div className="flex flex-wrap gap-2">
              {frontendSkills.map((skill, i) => (
                <motion.span
                  key={skill}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="flex items-center gap-2 px-3 py-1.5 bg-[#09090b] border border-white/10 rounded-lg text-sm text-slate-300 shadow-sm cursor-default transition-colors hover:border-emerald-500/50 hover:bg-emerald-500/10"
                >
                  {getIcon(skill)}
                  {skill}
                </motion.span>
              ))}
            </div>
          </div>

          <div>
            <span className="font-geist-mono text-xs text-slate-600 uppercase tracking-widest mb-4 block mt-4">
              -- Backend / DevOps --
            </span>
            <div className="flex flex-wrap gap-2">
              {backendSkills.map((skill) => (
                <motion.span
                  key={skill}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="flex items-center gap-2 px-3 py-1.5 bg-[#09090b] border border-white/5 rounded-lg text-sm text-slate-300 cursor-default hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-colors"
                >
                  {getIcon(skill)}
                  {skill}
                </motion.span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
