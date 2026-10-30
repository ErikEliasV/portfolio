import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { EXPERIENCE } from "../src/lib/experience.ts";

const load = (locale) =>
  JSON.parse(readFileSync(new URL(`../messages/${locale}.json`, import.meta.url), "utf8"));

test("experience starts with the GRAW freelance and keeps the older jobs", () => {
  assert.deepEqual(EXPERIENCE.map((job) => job.key), ["graw", "i9", "senac", "claro"]);
});

test("every job has role, company, date and description in both locales", () => {
  for (const locale of ["pt-BR", "en"]) {
    const m = load(locale).Experience;
    for (const { key } of EXPERIENCE) {
      for (const field of ["role", "company", "date", "desc"]) {
        assert.ok(m[`${key}_${field}`]?.trim(), `${locale} Experience.${key}_${field}`);
      }
    }
  }
});
