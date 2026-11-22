// CG-29 / MSG-046: the checksummed benchmark extracts must be exactly what the extraction tool wrote
// (no hand edits), and core values used by the growth scorecard must match the MPD2023 source.
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const dir = new URL('../docs/research/data/', import.meta.url);
const manifest = JSON.parse(readFileSync(new URL('CG29_DATA_MANIFEST.json', dir), 'utf8'));

describe('CG-29 benchmark data extracts', () => {
  it('every extract matches the SHA-256 recorded in the manifest', () => {
    const outputs = Object.entries(manifest.outputs) as [string, { sha256: string; rows: number }][];
    expect(outputs.length).toBeGreaterThanOrEqual(4);
    for (const [name, meta] of outputs) {
      const buf = readFileSync(new URL(name, dir));
      expect(createHash('sha256').update(buf).digest('hex'), name).toBe(meta.sha256);
      expect(buf.toString('utf8').trim().split('\n').length - 1, name).toBe(meta.rows);
    }
  });

  it('records source URL, licence and the publisher checksum of the MPD2023 workbook', () => {
    const mpd = manifest.inputs['mpd2023_web.xlsx'];
    expect(mpd.license).toBe('CC BY 4.0');
    expect(mpd.sha1).toBe(mpd.publisher_sha1);
    for (const input of Object.values(manifest.inputs) as { url: string; license: string }[]) {
      expect(input.url).toMatch(/^https:\/\//);
      expect(input.license.length).toBeGreaterThan(5);
    }
  });

  it('MPD2023 anchors used by the scorecard (UK 1836/1913, China 1850, India 1913)', () => {
    const rows = readFileSync(new URL('MPD2023_SUBSET_1820_2022.csv', dir), 'utf8').trim().split('\n').map((l) => l.split(','));
    const get = (c: string, y: number) => Number(rows.find((r) => r[0] === c && Number(r[3]) === y)![4]);
    expect(get('GBR', 1836)).toBe(3937);
    expect(get('GBR', 1913)).toBe(8212);
    expect(get('CHN', 1850)).toBe(858);
    expect(get('IND', 1913)).toBe(1073);
  });
});
