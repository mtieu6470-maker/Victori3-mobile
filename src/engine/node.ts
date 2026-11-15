// Node loader for the headless engine (tests, CLI, reports).
import fs from 'node:fs';
import path from 'node:path';
import { HistoricalData, setData, type MapTopology } from './data/db';
import type { HistoricalDB } from './data/dbTypes';

let loaded: HistoricalData | null = null;
export function loadNodeData(root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..', '..')): HistoricalData {
  if (loaded) return loaded;
  const db = JSON.parse(fs.readFileSync(path.join(root, 'src/generated/db.json'), 'utf8')) as HistoricalDB;
  const map = JSON.parse(fs.readFileSync(path.join(root, 'src/generated/map.json'), 'utf8')) as MapTopology;
  loaded = new HistoricalData(db, map);
  setData(loaded);
  return loaded;
}
