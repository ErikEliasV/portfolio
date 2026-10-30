export interface Project {
  slug: string;
  titleKey: string;
  descKey: string;
  color: string; // cor do dither de fundo na página do projeto
  thumbnail: string;
  screenshots: string[]; // imagens ou vídeos (.mp4)
  tech: string[];
  github?: string;
  live?: string;
}

export const projects: Project[] = [
  {
    slug: "ellefanning-website",
    titleKey: "ellefanning_title",
    descKey: "ellefanning_desc",
    color: "#e07295",
    thumbnail: "/screenshot/ELLEFANNING_website/hero.mp4",
    screenshots: [
      "/screenshot/ELLEFANNING_website/hero.mp4",
      "/screenshot/ELLEFANNING_website/filmography.mp4",
      "/screenshot/ELLEFANNING_website/characters.mp4",
      "/screenshot/ELLEFANNING_website/editorial.mp4",
      "/screenshot/ELLEFANNING_website/now.mp4",
    ],
    tech: ["Next.js 16", "TypeScript", "Three.js", "WebGL / GLSL", "GSAP", "Lenis", "Tailwind CSS 4", "Web Audio API"],
    github: "https://github.com/ErikEliasV/ellefanning-portfolio",
    live: "https://erikeliasv.github.io/ellefanning-portfolio/",
  },
  {
    slug: "kiresaile-website",
    titleKey: "kiresaile_title",
    descKey: "kiresaile_desc",
    color: "#1b1be0",
    thumbnail: "/screenshot/KIRESAILE_website/hero.png",
    screenshots: [
      "/screenshot/KIRESAILE_website/hero.png",
      "/screenshot/KIRESAILE_website/fabric-shader.png",
      "/screenshot/KIRESAILE_website/collection-wall.png",
      "/screenshot/KIRESAILE_website/brand-story.png",
      "/screenshot/KIRESAILE_website/collection-page.png",
      "/screenshot/KIRESAILE_website/product-page.png",
      "/screenshot/KIRESAILE_website/cart-drawer.png",
      "/screenshot/KIRESAILE_website/footer.png",
    ],
    tech: ["Next.js 16", "TypeScript", "Tailwind CSS 4", "WebGL / GLSL"],
    github: "https://github.com/ErikEliasV/KIRESAILE",
    live: "https://erikeliasv.github.io/KIRESAILE/",
  },
  {
    slug: "bmw-website",
    titleKey: "bmw_title",
    descKey: "bmw_desc",
    color: "#1d69d3",
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
