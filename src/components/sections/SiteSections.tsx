import type { ComponentType } from "react";
import { SECTIONS, type SectionId } from "@/lib/sections";
import { ContactSection } from "./ContactSection";
import { EducationSection } from "./EducationSection";
import { ExperienceSection } from "./ExperienceSection";
import { ProjectsSection } from "./ProjectsSection";
import { SectionHeader } from "./SectionHeader";
import { SkillsSection } from "./SkillsSection";

const CONTENT: Record<SectionId, ComponentType> = {
  experience: ExperienceSection,
  skills: SkillsSection,
  education: EducationSection,
  projects: ProjectsSection,
  contact: ContactSection,
};

export function SiteSections() {
  return (
    <div>
      {SECTIONS.map((section) => {
        const Content = CONTENT[section.id];
        return (
          <section key={section.id} id={section.id} className="scroll-mt-20 px-6 pt-18 md:px-9">
            <div className="mx-auto max-w-[1200px]">
              <SectionHeader section={section} />
              <Content />
            </div>
          </section>
        );
      })}
    </div>
  );
}
