import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { SECTIONS } from "../src/lib/sections.ts";

const load = (locale) =>
  JSON.parse(readFileSync(new URL(`../messages/${locale}.json`, import.meta.url), "utf8"));

const LOCALES = { "pt-BR": load("pt-BR"), en: load("en") };

const isFilled = (value) => typeof value === "string" && value.trim().length > 0;

test("sections follow the spec order", () => {
  assert.deepEqual(SECTIONS.map((s) => s.id), ["experience", "skills", "education", "projects", "contact"]);
  assert.deepEqual(SECTIONS.map((s) => s.number), ["01", "02", "03", "04", "05"]);
  assert.deepEqual(SECTIONS.map((s) => s.command), [
    "whoami --history", "system_info --tools", "cat education.txt", "ls ~/projects --showcase", "contact --links",
  ]);
});

test("every section has nav, title, label and blurb in both locales", () => {
  for (const [locale, m] of Object.entries(LOCALES)) {
    for (const { id } of SECTIONS) {
      assert.ok(isFilled(m.Nav?.[id]), `${locale} Nav.${id}`);
      for (const field of ["title", "label", "blurb"]) {
        assert.ok(isFilled(m.Sections?.[id]?.[field]), `${locale} Sections.${id}.${field}`);
      }
    }
    assert.ok(isFilled(m.Nav?.about), `${locale} Nav.about`);
    for (const group of ["frontend", "backend", "tools"]) {
      assert.ok(isFilled(m.Sections?.skills?.[group]), `${locale} Sections.skills.${group}`);
    }
    assert.ok(isFilled(m.Sections?.contact?.eof), `${locale} Sections.contact.eof`);
    assert.ok(isFilled(m.HeroCards?.experience), `${locale} HeroCards.experience`);
    assert.ok(isFilled(m.HeroCards?.skills), `${locale} HeroCards.skills`);
    assert.ok(isFilled(m.Hero?.boot_ready), `${locale} Hero.boot_ready`);
  }
});
