"use client";

import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

interface Line {
  kind: "cmd" | "out";
  text: ReactNode;
}

const cmd = (text: string): Line => ({ kind: "cmd", text });
const out = (text: ReactNode): Line => ({ kind: "out", text });

const Ok = () => <span className="text-accent">✔</span>;

const INSTALLED = (
  <>
    <Ok /> react@19.2  <Ok /> next@16.2  <Ok /> framer-motion  <Ok /> webgl
  </>
);

// Cada passo é uma "linha" do boot; o total bate com BOOT_LINES
function desktopSteps(ready: string): Line[][] {
  return [
    [cmd("cd ~/projects")],
    [cmd("ls"), out("portfolio/  api/  mobile-app/")],
    [cmd("cd portfolio")],
    [cmd("git log -1"), out("commit 8f2a1b9c"), out("feat: build premium portfolio for awesome recruiters")],
    [cmd("npm install")],
    [out(INSTALLED)],
    [cmd("npm run dev")],
    [out(<><span className="text-accent">▲</span> Next.js 16.2 · {ready}</>)],
  ];
}

function mobileSteps(ready: string): Line[][] {
  return [
    [cmd("cd ~/portfolio")],
    [cmd("npm install"), out(INSTALLED)],
    [cmd("npm run dev")],
    [out(<><span className="text-accent">▲</span> Next.js 16.2 · {ready}</>)],
  ];
}

export function BootTerminal({ typedLines, mobile }: { typedLines: number; mobile: boolean }) {
  const t = useTranslations("Hero");
  const steps = mobile ? mobileSteps(t("boot_ready")) : desktopSteps(t("boot_ready"));
  const lines = steps.slice(0, Math.max(1, typedLines)).flat();

  return (
    <div className="text-[12px] leading-[1.75] md:text-[13px]">
      {lines.map((line, i) => (
        <div key={i} className={line.kind === "out" ? "whitespace-pre-wrap text-copy" : "text-fg"}>
          {line.kind === "cmd" && (
            <>
              <span className="text-accent">erik@local</span> <span className="text-muted">~/portfolio $</span>{" "}
            </>
          )}
          {line.text}
          {i === lines.length - 1 && (
            <span
              aria-hidden="true"
              className="ml-1 inline-block h-[1.1em] w-[0.6em] translate-y-[0.18em] animate-blink bg-accent motion-reduce:animate-none"
            />
          )}
        </div>
      ))}
    </div>
  );
}
