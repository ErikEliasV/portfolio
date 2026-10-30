"use client";

import { useTranslations } from "next-intl";
import { projects } from "@/data/projects";
import { Link } from "@/i18n/routing";
import { PixelCard } from "@/components/ui/PixelCard";
import { Reveal } from "./Reveal";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export function ProjectsSection() {
  const t = useTranslations("Projects");

  return (
    <div className="grid gap-3.5 md:grid-cols-2">
      {projects.map(({ slug, titleKey, thumbnail, tech }, i) => (
        <Reveal key={slug} index={i}>
          <Link href={`/projects/${slug}`} className="group block h-full">
            <PixelCard className="h-full overflow-hidden p-0 group-hover:-translate-y-[3px] group-hover:border-accent-dim">
              {/* eslint-disable-next-line @next/next/no-img-element -- export estático com imagens sem otimização */}
              <img
                src={`${basePath}${thumbnail}`}
                alt={t(titleKey)}
                loading="lazy"
                className="block aspect-video w-full border-b border-line bg-panel object-cover"
              />
              <div className="px-5 pb-5 pt-[18px]">
                <h3 className="font-pixel text-xl font-bold uppercase text-cream">{t(titleKey)}</h3>
                <div className="mt-3 flex flex-wrap gap-[7px]">
                  {tech.slice(0, 4).map((item) => (
                    <span key={item} className="border border-line px-2 py-[3px] text-[10.5px] text-muted">
                      {item}
                    </span>
                  ))}
                </div>
                <span className="mt-4 inline-block font-pixel uppercase text-accent">{`{${t("view_project")}}`}</span>
              </div>
            </PixelCard>
          </Link>
        </Reveal>
      ))}
    </div>
  );
}
