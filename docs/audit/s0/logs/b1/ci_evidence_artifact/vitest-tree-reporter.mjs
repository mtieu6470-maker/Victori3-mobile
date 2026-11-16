import fs from 'node:fs/promises';
import { getSuites, getTests } from '@vitest/runner/utils';

const VALID_STATES = new Set(['run', 'skip', 'only', 'todo', 'pass', 'fail']);
const STATUS_MAP = {
  fail: 'failed', only: 'pending', pass: 'passed',
  run: 'pending', skip: 'skipped', todo: 'todo',
};

export default class VitestTaskTreeReporter {
  onInit(ctx) { this.ctx = ctx; }

  async onFinished(files = this.ctx.state.getFiles(), errors = []) {
    const suites = getSuites(files);
    const tests = getTests(files);
    const invalid = [];
    const checkTask = (task, where) => {
      if (!VALID_STATES.has(task.mode)) invalid.push(`${where}.mode=${JSON.stringify(task.mode)}`);
      if (task.result && !VALID_STATES.has(task.result.state)) {
        invalid.push(`${where}.result.state=${JSON.stringify(task.result.state)}`);
      }
    };

    suites.forEach((task, i) => {
      checkTask(task, `suite[${i}]`);
      if (task.mode === 'only' || task.result?.state === 'only') {
        invalid.push(`suite[${i}] uses unsupported focused-only state`);
      }
    });
    tests.forEach((task, i) => {
      checkTask(task, `test[${i}]`);
      // Vitest 2.1.9's JSON reporter maps "only" to pending in assertion detail,
      // but its aggregate numPendingTests calculation does not count state="only".
      // Reject this edge case rather than accepting inconsistent summaries.
      if (task.mode === 'only' || task.result?.state === 'only') {
        invalid.push(`test[${i}] uses unsupported focused-only state`);
      }
    });

    const numTotalTestSuites = suites.length;
    const numFailedTestSuites = suites.filter(s => s.result?.state === 'fail').length;
    const numPendingTestSuites = suites.filter(
      s => s.result?.state === 'run' || s.mode === 'todo',
    ).length;
    const numPassedTestSuites = numTotalTestSuites - numFailedTestSuites - numPendingTestSuites;
    const numTotalTests = tests.length;
    const numFailedTests = tests.filter(t => t.result?.state === 'fail').length;
    const numPassedTests = tests.filter(t => t.result?.state === 'pass').length;
    const numPendingTests = tests.filter(
      t => t.result?.state === 'run' || t.mode === 'skip' || t.result?.state === 'skip',
    ).length;
    const numTodoTests = tests.filter(t => t.mode === 'todo').length;

    const treeFiles = files.map((file, i) => {
      const fileTests = getTests([file]);
      const hasFailedTests = fileTests.some(t => t.result?.state === 'fail');
      const status = file.result?.state === 'fail' || hasFailedTests ? 'failed' : 'passed';
      const assertions = fileTests.map((test, j) => {
        const state = test.result?.state || test.mode;
        if (!Object.prototype.hasOwnProperty.call(STATUS_MAP, state)) {
          invalid.push(`file[${i}].test[${j}] status=${JSON.stringify(state)}`);
        }
        return { title: test.name, status: STATUS_MAP[state] || null };
      });
      return { name: file.filepath, status, assertions };
    });

    const report = {
      schema: 'vitest-2.1.9-task-tree-v1',
      fileCount: files.length,
      counters: {
        numTotalTestSuites, numPassedTestSuites, numFailedTestSuites, numPendingTestSuites,
        numTotalTests, numPassedTests, numFailedTests, numPendingTests, numTodoTests,
      },
      unhandledErrorCount: Array.isArray(errors) ? errors.length : null,
      invalidStates: invalid,
      files: treeFiles,
    };

    const output = process.env.VITEST_TREE_REPORT;
    if (!output) throw new Error('VITEST_TREE_REPORT is not set');
    await fs.writeFile(output, JSON.stringify(report, null, 2) + '\n', 'utf8');
  }
}
