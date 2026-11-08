"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { CONTACT_EMAIL } from "@/lib/contact";
import { lockScroll, unlockScroll } from "@/lib/scroll-lock";
import { CopyEmailButton } from "./CopyEmailButton";

export type ContactResult = { type: "sent"; name: string } | { type: "failed"; reason: "network" | "rejected" };

// Janela de terminal com o resultado do envio. <dialog> nativo: prende o foco,
// fecha no Esc e devolve o foco ao botão de enviar.
export function ContactResultDialog({
  result,
  onClose,
  onRetry,
}: {
  result: ContactResult | null;
  onClose: () => void;
  onRetry: () => void;
}) {
  const t = useTranslations("Sections.contact.form.result");
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (result && !dialog.open) {
      dialog.showModal();
      // autoFocus do React não vira atributo, então o <dialog> não acharia o botão principal
      dialog.querySelector<HTMLElement>("[data-autofocus]")?.focus();
      lockScroll();
    } else if (!result && dialog.open) {
      dialog.close();
    }
  }, [result]);

  const sent = result?.type === "sent";

  return (
    <dialog
      ref={ref}
      onClose={() => {
        unlockScroll();
        onClose();
      }}
      // Clique fora da janela (no fundo escuro) fecha
      onClick={(event) => event.target === event.currentTarget && event.currentTarget.close()}
      aria-labelledby="contact-result-title"
      className="m-auto w-[min(calc(100vw-32px),480px)] border border-line bg-panel p-0 text-fg shadow-[0_0_60px_#000a] backdrop:bg-ink/80 backdrop:backdrop-blur-sm"
    >
      {result && (
        <>
          <div className="flex h-10 items-center gap-[7px] border-b border-line px-4" aria-hidden="true">
            <span className={`size-2.5 ${sent ? "bg-accent" : "bg-[#ff8a7a]"}`} />
            <span className="size-2.5 bg-line" />
            <span className="size-2.5 bg-line" />
            <span className="ml-auto text-[10px] tracking-[0.1em] text-muted">ERIK@LOCAL · CONTACT</span>
          </div>
          <div className="px-5 pb-6 pt-5 md:px-6">
            <p className="text-[12px] text-muted" aria-hidden="true">
              <span className="text-accent">erik@local</span> ~/portfolio $ contact --send
            </p>
            <p className={`mt-1 text-[12px] ${sent ? "text-accent" : "text-[#ff8a7a]"}`} aria-hidden="true">
              {sent ? "✔ exit 0" : "✖ exit 1"}
            </p>
            <h2
              id="contact-result-title"
              className="mt-5 font-pixel text-[clamp(22px,4vw,28px)] uppercase leading-none text-cream"
            >
              {sent ? t("sentTitle") : t("failedTitle")}
            </h2>
            <p className="mt-3 text-[13px] leading-[1.7] text-copy">
              {result.type === "sent"
                ? t("sentBody", { name: result.name })
                : t(`failedBody.${result.reason}`, { email: CONTACT_EMAIL })}
            </p>
            {!sent && <CopyEmailButton className="mt-5" />}
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
              {!sent && (
                <button
                  type="button"
                  data-autofocus
                  onClick={onRetry}
                  className="font-pixel text-[18px] uppercase text-accent hover:underline"
                >
                  {`{${t("retry")}}`}
                </button>
              )}
              <button
                type="button"
                data-autofocus={sent || undefined}
                onClick={() => ref.current?.close()}
                className={`font-pixel text-[18px] uppercase hover:underline ${sent ? "text-accent" : "text-muted"}`}
              >
                {`{${t("close")}}`}
              </button>
            </div>
          </div>
        </>
      )}
    </dialog>
  );
}
