// S0-B3 audit harness configuration (not product code). Loads the audited checkout's own vitest.config.ts unchanged
// (path from S0_BASE_CONFIG) and only adds the assertion-counter setup file next to this config, so the unmodified
// test suite runs exactly as configured by the project, with one observer hook.
// Usage (from the audited checkout):
//   S0_BASE_CONFIG=$PWD/vitest.config.ts S0_ASSERTION_LOG=/tmp/out.jsonl \
//     npx vitest run --config <repo>/tools/audit/s0/vitest.assertion-count.config.ts
import { mergeConfig } from 'vitest/config';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));

export default async () => {
  const basePath = process.env.S0_BASE_CONFIG;
  if (!basePath) throw new Error('S0_BASE_CONFIG must point to the audited checkout vitest.config.ts');
  const base = (await import(pathToFileURL(basePath).href)).default;
  return mergeConfig(base, {
    root: dirname(basePath),
    test: { setupFiles: [join(here, 'vitest-assertion-counter.setup.ts')] },
  });
};
