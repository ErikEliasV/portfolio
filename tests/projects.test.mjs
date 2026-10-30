import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { projects } from "../src/data/projects.ts";

const load = (locale) =>
  JSON.parse(readFileSync(new URL(`../messages/${locale}.json`, import.meta.url), "utf8"));
const LOCALES = { "pt-BR": load("pt-BR"), en: load("en") };

const bySlug = Object.fromEntries(projects.map((p) => [p.slug, p]));

test("each project has its dither color", () => {
  assert.equal(bySlug["bmw-website"].color, "#1d69d3");
  assert.equal(bySlug["kiresaile-website"].color, "#1b1be0");
  assert.equal(bySlug["ellefanning-website"].color, "#e07295");
  for (const p of projects) assert.match(p.color, /^#[0-9a-f]{6}$/);
});

test("elle fanning project points to its repo and live site", () => {
  const p = bySlug["ellefanning-website"];
  assert.equal(p.github, "https://github.com/ErikEliasV/ellefanning-portfolio");
  assert.equal(p.live, "https://erikeliasv.github.io/ellefanning-portfolio/");
  assert.equal(p.thumbnail, "/screenshot/ELLEFANNING_website/hero.mp4");
  assert.equal(p.screenshots.length, 5);
});

test("every project media file exists in public/", () => {
  for (const p of projects) {
    for (const src of [p.thumbnail, ...p.screenshots]) {
      assert.ok(existsSync(new URL(`../public${src}`, import.meta.url)), `${p.slug}: missing public${src}`);
    }
  }
});

test("every project has title and description in both locales", () => {
  for (const [locale, m] of Object.entries(LOCALES)) {
    for (const p of projects) {
      assert.ok(m.Projects[p.titleKey]?.trim(), `${locale} Projects.${p.titleKey}`);
      assert.ok(m.Projects[p.descKey]?.trim(), `${locale} Projects.${p.descKey}`);
    }
  }
});
