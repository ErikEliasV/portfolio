export type SectionId = "experience" | "skills" | "education" | "projects" | "contact";

export interface SectionMeta {
  id: SectionId;
  number: string;
  command: string; // enfeite: linha de terminal acima do título
}

export const SECTIONS: readonly SectionMeta[] = [
  { id: "experience", number: "01", command: "whoami --history" },
  { id: "skills", number: "02", command: "system_info --tools" },
  { id: "education", number: "03", command: "cat education.txt" },
  { id: "projects", number: "04", command: "ls ~/projects --showcase" },
  { id: "contact", number: "05", command: "contact --links" },
];
