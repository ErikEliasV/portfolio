"use client";

import { useRef, useState, type FormEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import { twMerge } from "tailwind-merge";
import {
  CONTACT_KINDS,
  sendContact,
  validateContact,
  type ContactField,
  type ContactFields,
  type ContactKind,
} from "@/lib/contact";
import { ContactResultDialog, type ContactResult } from "./ContactResultDialog";

type Status = { state: "idle" | "sending" } | ({ state: "result" } & { result: ContactResult });

const LABEL = "mb-1.5 block text-[10px] uppercase tracking-[0.12em] text-muted";
const INPUT =
  "w-full rounded-none border border-line bg-ink px-3 py-2.5 text-[13px] text-fg outline-none transition-colors placeholder:text-muted/70 focus:border-accent aria-invalid:border-[#ff8a7a]";
const ERROR = "mt-1.5 text-[11px] text-[#ff8a7a]";

export function ContactForm() {
  const t = useTranslations("Sections.contact.form");
  const locale = useLocale();
  const formRef = useRef<HTMLFormElement>(null);
  const [kind, setKind] = useState<ContactKind>("job");
  const [errors, setErrors] = useState<ContactField[]>([]);
  const [status, setStatus] = useState<Status>({ state: "idle" });

  const read = (form: HTMLFormElement): ContactFields => {
    const data = new FormData(form);
    const text = (key: string) => String(data.get(key) ?? "");
    return {
      kind,
      name: text("name"),
      email: text("email"),
      company: text("company"),
      message: text("message"),
      botcheck: data.has("botcheck"),
    };
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status.state === "sending") return;
    const form = event.currentTarget;
    const fields = read(form);
    const invalid = validateContact(fields);
    setErrors(invalid);
    if (invalid.length) {
      form.querySelector<HTMLElement>(`[name="${invalid[0]}"]`)?.focus();
      return;
    }
    setStatus({ state: "sending" });
    const sent = await sendContact(fields, locale);
    if (sent.ok) formRef.current?.reset(); // no erro, o que a pessoa escreveu fica
    setStatus({
      state: "result",
      result: sent.ok
        ? { type: "sent", name: fields.name.trim().split(/\s+/)[0] }
        : { type: "failed", reason: sent.reason },
    });
  };

  // Fechar o modal volta ao normal, sem atropelar um reenvio já em andamento
  const closeResult = () => setStatus((s) => (s.state === "result" ? { state: "idle" } : s));
  const retry = () => formRef.current?.requestSubmit();

  // Ao corrigir um campo, o aviso dele some
  const clearError = (field: ContactField) => setErrors((list) => list.filter((f) => f !== field));

  const field = (name: ContactField) => ({
    name,
    id: `contact-${name}`,
    "aria-invalid": errors.includes(name) || undefined,
    "aria-describedby": errors.includes(name) ? `contact-${name}-error` : undefined,
    onInput: () => clearError(name),
  });

  const errorFor = (name: ContactField) =>
    errors.includes(name) && (
      <p id={`contact-${name}-error`} className={ERROR}>
        {t(`errors.${name}`)}
      </p>
    );

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="border border-line bg-panel/95 p-5 md:p-6">
      <fieldset>
        <legend className={LABEL}>{t("kind")}</legend>
        <div className="flex flex-wrap gap-2">
          {CONTACT_KINDS.map((k) => (
            <label key={k} className="cursor-pointer">
              <input
                type="radio"
                name="kind"
                value={k}
                checked={kind === k}
                onChange={() => setKind(k)}
                className="peer sr-only"
              />
              <span className="block border border-line bg-ink px-3 py-2 text-[11px] uppercase tracking-[0.08em] text-copy transition-colors hover:border-accent-dim peer-checked:border-accent peer-checked:text-accent peer-focus-visible:outline peer-focus-visible:outline-1 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent">
                {t(`kinds.${k}`)}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className={LABEL}>
            {t("name")}
          </label>
          <input {...field("name")} type="text" autoComplete="name" placeholder={t("namePlaceholder")} className={INPUT} />
          {errorFor("name")}
        </div>
        <div>
          <label htmlFor="contact-email" className={LABEL}>
            {t("email")}
          </label>
          <input
            {...field("email")}
            type="email"
            autoComplete="email"
            placeholder={t("emailPlaceholder")}
            className={INPUT}
          />
          {errorFor("email")}
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor="contact-company" className={LABEL}>
          {t("company")}
        </label>
        <input
          id="contact-company"
          name="company"
          type="text"
          autoComplete="organization"
          placeholder={t(`companyHint.${kind}`)}
          className={INPUT}
        />
      </div>

      <div className="mt-4">
        <label htmlFor="contact-message" className={LABEL}>
          {t("message")}
        </label>
        <textarea
          {...field("message")}
          rows={5}
          placeholder={t(`messageHint.${kind}`)}
          className={twMerge(INPUT, "min-h-28 resize-y")}
        />
        {errorFor("message")}
      </div>

      {/* Armadilha para robôs: invisível e fora do Tab */}
      <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

      <button
        type="submit"
        disabled={status.state === "sending"}
        className="mt-5 font-pixel text-[clamp(18px,1.9vw,24px)] uppercase text-accent transition-opacity hover:underline disabled:cursor-wait disabled:opacity-60"
      >
        {status.state === "sending" ? t("sending") : `{${t("send")}}`}
      </button>

      <ContactResultDialog
        result={status.state === "result" ? status.result : null}
        onClose={closeResult}
        onRetry={retry}
      />
    </form>
  );
}
