import { useTranslations } from "next-intl";
import type { SectionMeta } from "@/lib/sections";

export function SectionHeader({ section }: { section: SectionMeta }) {
  const t = useTranslations("Sections");
  const { id, number, command } = section;

  return (
    <div className="mb-7 flex flex-wrap items-end justify-between gap-6">
      <div className="min-w-0 max-w-full">
        {/* Textos pequenos ganham uma placa escura: nunca direto sobre o dither */}
        <p className="-ml-1.5 mb-2.5 w-fit bg-ink/90 px-1.5 py-0.5 text-[12px] text-muted">
          <span className="text-accent">erik@local</span> ~/portfolio $ {command}
        </p>
        <h2 className="font-pixel text-[clamp(28px,8.4vw,96px)] font-bold leading-[0.88] tracking-[-0.03em] text-cream [overflow-wrap:anywhere]">
          {t(`${id}.title`)}/
        </h2>
      </div>
      <p className="max-w-[300px] bg-ink/90 px-3 py-2 text-[11px] uppercase leading-[1.6] tracking-[0.06em] text-muted">
        <span className="font-medium text-fg">
          {number} · {t(`${id}.label`)}
        </span>
        <span className="ml-1.5 text-accent" aria-hidden="true">
          ✕✕✕
        </span>
        <br />
        {t(`${id}.blurb`)}
      </p>
    </div>
  );
}
