export interface Project {
  slug: string;
  titleKey: string;
  descKey: string;
  thumbnail: string;
  screenshots: string[];
  tech: string[];
  github?: string;
  live?: string;
}

export const projects: Project[] = [
  {
    slug: "bmw-website",
    titleKey: "bmw_title",
    descKey: "bmw_desc",
    thumbnail: "/screenshot/BMW_website/hero-preview.png",
    screenshots: [
      "/screenshot/BMW_website/hero.png",
      "/screenshot/BMW_website/features.png",
      "/screenshot/BMW_website/design.png",
      "/screenshot/BMW_website/interior.png",
      "/screenshot/BMW_website/color-selector.png",
      "/screenshot/BMW_website/stats.png",
      "/screenshot/BMW_website/faq.png",
    ],
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
    github: "https://github.com/ErikEliasV/bmw-x6-landing",
    live: "https://erikeliasv.github.io/bmw-x6-landing/",
  },
];
