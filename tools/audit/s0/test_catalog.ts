// S0-B3 audit tool (not product code). Builds the test catalog of an audited checkout:
//  - static structure of every describe/it call (file, line, describe path, title or title template) via the
//    TypeScript compiler API, without executing the tests;
//  - runtime results from a Vitest JSON report (status, duration) and from the assertion-count log written by
//    vitest-assertion-counter.setup.ts (assertions actually executed per test);
//  - stability evidence from earlier full runs (lists of passed test names);
//  - the auditor's per-test analysis from an annotations JSON keyed by "file:line".
// Usage: npx tsx tools/audit/s0/test_catalog.ts --base <checkout> --vitest-json <f> --assertions <f>
//          --annotations <f> --runs <name=listfile>... --out <s0_test_catalog.json>
import ts from 'typescript';
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';

const args = process.argv.slice(2);
const opt = (k: string) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : undefined; };
const multi = (k: string) => args.flatMap((a, i) => (a === k ? [args[i + 1]] : []));
const base = opt('--base')!, vitestJson = opt('--vitest-json')!, assertionsLog = opt('--assertions')!;
const annotationsFile = opt('--annotations')!, out = opt('--out')!;
if (!base || !vitestJson || !assertionsLog || !annotationsFile || !out) throw new Error('missing arguments');

interface StaticTest { file: string; line: number; describePath: string[]; titleTemplate: string; titleRegex: string; dynamic: boolean }

function titleOf(node: ts.Expression, sf: ts.SourceFile): { text: string; dynamic: boolean } {
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return { text: node.text, dynamic: false };
  if (ts.isTemplateExpression(node)) {
    let text = node.head.text;
    for (const span of node.templateSpans) text += '${' + span.expression.getText(sf) + '}' + span.literal.text;
    return { text, dynamic: true };
  }
  return { text: node.getText(sf), dynamic: true };
}
const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
function templateRegex(t: string): string {
  return '^' + t.split(/\$\{[^}]*\}/).map(esc).join('.+?') + '$';
}

const statics: StaticTest[] = [];
const testDir = join(base, 'tests');
for (const f of readdirSync(testDir).filter((x) => x.endsWith('.test.ts')).sort()) {
  const path = join(testDir, f);
  const sf = ts.createSourceFile(path, readFileSync(path, 'utf8'), ts.ScriptTarget.Latest, true);
  const visit = (node: ts.Node, stack: string[]) => {
    if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && ['describe', 'it', 'test'].includes(node.expression.text) && node.arguments.length >= 2) {
      const t = titleOf(node.arguments[0], sf);
      const line = sf.getLineAndCharacterOfPosition(node.getStart(sf)).line + 1;
      if (node.expression.text === 'describe') { ts.forEachChild(node, (c) => visit(c, [...stack, t.text])); return; }
      statics.push({ file: relative(base, path), line, describePath: stack, titleTemplate: t.text, titleRegex: templateRegex(t.text), dynamic: t.dynamic });
    }
    ts.forEachChild(node, (c) => visit(c, stack));
  };
  visit(sf, []);
}

const report = JSON.parse(readFileSync(vitestJson, 'utf8'));
const counts = readFileSync(assertionsLog, 'utf8').trim().split('\n').map((l) => JSON.parse(l));
const annotations: Record<string, Record<string, unknown>> = JSON.parse(readFileSync(annotationsFile, 'utf8'));
const runs = multi('--runs').map((spec) => {
  const [name, file] = spec.split('=');
  // Verbose-reporter lines "✓ <file> > <suite> > <title> [123ms]", optionally prefixed by a GitHub Actions timestamp.
  const names = new Set(readFileSync(file, 'utf8').split('\n')
    .map((l) => l.replace(/\x1b\[[0-9;]*m/g, '').replace(/^﻿?\d{4}-\d{2}-\d{2}T[\d:.]+Z\s?/, '').trim())
    .filter((l) => l.startsWith('✓')).map((l) => l.replace(/^✓\s+/, '').replace(/\s+\d+ms$/, '')));
  return { name, names };
});

const rows: Record<string, unknown>[] = [];
const unmatched: string[] = [];
for (const fileRes of report.testResults) {
  const file = relative(base, fileRes.name);
  for (const a of fileRes.assertionResults) {
    const desc: string[] = a.ancestorTitles;
    const cands = statics.filter((s) => s.file === file && new RegExp(s.titleRegex).test(a.title)
      && s.describePath.length === desc.length && s.describePath.every((d, i) => new RegExp(templateRegex(d)).test(desc[i])));
    if (cands.length !== 1) unmatched.push(`${file} > ${desc.join(' > ')} > ${a.title} (${cands.length} static candidates)`);
    const s = cands[0];
    const cnt = counts.find((c) => c.file === file && c.title === a.title && JSON.stringify(c.suite) === JSON.stringify(desc));
    const fullName = `${file} > ${[...desc, a.title].join(' > ')}`;
    const stability = runs.map((r) => ({ run: r.name, passed: r.names.has(fullName) }));
    rows.push({
      id: `${file}:${s?.line ?? '?'}${s?.dynamic ? ' [' + a.title.split(':')[0] + ']' : ''}`,
      file, line: s?.line ?? null, describe: desc, title: a.title, title_template: s?.titleTemplate ?? null,
      status_in_catalog_run: a.status, duration_ms_in_catalog_run: a.duration ?? null,
      assertions_executed_in_catalog_run: cnt ? cnt.assertionCalls : null,
      stability: { runs: stability.length, passed: stability.filter((x) => x.passed).length, detail: stability },
      ...(s ? annotations[`${s.file}:${s.line}`] ?? { analysis_missing: true } : { analysis_missing: true }),
    });
  }
}
const missingAnalysis = rows.filter((r) => r.analysis_missing).map((r) => r.id);
writeFileSync(out, JSON.stringify({
  schema: 's0-test-catalog-v1',
  audited_checkout: base.replace(/.*\//, '<checkout>/'),
  static_call_sites: statics.length,
  runtime_tests: rows.length,
  unmatched_runtime_tests: unmatched,
  tests_without_analysis: missingAnalysis,
  tests: rows,
}, null, 2) + '\n');
console.log(`static it/test call sites: ${statics.length}; runtime tests: ${rows.length}; unmatched: ${unmatched.length}; without analysis: ${missingAnalysis.length}`);
for (const s of statics) console.log(`${s.file}:${s.line}\t${s.describePath.join(' > ')} > ${s.titleTemplate}`);
