import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const load = (locale) =>
  JSON.parse(readFileSync(new URL(`../messages/${locale}.json`, import.meta.url), "utf8"));

const ptBR = load("pt-BR");
const en = load("en");

function flatten(obj, prefix = "") {
  return Object.entries(obj).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return value !== null && typeof value === "object" ? flatten(value, path) : [[path, value]];
  });
}

const keys = (messages) => flatten(messages).map(([path]) => path);

test("locales have identical key sets", () => {
  assert.deepEqual(keys(ptBR).sort(), keys(en).sort());
});

test("no empty strings", () => {
  for (const [locale, messages] of [["pt-BR", ptBR], ["en", en]]) {
    for (const [path, value] of flatten(messages)) {
      assert.equal(typeof value, "string", `${locale} ${path} is not a string`);
      assert.ok(value.trim().length > 0, `${locale} ${path} is empty`);
    }
  }
});
