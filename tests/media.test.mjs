import { test } from "node:test";
import assert from "node:assert/strict";
import { isVideo } from "../src/lib/media.ts";

test("isVideo detects video files by extension", () => {
  assert.equal(isVideo("/screenshot/ELLEFANNING_website/hero.mp4"), true);
  assert.equal(isVideo("/clip.WEBM"), true);
  assert.equal(isVideo("/screenshot/BMW_website/hero.png"), false);
  assert.equal(isVideo("/movie.mp4.png"), false);
});
