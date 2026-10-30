"use client";

import { useTranslations } from "next-intl";
import { PixelCard } from "@/components/ui/PixelCard";
import { PixelIcon } from "@/components/ui/PixelIcon";
import { Reveal } from "./Reveal";

export function EducationSection() {
  const t = useTranslations("Education");

  return (
    <div className="grid gap-3.5 md:grid-cols-2">
      <Reveal index={0}>
        <PixelCard highlight className="h-full">
          <h3 className="flex items-center gap-3 text-[13px] font-medium uppercase tracking-widest text-fg">
            <PixelIcon variant="plus" />
            {t("course")}
          </h3>
          <p className="mt-2.5 text-[11px] uppercase tracking-[0.06em] text-muted">{t("institution")}</p>
          <p className="mt-1.5 text-[11px] uppercase tracking-[0.08em] text-accent">[ {t("date")} ]</p>
        </PixelCard>
      </Reveal>
      <Reveal index={1}>
        <PixelCard className="h-full">
          <h3 className="flex items-center gap-3 text-[13px] font-medium uppercase tracking-widest text-fg">
            <PixelIcon variant="corner" />
            {t("certs_label")}
          </h3>
          <ul className="mt-3.5 flex flex-col gap-2 text-[12.5px] text-copy">
            {t("certs")
              .split(", ")
              .map((cert) => (
                <li key={cert}>
                  <span className="text-accent" aria-hidden="true">
                    ✔{" "}
                  </span>
                  {cert}
                </li>
              ))}
          </ul>
        </PixelCard>
      </Reveal>
    </div>
  );
}
