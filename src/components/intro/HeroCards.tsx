"use client";

import { useTranslations } from "next-intl";
import { projects } from "@/data/projects";
import { PixelCard } from "@/components/ui/PixelCard";
import { PixelIcon, type PixelIconVariant } from "@/components/ui/PixelIcon";

const CARDS: { id: "experience" | "skills" | "projects"; icon: PixelIconVariant }[] = [
  { id: "experience", icon: "plus" },
  { id: "skills", icon: "corner" },
  { id: "projects", icon: "cross" },
];

// Atalhos do rodapé do hero (só desktop)
export function HeroCards() {
  const t = useTranslations();
  const texts = {
    experience: t("HeroCards.experience"),
    skills: t("HeroCards.skills"),
    projects: projects.map((p) => t(`Projects.${p.titleKey}`)).join(" · "),
  };

  return (
    <div className="hidden grid-cols-3 gap-3.5 md:grid">
      {CARDS.map(({ id, icon }) => (
        <a key={id} href={`#${id}`} className="group block">
          <PixelCard className="h-full p-4 group-hover:-translate-y-[3px] group-hover:border-accent-dim">
            <h2 className="flex items-center gap-3 text-[12px] font-medium uppercase tracking-[0.1em] text-fg">
              <PixelIcon variant={icon} className="size-3.5" />
              {t(`Nav.${id}`)}
            </h2>
            <p className="mt-2.5 text-[11px] uppercase leading-[1.55] tracking-[0.06em] text-muted">{texts[id]}</p>
          </PixelCard>
        </a>
      ))}
    </div>
  );
}
