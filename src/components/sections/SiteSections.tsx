import type { ComponentType } from "react";
import { SECTIONS, type SectionId } from "@/lib/sections";
import { EducationSection } from "./EducationSection";
import { ExperienceSection } from "./ExperienceSection";
import { SectionHeader } from "./SectionHeader";
import { SkillsSection } from "./SkillsSection";

const CONTENT: Partial<Record<SectionId, ComponentType>> = {
  experience: ExperienceSection,
  skills: SkillsSection,
  education: EducationSection,
};

export function SiteSections() {
  return (
    <div className="pb-10">
      {SECTIONS.map((section) => {
        const Content = CONTENT[section.id];
        if (!Content) return null;
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
