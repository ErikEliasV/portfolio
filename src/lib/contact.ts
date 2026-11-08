// Formulário de contato. O site é estático (GitHub Pages), então quem entrega a mensagem
// no email é o Web3Forms. A chave é pública por design: só permite enviar para o email
// cadastrado nela, então pode ficar no front-end.
export const CONTACT_EMAIL = "erik100.eliasv@gmail.com";
export const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";
export const WEB3FORMS_KEY = "0b78b94e-6bb4-467e-9b62-d266ce27325d";

export const CONTACT_KINDS = ["job", "project", "other"] as const;
export type ContactKind = (typeof CONTACT_KINDS)[number];

// Etiqueta no assunto do email (sempre em português: quem lê é o Erik), para filtrar no Gmail
const SUBJECT_TAG: Record<ContactKind, string> = { job: "Vaga", project: "Projeto", other: "Contato" };

export interface ContactFields {
  kind: ContactKind;
  name: string;
  email: string;
  company: string;
  message: string;
  botcheck: boolean; // campo invisível: só robô marca
}

export type ContactField = "name" | "email" | "message";

export type SendResult = { ok: true } | { ok: false; reason: "rejected" | "network" };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Campos com problema, na ordem em que aparecem no formulário
export function validateContact(fields: ContactFields): ContactField[] {
  const errors: ContactField[] = [];
  if (!fields.name.trim()) errors.push("name");
  if (!EMAIL_PATTERN.test(fields.email.trim())) errors.push("email");
  if (!fields.message.trim()) errors.push("message");
  return errors;
}

export function buildSubmission(fields: ContactFields, locale: string) {
  const name = fields.name.trim();
  const company = fields.company.trim();
  return {
    access_key: WEB3FORMS_KEY,
    subject: `[${SUBJECT_TAG[fields.kind]}] ${name}`,
    from_name: "Portfólio Erik Elias",
    name,
    email: fields.email.trim(), // o Web3Forms usa como "responder para"
    ...(company && { company }),
    message: fields.message.trim(),
    idioma: locale, // em que idioma a pessoa estava lendo o site
    botcheck: fields.botcheck,
  };
}

export async function sendContact(
  fields: ContactFields,
  locale: string,
  fetchImpl: typeof fetch = fetch,
): Promise<SendResult> {
  // Robô: finge que deu certo e não envia nada
  if (fields.botcheck) return { ok: true };
  try {
    const response = await fetchImpl(WEB3FORMS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(buildSubmission(fields, locale)),
    });
    const data = (await response.json().catch(() => null)) as { success?: boolean } | null;
    return response.ok && data?.success ? { ok: true } : { ok: false, reason: "rejected" };
  } catch {
    return { ok: false, reason: "network" };
  }
}
