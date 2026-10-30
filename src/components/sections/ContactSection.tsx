"use client";

import { useTranslations } from "next-intl";
import type { IconType } from "react-icons";
import { FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";
import { SiGmail } from "react-icons/si";
import { PixelCard } from "@/components/ui/PixelCard";
import { Reveal } from "./Reveal";

const LINKS: { name: string; href: string; short: string; Icon: IconType }[] = [
  { name: "GitHub", href: "https://github.com/ErikEliasV", short: "github.com/ErikEliasV", Icon: FaGithub },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/erik-elias-varela-de-sousa-731363310",
    short: "in/erik-elias-varela-de-sousa",
    Icon: FaLinkedin,
  },
  { name: "Instagram", href: "https://instagram.com/Erik_Elias1", short: "@Erik_Elias1", Icon: FaInstagram },
  { name: "Email", href: "mailto:erik100.eliasv@gmail.com", short: "erik100.eliasv@gmail.com", Icon: SiGmail },
];

export function ContactSection() {
  const t = useTranslations("Sections.contact");

  return (
    <>
      <div className="grid grid-cols-2 gap-3.5 md:grid-cols-4">
        {LINKS.map(({ name, href, short, Icon }, i) => (
          <Reveal key={name} index={i}>
            <a
              href={href}
              className="group block h-full"
              {...(href.startsWith("http") && { target: "_blank", rel: "noopener noreferrer" })}
            >
              <PixelCard className="flex h-full flex-col gap-3.5 group-hover:-translate-y-[3px] group-hover:border-accent-dim">
                <Icon aria-hidden="true" className="size-5 text-cream transition-colors group-hover:text-accent" />
                <span className="font-pixel text-base text-fg">{name}</span>
                <span className="text-[11px] text-muted [overflow-wrap:anywhere]">{short}</span>
              </PixelCard>
            </a>
          </Reveal>
        ))}
      </div>
      <div className="flex flex-col items-center gap-1 pb-9 pt-14 text-[11px] tracking-[0.14em] text-muted">
        <span className="text-accent">{t("eof")}</span>
        <span>EOF</span>
      </div>
    </>
  );
}
