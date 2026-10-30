import { test } from "node:test";
import assert from "node:assert/strict";
import { localeFromPath, stripBasePath } from "../src/lib/locale-from-path.ts";

test("localeFromPath reads the locale after the base path", () => {
  assert.equal(localeFromPath("/portfolio/en/projects/xyz", "/portfolio"), "en");
  assert.equal(localeFromPath("/portfolio/pt-BR/nada", "/portfolio"), "pt-BR");
  assert.equal(localeFromPath("/en", ""), "en");
});

test("localeFromPath falls back to pt-BR", () => {
  assert.equal(localeFromPath("/portfolio/xyz", "/portfolio"), "pt-BR");
  assert.equal(localeFromPath("/portfolio", "/portfolio"), "pt-BR");
  assert.equal(localeFromPath("/portfolio/english", "/portfolio"), "pt-BR");
});

test("stripBasePath keeps the path the visitor typed", () => {
  assert.equal(stripBasePath("/portfolio/en/xyz", "/portfolio"), "/en/xyz");
  assert.equal(stripBasePath("/portfolio", "/portfolio"), "/");
  assert.equal(stripBasePath("/other", "/portfolio"), "/other");
});
