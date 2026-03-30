"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { projects } from "@/data/projects";
import { Link } from "@/i18n/routing";
import { ArrowRight } from "@phosphor-icons/react";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export function ProjectsShowcase() {
  const t = useTranslations("Projects");

  return (
    <motion.section
      id="projects"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.1 }}
      className="w-full max-w-3xl mx-auto flex flex-col scroll-mt-32"
    >
      {/* Terminal Input Header */}
      <div className="flex items-center gap-2 mb-8 font-geist-mono text-sm md:text-base selection:bg-emerald-500/30">
        <span className="text-emerald-400">erik@local</span>
        <span className="text-teal-400">~/portfolio</span>
        <span className="text-slate-500">$</span>
        <h2 className="text-slate-200 ml-1">{t("title").replace("> ", "")}</h2>
      </div>

      {/* Project Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pl-4 md:pl-8 border-l border-white/5 ml-[5px]">
        {projects.map((project, i) => (
          <Link
            key={project.slug}
            href={`/projects/${project.slug}`}
          >
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, type: "spring", stiffness: 100, damping: 20 }}
              whileHover={{ y: -4 }}
              className="group relative bg-[#09090b] border border-white/10 rounded-xl overflow-hidden cursor-pointer transition-colors hover:border-emerald-500/50"
            >
              {/* Thumbnail */}
              <div className="relative w-full aspect-video overflow-hidden bg-zinc-900">
                <img
                  src={`${basePath}${project.thumbnail}`}
                  alt={t(project.titleKey)}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-transparent opacity-60" />
              </div>

              {/* Info */}
              <div className="p-4 flex flex-col gap-2">
                <h3 className="text-white font-medium text-sm tracking-tight group-hover:text-emerald-400 transition-colors">
                  {t(project.titleKey)}
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {project.tech.slice(0, 3).map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 text-[10px] font-geist-mono text-slate-500 border border-white/5 rounded-md bg-white/[0.02]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-1.5 mt-1 text-xs font-geist-mono text-emerald-500/70 group-hover:text-emerald-400 transition-colors">
                  <span>{t("view_project")}</span>
                  <ArrowRight weight="bold" className="text-[10px] transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </motion.article>
          </Link>
        ))}
      </div>
    </motion.section>
  );
}
