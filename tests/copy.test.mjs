import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

// Guarda do humanizer: nenhum travessão (— ou –) nos textos do site
const load = (locale) =>
  JSON.parse(readFileSync(new URL(`../messages/${locale}.json`, import.meta.url), "utf8"));

function leaves(obj, prefix = "") {
  return Object.entries(obj).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return typeof value === "object" ? leaves(value, path) : [[path, value]];
  });
}

test("site copy has no em or en dashes", () => {
  for (const locale of ["pt-BR", "en"]) {
    for (const [path, value] of leaves(load(locale))) {
      assert.doesNotMatch(value, /[—–]/, `${locale} ${path}: ${value}`);
    }
  }
});

test("there is a not-found page copy in both locales", () => {
  for (const locale of ["pt-BR", "en"]) {
    const m = load(locale).NotFound;
    for (const key of ["title", "message", "cta"]) assert.ok(m?.[key]?.trim(), `${locale} NotFound.${key}`);
  }
});
