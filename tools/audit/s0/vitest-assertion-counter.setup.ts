// S0-B3 audit harness (not product code, not a test): a Vitest setup file passed on the command line
// (`--setupFiles <this file>`) to observe, for every test of the unmodified suite, how many `expect` assertions
// actually executed and how the test ended. Used by the test catalog to detect tests that can pass without
// asserting anything ("empty pass"). It writes one JSON line per test to the file named by S0_ASSERTION_LOG.
import { afterEach, expect } from 'vitest';
import { appendFileSync } from 'node:fs';
import { relative } from 'node:path';

const out = process.env.S0_ASSERTION_LOG;

afterEach((ctx) => {
  if (!out) return;
  const task = ctx.task;
  const suitePath: string[] = [];
  for (let s = task.suite; s; s = s.suite) if (s.name) suitePath.unshift(s.name);
  const state = expect.getState();
  const file = task.file?.filepath ? relative(process.cwd(), task.file.filepath) : null;
  appendFileSync(out, JSON.stringify({
    file,
    suite: suitePath.filter((n) => n !== file),
    title: task.name,
    assertionCalls: state.assertionCalls,
    expectedAssertionsNumber: state.expectedAssertionsNumber ?? null,
    isExpectingAssertions: state.isExpectingAssertions ?? false,
  }) + '\n');
});
