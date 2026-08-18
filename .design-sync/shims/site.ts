/**
 * Re-export of the repo's real site config, with the process shim loaded first.
 *
 * ES modules evaluate their dependencies in the order the import declarations
 * appear, so `./process-env` runs before `src/config/site.ts` touches
 * `process.env`. Nothing about the config's values is redefined here — the
 * brand identity, fares and benchmarks all come from the real file.
 *
 * The relative path below deliberately bypasses the "@/config/site" alias that
 * points at this shim, so there is no resolution cycle.
 */
import "./process-env";

export * from "../../src/config/site";
