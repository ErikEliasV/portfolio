import { test } from "node:test";
import assert from "node:assert/strict";
import { bayerThresholds } from "../src/lib/dither/bayer.ts";
import { hexToRgb01, PLANET_PALETTE, WAVE_PALETTE } from "../src/lib/dither/palette.ts";
import { shouldRenderFrame } from "../src/lib/frame-throttle.ts";

const ranks = () => bayerThresholds().map((v) => Math.round(v * 64 - 0.5));

test("bayer has 64 unique ranks", () => {
  const sorted = ranks().sort((a, b) => a - b);
  assert.deepEqual(sorted, Array.from({ length: 64 }, (_, i) => i));
});

test("bayer first row", () => {
  assert.deepEqual(ranks().slice(0, 8), [0, 32, 8, 40, 2, 34, 10, 42]);
});

test("hexToRgb01", () => {
  const [r, g, b] = hexToRgb01("#b5f562");
  const expected = [181 / 255, 245 / 255, 98 / 255];
  for (const [i, v] of [r, g, b].entries()) assert.ok(Math.abs(v - expected[i]) < 1e-9);
  assert.throws(() => hexToRgb01("#zzz"));
});

test("palettes", () => {
  assert.deepEqual([...WAVE_PALETTE], ["#0d0d0d", "#151d0e", "#34501b", "#b5f562"]);
  assert.deepEqual(Object.keys(PLANET_PALETTE), [
    "oceanDeep", "oceanMid", "shallows", "landDark", "landMid", "landLight", "cloud", "rim",
  ]);
  for (const hex of Object.values(PLANET_PALETTE)) assert.doesNotThrow(() => hexToRgb01(hex));
});

test("frame throttle", () => {
  assert.equal(shouldRenderFrame(1000, 966, 30), true);
  assert.equal(shouldRenderFrame(1000, 990, 30), false);
  assert.equal(shouldRenderFrame(1000, 983.3, 60), true);
});

test("mixHex blends two colors", async () => {
  const { mixHex } = await import("../src/lib/dither/palette.ts");
  assert.equal(mixHex("#000000", "#ffffff", 0.5), "#808080");
  assert.equal(mixHex("#0d0d0d", "#1d69d3", 0), "#0d0d0d");
  assert.equal(mixHex("#0d0d0d", "#1d69d3", 1), "#1d69d3");
});

test("wavePalette tints the waves with a project color", async () => {
  const { wavePalette, mixHex } = await import("../src/lib/dither/palette.ts");
  const pal = wavePalette("#E07295");
  assert.deepEqual(pal, ["#0d0d0d", mixHex("#0d0d0d", "#e07295", 0.12), mixHex("#0d0d0d", "#e07295", 0.34), "#e07295"]);
});
