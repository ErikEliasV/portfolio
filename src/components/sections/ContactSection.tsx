"use client";

import { useTranslations } from "next-intl";
import type { IconType } from "react-icons";
import { FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";
import { ContactForm } from "./ContactForm";
import { CopyEmailButton } from "./CopyEmailButton";
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
];

// Chamada + email + links à esquerda; formulário à direita (empilha no celular)
export function ContactSection() {
  const t = useTranslations("Sections.contact");

  return (
    <>
      <div className="grid items-start gap-7 md:grid-cols-[1fr_1.25fr] md:gap-9">
        <Reveal>
          {/* Textos pequenos ganham placa escura: nunca direto sobre o dither */}
          <h3 className="w-fit bg-ink/90 px-2 py-1 font-pixel text-[clamp(22px,2.4vw,32px)] uppercase leading-none text-cream">
            {t("form.heading")}
          </h3>
          <p className="mt-4 max-w-[46ch] bg-ink/90 px-2 py-1.5 text-[11px] uppercase leading-[1.6] tracking-[0.06em] text-muted md:text-[12px]">
            {t("form.intro")}
          </p>
          <CopyEmailButton className="mt-5" />
          <ul className="mt-5 grid gap-2.5">
            {LINKS.map(({ name, href, short, Icon }) => (
              <li key={name}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 border border-line bg-panel/95 px-4 py-3 transition-colors hover:border-accent-dim"
                >
                  <Icon aria-hidden="true" className="size-4 flex-none text-cream transition-colors group-hover:text-accent" />
                  <span className="font-pixel text-sm text-fg">{name}</span>
                  <span className="ml-auto truncate text-[11px] text-muted">{short}</span>
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal index={1}>
          <ContactForm />
        </Reveal>
      </div>
      <div className="flex flex-col items-center gap-1 pb-9 pt-14 text-[11px] tracking-[0.14em] text-muted">
        <span className="text-accent">{t("eof")}</span>
        <span>EOF</span>
      </div>
    </>
  );
}
