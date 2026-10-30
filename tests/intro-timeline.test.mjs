import { test } from "node:test";
import assert from "node:assert/strict";
import { getIntroState } from "../src/lib/intro/timeline.ts";

const DESKTOP = { width: 1440, height: 900 };
const MOBILE = { width: 390, height: 844 };

function assertClose(actual, expected, label = "") {
  for (const [key, value] of Object.entries(expected)) {
    assert.ok(Math.abs(actual[key] - value) < 1e-6, `${label}${key}: ${actual[key]} != ${value}`);
  }
}

test("p=0 desktop", () => {
  const s = getIntroState(0, DESKTOP, false);
  assert.equal(s.heroOpacity, 1);
  assert.equal(s.typedLines, 1);
  assertClose(s.terminal, { top: 342, right: 86.4, bottom: 270, left: 864, radius: 12 }, "terminal.");
  assert.equal(s.browserBar, 0);
  assert.equal(s.planet.opacity, 1);
});

test("p=0.55 desktop", () => {
  const s = getIntroState(0.55, DESKTOP, false);
  assert.equal(s.typedLines, 8);
  assertClose(s.terminal, { top: 162, right: 230.4, bottom: 162, left: 230.4 }, "terminal.");
});

test("p=0.85", () => {
  const s = getIntroState(0.85, DESKTOP, false);
  assertClose(s.terminal, { top: 0, right: 0, bottom: 0, left: 0, radius: 0 }, "terminal.");
});

test("p=1", () => {
  const s = getIntroState(1, DESKTOP, false);
  assert.equal(s.browserBar, 1);
  assert.equal(s.done, true);
  assert.equal(s.heroOpacity, 0);
  assert.equal(s.planet.opacity, 0);
});

test("mobile p=0.55", () => {
  assert.equal(getIntroState(0.55, MOBILE, true).typedLines, 4);
});

test("clamps", () => {
  assert.deepEqual(getIntroState(-1, DESKTOP, false), getIntroState(0, DESKTOP, false));
  assert.deepEqual(getIntroState(2, DESKTOP, false), getIntroState(1, DESKTOP, false));
});

test("scales with viewport", () => {
  for (const p of [0, 0.3, 0.5, 0.7]) {
    const full = getIntroState(p, DESKTOP, false).terminal;
    const half = getIntroState(p, { width: 720, height: 450 }, false).terminal;
    for (const key of ["top", "right", "bottom", "left"]) {
      assert.ok(Math.abs(half[key] - full[key] / 2) < 1e-9, `p=${p} ${key}`);
    }
  }
});

test("planet path desktop", () => {
  assertClose(getIntroState(0, DESKTOP, false).planet, { x: 0.72, y: 0.42, radius: 0.55, opacity: 1 });
  assertClose(getIntroState(0.6, DESKTOP, false).planet, { x: 0.5, y: -0.1, radius: 0.2, opacity: 0 });
  assertClose(getIntroState(0, MOBILE, true).planet, { x: 0.5, y: 0.3, radius: 0.4, opacity: 1 });
});
