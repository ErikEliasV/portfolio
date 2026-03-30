import { projects } from "@/data/projects";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { ProjectDetailClient } from "./ProjectDetailClient";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  setRequestLocale(locale);

  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  return <ProjectDetailClient project={project} />;
}
