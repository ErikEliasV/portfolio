"use client";

import { useTranslations } from "next-intl";
import { MotionConfig, motion } from "framer-motion";
import type { Project } from "@/data/projects";
import { DitherBackground } from "@/components/dither/DitherBackground";
import { BrowserBar } from "@/components/nav/BrowserBar";
import { Chip } from "@/components/ui/Chip";
import { PixelCard } from "@/components/ui/PixelCard";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const enter = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, type: "spring" as const, stiffness: 100, damping: 20 },
});

function Label({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-4 w-fit bg-ink/90 px-1.5 py-0.5 text-[11px] uppercase tracking-[0.12em] text-muted">
      -- {children} --
    </h2>
  );
}

export function ProjectDetailClient({ project }: { project: Project }) {
  const t = useTranslations("Projects");
  const tSections = useTranslations("Sections");

  return (
    <MotionConfig reducedMotion="user">
      <DitherBackground />
      <BrowserBar visible={1} showBack />

      <main className="mx-auto max-w-5xl px-6 pb-24 pt-28">
        {/* Cabeçalho */}
        <motion.div {...enter()}>
          <p className="-ml-1.5 mb-6 w-fit bg-ink/90 px-1.5 py-0.5 text-[12px] text-muted [overflow-wrap:anywhere]">
            <span className="text-accent">erik@local</span> ~/projects $ cat {project.slug}/README.md
          </p>
          <h1 className="font-pixel text-[clamp(28px,6vw,72px)] font-bold uppercase leading-[0.95] text-cream text-outline [overflow-wrap:anywhere]">
            {t(project.titleKey)}
          </h1>
          <p className="mt-6 max-w-[70ch] border border-line bg-panel/95 p-5 text-[14px] leading-[1.7] text-copy">
            {t(project.descKey)}
          </p>
        </motion.div>

        {/* Tech stack */}
        <motion.div {...enter(0.1)} className="mt-10">
          <Label>{t("tech_stack")}</Label>
          <div className="flex flex-wrap gap-[7px]">
            {project.tech.map((tech) => (
              <Chip key={tech}>{tech}</Chip>
            ))}
          </div>
        </motion.div>

        {/* Links */}
        {(project.github || project.live) && (
          <motion.div {...enter(0.15)} className="mt-8 flex flex-wrap gap-3.5">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-line bg-panel/95 px-4 py-2 font-pixel text-sm uppercase text-fg transition-colors hover:border-accent-dim hover:text-accent"
              >
                {"{GitHub}"}
              </a>
            )}
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-accent-dim bg-panel/95 px-4 py-2 font-pixel text-sm uppercase text-accent transition-colors hover:bg-ink"
              >
                {"{Live Demo}"}
              </a>
            )}
          </motion.div>
        )}

        {/* Galeria */}
        <motion.div {...enter(0.2)} className="mt-16">
          <Label>{t("screenshots")}</Label>
          <div className="flex flex-col gap-6">
            {project.screenshots.map((src, i) => (
              <motion.div
                key={src}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.05, type: "spring", stiffness: 100, damping: 20 }}
              >
                <PixelCard className="overflow-hidden p-0">
                  {/* eslint-disable-next-line @next/next/no-img-element -- export estático com imagens sem otimização */}
                  <img
                    src={`${basePath}${src}`}
                    alt={`${t(project.titleKey)} screenshot ${i + 1}`}
                    className="block aspect-video w-full bg-panel object-cover"
                    loading="lazy"
                  />
                </PixelCard>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Fim do arquivo */}
        <div className="mt-24 flex flex-col items-center gap-1 text-[11px] tracking-[0.14em] text-muted">
          <span className="text-accent">{tSections("contact.eof")}</span>
          <span>EOF</span>
        </div>
      </main>
    </MotionConfig>
  );
}
