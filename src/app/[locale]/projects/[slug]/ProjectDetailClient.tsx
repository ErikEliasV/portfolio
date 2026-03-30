"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Link } from "@/i18n/routing";
import { ArrowLeft } from "@phosphor-icons/react";
import type { Project } from "@/data/projects";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export function ProjectDetailClient({ project }: { project: Project }) {
  const t = useTranslations("Projects");

  return (
    <main className="min-h-screen bg-[#0c0c10] text-slate-200">
      {/* Fixed Top Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0c0c10]/80 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-geist-mono text-slate-400 hover:text-emerald-400 transition-colors group"
          >
            <ArrowLeft weight="bold" className="text-xs transition-transform group-hover:-translate-x-1" />
            {t("back")}
          </Link>
          <span className="font-geist-mono text-xs text-emerald-400 tracking-widest">
            ERIK_PORTFOLIO
          </span>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 pt-28 pb-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        >
          {/* Terminal prompt */}
          <div className="flex items-center gap-2 mb-6 font-geist-mono text-sm selection:bg-emerald-500/30">
            <span className="text-emerald-400">erik@local</span>
            <span className="text-teal-400">~/projects</span>
            <span className="text-slate-500">$</span>
            <span className="text-slate-200 ml-1">cat {project.slug}/README.md</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-medium tracking-tight text-white mb-4">
            {t(project.titleKey)}
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed max-w-[65ch]">
            {t(project.descKey)}
          </p>
        </motion.div>

        {/* Tech Stack */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 100, damping: 20 }}
          className="mt-10"
        >
          <h2 className="font-geist-mono text-xs text-slate-600 uppercase tracking-widest mb-4">
            -- {t("tech_stack")} --
          </h2>
          <div className="flex flex-wrap gap-2">
            {project.tech.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1.5 text-sm font-geist-mono text-slate-300 border border-white/10 rounded-lg bg-white/[0.02] hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-colors"
              >
                {tech}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Links */}
        {(project.github || project.live) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, type: "spring", stiffness: 100, damping: 20 }}
            className="mt-8 flex gap-4"
          >
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 text-sm font-geist-mono text-slate-300 border border-white/10 rounded-lg hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:text-emerald-400 transition-all"
              >
                GitHub
              </a>
            )}
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 text-sm font-geist-mono text-emerald-400 border border-emerald-500/50 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 transition-all"
              >
                Live Demo
              </a>
            )}
          </motion.div>
        )}

        {/* Screenshots Gallery */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 100, damping: 20 }}
          className="mt-16"
        >
          <h2 className="font-geist-mono text-xs text-slate-600 uppercase tracking-widest mb-6">
            -- {t("screenshots")} --
          </h2>
          <div className="flex flex-col gap-6">
            {project.screenshots.map((src, i) => (
              <motion.div
                key={src}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.05, type: "spring", stiffness: 100, damping: 20 }}
                className="relative w-full rounded-xl overflow-hidden border border-white/10 bg-zinc-900"
              >
                <img
                  src={`${basePath}${src}`}
                  alt={`${t(project.titleKey)} screenshot ${i + 1}`}
                  className="w-full h-auto"
                  loading="lazy"
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Terminal closure */}
        <div className="mt-24 text-xs font-geist-mono text-slate-500 flex flex-col gap-1 items-center justify-center opacity-40 hover:opacity-100 transition-opacity cursor-default">
          <span className="text-emerald-500/50">{"[ End of file ]"}</span>
          <span>EOF</span>
        </div>
      </div>
    </main>
  );
}
