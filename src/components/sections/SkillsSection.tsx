"use client";

import { useTranslations } from "next-intl";
import { Chip } from "@/components/ui/Chip";
import { PixelCard } from "@/components/ui/PixelCard";
import { PixelIcon, type PixelIconVariant } from "@/components/ui/PixelIcon";
import { Reveal } from "./Reveal";

const GROUPS: { key: "frontend" | "backend" | "tools"; icon: PixelIconVariant }[] = [
  { key: "frontend", icon: "plus" },
  { key: "backend", icon: "corner" },
  { key: "tools", icon: "cross" },
];

export function SkillsSection() {
  const t = useTranslations();

  return (
    <div className="grid gap-3.5 md:grid-cols-3">
      {GROUPS.map(({ key, icon }, i) => (
        <Reveal key={key} index={i}>
          <PixelCard className="h-full">
            <h3 className="flex items-center gap-3 text-[13px] font-medium uppercase tracking-widest text-fg">
              <PixelIcon variant={icon} />
              {t(`Sections.skills.${key}`)}
            </h3>
            <div className="mt-4 flex flex-wrap gap-[7px]">
              {t(`Skills.${key}`)
                .split(", ")
                .map((skill) => (
                  <Chip key={skill}>{skill}</Chip>
                ))}
            </div>
          </PixelCard>
        </Reveal>
      ))}
    </div>
  );
}
