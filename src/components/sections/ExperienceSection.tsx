"use client";

import { useTranslations } from "next-intl";
import { PixelCard } from "@/components/ui/PixelCard";
import { PixelIcon, type PixelIconVariant } from "@/components/ui/PixelIcon";
import { Reveal } from "./Reveal";

const JOBS: { key: string; icon: PixelIconVariant; highlight?: boolean }[] = [
  { key: "i9", icon: "plus", highlight: true },
  { key: "senac", icon: "corner" },
  { key: "claro", icon: "cross" },
];

export function ExperienceSection() {
  const t = useTranslations("Experience");

  return (
    <div className="grid gap-3.5 md:grid-cols-3">
      {JOBS.map(({ key, icon, highlight }, i) => (
        <Reveal key={key} index={i}>
          <PixelCard highlight={highlight} className="h-full">
            <h3 className="flex items-center gap-3 text-[13px] font-medium uppercase tracking-widest text-fg">
              <PixelIcon variant={icon} />
              {t(`${key}_role`)}
            </h3>
            <p className="mt-2.5 text-[11px] uppercase tracking-[0.06em] text-muted">{t(`${key}_company`)}</p>
            <p className="mt-1.5 text-[11px] uppercase tracking-[0.08em] text-accent">[ {t(`${key}_date`)} ]</p>
            <p className="mt-3.5 text-[12.5px] leading-[1.65] text-copy">{t(`${key}_desc`)}</p>
          </PixelCard>
        </Reveal>
      ))}
    </div>
  );
}
