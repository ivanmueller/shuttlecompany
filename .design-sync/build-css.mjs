#!/usr/bin/env node
/**
 * Compiles the repo's Tailwind v4 stylesheet into the static CSS the design
 * system ships. `cfg.cssEntry` points at the output.
 *
 * Run this before every `package-build.mjs` run — it is recorded as
 * `buildCmd` in .design-sync/config.json for exactly that reason. Authored
 * previews are scanned as sources (see tailwind-entry.css), so a preview that
 * introduces a new utility class only gets that class after a re-run.
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, statSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const repo = resolve(here, "..");
const input = resolve(here, "tailwind-entry.css");
const output = resolve(here, ".cache/styles.compiled.css");
const cli = resolve(repo, ".ds-sync/node_modules/@tailwindcss/cli/dist/index.mjs");

mkdirSync(dirname(output), { recursive: true });
execFileSync(process.execPath, [cli, "-i", input, "-o", output, "--cwd", repo], {
  stdio: "inherit",
});

const { size } = statSync(output);
console.log(`[css] ${output} — ${(size / 1024).toFixed(1)} KB`);
if (size < 5_000) {
  console.error("[css] output looks too small — check the @source globs in tailwind-entry.css");
  process.exit(1);
}
